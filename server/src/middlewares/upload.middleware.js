import multer from 'multer';

// Use in-memory storage to ensure zero server-side persistent file storage.
// Images exist only in memory buffers during the request lifecycle.
const storage = multer.memoryStorage();

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type "${file.mimetype}". Only JPG, PNG, and WebP images are supported.`
    );
    error.code = 'INVALID_FILE_TYPE';
    error.status = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 2,
  },
  fileFilter,
});

// Middleware for virtual try-on dual upload slots
export const tryonUploadMiddleware = upload.fields([
  { name: 'personImage', maxCount: 1 },
  { name: 'garmentImage', maxCount: 1 },
]);
