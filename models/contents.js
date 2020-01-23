const { insert, remove, select } = require('../utils/dbQuery');
const TABLE_NAME = 'contents';


const removeContentByStructure = async (id) => {

    const where = {structure: id};

    return await remove( TABLE_NAME, where )
    
}

const removeContentByNews = async (id) => {

    const where = {news_id: id};

    return await remove( TABLE_NAME, where )
    
}

const removeContentByPages = async (id) => {

    const where = {pages_id: id};

    return await remove( TABLE_NAME, where )
    
}

const addContent = async (structure, place, comment, news_id = null, pages_id = null) => {

    const data = {structure,place,comment,news_id, pages_id};

    return await insert( TABLE_NAME, data )
    
}


const getContentsWithKeyByStructure = async (id, dir=false) => {

    const where ={structure: id};
    const contents = await select( TABLE_NAME, where );
    const newContents = [];
    contents.forEach(t => (dir)? newContents[t.id] = {place:t.place, name:t.comment}  : newContents[t.place] = t.id);
    console.log('sdfdf',newContents);
    return newContents;
}

const contentByStructureId = async (structure, limit = '') => {
    return await select( TABLE_NAME, {structure}, limit );
}

const contentByNewsId = async (news_id, limit = '') => {
     return await select( TABLE_NAME, {news_id}, limit );
}

const contentByPagesId = async (pages_id, limit = '') => {
    return await select( TABLE_NAME, {pages_id}, limit );
}



module.exports = {
    addContent,
    removeContentByStructure,
    getContentsWithKeyByStructure,
    contentByStructureId,
    contentByNewsId,
    removeContentByNews,
    removeContentByPages,
    contentByPagesId
}