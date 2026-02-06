import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import isAuthenticated from '../middlewares/auth.middleware.js';

const Grouter = express.Router();

Grouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

Grouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
     try {
        const token = jwt.sign({ id: req.user._id ,email: req.user.email },process.env.JWT_SECRET, { expiresIn: '7d' });
        // Set httpOnly cookie for authentication persistence
        // In development, secure should be false. In production, it should be true.
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' // Use 'None' for production if secure is true, 'Lax' otherwise
        };
        // If not in production, explicitly set secure to false for development
        if (process.env.NODE_ENV !== 'production') {
            cookieOptions.secure = false;
        }
        res.cookie("token" , token , cookieOptions);
        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`); // Redirect to frontend root with token
     } catch (error) {
        console.error('Error generating JWT:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication%20failed`);
     }
  })

  Grouter.get('/me' , isAuthenticated ,(req, res)=>{
        res.json({sucess : true , user : req.user});
  })


  export default Grouter;
