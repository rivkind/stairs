const { insert, update, select } = require('../utils/dbQuery');
const TABLE_NAME = 'pages';

const getPages = async () => await select(TABLE_NAME);

const getMenu = async (req) => {

    const whereData = (req && req.session && req.session.user)? {isMenu: 1} : {isMenu: 1, auth: 0}

    const menus = await select(TABLE_NAME,whereData,null,[['ord','asc']]);
    const urlOriginal = (req)? req.originalUrl.slice(1) : '';
    const newMenu = menus.map(menu=>{
        const active = (urlOriginal === menu.url);
        const url = (menu.url === 'main')? '/' : menu.url;
        return {
            ...menu,
            active,
            url
        }
    });
    return newMenu;
}

const addPages = async (data) => {

    const {title,description,url,keywords,auth = 0, isMenu = 0, ord} = data;

    return await insert( TABLE_NAME, {title,description,url,keywords, auth, isMenu, ord} );
}

const updatePages = async (id, updateData = {}) => await update( TABLE_NAME, updateData, {id} );

const pagesByCode = async (url) => await select( TABLE_NAME, {url} );

const removePage = async (id) => await remove( TABLE_NAME, {id} );

module.exports = {
    addPages,
    pagesByCode,
    getPages,
    updatePages,
    removePage,
    getMenu
}