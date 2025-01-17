import express from "express";
import { createDocument, getDocuments, updateDocument, deleteDocument, getDocumentById,updateDocumentPermissions } from "../controllers/documentController.js";

const documentRouter = express.Router();

documentRouter.route("/").get(getDocuments).post(createDocument);;
documentRouter.route("/:id").delete(deleteDocument).get(getDocumentById).patch(updateDocument);
documentRouter.route("/Permission/:id").patch(updateDocumentPermissions)
export default documentRouter;
