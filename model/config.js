const mysql = require("mysql");
require("dotenv").config();

//connection with the database
const conn = mysql.createPool({
  connectionLimit: 10, //ste the connection pool limit
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//test the database connection with a simple query

conn.query("select 1+1 AS Solution", (err, result, fields) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  } else {
    console.log("Database Connection Established");
  }
});

conn.on('error',function(err){
    console.error('Database Error:',err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
        console.log('PROTOCOL_CONNECTION_LOST error. Reconnecting...');
        //no need to handle the manully,the pool will manage reconnection 
    }else{
    throw err;
    }
})
module.exports = conn;