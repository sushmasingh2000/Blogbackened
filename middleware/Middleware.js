const jwt = require('jsonwebtoken');
const secretKey = 'sushma'; 

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'Token is required' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Invalid or expired token' });
        }
        req?.userId = decoded?.id; 
        next();
    });
};
