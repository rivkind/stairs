const express = require('express');
const uuidv1 = require('uuid/v1');
const { hasEmail, addUser, signin, confirmUser } = require('../models/users');
const { addSession } = require('../models/users-session');
const message = require('../config/message');
const guestAccess = require('../middleware/guest-access');
const { sendEmail } = require('../utils/mail')
const { textMailWelcome } = require('../utils/utils')


const router = express.Router();

router.get('/register',guestAccess, async (req, res) => {
    res.render('login/register', {layout: 'login'});
});

router.get('/success',guestAccess, async (req, res) => {
    res.render('login/register', {layout: 'login', success: true});
});

router.get('/confirm/success',guestAccess, async (req, res) => {
    res.render('login/confirm', {layout: 'login'});
});

router.get('/confirm/unsuccess',guestAccess, async (req, res) => {
    res.render('admin/error', {layout: 'main'});
});

router.get('/confirm/:code',guestAccess, async (req, res) => {
    try {
        const update = await confirmUser(req.params.code);
        if(update) {
            res.redirect(302,`/users/confirm/success`);
        } else{
            res.redirect(302,`/users/confirm/unsuccess`);
        }
    } catch (error) {
        console.log(error);
        res.render('admin/error', {layout: 'main'});
    }
    
});

router.get('/login',guestAccess, async (req, res) => {
    res.render('login/signin', {layout: 'login'});
});

router.get('/logout',async (req, res) => {
    req.session.destroy();
    res.redirect(302,`/`);
});

router.post('/login',guestAccess, async (req, res) => {
    try {
        const user = await signin(req.body);
        if(user) {
            const session = await addSession(user[0].id);
            if(session) {
                const dataSession = {
                    session,
                    id: user[0].id
                }
                req.flash('session', dataSession);
                res.redirect(302,`/users/success`);
            } else
                res.render('login/signin', {layout: 'login', data: req.body, error: message.ERR_REGISTER});
            
            
        } else
            res.render('login/signin', {layout: 'login', data: req.body, error: message.ERR_REGISTER});
    } catch (error) {
        console.log(error);
        res.render('admin/error', {layout: 'main'});
    }
});

router.post('/register',guestAccess, async (req, res) => {
    const { password, password2, email } = req.body;
    if(password.length > 4 && password === password2 && email.length > 4) {
        try {
            const isNewUser = await hasEmail(email);
            if(isNewUser)
                res.status(200).render('login/register', {layout: 'login', data: req.body, error: message.ERR_HAS_EMAIL});
            else {
                
                const token = uuidv1();
                
                await addUser(req.body, token);
                const messageMail = textMailWelcome(token);
                sendEmail(email,'Подтверждение регистрации',messageMail)
                    .then( () => { console.log("Письмо отправлено!"); } )
                    .catch( err => { console.error(err); } )
                ;
                res.redirect(302,`/users/success`);  
            }
        } catch (error) {
            console.log(error);
            res.status(200).render('login/register', {layout: 'login', data: req.body, error: message.ER_COMMON_ERROR});
        }
        
    } else
        res.status(200).render('login/register', {layout: 'login', data: req.body, error: message.ERR_REGISTER});
});

module.exports = router;