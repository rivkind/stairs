const { insert, update, select } = require('../utils/dbQuery');
const TABLE_NAME = 'news';

const getNews = async () => {

    return await select(TABLE_NAME);
}

const getListNews = async (limit) => {

    return await select(TABLE_NAME,{},limit,[['created_at','desc']]);
}

const addNews = async (data) => {

    const {title,description,url,keywords} = data;

    const prop =  {title,description,url,keywords}

    return await insert( TABLE_NAME, prop );
    
}

const updateNews = async (id, updateData = {}) => {
    return await update( TABLE_NAME, updateData, {id} );
}

const newsByCode = async (url) => {

    return await select( TABLE_NAME, {url} );
   
 }

module.exports = {
    addNews,
    newsByCode,
    getNews,
    updateNews,
    getListNews
}