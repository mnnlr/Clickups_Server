import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // Convert Buffer to Stream
import Document from "../models/Document.js";
import { sendErrorResponse, sendSuccessResponse } from "./responseHelpers.js";

// upload data to cloudinary
export const uploadDataToCloudinary = async (req, res) => {
    const { data, documentId } = req.body;

    if (!data) return sendErrorResponse(res, 400, "No data in request.");
    if (!documentId) return sendErrorResponse(res, 400, "No document id in request.");

    const doc = await Document.findById(documentId);

    // console.log("data: ", data);

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET_KEY,
    });

    try {
        // Generate a unique public_id using the document ID or a timestamp
        const uniquePublicId = doc
            ? doc.documentContent_cloudinaryPublicId // Use stored public_id
            : `tinymce_editor_content_${documentId}`; // Generate new public_id for new documents

        // Create an upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw", // Non-media content
                public_id: uniquePublicId, // Consistent public_id for editing
            },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error: ", error);
                    return sendErrorResponse(res, 500, "File didn't upload", error);
                }
                if (result) {
                    const updatedDocument = await Document.findByIdAndUpdate(
                        documentId,
                        {
                            $set: {
                                documentContent_cloudinaryURL: result.secure_url,
                                documentContent_cloudinaryPublicId: result.public_id, // Corrected field name
                            },
                        },
                        { new: true }
                    );
                    console.log("Cloudinary Upload Result: ", result);
                    if (updatedDocument) return sendSuccessResponse(res, 200, "Content uploaded successfully", updatedDocument);
                }
            }
        );
        // Pipe the string content to the upload stream
        streamifier.createReadStream(data).pipe(uploadStream);
    } catch (err) {
        console.error("err: ", err);
        return sendErrorResponse(res, 500, "File didn't upload", err);
    }
}

// get data from cloudinary
export const getDataFromCloudinary = async (req, res) => {
    const { documentId } = req.query;
    console.log("docId", documentId)
    if (!documentId) return sendErrorResponse(res, 400, "No document id in request.");

    const document = await Document.findById(documentId);
    if (!document) return sendErrorResponse(res, 400, "Document not found.");

    const cloudURL = document.documentContent_cloudinaryURL;
    if (!cloudURL) return sendErrorResponse(res, 299, "Cloudinary URL is not found.");

    const cloudRes = await fetch(cloudURL)
    if (!cloudRes) return sendErrorResponse(res, 299, "Cloudinary URL is not valid or does not exist.");

    // file data to text
    const cloudData = await cloudRes.text();
    return sendSuccessResponse(res, 200, "Data fetched successfully", cloudData);
}

export const deleteDataFromCloudinary = async (req, res, next) => {
    const { documentId } = req.params;

    if (!documentId) return sendErrorResponse(res, 400, "No document id in request.");

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET_KEY,
    });

    try {
        // Fetch the document to get the Cloudinary public_id
        const doc = await Document.findById(documentId);
        if (!doc) return sendErrorResponse(res, 400, "Document not found.");

        const cloudURL = doc.documentContent_cloudinaryURL;
        if (!cloudURL) return sendSuccessResponse(res, 200, "Cloudinary URL is not present.");

        // Extract the public_id from the Cloudinary URL
        const publicId = doc.documentContent_cloudinaryURL.split('/').pop().split('.')[0];

        // Delete the file from Cloudinary
        cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, // Ensure resource type matches what was uploaded
            async (err, result) => {
                if (err) {
                    console.error("Cloudinary Upload Error: ", err);
                    return sendErrorResponse(res, 500, "Something went wrong.", err);
                }
                // console.log("Cloudinary Upload Result: ", result);
                if (result.result === "ok") {
                    const updatedDocument = await Document.findByIdAndUpdate(documentId, { $unset: { documentContent_cloudinaryURL: "" } }, { new: true });
                    if (!updatedDocument) return sendErrorResponse(res, 400, "Error while updating the document.");

                    return sendSuccessResponse(res, 200, "Content deleted successfully", updatedDocument);
                } else {
                    console.log("Cloudinary Upload Result: ", result);
                    return sendErrorResponse(res, 500, "Fail to delete content on Cloudinary.");
                }
            }
        )
    } catch (err) {
        console.error("err: ", err);
        return sendErrorResponse(res, 500, "File didn't upload", err);
    }
}