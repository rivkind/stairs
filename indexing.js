require('dotenv').config()
const { getUrls } = require("./utils/urlUtils");
const { removeTags } = require("./utils/utils");
const { sha256 } = require("js-sha256");
const { updateUrl, getItemByUrl, addUrl, removeAllUrl, removeInactiveUrl } = require("./models/index-url");
const { removeWordsByIndexUrl,insertWords, removeAllWords } = require("./models/index-url-words");
const { composeContent } = require('./makets/contents');
const { isNeedProcess, startedProcess, finishedProcess, updateProcess } = require('./models/settings');
const { logToConsole } = require('./utils/utils')

const wordRE=/[а-яА-ЯёЁa-zA-Z]{4,}/g;

async function indexURLContent(indexUrlId,html) {

    let text=removeTags(html," ");
    await removeWordsByIndexUrl(indexUrlId);
    let valuesDatas=[];

    while (true) {
        let searchRes=wordRE.exec(text);
        if ( !searchRes )
            break;
        let d = {
            index_url: indexUrlId,
            clean_txt_index: searchRes.index,
            word: searchRes[0].toUpperCase()
        }
        valuesDatas.push(d);
    }
    if ( valuesDatas.length )
        await insertWords(valuesDatas);
}

const processURL = async (urlInfo) => {
    const htmlTemp = await composeContent(urlInfo.data.content, [urlInfo.data]);
    const html = htmlTemp.join('');
    /*switch ( urlInfo.groupCode ) {
        case 'news':
            html = await composeMaket(urlInfo.data.content, [urlInfo.data]); 
            break;
        case 'page':
            html = await composeMaket(1, [urlInfo.data]); 
            break;
    }*/
    const htmlCRC=sha256(html);
    const titleRes=/<title>(.+)<\/title>/.exec(html);
    const title=titleRes ? titleRes[1] : "";
    
    let indexUrls=await getItemByUrl(urlInfo.url);

    if ( indexUrls.length===0 ) {
        const date = new Date();

        const data = {
            url: urlInfo.url,
            title: urlInfo.data.title,
            description: urlInfo.data.description,
            group_code: urlInfo.groupCode,
            group_params: JSON.stringify(urlInfo.groupParams),
            html_crc: htmlCRC,
            add_dt: date,
            actual_flag: 1,
            last_render_dt: date,
            last_modification_dt: date
        }

        const indexUrlId=await addUrl(data);
        await indexURLContent(indexUrlId[0],html);
    }
    else {
        
        const indexUrlId=indexUrls[0].id;

        let updateData = {
            title: urlInfo.data.title,
            description: urlInfo.data.description,
            actual_flag: 1,
            last_render_dt: new Date(),
        }
        await updateUrl(updateData, {id: indexUrlId})

        if ( indexUrls[0].html_crc!==htmlCRC ) {
            
            await indexURLContent(indexUrlId,html);
            updateData = {
                html_crc: htmlCRC,
                last_modification_dt: new Date(),
            }
            await updateUrl(updateData, {id: indexUrlId})
        }

    }
}

(async function() {
    const isNeedIndexing = await isNeedProcess('indexing');
    if(isNeedIndexing && isNeedIndexing.length > 0) {
        logToConsole(`Started indexing...`);
        await startedProcess('indexing');
        let urls=await getUrls();

    
        //await removeAllUrl();
        //await removeAllWords();
    
        const updatData = {actual_flag: 0}
    
        await updateUrl(updatData);
    
        
        for ( var u=0; u<urls.length; u++ ) {
            const urlInfo=urls[u];
            await processURL(urlInfo);
        }
    
        await removeInactiveUrl();
        await finishedProcess('indexing');
        await updateProcess('sitemap');
        logToConsole(`finished indexing`);
    }
    return process.exit(22);
})();