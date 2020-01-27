const express = require('express');
const { arrayToHash, getChangeFreq, getPriority } = require('../../utils/utils');
const { getImages } = require('../../models/images');
const { getPages, pagesByCode, addPages, updatePages, removePage } = require('../../models/pages');

const { addContent, contentByPagesId, removeContentByPages } = require('../../models/contents');
const { getBlockTypes } = require('../../models/block-types');
const { addBlocksFromContents, getBlocksByContents } = require('../../models/contents-blocks');
const { updateProcess } = require('../../models/settings');
const message = require('../../config/message')
const { logLineAsync } = require('../../utils/utils'); 

const router = express.Router();

const slug = "admin/pages";

router.get('/', async (req, res) => {
    try {
        const pages = await getPages();
        res.render(`${slug}/index`, {layout: 'admin', items: pages});
    } catch (error) {
        logLineAsync(error);
        res.render('admin/error', {layout: 'admin'});
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
        res.render('admin/error', {layout: 'admin'});
    }
});


router.post('/add', async (req, res) => {
    let pages = [];
    try {
        const stcr = JSON.parse(req.body.structure);
        const arrTypes = await getBlockTypes();
        const types = arrayToHash(arrTypes,"code");
        if(!req.body.ord instanceof Number) req.body.ord = 0;
        pages = await addPages(req.body);
        if(pages.length === 0) throw Error(message.ER_COMMON_ERROR);
        for (let prop in stcr){
            const t = await addContent(null, prop, stcr[prop].name, null, pages[0]);
            if(prop == 'Main') {
                const updateData = {
                    content: t[0]
                }
                await updatePages(pages[0],updateData);
            }
        }
        const arrContents = await contentByPagesId(pages[0]);
        const contents = arrayToHash(arrContents,"place");
        await addBlocksFromContents(stcr,contents,types);
        await updateProcess('indexing');
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}`);
    } catch (error) {
        logLineAsync(error);
        if(pages.length > 0) await removePage(pages[0]);
        res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
        const arrImages = await getImages();
        const images = arrayToHash(arrImages,"id");
        const typesBlock = await getBlockTypes();
        const changeFreq = getChangeFreq(req.body.changefreq);
        const priority = getPriority(req.body.priority);
        res.render(`${slug}/form`, {layout: 'admin',data: req.body.structure,priority, changeFreq, pages: req.body, types: typesBlock, images: JSON.stringify(images)});
    }
});

router.get('/:url', async (req, res) => {
    try {
        const pages = await pagesByCode(req.params.url);
        if(pages && pages.length ===1) {
            const arrContents = await contentByPagesId(pages[0].id);
            const contents = arrayToHash(arrContents,"id");
            const types = await getBlockTypes();
            const arrImages = await getImages();
            const idTypes = arrayToHash(types,"id");
            const images = arrayToHash(arrImages,"id");
            const changeFreq = getChangeFreq(pages[0].changefreq);
            const priority = getPriority(pages[0].priority);
            const stcr = {};
            for (let prop in contents) {
                stcr[contents[prop].place] = await getBlocksByContents(prop, contents, idTypes);
            }
            res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr), changeFreq, types,priority,  images: JSON.stringify(images), pages: pages[0] });
        } else res.status(404).render('admin/error', {layout: 'admin'});
    } catch (error) {
        logLineAsync(error);
        res.render('admin/error', {layout: 'admin'});
    }
});

router.post('/:url', async (req, res) => {
    let pages = [];
    try {
        const pages = await pagesByCode(req.params.url);
        if(pages.length !== 1)  throw Error();
        const pagesNew = await pagesByCode(req.body.url);
        if(pagesNew.length === 1 && pagesNew[0].id !== pages[0].id ) throw Error(message.ER_DUP_ENTRY);
        if(!req.body.auth) req.body.auth = 0;
        if(!req.body.isMenu) req.body.isMenu = 0;
        if(!req.body.ord instanceof Number) req.body.ord = 0;
        req.body.ord = req.body.ord;
        let content = 0;
        await removeContentByPages(pages[0].id);
        const stcr = JSON.parse(req.body.structure);
        const arrTypes = await getBlockTypes();
        const types = arrayToHash(arrTypes,"code");
        for (let prop in stcr){
            const t = await addContent(null, prop, stcr[prop].name, null, pages[0].id);
            if(prop == 'Main') content = t[0];
        }
        const arrContents = await contentByPagesId(pages[0].id);
        const contents = arrayToHash(arrContents,"place");
        await addBlocksFromContents(stcr,contents,types);

        delete req.body.structure;
        
        const updateData = {
            ...req.body,
            content
        }
        await updatePages(pages[0].id, updateData);
        await updateProcess('indexing');
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}/${req.body.url}`);
    } catch (error) {
        logLineAsync(error);
        res.locals.error = (error.code)? (message[error.code] || message["ER_COMMON_ERROR"]) : error;
        const arrImages = await getImages();
        const images = arrayToHash(arrImages,"id");
        const typesBlock = await getBlockTypes();
        const changeFreq = getChangeFreq(req.body.changefreq);
        const priority = getPriority(req.body.priority);
        res.render(`${slug}/form`, {layout: 'admin',data: req.body.structure,changeFreq,priority, pages: req.body, types: typesBlock, images: JSON.stringify(images)});
    }
});

module.exports = router;