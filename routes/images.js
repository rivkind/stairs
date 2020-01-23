const express = require('express');
const path = require('path');
const multer = require('multer');
const { getImages, addImages, getImageByCode, deleteTmpFile, updateImages } = require('../models/images');
const message = require('../config/message')

const router = express.Router();

const upload = multer( { dest: path.join(__dirname,"..","uploads") } );

const slug = "admin/images";

router.get('/', async (req, res) => {
    try {
        const images = await getImages();
        res.render(`${slug}/index`, {layout: 'admin', items: images});
    } catch (error) {
        res.render('admin/error', {layout: 'admin'});
    }
});

router.get('/add', async (req, res) => {
    res.render(`${slug}/form`, {layout: 'admin'});
});

router.post('/add',upload.fields( [ {name:'image'} ] ), async (req, res) => {
    if(Object.keys(req.files).length == 0) {
        res.locals.error = message.NO_FILE;
        res.status(400).render(`${slug}/form`, {layout: 'admin', data: req.body});
    }else{
        try {
            const image = await getImageByCode(req.body.name);
            if(image.length !== 0) {
                deleteTmpFile(req.files.image[0]);
                res.locals.error = message["ER_DUP_ENTRY"];
                res.status(400).render(`${slug}/form`, {layout: 'admin', data: req.body});
            } else {
                await addImages(req.body, req.files.image[0]);
                req.flash('success', message.SUCCESS_ADDED);
                res.redirect(302,`/${slug}`);
            }
            
        } catch (error) {
            res.locals.error = message[error.code] || message["ER_COMMON_ERROR"];
            res.status(400).render(`${slug}/form`, {layout: 'admin', data: req.body});
        }
    }
});

router.get('/:code', async (req, res) => {
    try {
        const image = await getImageByCode(req.params.code);
        if(image.length === 1) {
            res.render(`${slug}/form`, {layout: 'admin', data: image[0]});
        }else{
            res.status(404).render('admin/error', {layout: 'admin'});
        }
    } catch (error) {
        res.render('admin/error', {layout: 'admin'});
    }
});

router.post('/:code',upload.fields( [ {name:'image'} ] ), async (req, res) => {
    
    try {
        if(req.body.name === '') {
            if(Object.keys(req.files).length !== 0) deleteTmpFile(req.files.image[0]);
            res.locals.error = message.ER_BAD_NULL_ERROR;
            res.status(400).render(`${slug}/form`, {layout: 'admin', data: req.body});
            return ;
        }
        const imageNew = await getImageByCode(req.body.name);
        const imageOld = await getImageByCode(req.params.code);
        if(imageNew.length === 1 && imageNew[0].id !== imageOld[0].id ) {
            if(Object.keys(req.files).length !== 0) deleteTmpFile(req.files.image[0]);
            res.locals.error = message.ER_DUP_ENTRY;
            res.status(400).render(`${slug}/form`, {layout: 'admin', data: req.body});
            return ;
        }
        await updateImages(req.body, req.files, imageOld[0]);
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}`);
        
    } catch (error) {
        if(Object.keys(req.files).length !== 0) deleteTmpFile(req.files.image[0]);
        const imageOld = await getImageByCode(req.params.code);
        res.locals.error = message[error.code] || message["ER_COMMON_ERROR"];
        res.status(400).render(`${slug}/form`, {layout: 'admin', data: imageOld[0]});
    }
    
});

module.exports = router;