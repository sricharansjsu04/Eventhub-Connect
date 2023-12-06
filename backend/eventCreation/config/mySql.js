require('dotenv').config();

const config = {
    db:{
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_DB,
        // waitForConnections: true,
        // connectionLimit: 10, 
        // queueLimit: 0
    }
}

module.exports = config;