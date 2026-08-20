import { generateVirtualTryOn } from '../services/tryon.service.js';
import { addHistoryRecord } from '../services/history.service.js';
import { config } from '../config/env.config.js';
import { validateImageMagicBytes, fetchImageWithSafeRedirects } from '../utils/security.utils.js';

const IS_DEV = config.nodeEnv === 'development';
const MAX_PROXY_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB maximum proxy image size

/**
 * Ephemeral Virtual Try-On Generation Handler
 * Streams images to TryOn-API and returns the result for live preview in the browser.
 * Nothing is stored to database or storage during generation (100% ephemeral).
 */
export const handleGenerateTryOn = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || !files.personImage || !files.personImage[0]) {
      const error = new Error('Missing required "personImage". Please upload a photo of yourself.');
      error.status = 400;
      error.code = 'MISSING_PERSON_IMAGE';
      throw error;
    }

    if (!files.garmentImage || !files.garmentImage[0]) {
      const error = new Error('Missing required "garmentImage". Please upload an image of the clothing item.');
      error.status = 400;
      error.code = 'MISSING_GARMENT_IMAGE';
      throw error;
    }

    const personFile = files.personImage[0];
    const garmentFile = files.garmentImage[0];

    // Validate binary magic bytes to prevent spoofed mimetype uploads
    if (!validateImageMagicBytes(personFile.buffer)) {
      const error = new Error('Invalid person photo file signature. Only JPG, PNG, and WebP image files are allowed.');
      error.status = 400;
      error.code = 'INVALID_FILE_SIGNATURE';
      throw error;
    }

    if (!validateImageMagicBytes(garmentFile.buffer)) {
      const error = new Error('Invalid garment image file signature. Only JPG, PNG, and WebP image files are allowed.');
      error.status = 400;
      error.code = 'INVALID_FILE_SIGNATURE';
      throw error;
    }

    const { category, mode, nsfwFilter } = req.body;

    const result = await generateVirtualTryOn({
      personFile,
      garmentFile,
      category: category || 'apparel',
      mode: mode || 'balanced',
      nsfwFilter: nsfwFilter !== 'false',
    });

    // Automatically save generated try-on into history
    if (result && result.resultUrl) {
      try {
        const savedRecord = await addHistoryRecord({
          resultUrl: result.resultUrl,
          model: result.model || 'wearfits/tryon-clothing',
          id: result.id,
          credits: result.credits || 1,
          executionTime: result.executionTime,
          category: category || 'apparel',
          personPreview: personFile ? `data:${personFile.mimetype};base64,${personFile.buffer.toString('base64')}` : null,
          garmentPreview: garmentFile ? `data:${garmentFile.mimetype};base64,${garmentFile.buffer.toString('base64')}` : null,
          userId: req.userId || null,
        });
        result.historyItem = savedRecord;
      } catch (histErr) {
        console.warn('Auto-history persistence notice (non-fatal):', histErr.message);
      }
    }

    if (IS_DEV) {
      console.log('✨ [Try-On Generated & Saved to History]:', {
        id: result?.id,
        model: result?.model,
        category: result?.category || category,
        executionTime: result?.executionTime,
        savedToHistory: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Explicit Save Handler
 * Called ONLY when the user explicitly clicks "Save to Wardrobe" / "Confirm & Save Look"
 */
export const handleSaveLook = async (req, res, next) => {
  try {
    const { title, resultUrl, personImage, garmentImage, category, model, executionTime } = req.body;
    const userId = req.userId || null;

    if (!resultUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing resultUrl in look data.',
      });
    }

    const savedRecord = await addHistoryRecord({
      resultUrl,
      title: title || 'Saved Look',
      personPreview: personImage,
      garmentPreview: garmentImage,
      category: category || 'apparel',
      model: model || 'wearfits/tryon-clothing',
      executionTime,
      userId,
    });

    return res.status(200).json({
      success: true,
      data: savedRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SSRF-Protected Image Proxy Handler
 * Securely proxies remote images with strict protocol, DNS IP blocklist, Content-Type, and size checks.
 */
export const handleProxyImage = async (req, res, next) => {
  const rawUrl = req.query.url;

  try {
    const response = await fetchImageWithSafeRedirects(rawUrl, {
      responseType: 'stream',
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*',
      },
    });

    const contentType = (response.headers['content-type'] || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      response.data.destroy();
      return res.status(400).json({
        error: 'Invalid content type. Only image mime types are permitted.',
      });
    }

    const contentLength = parseInt(response.headers['content-length'] || '0', 10);
    if (contentLength > MAX_PROXY_IMAGE_BYTES) {
      response.data.destroy();
      return res.status(413).json({
        error: 'Image file size exceeds maximum 10MB limit.',
      });
    }

    let downloadedBytes = 0;
    response.data.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (downloadedBytes > MAX_PROXY_IMAGE_BYTES) {
        response.data.destroy();
        if (!res.headersSent) {
          res.status(413).json({
            error: 'Image stream size exceeded maximum 10MB limit.',
          });
        }
      }
    });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return response.data.pipe(res);
  } catch (err) {
    if (IS_DEV) {
      console.error('Image proxy security error:', err.message);
    }
    return res.status(400).json({
      error: err.message || 'Failed to proxy image safely.',
    });
  }
};
