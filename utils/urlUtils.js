const { getPages }= require('../models/pages');
const { getNews }= require('../models/news');

const getUrls = async () => {
    let urls=[];

    const pages = await getPages();

    pages.forEach( page => {
        if(!page.auth) {
            urls.push({
                url:`/${page.url}`,
                groupCode:'page',
                groupParams:{pageURLCode:page.url},
                data: page
            });
        }
    } );

    const news = await getNews();
    news.forEach( newRow => {
        urls.push({
            url:`/news/${newRow.url}`,
            groupCode:'news',
            groupParams:{newsURLCode:newRow.url},
            data: newRow
        });
    } );

    return urls;
}

module.exports={
    getUrls
};