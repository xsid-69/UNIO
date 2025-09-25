import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, cb)=> {
    try {
       let user = await User.findOneAndUpdate({ googleId: profile.id } ); 
       if(!user){
          user = await User.create({
            googleId: profile.id,  
            name: profile.displayName,
            email: profile.emails[0].value,
            isLoggedIn:true,
            isAuthenticated:true // Save to profilePic instead of avatar
          })
       }
       return cb(null, user);
    } catch (error) {
        return cb(error, null);
    }
    
  }
));
