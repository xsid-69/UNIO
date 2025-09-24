import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import uploadImage from '../service/storage.service.js'; // Import ImageKit upload service


async function registerController(req , res ) {
    const {name ,email , password} = req.body;
    const existingUser = await userModel.findOne({email});

    if(existingUser){
        return res.status(400).json(
            {message:"Email already exists"
       });
    }

    const hashedPassword = await bcrypt.hash(password , 10);
    
    let profilePicUrl = "";
    if (req.file) {
        // Upload image to ImageKit
        const filename = `profile-${Date.now()}`; // No user ID yet, so use timestamp
        const result = await uploadImage(req.file.buffer, filename);
        profilePicUrl = result.url;
    }

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        profilePic: profilePicUrl
    })
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    res.cookie("token" , token )

    return res.status(201).json({
        message:"User registered successfully",
        user
    })
}

async function logincontroller(req , res){
    const {email , password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }
    const isPasswordValid= await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }
    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
    res.cookie("token" , token )
    return res.status(200).json({
        message: "Login successful",
        user,
        token
    })
}

async function uploadProfilePicController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const user = req.user; // User is available from authmiddleware
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Upload image to ImageKit
        const filename = `profile-${user._id}-${Date.now()}`;
        const result = await uploadImage(req.file.buffer, filename);

        // Update user's profile picture URL
        user.profilePic = result.url;
        await user.save();

        res.status(200).json({
            message: "Profile picture uploaded successfully!",
            profilePicUrl: result.url
        });

    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Failed to upload profile picture." });
    }
}

export { registerController, logincontroller, uploadProfilePicController };
