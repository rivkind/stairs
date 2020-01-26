const { getUrls } = require("./utils/urlUtils");
const { getAllUrl } = require("./models/index-url");
const { isNeedProcess, startedProcess, finishedProcess, updateProcess } = require('./models/settings');
const fsp = require('fs').promises; // используем экспериментальное API работы с файлами, основанное на промисах
const path = require("path");
const { logToConsole } = require('./utils/utils');

(async function () {
    const isNeedSitemap = await isNeedProcess('sitemap');
    if(isNeedSitemap && isNeedSitemap.length > 0) {
        logToConsole(`started create sitemap`);
        await startedProcess('sitemap');
        const urls=await getUrls();

        let indexUrls=await getAllUrl();
        let lastModificationsHash={};
        indexUrls.forEach( indexUrl => {
            lastModificationsHash[indexUrl.url]=indexUrl.last_modification_dt;
        } );

        
        const sitemap=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${urls.map( url => `
            <url>
                <loc>http://178.172.195.18:8881${url.url}</loc>
                <changefreq>${url.data.changefreq}</changefreq>
                <priority>${url.data.priority}</priority>
                <lastmod>${ lastModificationsHash[url.url] ? lastModificationsHash[url.url].toISOString() : "" }</lastmod>
            </url>`).join("")
        }
        </urlset>`;

        try {
            await fsp.writeFile(path.resolve(__dirname,"sitemap.xml"), sitemap);
            logToConsole('sitemap.xml has been saved.');
        }
        catch ( err ) {
            logToConsole(err);
        }
        await finishedProcess('sitemap');

        

    }
    
    
    return process.exit(22);
})();
