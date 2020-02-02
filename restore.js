var unzip = require('unzipper')
var fs = require('fs');
const path = require('path');
const { logToConsole } = require('./utils/utils')
const db = require('./config/db')

const dirPath = path.join(__dirname,'backup','img');
const filePathOut = path.join(__dirname,'static','img');

try {
        const files = fs.readdirSync(dirPath);
        const data = [];
        for(let i=0; i<files.length; i++) {
                const filePath = path.join(dirPath, files[i]);
                const fileInFolder = fs.statSync(filePath); 
                if(fileInFolder.isFile()) {
                        data.push({
                                filePath,
                                mtime: fileInFolder.mtime
                        })
                }  
        }
        
        data.sort((a,b) => (a.mtime > b.mtime) ? -1 : ((b.mtime > a.mtime) ? 1 : 0));
        
        fs.createReadStream(data[0].filePath).pipe(unzip.Extract({ path: filePathOut })).on('close', function () {
                logToConsole(`Success restore images ${data[0].filePath}`);
                
              });    
} catch (error) {
        logToConsole(`Error restore images: ` + error);
 }

const { exec } = require('child_process');

const dirPathDb = path.join(__dirname,'backup','db');

try {
        const filesDb = fs.readdirSync(dirPathDb);
        const dataDb = [];
        for(let i=0; i<filesDb.length; i++) {
                const filePathDb = path.join(dirPathDb, filesDb[i]);
                const fileInFolderDb = fs.statSync(filePathDb); 
                if(fileInFolderDb.isFile()) {
                        dataDb.push({
                                filePathDb,
                                mtime: fileInFolderDb.mtime
                        })
                }  
        }
        
        dataDb.sort((a,b) => (a.mtime > b.mtime) ? -1 : ((b.mtime > a.mtime) ? 1 : 0));
        
        exec(`mysql -u${db.user} -p${db.password} -h${db.host} < ${dataDb[0].filePathDb}`, (err, stdout, stderr) => {
                if (err) { 
            logToConsole(`exec error: ${err}`);
            return; 
          }else{
            logToConsole(`Success restore db ${dataDb[0].filePathDb}`);
          }
        });   
} catch (error) {
        logToConsole(`Error restore db: ` + error);
 }






