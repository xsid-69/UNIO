import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        
    },
    googleId:{
        type:String,
        
    },
    avatar:{
        type:String,
        
    },
    profilePic:{
        type:String,
        default: "" // Default empty string for profile picture
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    isAuthenticated:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model("user" , userSchema)

export default userModel;
