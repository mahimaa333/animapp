const config = require('./database');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log('My sql connected');
});

module.exports = connection;
