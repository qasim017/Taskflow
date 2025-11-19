const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware for authentication
const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
// check for authorization header
    if (!authorization) {
        return res.status(401).json({ error: "Authorization required" });
    }
    // split "Bearer <token>"

    const token = authorization.split(" ")[1];
// verify token
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Request is not authorized" });
    }
};

module.exports = requireAuth;