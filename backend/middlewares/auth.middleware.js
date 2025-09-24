import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js'; // Assuming user.model.js is correctly imported

async function authmiddleware (req , res , next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ // Changed to 401 for Unauthorized
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
      return res.status(401).json({
        message: "Invalid token, Login Again"
      });
    }
}

export default authmiddleware;
