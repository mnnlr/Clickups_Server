import { uploadDocuments } from "../utils/cloudinary.js";

export const upload_cloudinary = async (req, res) => {
  try {
    const file = req.file;
    console.log("this is file", req.file);
    if (!file) {
      console.log("file not found");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const result = await uploadDocuments(file.buffer);
    return res
      .status(200)
      .json({ message: "File uploaded successfully", result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "File upload failed" });
  }
};
