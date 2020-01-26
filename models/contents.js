const { insert, remove, select } = require('../utils/dbQuery');
const TABLE_NAME = 'contents';


const removeContentByStructure = async (id) => await remove( TABLE_NAME, {structure: id} );

const removeContentByNews = async (id) => await remove( TABLE_NAME, {news_id: id} );

const removeContentByPages = async (id) => await remove( TABLE_NAME, {pages_id: id} )

const addContent = async (structure, place, comment, news_id = null, pages_id = null) => await insert( TABLE_NAME, {structure,place,comment,news_id, pages_id} )

const contentByStructureId = async (structure, limit = '') => await select( TABLE_NAME, {structure}, limit );

const contentByNewsId = async (news_id, limit = '') => await select( TABLE_NAME, {news_id}, limit );

const contentByPagesId = async (pages_id, limit = '') => await select( TABLE_NAME, {pages_id}, limit );

module.exports = {
    addContent,
    removeContentByStructure,
    contentByStructureId,
    contentByNewsId,
    removeContentByNews,
    removeContentByPages,
    contentByPagesId
}