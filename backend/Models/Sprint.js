const mongoose=require('mongoose')

const sprintSchema=new mongoose.Schema({
    projectId:{type:mongoose.Schema.ObjectId,ref:"Project"},
    task:{type:mongoose.Schema.ObjectId,ref:"Task"},
    startDate:{type:Date,default:Date.now},
    endDate:{type:Date}
})
const Sprint =mongoose.model("Sprint",sprintSchema)
module.exports=Sprint