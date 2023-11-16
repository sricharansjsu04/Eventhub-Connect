// userController.js
const db = require('../config/db-config');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, lastName, firstName, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

    try {
        const sql = `INSERT INTO users (username, last_name, first_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        console.log(username, lastName, firstName, email, hashedPassword, role);
        await db.query(sql, [username, lastName, firstName, email, hashedPassword, role]);

        res.status(201).json({ message: 'User created successfully in database' });
    } catch (error) {
        console.error('Error creating user in database:', error);
        res.status(500).json({ message: 'Error creating user in database', error: error.message });
    }
};
