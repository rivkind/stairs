const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { newsByCode, getListNews } = require('../models/news');
const { composeMaket } = require('../makets');

const router = express.Router();
const structure = 2;

router.get('/:urlcode', async (req, res) => {
    try {
        const newUrlCode=req.params.urlcode;
    
        const news=await newsByCode(newUrlCode);

        if ( news.length!==1 ) {
            res.status(404).send("Извините, такой новости у нас нет!");
        } else {
            let html=await composeMaket(structure, news, req);
            res.send(html);
        }
    } catch (error) {
        console.log(error);
        res.render('admin/error', {layout: 'main'});
    }
    
});

module.exports = router;