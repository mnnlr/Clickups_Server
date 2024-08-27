const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    teamName: { //? added team name
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

module.exports = Team;