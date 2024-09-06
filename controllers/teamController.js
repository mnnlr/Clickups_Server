import Team from '../models/Team.js';
import UserModel from '../models/UserModel.js';

const createTeam = async (req, res) => {
    const { teamName, memberIdentifiers } = req.body;

    if (!teamName || !memberIdentifiers || !Array.isArray(memberIdentifiers)) {
        return res.status(400).json({ message: "Team name and member identifiers (IDs or emails) are required", success: false });
    }

    try {
        const members = [];
        for (const identifier of memberIdentifiers) {
            let user;
            if (identifier.includes('@')) {
                // Identifier is an email
                user = await UserModel.findOne({ email: identifier });
                if (!user) {
                    return res.status(404).json({ message: `Email ${identifier} is not in database. Please enter a valid employee email.`, success: false });
                }
            } else {
                // Identifier is an ID
                user = await UserModel.findById(identifier);
                if (!user) {
                    return res.status(404).json({ message: `User with ID ${identifier} is not in database. Please enter a valid employee ID.`, success: false });
                }
            }
            members.push(user._id.toString());
        }

        for (const member of members) {
            const teamExists = await Team.findOne({ teamName, members: { $in: [member] } });
            if (teamExists) {
                return res.status(400).json({ message: `Member with identifier ${memberIdentifiers[members.indexOf(member)]} already exists in the team`, success: false });
            }
        }

        const teamId = await Team.create({ teamName, members });

        return res.status(201).json({ message: "Added team members successfully", success: true, teamId: teamId._id });
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
    const { teamName, members } = req.body;
    console.log(teamName, members)
    try {
        const team = await Team.findOneAndUpdate({ teamName }, { members }, { new: true });
        return res.status(200).json({ message: "Team updated successfully", success: true, teamId: team._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when updating team", success: false });
    }
}

const deleteTeam = async (req, res) => {
    const { teamName } = req.body;

    if (!teamName) {
        return res.status(400).json({ message: "Team name is required", success: false });
    }

    try {
        const team = await Team.findOne({ teamName });
        if (!team) {
            return res.status(404).json({ message: "Team not found", success: false });
        }

        await Team.deleteOne({ teamName });
        return res.status(200).json({ message: "Deleted team successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when deleting the team", success: false });
    }
}


export {
    createTeam,
    getAllTeamsMembers,
    deleteTeam,
    updateTeam,
}