
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    class_name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

const Class = mongoose.model("Class" , classSchema)
export default Class