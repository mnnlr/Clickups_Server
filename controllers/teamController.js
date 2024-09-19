import Team from '../models/Team.js';
import UserModel from '../models/UserModel.js';
import { io, TeamMember } from '../Socket/Socket.js';
import { saveOfflineNotification, TeamNotification } from './notificationController.js';

const createTeam = async (req, res) => {
    const { teamName, memberEmail } = req.body;
    // console.log(teamName, memberEmail)
    if (!teamName || !memberEmail) {
        return res.status(400).json({ message: "Team name and member email are required", success: false });
    }

    try {
        const user = await UserModel.findOne({ email: memberEmail });
        if (!user) {
            return res.status(404).json({ message: `Email ${memberEmail} is not in database. Please enter a valid employee email.`, success: false });
        }

        const existingTeam = await Team.findOne({ teamName, members: user._id });
        if (existingTeam) {
            return res.status(400).json({ message: "Member already exists in the team", success: false });
        }

        const team = await Team.create({ teamName, members: [user._id] });


        return res.status(201).json({ message: "Team created successfully", success: true, teamId: team._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when creating team", success: false });
    }
}

const getAllTeamsMembers = async (req, res) => {
    try {
        const teams = await Team.find().populate('members');
        return res.status(200).json({ teams, success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when getting teams", success: false });
    }
}

const updateTeam = async (req, res) => {
    const { teamName, memberEmail } = req.body;

    if (!teamName || !memberEmail) {
        return res.status(400).json({ message: "Team name and member email are required", success: false });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email: memberEmail });
        if (!user) {
            return res.status(404).json({ message: `Email ${memberEmail} is not in database. Please enter a valid employee email.`, success: false });
        }

        // Find the team by name
        const existingTeam = await Team.findOne({ teamName });
        if (!existingTeam) {
            return res.status(404).json({ message: "Team not found", success: false });
        }

        // Check if the user is already a member
        if (existingTeam.members.includes(user._id)) {
            return res.status(400).json({ message: `Member with email ${memberEmail} already exists in the team`, success: false });
        }

        // Add the new member to the team
        existingTeam.members.push(user._id);
        await existingTeam.save();

        // Prepare notification message
        const newUser = { name: user.name };
        await TeamNotification(existingTeam.members, `New member ${newUser.name} has joined the ${teamName} team`);

        // Get online members' socket IDs
        const teamsArray = Array.isArray(existingTeam.members) ? existingTeam.members : [existingTeam.members];
        const teamSocketIds = TeamMember(teamsArray);

        // Send real-time notifications to online team members
        teamSocketIds.forEach((socketId, index) => {
            const assigneeId = teamsArray[index];

            if (socketId) {
                // Send real-time notification via socket.io
                io.to(socketId).emit('teamMemberAdded', {
                    message: `New member ${newUser.name} has joined the ${teamName}.`,
                    teamName,
                    memberName: newUser.name
                });
            } else {
                // Handle the case where socketId is not found
                console.warn(`No socketId found for user ${assigneeId}`);
            }
        });

        return res.status(200).json({ message: "Team member added successfully", success: true, teamId: existingTeam._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when updating team", success: false });
    }
};




const deleteTeam = async (req, res) => {
    const { teamId } = req.body;

    if (!teamId) {
        return res.status(400).json({ message: "Team ID is required", success: false });
    }

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found", success: false });
        }

        await Team.findByIdAndDelete(teamId);
        return res.status(200).json({ message: "Deleted team successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when deleting the team", success: false });
    }
}

const deleteTeamMember = async (req, res) => {
    const { teamName, email } = req.body;

    if (!teamName || !email) {
        return res.status(400).json({ message: "Team name and member email required", success: false });
    }

    try {
        const team = await Team.findOne({ teamName });
        if (!team) {
            return res.status(404).json({ message: "Team not found", success: false });
        }

        const member = await UserModel.findOne({ email });
        if (!member) {
            return res.status(404).json({ message: "Member not found", success: false });
        }

        await Team.updateOne({ teamName }, { $pull: { members: member._id } });
        return res.status(200).json({ message: "Deleted team member successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when deleting the team member", success: false });
    }
}


export {
    createTeam,
    getAllTeamsMembers,
    deleteTeam,
    updateTeam,
    deleteTeamMember
}