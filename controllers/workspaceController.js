import Workspace from "../models/Workspace.js";
import UserModel from "../models/UserModel.js"
import { sendSuccessResponse, sendErrorResponse } from "./responseHelpers.js"

// controllers
export const getAllWorkspace = async (req, res) => {
    try {
        const workspaceData = await Workspace.find().populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (workspaceData) return sendSuccessResponse(res, 200, "Data in database.", workspaceData);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while getting workspace data (controller: getAllWorkspace).", err);
    }
}

export const getAllUserWorkspaces=async(req,res)=>{
    try {
        // Extract the user ID from request parameters
        const { id } = req.params;
        console.log("User ID:", id);
    
        // Query workspaces where the user ID is present anywhere relevant
        const workspaceData = await Workspace.find({
            $or: [
                { workspaceMembers: { $in: [id] } }, // Check if user is in workspaceMembers
                { workspaceCreatedBy: id }, // Check if user created the workspace
            ],
        }).populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
    
        if (workspaceData.length > 0) {
            return sendSuccessResponse(res, 200, "Data retrieved successfully.", workspaceData);
        } else {
            return sendSuccessResponse(res, 200, "No workspaces found for the given user ID.", []);
        }
    } catch (err) {
        return sendErrorResponse(
            res,
            500,
            "Error in server while getting workspace data (controller: getAllWorkspace).",
            err
        );
    }
}    

export const getWorkspaceById = async (req, res) => {
    const { id } = req.params;
    if (!id) return sendErrorResponse(res, 404, "Id didn't provided.");
    try {
        const workspaceData = await Workspace.findById(id).populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (workspaceData) return sendSuccessResponse(res, 200, "Data in database.", workspaceData);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while getting workspace data (controller: getAllWorkspace).", err);
    }
}

export const handleCreateWorkspace = async (req, res) => {
    const { workspaceName, workspaceCreatedBy } = req.body;

    if (!workspaceName || !workspaceCreatedBy) return sendErrorResponse(res, 400, "Workspace name or created by is not provided.");

    try {
        const createWorkspace = await Workspace.create({ workspaceName, workspaceCreatedBy });

        const populatedWorkspace = await Workspace.findById(createWorkspace._id)
            .populate("workspaceDocuments workspaceMembers workspaceCreatedBy");

        if (!populatedWorkspace) return sendErrorResponse(res, 500, "Error while creating workspace (controller: handleCreateWorkspce).");

        return sendSuccessResponse(res, 201, "Workspace created successfully in database.", populatedWorkspace);

    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while creating workspace (controller: handleCreateWorkspce).", err);
    }
}

export const handleUpdateWorkspace = async (req, res) => {
    const { id } = req.params;
    const { workspaceName } = req.body;

    if (!id) return sendErrorResponse(res, 400, "Workspace Id is not provided (controller: handleUpdateWorkspace).");

    try {
        // $set is update only given data fields.
        const updatedWorkspace = await Workspace.findByIdAndUpdate(id, { workspaceName }, { new: true, runValidators: true }).populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (!updatedWorkspace) return sendErrorResponse(res, 404, `Workspace with id: ${id} is not present in database (controller: handleUpdateWorkspace).`);
        return sendSuccessResponse(res, 200, `Workspace with id: ${id} is updated.`, updatedWorkspace);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while updating workspace (controller: handleUpdateWorkspace).", err);
    }
}

export const handleDeleteWorkspace = async (req, res) => {
    const { id } = req.params;

    if (!id) return sendErrorResponse(res, 400, "Workspace Id is not provided (controller: handleDeleteWorkspace).");

    try {
        const deletedWorkspace = await Workspace.findByIdAndDelete(id);
        if (!deletedWorkspace) return sendErrorResponse(res, 404, `Workspace with id: ${id} is not present in database (controller: handleDeleteWorkspace).`);
        return sendSuccessResponse(res, 200, `Workspace with id: ${id} is deleted.`);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while deleting workspace (controller: handleDeleteWorkspace).", err);
    }
}


// export const addMemberToWorkspace = async (req, res) => {
//     const { workspaceId } = req.params;
//     const { memberId } = req.body;

//     // console.log(req.params);
//     // console.log(req.body);


//     const membersToAdd = Array.isArray(memberId) ? memberId : [memberId];

//     // // Validate if memberId or membersToAdd is empty
//     // if (!membersToAdd || membersToAdd.length === 0) {
//     //     return sendErrorResponse(res, 400, "No member IDs provided.");
//     // }

//     const uniqueMembers = new Set(membersToAdd);
//     if (uniqueMembers.size !== membersToAdd.length) {
//         return sendErrorResponse(res, 400, "Duplicate member IDs found.");
//     }

//     try {
//         const workspace = await Workspace.findById(workspaceId);
//         if (!workspace) {
//             return sendErrorResponse(res, 404, `Workspace with ID ${workspaceId} does not exist.`);
//         }

//         for (let memberId of membersToAdd) {
//             const member = await UserModel.findById(memberId);
//             if (!member) {
//                 return sendErrorResponse(res, 400, `User with ID ${memberId} does not exist in the database.`);
//             }

//             if (workspace.workspaceMembers.includes(memberId)) {
//                 return sendErrorResponse(res, 400, `User with ID ${memberId} is already a member of the workspace.`);
//             }
//         }
//         workspace.workspaceMembers = [...new Set([...workspace.workspaceMembers, ...membersToAdd])];


