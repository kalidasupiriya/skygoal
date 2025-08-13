const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    // Also check Authorization header for Bearer token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
