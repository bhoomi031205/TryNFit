import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60, // Set maximum execution duration for Vercel
};

const TRYON_API_URL = 'https://tryon-api.com/api/v1/tryon';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = (process.env.TRYON_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      code: 'MISSING_API_KEY',
      error: 'TRYON_API_KEY environment variable is not configured on Vercel.',
    });
  }

  const form = formidable({
    multiples: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fFields, fFiles) => {
        if (err) return reject(err);
        resolve({ fields: fFields, files: fFiles });
      });
    });

    const personFileObj = Array.isArray(files.personImage) ? files.personImage[0] : files.personImage;
    const garmentFileObj = Array.isArray(files.garmentImage) ? files.garmentImage[0] : files.garmentImage;

    if (!personFileObj || !garmentFileObj) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FILES',
        error: 'Both personImage and garmentImage files are required.',
      });
    }

    const category = (Array.isArray(fields.category) ? fields.category[0] : fields.category) || 'apparel';
    const mode = (Array.isArray(fields.mode) ? fields.mode[0] : fields.mode) || 'balanced';

    // Read files into memory buffers
    const personBuffer = fs.readFileSync(personFileObj.filepath);
    const garmentBuffer = fs.readFileSync(garmentFileObj.filepath);

    const startTime = Date.now();
    const tryonFormData = new FormData();
    tryonFormData.append('person_images', personBuffer, {
      filename: personFileObj.originalFilename || 'person.jpg',
      contentType: personFileObj.mimetype || 'image/jpeg',
    });
    tryonFormData.append('garment_images', garmentBuffer, {
      filename: garmentFileObj.originalFilename || 'garment.jpg',
      contentType: garmentFileObj.mimetype || 'image/jpeg',
    });
    tryonFormData.append('model', mode === 'performance' ? 'wearfits/tryon-clothing' : 'wearfits/tryon-clothing');
    tryonFormData.append('category', 'apparel');

    const tryonResponse = await axios.post(TRYON_API_URL, tryonFormData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...tryonFormData.getHeaders(),
      },
      timeout: 120000,
    });

    const data = tryonResponse.data;
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

    const resultImageUrl =
      (typeof data?.images?.[0] === 'string' ? data.images[0] : data?.images?.[0]?.url) ||
      data?.data?.images?.[0]?.url ||
      data?.resultUrl ||
      data?.image_url;

    if (!resultImageUrl) {
      return res.status(502).json({
        success: false,
        error: 'TryOn-API returned a response without a valid generated result image URL.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: data.id || `tryon_${Date.now()}`,
        status: 'completed',
        resultUrl: resultImageUrl,
        credits: data.usage?.credits ?? 1,
        model: data.model || 'wearfits/tryon-clothing',
        executionTime: `${executionTime}s`,
        category,
      },
    });
  } catch (error) {
    console.error('Vercel Serverless Try-On Handler error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error?.message || error.message || 'Virtual try-on processing failed.';
    return res.status(status).json({
      success: false,
      error: message,
      code: error.response?.data?.error?.code || 'TRYON_ERROR',
    });
  }
}
