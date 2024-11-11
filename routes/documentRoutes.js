import express from "express";
import { createDocument, getDocuments, updateDocument, deleteDocument, getDocumentById } from "../controllers/documentController.js";

const documentRouter = express.Router();

documentRouter.route("/").get(getDocuments).post(createDocument);;
documentRouter.route("/:id").delete(deleteDocument).get(getDocumentById).patch(updateDocument);

export default documentRouter;
