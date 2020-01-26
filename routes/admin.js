const express = require('express');
//const path = require('path');
// const multer = require('multer');
//const message = require('../config/message');

//const { addType, getType, removeType } = require('../models/turnirs-type');



const router = express.Router();

/*const upload = multer( { dest: path.join(__dirname,"..","uploads","flag") } ); 
 
router.post('/turnir-type/add',upload.fields( [ {name:'flag'} ] ), async (req, res) => {

    if(Object.keys(req.files).length == 0) {
        res.locals.error = message.NO_FILE;
        res.status(400).render('admin/turnir-type/form', {layout: 'admin', data: req.body});
    }else{
        try {
            await addType(req.body, req.files.flag[0]);
            req.flash('success', message.SUCCESS_ADDED);
            res.redirect(302,'/admin/turnir-type/add');
        } catch (error) {
            res.locals.error = message[error.code];
            res.status(400).render('admin/turnir-type/form', {layout: 'admin', data: req.body});
        }
    }
});

router.post('/turnir-type/:id',upload.fields( [ {name:'flag'} ] ), async (req, res) => {

    const file = (Object.keys(req.files).length == 0)? null : req.files.flag[0];
    updateType(+req.params.id,req.body,file);

    if(Object.keys(req.files).length == 0) {
        res.locals.error = message.NO_FILE;
        res.status(400).render('admin/turnir-type/form', {layout: 'admin', data: req.body});
    }else{
        addType(req.body, req.files.flag[0])
            .then(response=>{
                req.flash('success', message.SUCCESS_ADDED);
                
                res.redirect(302,'/admin/turnir-type/add');
            })
            .catch(err=>{
                res.locals.error = message[err.code];
                res.status(400).render('admin/turnir-type/form', {layout: 'admin', data: req.body});
            });
    }
});

router.post('/turnir-type/remove/:id', async (req, res) => {
    try {
        const types = await removeType(+req.params.id);
        //res.render('admin/turnir-type/form', {layout: 'admin', data: types});
    } catch (error) {
        console.log(error);
    }
    
});
 
router.get('/turnir-type/add', (req, res) => {
    res.render('admin/turnir-type/form', {layout: 'admin'});
});

router.get('/turnir-type/:id', async (req, res) => {
    try {
        const types = await getType(+req.params.id);
        res.render('admin/turnir-type/form', {layout: 'admin', data: types});
    } catch (error) {
        console.log(error);
    }
    
});

router.get('/turnir-type', async (req, res) => {
    try {
        const types = await getType();
        console.table(types);
        res.render('admin/turnir-type/index', {layout: 'admin', items: types});
    } catch (error) {
        console.log(error);
    }
    
    //res.render('admin/turnir-type/form', {layout: 'admin'});
});*/

router.get('/', (req, res) => {
    res.render('admin/index', {layout: 'admin'});
});

router.use("/images",require('./admin/images'));
router.use("/structure",require('./admin/structure'));
router.use("/news",require('./admin/news'));
router.use("/pages",require('./admin/pages'));
router.use("/settings",require('./admin/settings'));
 
module.exports = router;