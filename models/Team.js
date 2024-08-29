import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
}, { timestamps: true });


const Team = mongoose.model("Team", TeamSchema);

export default Team;