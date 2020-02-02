const express = require('express');
const { arrayToHash } = require('../../utils/utils');
const { getImages } = require('../../models/images');
const { getStructures} = require('../../models/structures');

const { removeContentByStructure, addContent, contentByStructureId } = require('../../models/contents');
const { getBlockTypes } = require('../../models/block-types');
const { addBlocksFromContents, getBlocksByContents } = require('../../models/contents-blocks');
const message = require('../../config/message')
const { logLineAsync } = require('../../utils/utils');

const router = express.Router();

const slug = "admin/structure";

router.get('/', async (req, res) => {
    try {
        const structures = await getStructures();
        res.render(`${slug}/index`, {layout: 'admin', items: structures});
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const structure = await getStructures(req.params.id);
        if(structure){
            const arrContents = await contentByStructureId(req.params.id);
            const contents = arrayToHash(arrContents,"id");
            const types = await getBlockTypes();
            const arrImages = await getImages();
            const idTypes = arrayToHash(types,"id");
            const images = arrayToHash(arrImages,"id");
            let stcr = {};

            if(arrContents.length === 0) {
                stcr = {
                    Head: {data:[], name: "Head", comment: "Head"},
                    Left: {data:[], name: "Left", comment: "Left"},
                    Main: {data:[], name: "Main", comment: "Main"},
                    Footer: {data:[], name: "Footer", comment: "Footer"}
                };
            }else{
                for (let prop in contents) {
                    stcr[contents[prop].place] = await getBlocksByContents(prop, contents, idTypes);
                }
            }
            res.render(`${slug}/form`, {layout: 'admin', data: JSON.stringify(stcr), types, images: JSON.stringify(images) });
        }else res.status(404).render('admin/error', {layout: 'admin'});
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const structure = await getStructures(id);
        if(structure){
            await removeContentByStructure(id);
            const stcr = JSON.parse(req.body.structure);
            const arrTypes = await getBlockTypes();
            const types = arrayToHash(arrTypes,"code");
            for (let prop in stcr) {
                await addContent(id, prop, stcr[prop].name);
            }
            const arrContents = await contentByStructureId(id);
            const contents = arrayToHash(arrContents,"place");
            await addBlocksFromContents(stcr,contents,types);
            req.flash('success', message.SUCCESS_EDIT);
            res.redirect(302,`/${slug}/${id}`);
        }else res.status(404).render('admin/error', {layout: 'admin'});
    } catch (error) {
        logLineAsync(error);
        res.status(500).render('admin/error', {layout: 'admin'});
    }
});

module.exports = router;