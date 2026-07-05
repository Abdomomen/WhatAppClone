import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * دالة رفع صورة إلى Cloudinary
 * @param {string} fileBufferOrPath - مسار الصورة المؤقت أو دفق البيانات (Buffer/Base64)
 * @param {string} folderName - اسم المجلد داخل Cloudinary لتنظيم الصور
 */
export const uploadImage = async (fileBufferOrPath, folderName = 'my_app_uploads') => {
  try {
    const result = await cloudinary.uploader.upload(fileBufferOrPath, {
      folder: folderName,
      resource_type: 'auto',
    });
    
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`Cloudinary Upload Error: ${error.message}`);
    throw new Error('فشل رفع الصورة إلى الخادم');
  }
};

/**
 * دالة حذف صورة من Cloudinary
 * @param {string} publicId - المعرّف الفريد للصورة المراد حذفها
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; 
  } catch (error) {
    console.error(`Cloudinary Delete Error: ${error.message}`);
    throw new Error('فشل حذف الصورة من الخادم');
  }
};
