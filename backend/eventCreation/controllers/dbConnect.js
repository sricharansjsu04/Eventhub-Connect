var mysql = require('mysql2');
var config = require("../config/mySql")

// var connection = mysql.createConnection(config.db);


const pool = mysql.createPool(config.db);


// connection.on('error', function(err) {
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//         console.log('Reconnecting...');
//         connection = mysql.createConnection(config.db);
//         connection.connect();
//     } else {
//         throw err;
//     }
// });

module.exports =  pool;