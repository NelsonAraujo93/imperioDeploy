'use strict'

const mysql = require('mysql');
require('dotenv').config();

const bcrypt = require ('bcryptjs');
var a = process.env.DATABASE;

const connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  port : 3306,
  database : process.env.DATABASE
});
/*var user ={
  fullName:'nelson',
  country:'CO',
  userType: 'user',
  email:'nelsonaraujoparedes@gmail.com',
  username: 'shinra',
  password: 'shinra17',
};
console.log('hi');
var functions= {
  saveUser: async (req, res) => {
    user.password = await bcrypt.hash(user.password, 8);
    connection.query("INSERT INTO users (full_name, country_code, user_type, email) VALUES  ( '" +user.fullName + "', '" + user.country + "', '" + user.userType + "', '" + user.email + "')" ,async (err, result) => {
      if (err){
          return res.status(404).send({
              status: 'error',
              message: 'on create user' + err
          });
      }else{
          connection.query("INSERT INTO login (email,user_name,password,user_id) VALUES ('" + user.email + "', '" + user.username+ "','" + user.password + "',LAST_INSERT_ID())",async (err, result) =>{
              if(err){
                  return res.status(404).send({
                      status: 'error',
                      message: 'on create login' + err
                  });
              }else{
                  connection.query("INSERT INTO user_points (user_id, points) VALUES (LAST_INSERT_ID() , 0)", async (err, result) =>{
                      if(err){
                          return res.status(404).send({
                              status: 'error',
                              message: 'on create user_points' + err
                          });
                          
                      }else{
                          console.log('creado');
                      }
                  });
              }
          });
      }
    });
  }
}
functions.saveUser();*/
module.exports = connection;