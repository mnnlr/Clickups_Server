import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
  sprintname: {
    type: String,
    required: true
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  taskIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      max:100
    },
  ],
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: { type: Date },
});

const Sprint = mongoose.model("Sprint", sprintSchema);

export default Sprint;
