const jwt = require('jsonwebtoken');

const decodeToken = () => {
    try {
        // if (!token) 
        // {
        //     const authHeader = req.headers.authorization;
        //     const token = authHeader.split(' ')[1];
        //     if(!token) return null;
        // }

        // Handle "Bearer <token>" format if commonly passed
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        return null; // Invalid token
    }
};

const protectRoute = (req, res, next) => {
    // 1) Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3) Attach user/id to req
        req.providerId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

module.exports = { decodeToken, protectRoute };
