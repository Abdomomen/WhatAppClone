import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formatBufferToDataUri = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export const uploadImage = async (file, folderName = "my_app_uploads") => {
  try {
    const fileContent = formatBufferToDataUri(file);

    const result = await cloudinary.uploader.upload(fileContent, {
      folder: folderName,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`Cloudinary Upload Error: ${error.message}`);
    throw new Error("Failed to upload image to the server");
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Cloudinary Delete Error: ${error.message}`);
    throw new Error("Failed to delete image from the server");
  }
};
