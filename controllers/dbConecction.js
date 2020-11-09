'use strict'

const mysql = require('mysql');
require('dotenv').config();

var a = process.env.DATABASE;

const connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  //port : 3306
  database : process.env.DATABASE
});
console.log(connection.state);
connection.connect(function(err) {
  if (err) {
    console.log(err);
    throw err; 
    }

});
module.exports = connection;