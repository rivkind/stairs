const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const { getImageById } = require('../models/images');
const { getListNews } = require('../models/news');
const { getMenu } = require('../models/pages');

const composeBlock_HeaderH1 = async (blockAttributes) => await composeHTML('h1.hbs',{text: blockAttributes.text});

const composeBlock_HeaderH2 = async (blockAttributes) => await composeHTML('h2.hbs',{text: blockAttributes.text});

const composeBlock_HeaderH3 = async (blockAttributes) => await composeHTML('h3.hbs',{text: blockAttributes.text});

const composeBlock_HeaderH4 = async (blockAttributes) => await composeHTML('h4.hbs',{text: blockAttributes.text});

const composeBlock_HeaderH5 = async (blockAttributes) => await composeHTML('h5.hbs',{text: blockAttributes.text});

const composeBlock_HeaderH6 = async (blockAttributes) => await composeHTML('h6.hbs',{text: blockAttributes.text});

const composeBlock_Header = async (appData) => await composeHTML('header.hbs',{text: appData[0].title});

const composeBlock_Search = async () => await composeHTML('search.hbs');

const composeBlock_Content = async (blockAttributes) => `<div>${blockAttributes.join("\n")}</div>`;

const composeBlock_FormattedText = async (blockAttributes) => `<div>${blockAttributes.text}</div>`;

const composeBlock_Image = async (blockAttributes) => {
    const imageId=blockAttributes.image;
    if ( !imageId )
        return "";
    try {
        let url=await getImageById(+imageId);
    } catch (error) {
        console.log(error);
        return "";
    }

    return await composeHTML('img.hbs',{url});
}

const composeBlock_ContentBlock = async (blocks) => {
    const col = 12/blocks.length;
    return `<div class="row">${blocks.map( html => `<div class="col-${col}">${html.join("\n")}</div>` ).join("\n")}</div>`;
}

const composeBlock_Menu = async (req) => {
    const user = (req && req.session && req.session.user)? req.session.user : null;
    try {
        const menu = await getMenu(req);
        return await composeHTML('menu.hbs',{ session: (user && user.length > 0), menu });
    } catch (error) {
        console.log(error);
        return '';
    }
}

const composeBlock_News = async () => {
    try {
        const news = await getListNews(3);
        return await composeHTML('news_top.hbs',{ news });
    } catch (error) {
        console.log(error);
        return '';
    }
}

const composeBlock_News_All = async () => {
    try {
        const news = await getListNews();
        return await composeHTML('news.hbs',{ news });
    } catch (error) {
        console.log(error);
        return '';
    }
}

const composeHTML = async (template, data = {}) => {
    const viewString = await fs.readFile(path.join(__dirname,'..', 'templates','blocks',template),"utf8");
    const viewTemplate = handlebars.compile(viewString);
    const viewHTML = viewTemplate(data);
    return viewHTML;
}

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
    composeBlock_News,
    composeBlock_News_All
};