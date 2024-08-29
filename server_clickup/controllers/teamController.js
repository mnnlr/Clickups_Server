import Team from'../models/Team.js';
import UserModel from'../models/UserModel.js';

const createTeam = async (req, res) => {
    const { teamName, memberEmail } = req.body;
    
    if (!teamName || !memberEmail) {
        return res.status(400).json({ message: "Team name and member's email are required" });
    }

    const user = await UserModel.findOne({ email: memberEmail });
    if (!user) {
        return res.status(404).json({ message: "Please SignIn" });
    }
    const member = user._id.toString()
    try {
        await Team.create({ teamName, member });
        return res.status(201).json({ message: "Added team member successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong when creating team" });
    }
}

export {
    createTeam,
}