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
        subject: 'Gracias por jugar en ImperioApp',
        html: '<a href="'+ +'" Recuerda seguir el link a GodTier </a><strong>'+ formulario.user_name +'</strong>. Si necesitar ayuda no olvides comunicarte con nosotros.<br><br><br><br>'+
        'Atentamente: <strong> Imperio Gaming Staff </strong>'
    };
    transporter.sendMail(mailOptionsHello, function (err, info) {
        if (err){
            console.log(err);
        }else{
            console.log(info);
        }
    });
};