//         await workspace.save();
//         const updatedWorkspace = await Workspace.findById(workspaceId)
//             .populate("workspaceDocuments workspaceMembers workspaceCreatedBy");

//         return sendSuccessResponse(res, 200, "Members added successfully to workspace.", updatedWorkspace);
//     } catch (err) {
//         return sendErrorResponse(res, 500, "Error in server while adding member to workspace.", err.message || err);
//     }
// };

// export const removeMemberFromWorkspace = async (req, res) => {
//     const { workspaceId } = req.params;
//     const { memberId } = req.body;

//     // if (!workspaceId) {
//     //     return sendErrorResponse(res, 400, "Workspace ID is not provided.");
//     // }

//     try {

//         const member = await UserModel.findById(memberId);
//         if (!member) {
//             return sendErrorResponse(res, 404, `User with ID ${memberId} does not exist in the database.`);
//         }


//         const workspace = await Workspace.findById(workspaceId);
//         if (!workspace) {
//             return sendErrorResponse(res, 404, `Workspace with ID ${workspaceId} does not exist.`);
//         }


//         const memberIndex = workspace.workspaceMembers.indexOf(memberId);
//         if (memberIndex === -1) {
//             return sendErrorResponse(res, 400, `User with ID ${memberId} is not a member of the workspace.`);
//         }


//         workspace.workspaceMembers.splice(memberIndex, 1);
//         await workspace.save();


//         const updatedWorkspace = await Workspace.findById(workspaceId)
//             .populate("workspaceDocuments workspaceMembers workspaceCreatedBy");

//         return sendSuccessResponse(res, 200, "Member removed successfully from workspace.", updatedWorkspace);
//     } catch (err) {
//         return sendErrorResponse(res, 500, "Error in server while removing member from workspace.", err);
//     }
// };


export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;  
    const { members, action } = req.body;
    if (!['add', 'remove'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'add' or 'remove'", success: false });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found", success: false });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: "Members should be an array of user IDs", success: false });
    }

    if (action === 'add') {
      for (let memberId of members) {
        if (!workspace.workspaceMembers.some(id => id.equals(memberId))) {
          workspace.workspaceMembers.push(memberId);
        }
      }
    } else if (action === 'remove') {
      for (let memberId of members) {
        workspace.workspaceMembers = workspace.workspaceMembers.filter(id => !id.equals(memberId));
      }
    }

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspaceId)
      .populate('workspaceMembers');

    return res.status(200).json({
      message: `Members ${action === 'add' ? 'added to' : 'removed from'} workspace successfully`,
      success: true,
      workspace: updatedWorkspace,
    });

  } catch (error) {
    console.error("Error updating members in workspace: ", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// export const removeMemberFromWorkspace = async (req, res) => {
//     const { workspaceId } = req.params;
//     const { memberId } = req.body;

//     // if (!workspaceId) {
//     //     return sendErrorResponse(res, 400, "Workspace ID is not provided.");
//     // }

//     try {

//         const member = await UserModel.findById(memberId);
//         if (!member) {
//             return sendErrorResponse(res, 404, `User with ID ${memberId} does not exist in the database.`);
//         }


//         const workspace = await Workspace.findById(workspaceId);
//         if (!workspace) {
//             return sendErrorResponse(res, 404, `Workspace with ID ${workspaceId} does not exist.`);
//         }


//         const memberIndex = workspace.workspaceMembers.indexOf(memberId);
//         if (memberIndex === -1) {
//             return sendErrorResponse(res, 400, `User with ID ${memberId} is not a member of the workspace.`);
//         }


//         workspace.workspaceMembers.splice(memberIndex, 1);
//         await workspace.save();


//         const updatedWorkspace = await Workspace.findById(workspaceId)
//             .populate("workspaceDocuments workspaceMembers workspaceCreatedBy");

//         return sendSuccessResponse(res, 200, "Member removed successfully from workspace.", updatedWorkspace);
//     } catch (err) {
//         return sendErrorResponse(res, 500, "Error in server while removing member from workspace.", err);
//     }
// };

export const removeMemberFromWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    const { memberIds } = req.body; // Accept `memberIds` as an array

    if (!workspaceId) {
        return sendErrorResponse(res, 400, "Workspace ID is not provided.");
    }

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
        return sendErrorResponse(res, 400, "Member IDs must be a non-empty array.");
    }

    try {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return sendErrorResponse(res, 404, `Workspace with ID ${workspaceId} does not exist.`);
        }

        // Filter out members that are not in the workspace
        const membersNotInWorkspace = memberIds.filter(
            (id) => !workspace.workspaceMembers.includes(id)
        );

        if (membersNotInWorkspace.length > 0) {
            return sendErrorResponse(
                res,
                400,
                `Some members are not part of the workspace: ${membersNotInWorkspace.join(", ")}.`
            );
        }

        // Remove the members
        workspace.workspaceMembers = workspace.workspaceMembers.filter(
            (id) => !memberIds.includes(id)
        );

        await workspace.save();

        const updatedWorkspace = await Workspace.findById(workspaceId)
            .populate("workspaceDocuments workspaceMembers workspaceCreatedBy");

        return sendSuccessResponse(
            res,
            200,
            "Members removed successfully from workspace.",
            updatedWorkspace
        );
    } catch (err) {
        return sendErrorResponse(
            res,
            500,
            "Error in server while removing members from workspace.",
            err
        );
    }
};
