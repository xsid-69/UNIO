import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js'; // Assuming user.model.js is correctly imported

async function isAuthenticated (req , res , next){
  try {
    let token;

    // Prefer Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      // Some clients might accidentally store the token with a Bearer prefix in the cookie
      if (typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7);
      }
    }

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Unauthorized, Login First' });
    }

    // Basic JWT shape validation to avoid jsonwebtoken throwing on obviously malformed values
    const jwtShape = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (!jwtShape.test(token)) {
      console.warn('Received token with invalid format, clearing cookie (if any)');
      if (req.cookies && req.cookies.token) {
        // clear malformed cookie so client can recover
        res.clearCookie('token');
      }
      return res.status(401).json({ message: 'Invalid token format, please login again' });
    }

    const decode = jwt.verify(token , process.env.JWT_SECRET );
    const user = await userModel.findOne({_id:decode.id});

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err); // Log the error for debugging
    // If there was a cookie present, clear it to help client recover
    if (req.cookies && req.cookies.token) {
      try { res.clearCookie('token'); } catch (e) { /* ignore */ }
    }
    return res.status(401).json({ message: 'Invalid token, Login Again' });
  }
}

export default isAuthenticated;
