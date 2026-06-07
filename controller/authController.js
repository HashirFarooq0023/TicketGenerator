const { User } = require('../models/models');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const options = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE || 604800000)),
        httpOnly: true,
        secure: false
    };

    res.cookie('token', token, options);
    res.redirect('/dashboard');
};

// @desc    Show Register Page
// @route   GET /register
// @access  Public
const showRegister = (req, res) => {
    res.render('register', { title: 'Register', error: req.query.error || null });
};

// @desc    Register User
// @route   POST /register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            return res.redirect('/register?error=Passwords do not match');
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.redirect('/register?error=Email already registered');
        }

        // Create User
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'employee'
        });

        // Set JWT cookie and redirect
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Registration Error:', error);
        res.redirect(`/register?error=${encodeURIComponent(error.message)}`);
    }
};

// @desc    Show Login Page
// @route   GET /login
// @access  Public
const showLogin = (req, res) => {
    res.render('login', { title: 'Login', error: req.query.error || null, message: req.query.message || null });
};

// @desc    Login User
// @route   POST /login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.redirect('/login?error=Please enter email and password');
        }

        // Check for User
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/login?error=Invalid credentials');
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.redirect('/login?error=Invalid credentials');
        }

        // Set JWT cookie and redirect
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login Error:', error);
        res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
};

// @desc    Logout User / Clear Cookie
// @route   GET /logout
// @access  Private
const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login?message=Logged out successfully');
};

module.exports = {
    showRegister,
    register,
    showLogin,
    login,
    logout
};
