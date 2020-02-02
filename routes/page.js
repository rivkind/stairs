const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { pagesByCode } = require('../models/pages');
const { composeMaket } = require('../makets');
const { searchWord } = require('../models/index-url-words')
const { getAllUrl } = require('../models/index-url');
const { arrayToHash } = require('../utils/utils');
const authAccess = require('../middleware/auth-access');
const { logLineAsync } = require('../utils/utils');

const router = express.Router();
const structure = 1;

router.get('/search', async (req, res) => {
    try {
        let results = [];
        if(req.query.q) {
            results = await searchWord(req.query.q);
            const indexUrls=await getAllUrl();
            let indexUrlsIndex=arrayToHash(indexUrls,'id');
            results.forEach( result => {
                result.title=indexUrlsIndex[result.index_url].title;
                result.url=indexUrlsIndex[result.index_url].url;
                result.description=indexUrlsIndex[result.index_url].description;
                if(indexUrlsIndex[result.index_url].group_code == 'news') {
                    result.group_code=indexUrlsIndex[result.index_url].group_code;
                }
                
                result.group_params=indexUrlsIndex[result.index_url].group_params;
            } );
        }

        const data = [{
            id: 0,
            url: 'search',
            title: 'Поиск на сайте',
            description: 'поиск',
            keywords: 'поиск',
            content: null
        }]

        const viewString = await fs.readFile(path.join(__dirname,'..', 'templates','partials','search_list.hbs'),"utf8");
        const viewTemplate = handlebars.compile(viewString);
        const viewHTML = viewTemplate({
            results,
            count: results.length,
            success: (results.length > 0)
        });
        
        let html=await composeMaket(structure, data, req);
        html = html.split("{{{body}}}").join(viewHTML);
        res.send(html);
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'main'});
    }
    
});

router.get('/:urlcode', async (req, res) => {
    
    const newUrlCode=req.params.urlcode;

    try {
        const pages=await pagesByCode(newUrlCode);

        if ( pages.length !== 1 )
            res.status(404).send("Извините, такой страницы не существует!");
        else {
            const auth = await authAccess(req, res);
            if(pages[0].auth && auth)
                res.redirect(302,`/users/login`);
            else {
                let html=await composeMaket(structure, pages, req);
                res.send(html);
            }
        }
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'main'});
    }
});

module.exports = router;