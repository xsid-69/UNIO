import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,  
        required:true,
    },
    branch:{
        type:String,
        required:true,
    },
    semester:{
        type:Number, // Changed to Number to match database type
        required:true,
    }
})
export const subjectModel = mongoose.model("subject", subjectSchema, "subjectsData");
