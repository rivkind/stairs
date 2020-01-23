const express = require('express');
const { arrayToHash } = require('../utils/utils');
const { getImages } = require('../models/images');
const { getNews, newsByCode, addNews, updateNews } = require('../models/news');

const { addContent, contentByNewsId, removeContentByNews } = require('../models/contents');
const { getBlockTypes } = require('../models/block-types');
const { addBlocksFromContents, getBlocksByContents } = require('../models/contents-blocks');
const { updateProcess } = require('../models/settings');
const message = require('../config/message')

const router = express.Router();

const slug = "admin/news";

router.get('/add', async (req, res) => {

    const types = await getBlockTypes();
        const arrImages = await getImages();
        const idTypes = arrayToHash(types,"id");
        const images = arrayToHash(arrImages,"id");
        const stcr = {
            Main: {data:[], name: "Content_block", comment: "Main"}
        };
        res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr), types, images: JSON.stringify(images) });

});

router.post('/add', async (req, res) => {
    const stcr = JSON.parse(req.body.structure);
    const arrTypes = await getBlockTypes();
    const types = arrayToHash(arrTypes,"code");
    const news = await addNews(req.body);
    for (let prop in stcr){
        const t = await addContent(null, prop, stcr[prop].name, news[0]);
        if(prop == 'Main') {
            const updateData = {
                content: news[0]
            }
            await updateNews(t[0],updateData);
        }
    }
    const arrContents = await contentByNewsId(news[0]);
    const contents = arrayToHash(arrContents,"place");
    await addBlocksFromContents(stcr,contents,types);
    await updateProcess('indexing');
    req.flash('success', message.SUCCESS_EDIT);
    res.redirect(302,`/${slug}`);
});

router.get('/', async (req, res) => {
    try {
        const news = await getNews();
        res.render(`${slug}/index`, {layout: 'admin', items: news});
    } catch (error) {
        res.render('admin/error', {layout: 'admin'});
    }
});

router.get('/:url', async (req, res) => {
    const news = await newsByCode(req.params.url);
    if(news && news.length ===1) {
        const arrContents = await contentByNewsId(news[0].id);
        const contents = arrayToHash(arrContents,"id");
        const types = await getBlockTypes();
        const arrImages = await getImages();
        const idTypes = arrayToHash(types,"id");
        const images = arrayToHash(arrImages,"id");
        const stcr = {};
        for (let prop in contents) {
            stcr[contents[prop].place] = await getBlocksByContents(prop, contents, idTypes);
        }
        res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr), types, images: JSON.stringify(images), news: news[0] });
    }
});

router.post('/:url', async (req, res) => {
    const news = await newsByCode(req.params.url);
    if(news && news.length ===1) {
        
        let content = 0;
        await removeContentByNews(news[0].id);
        const stcr = JSON.parse(req.body.structure);
        const arrTypes = await getBlockTypes();
        const types = arrayToHash(arrTypes,"code");
        for (let prop in stcr){
            const t = await addContent(null, prop, stcr[prop].name, news[0].id);
            if(prop == 'Main') {

                content = t[0];
            }
        }
        const arrContents = await contentByNewsId(news[0].id);
        const contents = arrayToHash(arrContents,"place");
        await addBlocksFromContents(stcr,contents,types);

        delete req.body.structure;
        
        const updateData = {
            ...req.body,
            content
        }
        await updateNews(news[0].id, updateData);
        await updateProcess('indexing');
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}/${req.params.url}`);
    }
    
    
});

module.exports = router;