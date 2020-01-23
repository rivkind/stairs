const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const { getImageById } = require('../models/images');
const { getListNews } = require('../models/news');

const composeBlock_HeaderH1 = async (blockAttributes) => {
    return `<h1>${blockAttributes.text}</h1>`;
}

const composeBlock_HeaderH2 = async (blockAttributes) => {
    return `<h2>${blockAttributes.text}</h2>`;
}

const composeBlock_HeaderH3 = async (blockAttributes) => {
    return `<h3>${blockAttributes.text}</h3>`;
}

const composeBlock_HeaderH4 = async (blockAttributes) => {
    return `<h4>${blockAttributes.text}</h4>`;
}

const composeBlock_HeaderH5 = async (blockAttributes) => {
    return `<h5>${blockAttributes.text}</h5>`;
}

const composeBlock_HeaderH6 = async (blockAttributes) => {
    return `<h6>${blockAttributes.text}</h6>`;
}

const composeBlock_Image = async (blockAttributes) => {
    const imageId=blockAttributes.image;
    if ( !imageId )
        return "";


    let imageRow=await getImageById(+imageId);
    
    return `<img src='${imageRow[0].url}' style='display: block; max-width: 400px'>`;
}

const composeBlock_Content = async (blockAttributes) => {
    return `<div>${blockAttributes.join("\n")}</div>`;
}

const composeBlock_ContentBlock = async (blocks) => {
    const col = 12/blocks.length;
    return `<div class="row">${blocks.map( html => `<div class="col-${col}">${html.join("\n")}</div>` ).join("\n")}</div>`;
}

const composeBlock_FormattedText = async (blockAttributes) => {
    return `<div>${blockAttributes.text}</div>`;
}

const composeBlock_Header = async (appData) => {
     return `<h2>${appData[0].title}</h2>`;
}

async function composeBlock_Search() {
    return  await fs.readFile(path.join(__dirname,'..', 'templates','partials','search.hbs'),"utf8");
}

async function composeBlock_Menu(req) {
    const user = (req && req.session && req.session.user)? req.session.user : null;
    
    const viewString = await fs.readFile(path.join(__dirname,'..', 'templates','partials','menu.hbs'),"utf8");
    const viewTemplate = handlebars.compile(viewString);
    
    
    const viewHTML = viewTemplate({
        session: (user && user.length > 0),
    });
    return viewHTML;
}

async function composeBlock_News() {
    const news = await getListNews(3);
    const viewString = await fs.readFile(path.join(__dirname,'..', 'templates','partials','news_top.hbs'),"utf8");
    const viewTemplate = handlebars.compile(viewString);
    const viewHTML = viewTemplate({
        news: news,
    });
    return viewHTML;
}

/*

async function composeBlock_Image(coreData,appData,blockAttributes) {

    const imageId=blockAttributes.image;
    if ( !imageId )
        return "";

    let imageRow=await selectQueryRowFactory(coreData.connection, `
        select url
        from images
        where id=?
    ;`, [imageId]);

    return `<img src='${imageRow.url}' style='display: block; max-width: 400px'>`;
}



async function composeBlock_Contacts(coreData,appData,blockAttributes) {
    return `
Наши контакты: тел. 233-322-233-322<br>
Лучшие страницы: <a href="/main">главная страница</a> <a href="/news">новости</a>
`;
}

async function composeBlock_News(coreData,appData,blockAttributes) {

    let news=await selectQueryFactory(coreData.connection, `
        select url_code, header
        from news
    ;`, []);

    return `
<h3>НОВОСТИ:</h3>
${news.map( newRow => `<a href="/new/${newRow.url_code}">${newRow.header}</a>` ).join("<br>")}
    `;
}

async function composeBlock_URLNew_Header(coreData,appData,blockAttributes) {
    return `<h1>${appData.newInfo.header}</h1>`;
}

*/
module.exports={
    composeBlock_HeaderH1,
    composeBlock_HeaderH2,
    composeBlock_HeaderH3,
    composeBlock_HeaderH4,
    composeBlock_HeaderH5,
    composeBlock_HeaderH6,
    composeBlock_Content,
    composeBlock_ContentBlock,
    composeBlock_FormattedText,
    composeBlock_Header,
    composeBlock_Image,
    composeBlock_Search,
    composeBlock_Menu,
    composeBlock_News
};