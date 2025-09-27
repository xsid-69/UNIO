import userModel from '../models/user.model.js';

const isAdmin = async (req, res, next) => {
  try {
    // Ensure user is authenticated first (this middleware should be used after isAuthenticated)
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });

    // Re-fetch user to get fresh role data
    const user = await userModel.findById(req.user._id || req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

  // Prefer boolean flag `isAdmin` when available, fall back to role string for compatibility
  const isAdminFlag = typeof user.isAdmin === 'boolean' ? user.isAdmin : (user.role === 'admin');
  if (!isAdminFlag) return res.status(403).json({ message: 'Forbidden: Admins only' });

    // Attach full user
    req.user = user;
    next();
  } catch (err) {
    console.error('isAdmin middleware error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default isAdmin;
