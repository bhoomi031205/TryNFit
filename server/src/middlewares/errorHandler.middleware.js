import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err);

  // Handle Multer specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the 5MB limit. Please upload a smaller image.',
        code: 'FILE_TOO_LARGE',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: `Unexpected field "${err.field}". Please upload images to "personImage" and "garmentImage".`,
        code: 'UNEXPECTED_FIELD',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
      code: 'UPLOAD_ERROR',
    });
  }

  // Handle known application errors
  if (err.status && err.message) {
    return res.status(err.status).json({
      success: false,
      error: err.message,
      code: err.code || 'APP_ERROR',
    });
  }

  // Handle unhandled errors
  return res.status(500).json({
    success: false,
    error: 'An unexpected error occurred while processing your virtual try-on request. Please try again.',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
