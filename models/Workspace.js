import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema({
  workspaceName: {
    type: String,
    require: true,
  },
  workspaceDocuments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }],
  workspaceMembers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  workspaceCreatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true
  }
}, { timestamps: true })

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
