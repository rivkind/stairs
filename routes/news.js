const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { newsByCode, getListNews } = require('../models/news');
const { composeMaket } = require('../makets');

const router = express.Router();
const structure = 2;

router.get('/', async (req, res) => {
    const news=await getListNews();
    const data = [{
        id: 0,
        url: 'news',
        title: 'Список новостей',
        description: 'Список новостей сайта',
        keywords: 'новости',
        content: null
    }]
    let html=await composeMaket(structure, data, req);
    const viewString = await fs.readFile(path.join(__dirname,'..', 'templates','partials','news.hbs'),"utf8");
    const viewTemplate = handlebars.compile(viewString);
    const viewHTML = viewTemplate({
        news: news,
    });
    
    html = html.split("{{{body}}}").join(viewHTML);
    res.send(html);
});

router.get('/:urlcode', async (req, res) => {
    const newUrlCode=req.params.urlcode;
    
    const news=await newsByCode(newUrlCode);

    if ( news.length!==1 ) {
        res.status(404).send("Извините, такой новости у нас нет!");
    } else {
        let html=await composeMaket(structure, news, req);
        res.send(html);
    }
});

module.exports = router;