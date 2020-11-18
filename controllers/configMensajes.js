'use strict'

const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port:465,
        secure: true,
        auth: {
        user: 'imperiogamingms@gmail.com', // Cambialo por tu email
        pass: 'imperio1234' // Cambialo por tu password
        }
    });
    const mailOptionsHello = {
        from: 'Imperio Gaming' + '<imperiogamingms@gmail.com>',
        to: formulario.email, // Cambia esta parte por el destinatario
        subject: 'Bienvenid@ a Imperio Gaming',
        html: 'Gracias por crear una cuenta con nosotros <strong>'+ formulario.nombre +'</strong><br><br><br><br>'+
        'Atentamente: <strong>Imperio Gaming Staff </strong>'
    };
    transporter.sendMail(mailOptionsHello, function (err, info) {
        if (err){
            console.log(err);
        }else{
            console.log(info);
        }
    });
};