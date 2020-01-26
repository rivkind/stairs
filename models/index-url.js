const { select, insert, update, remove } = require('../utils/dbQuery');
const TABLE_NAME = 'index_urls';


const addUrl = async (data) => await insert(TABLE_NAME,data);

const getAllUrl = async () => await select(TABLE_NAME);

const getItemByUrl = async (url) => await select(TABLE_NAME,{url});

const updateUrl = async (updateData, whereData = {}) => await update(TABLE_NAME, updateData, whereData);

const removeAllUrl = async () => await remove(TABLE_NAME);

const removeInactiveUrl = async () => await remove(TABLE_NAME, {actual_flag: 0});

module.exports = {
    addUrl,
    updateUrl,
    getItemByUrl,
    removeAllUrl,
    removeInactiveUrl,
    getAllUrl
}