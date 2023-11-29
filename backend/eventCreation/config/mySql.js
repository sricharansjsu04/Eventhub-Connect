const config = {
    db:{
        host: "database-1.c6sa5zn0zko5.us-east-2.rds.amazonaws.com",
        user: "root",
        password: "e=mc2trooper",
        port: 3306,
        database: "PlaypalDB",
        waitForConnections: true,
        connectionLimit: 10, 
        queueLimit: 0
    }
}

module.exports = config;