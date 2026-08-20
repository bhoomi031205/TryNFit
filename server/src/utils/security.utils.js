import net from 'net';
import dns from 'dns';
import axios from 'axios';

/**
 * Checks whether an IP address belongs to private/internal/loopback ranges.
 * Handles IPv4, IPv6, and IPv6-mapped IPv4 formats (e.g., ::ffff:127.0.0.1).
 */
export const isPrivateOrInternalIp = (ipStr) => {
  if (!ipStr || typeof ipStr !== 'string') return true;

  let ip = ipStr.trim();

  // Strip IPv6-mapped IPv4 prefix (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
  if (ip.toLowerCase().startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true;
    }

    // 0.0.0.0/8 (Broadcast/Current network)
    if (parts[0] === 0) return true;

    // 10.0.0.0/8 (Private Class A)
    if (parts[0] === 10) return true;

    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;

    // 169.254.0.0/16 (Link-local / Cloud metadata e.g. AWS 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 172.16.0.0/12 (Private Class B: 172.16.0.0 - 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (Private Class C)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 255.255.255.255 (Broadcast)
    if (parts[0] === 255 && parts[1] === 255 && parts[2] === 255 && parts[3] === 255) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1' || normalized === '::') return true;

    // fc00::/7 (Unique Local)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;

    // fe80::/10 (Link-Local)
    if (
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb')
    ) {
      return true;
    }

    return false;
  }

  // Reject unrecognized or non-standard IP formats
  return true;
};

/**
 * Validates a target URL against SSRF vulnerabilities:
 * 1. Requires http: or https: protocol.
 * 2. Rejects local hostnames (localhost, *.local, *.internal, 0.0.0.0).
 * 3. Resolves domain name via DNS lookup and verifies EVERY resolved IP address against private/internal IP ranges.
 */
export const validateProxyUrl = async (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') {
    throw new Error('Missing URL parameter.');
  }

  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch (err) {
    throw new Error('Invalid URL format.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Invalid URL protocol. Only http: and https: protocols are permitted.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block explicit local hostnames
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname === '0.0.0.0' ||
    hostname === '0'
  ) {
    throw new Error('Access to local or internal hostnames is strictly forbidden.');
  }

  // Direct IP check or DNS resolution
  if (net.isIP(hostname)) {
    if (isPrivateOrInternalIp(hostname)) {
      throw new Error(`Access to private/internal IP address (${hostname}) is strictly forbidden.`);
    }
  } else {
    try {
      const addresses = await dns.promises.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        throw new Error(`Could not resolve hostname '${hostname}'`);
      }

      for (const record of addresses) {
        if (isPrivateOrInternalIp(record.address)) {
          throw new Error(
            `Access to private/internal IP range (${record.address}) via '${hostname}' is strictly forbidden.`
          );
        }
      }
    } catch (dnsErr) {
      if (dnsErr.message.includes('forbidden') || dnsErr.message.includes('restricted') || dnsErr.message.includes('Invalid')) {
        throw dnsErr;
      }
      throw new Error(`DNS lookup failed for hostname '${hostname}'`);
    }
  }

  return parsed;
};

/**
 * Fetches an image URL securely while safely allowing up to `maxRedirects` HTTP redirects.
 * EVERY hop URL and its resolved DNS IP address are strictly re-validated via `validateProxyUrl`
 * BEFORE making the next request.
 */
export const fetchImageWithSafeRedirects = async (initialUrlStr, options = {}) => {
  let currentUrl = initialUrlStr;
  let redirects = 0;
  const maxRedirects = options.maxRedirects ?? 3;

  while (redirects <= maxRedirects) {
    // 1. SSRF Guard Check: Validate protocol, hostname, and resolved DNS IP addresses
    const validatedUrl = await validateProxyUrl(currentUrl);

    // 2. Fetch with maxRedirects: 0 so we can inspect Location header per hop
    const response = await axios.get(validatedUrl.href, {
      ...options,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Check for HTTP Redirect (301, 302, 303, 307, 308)
    if (response.status >= 300 && response.status < 400) {
      redirects++;
      if (redirects > maxRedirects) {
        throw new Error(`Exceeded maximum allowed redirects limit (${maxRedirects}).`);
      }

      const locationHeader = response.headers.location;
      if (!locationHeader) {
        throw new Error('Redirect response missing Location header.');
      }

      // Resolve relative redirect against current URL
      currentUrl = new URL(locationHeader, validatedUrl.href).href;
      continue;
    }

    return response;
  }

  throw new Error('Maximum redirect limit exceeded.');
};

/**
 * Validates actual binary image magic bytes in memory buffers (JPEG, PNG, WebP)
 */
export const validateImageMagicBytes = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 12) return false;

  // JPEG magic bytes: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG magic bytes: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return true;
  }

  // WebP magic bytes: RIFF .... WEBP
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  if (isRiff && isWebp) {
    return true;
  }

  return false;
};
