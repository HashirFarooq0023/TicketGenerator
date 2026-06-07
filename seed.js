require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const { User, Ticket } = require('./models/models');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Ticket.deleteMany({});
        console.log('Cleared existing database entries.');

        // 1. Create Users
        const users = [
            {
                name: 'Kashif Mahmood',
                email: 'kashif@ucp.edu.pk',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Ali Raza',
                email: 'aliraza@ucp.edu.pk',
                password: 'password123',
                role: 'employee'
            },
            {
                name: 'Sana Khan',
                email: 'sanakhan@ucp.edu.pk',
                password: 'password123',
                role: 'employee'
            },
            {
                name: 'Bilal Ahmed',
                email: 'bilalahmed@ucp.edu.pk',
                password: 'password123',
                role: 'employee'
            },
            {
                name: 'Zainab Bibi',
                email: 'zainabbibi@ucp.edu.pk',
                password: 'password123',
                role: 'employee'
            }
        ];

        const createdUsers = await User.create(users);
        console.log(`Successfully created ${createdUsers.length} users.`);

        // Find user helper
        const findUser = (email) => createdUsers.find(u => u.email === email);

        // 2. Create Tickets
        const tickets = [
            {
                title: 'VPN Connection Failure',
                description: 'Cannot connect to the university VPN from home to access local portals. It keeps throwing host timeout errors after 30 seconds.',
                priority: 'High',
                status: 'Open',
                roomNumber: 'A-CL-400',
                createdBy: findUser('aliraza@ucp.edu.pk')._id
            },
            {
                title: 'Software Access Request',
                description: 'Requesting license activation for MS Project and MATLAB. Needed urgently for semester project modeling work.',
                priority: 'Medium',
                status: 'In Progress',
                roomNumber: 'CL203',
                createdBy: findUser('sanakhan@ucp.edu.pk')._id
            },
            {
                title: 'Lab 4 Printer Jammed & Low Toner',
                description: 'The main printer in Lab 4 (3rd floor) is jammed with paper and showing error code 404. Also, it requires black toner replacement.',
                priority: 'Low',
                status: 'Open',
                roomNumber: 'A204',
                createdBy: findUser('bilalahmed@ucp.edu.pk')._id
            },
            {
                title: 'LMS Account Password Reset',
                description: 'Locked out of the Learning Management System account after multiple failed attempts. Please reset password and send a reset link.',
                priority: 'High',
                status: 'Resolved',
                roomNumber: 'CL203',
                createdBy: findUser('zainabbibi@ucp.edu.pk')._id
            }
        ];

        const createdTickets = await Ticket.create(tickets);
        console.log(`Successfully created ${createdTickets.length} support tickets.`);

        console.log('\nSeeding completed successfully!');
        console.log('Sample Logins:');
        console.log('-------------------------------------------');
        console.log('Admin:    kashif@ucp.edu.pk    / password123');
        console.log('Employee: aliraza@ucp.edu.pk   / password123');
        console.log('Employee: sanakhan@ucp.edu.pk  / password123');
        console.log('-------------------------------------------');

        mongoose.connection.close();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
