const mailer_transportConfig = {
    host: process.env.MAIL_HOST, 
    port: process.env.MAIL_PORT, // порт
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
};
const mailer_fromEmail = process.env.FROM_EMAIL;

module.exports={
    mailer_transportConfig,
    mailer_fromEmail

};