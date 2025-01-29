import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    teams: {
      teamIDs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
      ],
      memberIDs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sprintId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sprint",
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
    individualtaskId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Individual Tasks",
      default: [],
    },
    status: {
      type: String,
      enum: ["completed", "active", "inactive"],
      default: "inactive",
    },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

const Projects = mongoose.model("Project", ProjectSchema);

export default Projects;
