'use strict'

const app = require('./app'); //importo el modulo app
//const appHttp = require('./appHttp'); 
const port = 3900;
//const pott = 8080;
const fs = require('fs');
//const https = require('https');
const http = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/imperiogaming.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/imperiogaming.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/imperiogaming.net/chain.pem', 'utf8');

const options = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
var server = https.createServer(options, app);
//const privateKey = fs.readFileSync('./encryption/server.key', 'utf8');
//const certificate = fs.readFileSync('./encryption/server.crt', 'utf8');

//const options = {
	//key: privateKey,
	//cert: certificate,
//};

//var server = https.createServer(options, app);

//appHttp.all('*', (req, res) => res.redirect(301, 'https://localhost:3900'));
//const httpServer = http.createServer(appHttp);

 
app.listen(port, ()=>{
  console.log("hello");
});
/*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();*/