const { insert, update, select, remove } = require('../utils/dbQuery');
const TABLE_NAME = 'news';

const getNews = async () => await select(TABLE_NAME);

const getListNews = async (limit) => await select(TABLE_NAME,{},limit,[['created_at','desc']]);


const addNews = async (data) => {
    const {title,description,url,keywords,changefreq, priority} = data;

    return await insert( TABLE_NAME, {title,description,url,keywords,changefreq, priority} );
}

const updateNews = async (id, updateData = {}) => await update( TABLE_NAME, updateData, {id} );

const newsByCode = async (url) => await select( TABLE_NAME, {url} );

const removeNews = async (id) => await remove( TABLE_NAME, {id} );

module.exports = {
    addNews,
    newsByCode,
    getNews,
    updateNews,
    getListNews,
    removeNews
}