const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Authenticated = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded.user;
        console.log("User is authenticated.");
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = Authenticated;