import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary only if credentials are set and not default
const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== '1234567890';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadToCloudinary = (file, folder = 'mbbs-consultancy') => {
  return new Promise((resolve, reject) => {
    // Fallback: If not configured, convert buffer to base64 URL so the app still works!
    if (!isConfigured) {
      console.warn('Cloudinary not configured. Falling back to local data URI.');
      const mime = file.mimetype || 'image/png';
      const base64 = file.buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      return resolve({ secure_url: dataUri, public_id: 'mock_id_' + Date.now() });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};

export default cloudinary;
