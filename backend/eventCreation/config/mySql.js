const config = {
    db:{
        host: "clouddb.c9yc7iqlqitw.us-east-2.rds.amazonaws.com",
        user: "root",
        password: "Lumberjack98",
        port: 3306,
        database: "PlaypalDB",
        waitForConnections: true,
        connectionLimit: 10, 
        queueLimit: 0
    }
}

module.exports = config;