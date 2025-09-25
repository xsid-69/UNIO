import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js'; // Assuming user.model.js is correctly imported

async function isAuthenticated (req , res , next){
    let token;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies.token) {
        // Fallback to checking for token in cookies
        token = req.cookies.token;
    }

    if(!token){
        return res.status(401).json({
            message: "Unauthorized, Login First"
        });
    }

    try{
      const decode =  jwt.verify(token , process.env.JWT_SECRET );
      const user = await userModel.findOne({_id:decode.id});

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    }catch(err){
      console.error("JWT verification error:", err); // Log the error for debugging
      return res.status(401).json({
        message: "Invalid token, Login Again"
      });
    }
}

export default isAuthenticated;
