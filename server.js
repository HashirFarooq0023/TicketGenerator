
require('dotenv').config();
if (!process.env.VERCEL) {
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}
const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { getUserStatus } = require('./middleware/auth');

const app = express();

// Connect Database
connectDB();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global Auth middleware to populate req.user / res.locals.user
app.use(getUserStatus);

// Routes
const routes = require('./routes/routes');
app.use('/', routes);

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;