const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

// Global middleware to populate res.locals.user from cookie if valid
const getUserStatus = async (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    res.locals.user = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
        } catch (error) {
            console.error('JWT Verification error:', error.message);
            res.clearCookie('token');
        }
    }
    next();
};

// Protect routes - requires authentication
const protect = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login?error=Please log in to access this page');
    }
    next();
};

// Redirect to dashboard if user is already logged in
const redirectIfAuthenticated = (req, res, next) => {
    if (req.user) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    getUserStatus,
    protect,
    redirectIfAuthenticated
};
