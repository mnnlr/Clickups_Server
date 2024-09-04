import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },
  taskIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Task",
    },
  ],
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: { type: Date },
});
const Sprint = mongoose.model("Sprint", sprintSchema);

export default Sprint;
