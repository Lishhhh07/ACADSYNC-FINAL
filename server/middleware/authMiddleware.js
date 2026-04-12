import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure dotenv is loaded
dotenv.config();

/**
 * Middleware to verify JWT token
 * Extracts user info from token and attaches to req.user
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('[Auth] No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[Auth] Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // { userId, email, role }
    console.log('[Auth] ✅ Token verified. User ID:', req.user.userId, 'Role:', req.user.role);
    next();
  });
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
