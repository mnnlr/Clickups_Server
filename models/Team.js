const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
});


const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;