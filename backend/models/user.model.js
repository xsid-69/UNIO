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
    year: { // Added year field
        type: String,
    },
    sem: { // Added semester field
        type: String,
    },
    branch: { // Added branch field
        type: String,
    },
    role: { // Existing role field for compatibility
        type: String,
        enum: ['user', 'admin'], // Possible roles
        default: 'user' // Default role is 'user'
    },
    isAdmin: { // New boolean flag to simplify admin checks
        type: Boolean,
        default: false
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
