 const mongoose = require('mongoose');

 const ProjectSchema=new mongoose.Schema({
    projectName:{type:String,required:true},
    description:{type:String},
    team:[ {
         role:[{type:String}],
         id:{type:mongoose.Schema.ObjectId ,ref:"User"}
        } ],
    owner:{type:mongoose.Schema.ObjectId ,ref:"User" ,required:true},
    taskId:[{type:mongoose.Schema.ObjectId, ref:"Task", max:100}],
    sprintId:[{type:mongoose.Schema.ObjectId,ref:"Sprint"}],
    timestamp:{type:Date, default:Date.now },
     status: { type:String, enum: ['active', 'inactive'], default: 'inactive' },
     duedate:{type:Date}
 })
 const Projects =mongoose.model("Project",ProjectSchema)

 module.exports = Projects