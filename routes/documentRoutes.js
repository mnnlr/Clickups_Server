import express from "express";
import { createDocument, getDocuments, updateDocument, deleteDocument, getDocumentById } from "../controllers/documentController.js";

const documentRouter = express.Router();

documentRouter.route("/:id").patch(updateDocument).delete(deleteDocument).get(getDocumentById);
documentRouter.route("/").get(getDocuments).post(createDocument);;

export default documentRouter;
