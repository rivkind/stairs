const express = require('express');
const path = require('path');
const multer = require('multer');
const { getImages, addImages, getImageByCode, deleteTmpFile, updateImages } = require('../../models/images');
const message = require('../../config/message')
const { logLineAsync } = require('../../utils/utils'); 

const router = express.Router();

const upload = multer( { dest: path.join(__dirname,"..","..","uploads") } );

const slug = "admin/images";

router.get('/', async (req, res) => {
    try {
        const images = await getImages();
        res.render(`${slug}/index`, {layout: 'admin', items: images});
    } catch (error) {
        logLineAsync(error);
        res.render('admin/error', {layout: 'admin'});
    }
});

router.get('/add', async (req, res) => {
    res.render(`${slug}/form`, {layout: 'admin'});
});

router.post('/add',upload.fields( [ {name:'image'} ] ), async (req, res) => {
    const { name } = req.body;
    const nameFile = name.trim();
    if(Object.keys(req.files).length == 0) {
        res.locals.error = message.NO_FILE;
        res.render(`${slug}/form`, {layout: 'admin', data: req.body});
    }else{
        try {
            const image = await getImageByCode(nameFile);
            
            if(image.length !== 0) throw Error(message["ER_DUP_ENTRY"]);
            else if(!nameFile) throw Error(message["ER_BAD_NULL_ERROR"]);
            else {
                await addImages(req.body, req.files.image[0]);
                req.flash('success', message.SUCCESS_ADDED);
                res.redirect(302,`/${slug}`);
            }
        } catch (error) {
            logLineAsync(error);
            deleteTmpFile(req.files.image[0]);
            res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
            res.render(`${slug}/form`, {layout: 'admin', data: req.body});
        }
    }
});

router.get('/:code', async (req, res) => {
    try {
        const image = await getImageByCode(req.params.code);
        if(image.length === 1) res.render(`${slug}/form`, {layout: 'admin', data: image[0]});
        else res.status(404).render('admin/error', {layout: 'admin'});
    } catch (error) {
        logLineAsync(error);
        res.render('admin/error', {layout: 'admin'});
    }
});

router.post('/:code',upload.fields( [ {name:'image'} ] ), async (req, res) => {
    let imageOld = [];
    try {
        imageOld = await getImageByCode(req.params.code);
        if(imageOld.length !== 1)  throw Error();
        
        if(req.body.name === '') throw Error(message.ER_BAD_NULL_ERROR);
        
        const imageNew = await getImageByCode(req.body.name);
        if(imageNew.length === 1 && imageNew[0].id !== imageOld[0].id ) throw Error(message.ER_DUP_ENTRY);
        await updateImages(req.body, req.files, imageOld[0]);
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}`);
    } catch (error) {
        logLineAsync(error);
        if(Object.keys(req.files).length !== 0) deleteTmpFile(req.files.image[0]);
        res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
        res.render(`${slug}/form`, {layout: 'admin', data: imageOld[0]});
    }
});

module.exports = router;