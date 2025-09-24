import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default: "" // Default empty string for profile picture
    }
})

const userModel = mongoose.model("user" , userSchema)

export default userModel;
