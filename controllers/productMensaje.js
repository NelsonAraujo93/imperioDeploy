'use strict'

const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'imperiogamingms@gmail.com', // Cambialo por tu email
        pass: 'imperio1234' // Cambialo por tu password
        }
    });
    const mailOptionsHello = {
        from: 'Imperio Gaming' + '<imperiogamingms@gmail.com>',
        to: formulario.email, // Cambia esta parte por el destinatario
        subject: 'Gracias por comprar en ImperioApp, compra de '+ formulario.product_name,
        html: 'Gracias por tu compra <strong>'+ formulario.user_name +'</strong>. Revisaremos tu mensaje y nos contactaremos contigo para entregar tu premio.<br><br><br><br>'+
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