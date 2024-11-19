import { v2 } from "cloudinary";
import cloudinary from "cloudinary";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Cloudinary


const uploadDocuments = async (fileBuffer) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME, //'your_cloud_name',
    api_key: process.env.API_KEY, //'your_api_key',
    api_secret: process.env.API_SECRET_KEY, //'your_api_secret'
  });
  console.log("this is file from cloudinary", fileBuffer);
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "raw", // this is cruciaal for non-image like docs
  };

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
    console.log(result)
    return result.public_id;
  } catch (error) {
    console.log("Upload Failed:", error);
  }
};

export {uploadDocuments, upload};
