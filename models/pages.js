const { insert, update, select } = require('../utils/dbQuery');
const TABLE_NAME = 'pages';

const getPages = async () => {

    return await select(TABLE_NAME);
}

const addPages = async (data) => {

    const {title,description,url,keywords} = data;

    const prop =  {title,description,url,keywords}

    return await insert( TABLE_NAME, prop );
    
}

const updatePages = async (id, updateData = {}) => {
    return await update( TABLE_NAME, updateData, {id} );
}

const pagesByCode = async (url) => {

    return await select( TABLE_NAME, {url} );
   
 }

module.exports = {
    addPages,
    pagesByCode,
    getPages,
    updatePages
}