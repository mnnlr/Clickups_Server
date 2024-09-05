import Team from '../models/Team.js';
import UserModel from '../models/UserModel.js';

const createTeam = async (req, res) => {
    const { teamName, memberEmail } = req.body;

    if (!teamName || !memberEmail) {
        return res.status(400).json({ message: "Team name and member's email are required", success: false });
    }

    const user = await UserModel.findOne({ email: memberEmail });
    if (!user) {
        return res.status(404).json({ message: "Email is not in database. Please enter employee email.", success: false });
    }
    const member = user._id.toString()
    try {
        if (user && member) {
            const teamExists = await Team.findOne({ teamName, member })
            if (teamExists) {
                return res.status(400).json({ message: "Member already exists in the team", success: false });
            }
        }
        await Team.create({ teamName, member });
        return res.status(201).json({ message: "Added team member successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when creating team", success: false });
    }
}

const getAllTeamsMembers = async (req, res) => {
    try {
        const teams = await Team.find().populate('member');
        return res.status(200).json({ teams, success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when getting teams", success: false });
    }
}

const deleteTeamMember = async (req, res) => {
    const { teamName, memberEmail } = req.body;

    if (!teamName || !memberEmail) {
        return res.status(400).json({ message: "Team name and member's email are required", success: false });
    }

    const user = await UserModel.findOne({ email: memberEmail });
    if (!user) {
        return res.status(404).json({ message: "User is not in the database", success: false });
    }

    const member = user._id.toString()
    const memberExistsByTeam = await Team.find({ teamName });
    const memberExistsByUser = await Team.find({ member });
    if (memberExistsByTeam.length < 0 && memberExistsByUser.length < 0) {
        return res.status(400).json({ message: "Member is not exists in the team.", success: false });
    } else {
        await Team.deleteOne({ member });
        return res.status(200).json({ message: "Deleted team member successfully", success: true });
    }
}


export {
    createTeam,
    getAllTeamsMembers,
    deleteTeamMember,
}