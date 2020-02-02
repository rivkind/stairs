const express = require('express');
const { arrayToHash, getChangeFreq, getPriority } = require('../../utils/utils');
const { getImages } = require('../../models/images');
const { getNews, newsByCode, addNews, updateNews, removeNews } = require('../../models/news');

const { addContent, contentByNewsId, removeContentByNews } = require('../../models/contents');
const { getBlockTypes } = require('../../models/block-types');
const { addBlocksFromContents, getBlocksByContents } = require('../../models/contents-blocks');
const { updateProcess } = require('../../models/settings');
const message = require('../../config/message')
const { logLineAsync } = require('../../utils/utils'); 

const router = express.Router();

const slug = "admin/news";

router.get('/', async (req, res) => {
    try {
        const news = await getNews();
        res.render(`${slug}/index`, {layout: 'admin', items: news});
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

router.get('/add', async (req, res) => {
    try {
        const types = await getBlockTypes();
        const arrImages = await getImages();
        const images = arrayToHash(arrImages,"id");
        const changeFreq = getChangeFreq();
        const priority = getPriority();
        const stcr = {
            Main: {data:[], name: "Content_block", comment: "Main"}
        };
        res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr), types,priority, changeFreq, images: JSON.stringify(images) });
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

router.post('/add', async (req, res) => {
    let news = [];
    try {
        const stcr = JSON.parse(req.body.structure);
        const arrTypes = await getBlockTypes();
        const types = arrayToHash(arrTypes,"code");
        news = await addNews(req.body);
        if(news.length === 0) throw Error(message.ER_COMMON_ERROR);
        for (let prop in stcr){
            const t = await addContent(null, prop, stcr[prop].name, news[0]);
            if(prop == 'Main') {
                const updateData = {
                    content: t[0]
                }
                await updateNews(news[0],updateData);
            }
        }
        const arrContents = await contentByNewsId(news[0]);
        const contents = arrayToHash(arrContents,"place");
        await addBlocksFromContents(stcr,contents,types);
        await updateProcess('indexing');
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}`);
    } catch (error) {
        logLineAsync(error);
        if(news.length > 0) await removeNews(news[0]);
        res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
        const arrImages = await getImages();
        const images = arrayToHash(arrImages,"id");
        const changeFreq = getChangeFreq(req.body.changefreq);
        const priority = getPriority(req.body.priority);
        const typesBlock = await getBlockTypes();
        res.render(`${slug}/form`, {layout: 'admin',data: req.body.structure, news: req.body,priority, changeFreq, types: typesBlock, images: JSON.stringify(images)});
    }
});

router.get('/:url', async (req, res) => {
    try {
        const news = await newsByCode(req.params.url);
        if(news && news.length ===1) {
            const arrContents = await contentByNewsId(news[0].id);
            const contents = arrayToHash(arrContents,"id");
            const types = await getBlockTypes();
            const arrImages = await getImages();
            const idTypes = arrayToHash(types,"id");
            const images = arrayToHash(arrImages,"id");
            const changeFreq = getChangeFreq(news[0].changefreq);
            const priority = getPriority(news[0].priority);
            const stcr = {};
            for (let prop in contents) {
                stcr[contents[prop].place] = await getBlocksByContents(prop, contents, idTypes);
            }
            res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr),changeFreq, types,priority, images: JSON.stringify(images), news: news[0] });
        } else res.status(404).render('admin/error', {layout: 'admin'});
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

router.post('/:url', async (req, res) => {
    let news = [];
    try {
        const news = await newsByCode(req.params.url);
        if(news.length !== 1)  throw Error();
        const newsNew = await newsByCode(req.body.url);
        if(newsNew.length === 1 && newsNew[0].id !== news[0].id ) throw Error(message.ER_DUP_ENTRY);
        let content = 0;
        await removeContentByNews(news[0].id);
        const stcr = JSON.parse(req.body.structure);
        const arrTypes = await getBlockTypes();
        const types = arrayToHash(arrTypes,"code");
        for (let prop in stcr){
            const t = await addContent(null, prop, stcr[prop].name, news[0].id);
            if(prop == 'Main') content = t[0];
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
        res.redirect(302,`/${slug}/${req.body.url}`);
    } catch (error) {
        logLineAsync(error);
        res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
        const arrImages = await getImages();
        const images = arrayToHash(arrImages,"id");
        const changeFreq = getChangeFreq(req.body.changefreq);
        const priority = getPriority(req.body.priority);
        const typesBlock = await getBlockTypes();
        res.render(`${slug}/form`, {layout: 'admin',data: req.body.structure, news: req.body,changeFreq,priority, types: typesBlock, images: JSON.stringify(images)});
    }
});

module.exports = router;