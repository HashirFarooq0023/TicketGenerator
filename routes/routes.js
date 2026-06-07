const express = require('express');
const router = express.Router();
const pagecontroller = require('../controller/controller.js');
const authController = require('../controller/authController.js');
const ticketController = require('../controller/ticketController.js');
const { protect, redirectIfAuthenticated } = require('../middleware/auth');

// Public Pages
router.get('/', pagecontroller.index);
router.get('/about', pagecontroller.showAboutpage);
router.get('/contact', pagecontroller.showContact);

// Authentication Routes
router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post('/register', redirectIfAuthenticated, authController.register);
router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/logout', authController.logout);

// Protected Dashboard & Ticket CRUD Routes
router.get('/dashboard', protect, ticketController.getDashboard);
router.post('/tickets', protect, ticketController.createTicket);
router.get('/tickets/:id', protect, ticketController.getTicket);
router.get('/tickets/:id/edit', protect, ticketController.editTicketForm);
router.post('/tickets/:id/update', protect, ticketController.updateTicket);
router.post('/tickets/:id/delete', protect, ticketController.deleteTicket);

module.exports = router;