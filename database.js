const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 't32.h.filess.io', 
    user: 'Interstellarjams_timesoonif',
    port: 3307,
    password: 'ac67029e7f39d25d3d2add03528516d9c5a448d2', 
    database: 'Interstellarjams_timesoonif' 
});

module.exports = connection;