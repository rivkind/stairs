const express = require('express');
const { arrayToHash } = require('../../utils/utils');

const { getSettings, updateSettings } = require('../../models/settings');
const message = require('../../config/message')

const router = express.Router();

const slug = "admin/settings";

router.get('/', async (req, res) => {
    try {
        const s = await getSettings();
        res.render(`${slug}/index`, {layout: 'admin', s});
    } catch (error) {
        console.log(error);
        res.render('admin/error', {layout: 'admin'});
    }
});

router.post('/', async (req, res) => {
    try {
        if(!req.body.index_full) req.body.index_full = 0;
        await updateSettings(req.body.index_full,'index_full');
        await updateSettings(1,'indexing');
        req.flash('success', message.SUCCESS_EDIT);
        res.redirect(302,`/${slug}`);
    } catch (error) {
        console.log(error);
        res.render('admin/error', {layout: 'admin'});
    }
});

module.exports = router;