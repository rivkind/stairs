const nodemailer = require("nodemailer");
const { removeTags } = require('./utils');
const { mailer_transportConfig, mailer_fromEmail } = require("../config/mail");

// отсылает почту на указанный емейл, с указанной темой и телом письма
// тело может быть с HTML-тегами
const sendEmail = (recipientEmail,subject,body) => {

    return new Promise( (resolve,reject) => {

        let transporter = nodemailer.createTransport(mailer_transportConfig);
        

        let text=body;
        let html=undefined;
        let textWOTags=removeTags(text);
        if ( textWOTags!==text ) { // если теги есть - отправляем две разных версии письма, HTML и текстовую; если тегов нет - только текстовую
            text=textWOTags;
            html=body;
        }

        let message = {
            from: mailer_fromEmail, // с какого ящика идёт отправка (емейл отправителя), может не совпадать с mailer_transportConfig.auth
            to: recipientEmail,
            subject: subject,
            text: text, // текстовая версия письма
            html: html, // HTML-версия письма
        };

        transporter.sendMail(message, (err,info) => {
            if ( err ) {
                console.error("sendEmail - error",err);
                reject(err);
            }
            else {
                resolve(info);
            }
        } );

    } );

}

module.exports={
    sendEmail
};

