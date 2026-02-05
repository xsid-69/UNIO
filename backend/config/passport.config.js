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
      // Try to find existing user by googleId
      let user = await User.findOne({ googleId: profile.id });
      const avatarUrl = (profile.photos && profile.photos[0] && profile.photos[0].value) || (profile._json && profile._json.picture) || '';
      const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || '';

      if (!user) {
        // If a user with the same email already exists (registered via email/password),
        // link the Google account to that existing user instead of creating a duplicate.
        if (email) {
          const existingByEmail = await User.findOne({ email });
          if (existingByEmail) {
            existingByEmail.googleId = profile.id;
            existingByEmail.avatar = avatarUrl || existingByEmail.avatar;
            existingByEmail.isLoggedIn = true;
            existingByEmail.isAuthenticated = true;
            user = await existingByEmail.save();
          }
        }
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            avatar: avatarUrl,
            isLoggedIn: true,
            isAuthenticated: true
          });
        }
      } else {
        // Update avatar/email if changed
        let changed = false;
        if (avatarUrl && user.avatar !== avatarUrl) {
          user.avatar = avatarUrl;
          changed = true;
        }
        if (email && user.email !== email) {
          user.email = email;
          changed = true;
        }
        if (changed) await user.save();
      }
      return cb(null, user);
    } catch (error) {
        return cb(error, null);
    }
    
  }
));
