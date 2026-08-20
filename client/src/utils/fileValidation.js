export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Formats bytes into human readable string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Validates a file for type and maximum 5MB size limit
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WebP image.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 5MB.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Helper to generate a valid canvas JPEG file blob if network fetch is blocked
 */
const createCanvasJpegFile = (filename, mimeType) => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 600, 800);
      grad.addColorStop(0, '#FF407D');
      grad.addColorStop(1, '#7928CA');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 800);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(filename.replace('.jpg', ''), 300, 400);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], filename, { type: mimeType }));
          } else {
            resolve(new File([new Blob(['preset-image'], { type: mimeType })], filename, { type: mimeType }));
          }
        },
        mimeType,
        0.85
      );
    } catch (e) {
      resolve(new File([new Blob(['preset-image'], { type: mimeType })], filename, { type: mimeType }));
    }
  });
};

/**
 * Fetches an image from a URL (e.g. preset) and converts it to a File object safely
 */
export const urlToFile = async (url, filename, mimeType = 'image/jpeg') => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  } catch (err) {
    console.warn(`Direct fetch failed for ${url}, trying canvas fallback:`, err);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 600;
          canvas.height = img.naturalHeight || 800;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], filename, { type: mimeType }));
              } else {
                createCanvasJpegFile(filename, mimeType).then(resolve);
              }
            },
            mimeType,
            0.9
          );
        } catch (e) {
          createCanvasJpegFile(filename, mimeType).then(resolve);
        }
      };
      img.onerror = () => {
        createCanvasJpegFile(filename, mimeType).then(resolve);
      };
      img.src = url;
    });
  }
};

