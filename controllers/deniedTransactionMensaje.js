'use strict'

const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'testshinra93@gmail.com', // Cambialo por tu email
        pass: 'shinratense17' // Cambialo por tu password
        }
    });
    const mailOptionsHello = {
        from: 'Imperio Gaming' + '<testshinra93@gmail.com>',
        to: formulario.email, // Cambia esta parte por el destinatario
        subject: 'Lo sentimos, tu transacción ha sido rechazada',
        html: 'Comunicate a nuestro correo para más información, tus puntos serán devueltos'
    };
    transporter.sendMail(mailOptionsHello, function (err, info) {
        if (err){
            console.log(err);
        }else{
            console.log(info);
        }
    });
};