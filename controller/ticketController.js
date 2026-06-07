const { Ticket } = require('../models/models');

// @desc    Show Dashboard (Read All Tickets)
// @route   GET /dashboard
// @access  Private
const getDashboard = async (req, res) => {
    try {
        let query = {};
        
        // If employee, only show their own unresolved tickets. If admin, show all.
        if (req.user.role !== 'admin') {
            query.createdBy = req.user._id;
            query.status = { $ne: 'Resolved' };
        }

        const tickets = await Ticket.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.render('dashboard', {
            title: 'Dashboard',
            tickets,
            error: req.query.error || null,
            message: req.query.message || null
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.render('dashboard', {
            title: 'Dashboard',
            tickets: [],
            error: 'Failed to load tickets: ' + error.message,
            message: null
        });
    }
};

// @desc    Create Support Ticket (Create)
// @route   POST /tickets
// @access  Private
const createTicket = async (req, res) => {
    try {
        const { title, description, priority, roomNumber } = req.body;

        if (!title || !description) {
            return res.redirect('/dashboard?error=Title and description are required');
        }

        await Ticket.create({
            title,
            description,
            priority: priority || 'Medium',
            roomNumber,
            createdBy: req.user._id
        });

        res.redirect('/dashboard?message=Ticket created successfully');
    } catch (error) {
        console.error('Create Ticket Error:', error);
        res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
    }
};

// @desc    View Support Ticket Details (Read One)
// @route   GET /tickets/:id
// @access  Private
const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name email');

        if (!ticket) {
            return res.redirect('/dashboard?error=Ticket not found');
        }

        // Access check: only owner or admin can view
        if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
            return res.redirect('/dashboard?error=Not authorized to view this ticket');
        }

        res.render('ticket-detail', {
            title: 'Ticket Details',
            ticket,
            error: req.query.error || null,
            message: req.query.message || null
        });
    } catch (error) {
        console.error('Get Ticket Error:', error);
        res.redirect(`/dashboard?error=Invalid ticket ID`);
    }
};

// @desc    Show Edit Ticket Form
// @route   GET /tickets/:id/edit
// @access  Private
const editTicketForm = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.redirect('/dashboard?error=Ticket not found');
        }

        // Access check: only owner or admin can edit
        if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.redirect('/dashboard?error=Not authorized to edit this ticket');
        }

        res.render('edit-ticket', {
            title: 'Edit Ticket',
            ticket,
            error: req.query.error || null
        });
    } catch (error) {
        console.error('Edit Ticket Form Error:', error);
        res.redirect(`/dashboard?error=Invalid ticket ID`);
    }
};

// @desc    Update Ticket (Update)
// @route   POST /tickets/:id/update
// @access  Private
const updateTicket = async (req, res) => {
    try {
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.redirect('/dashboard?error=Ticket not found');
        }

        // Access check: only owner or admin can update
        if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.redirect('/dashboard?error=Not authorized to update this ticket');
        }

        const { title, description, priority, status, roomNumber } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (status) updateData.status = status;
        if (roomNumber !== undefined) updateData.roomNumber = roomNumber;

        ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.redirect(`/tickets/${ticket._id}?message=Ticket updated successfully`);
    } catch (error) {
        console.error('Update Ticket Error:', error);
        res.redirect(`/tickets/${req.params.id}/edit?error=${encodeURIComponent(error.message)}`);
    }
};

// @desc    Delete Ticket (Delete)
// @route   POST /tickets/:id/delete
// @access  Private
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.redirect('/dashboard?error=Ticket not found');
        }

        // Access check: only owner or admin can delete
        if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.redirect('/dashboard?error=Not authorized to delete this ticket');
        }

        await Ticket.findByIdAndDelete(req.params.id);

        res.redirect('/dashboard?message=Ticket deleted successfully');
    } catch (error) {
        console.error('Delete Ticket Error:', error);
        res.redirect(`/dashboard?error=Failed to delete ticket: ${encodeURIComponent(error.message)}`);
    }
};

module.exports = {
    getDashboard,
    createTicket,
    getTicket,
    editTicketForm,
    updateTicket,
    deleteTicket
};
