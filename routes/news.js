const express = require('express');
const { newsByCode } = require('../models/news');
const { composeMaket } = require('../makets');
const { logLineAsync } = require('../utils/utils');

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
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'main'});
    }
    
});

module.exports = router;