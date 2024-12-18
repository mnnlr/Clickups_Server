import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // Convert Buffer to Stream
import Document from "../models/Document.js";

// upload data to cloudinary
export const uploadDataToCloudinary = async (req, res) => {
    const { data, documentId } = req.body;

    if (!data) res.status(400).json({ message: "No data in request." });
    if (!documentId) res.status(400).json({ message: "No document id in request." });

    // console.log("data: ", data);

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET_KEY,
    });

    try {
        // Create an upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw", // Non-media content
                public_id: "tinymce_editor_content", // Optional custom public ID
            },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error: ", error);
                    return res.status(500).json({ message: "File didn't upload", error });
                }
                if (result) {
                    const updatedDocument = await Document.findByIdAndUpdate(
                        documentId,
                        { $set: { documentContent_cloudinaryURL: result.secure_url } },
                        { new: true }
                    );
                    console.log("Cloudinary Upload Result: ", result);
                    if (updatedDocument) res.status(200).json({ message: "Content uploaded successfully", data: updatedDocument });
                }
            }
        );
        // Pipe the string content to the upload stream
        streamifier.createReadStream(data).pipe(uploadStream);
    } catch (err) {
        console.error("err: ", err)
        res.status(500).json({ message: "File did't uploaded", err });
    }
}

// get data from cloudinary
export const getDataFromCloudinary = async (req, res) => {
    const { documentId } = req.body;

    if (!documentId) res.status(400).json({ message: "No document id in request." });

    const document = await Document.findById(documentId);
    if (!document) res.status(400).json({ message: "Document not found." });

    const cloudURL = document.documentContent_cloudinaryURL;
    if (!cloudURL) res.status(400).json({ message: "Cloudinary URL is not found." });

    const cloudRes = await fetch(cloudURL)
    if (!cloudRes) res.status(400).json({ message: "Cloudinary URL is not valid or does not exist." });

    // file data to text
    const cloudData = await cloudRes.text();
    res.status(200).json({ message: "Data fetched successfully", data: cloudData });
}

export const deleteDataFromCloudinary = async (req, res, next) => {
    const { documentId } = req.params;

    if (!documentId) res.status(400).json({ message: "No document id in request." });

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET_KEY,
    });

    try {
        // Fetch the document to get the Cloudinary public_id
        const doc = await Document.findById(documentId);
        if (!doc) res.status(400).json({ message: "Document not found." });

        const cloudURL = doc.documentContent_cloudinaryURL;
        if (!cloudURL) res.status(400).json({ message: "Cloudinary URL is not found." });

        // Extract the public_id from the Cloudinary URL
        const publicId = doc.documentContent_cloudinaryURL.split('/').pop().split('.')[0];

        // Delete the file from Cloudinary
        cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, // Ensure resource type matches what was uploaded
            async (err, result) => {
                if (err) {
                    console.error("Cloudinary Upload Error: ", err);
                    res.status(500).json({ error: "Something went wrong.", err });
                }
                // console.log("Cloudinary Upload Result: ", result);
                if (result.result === "ok") {
                    const updatedDocument = await Document.findByIdAndUpdate(documentId, { $unset: { documentContent_cloudinaryURL: "" } }, { new: true });
                    if (!updatedDocument) res.status(400).json({ message: "Error while updating the document." });

                    res.status(200).json({ message: "Content deleted successfully", data: updatedDocument });
                } else {
                    console.log("Cloudinary Upload Result: ", result);
                    res.status(500).json({ message: "Fail to delete content on cludinary." });
                }
            }
        )
    } catch (err) {
        console.error("err: ", err)
        res.status(500).json({ message: "File did't uploaded", err });
    }
}