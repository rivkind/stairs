var unzip = require('unzipper')
var fs = require('fs');
const path = require('path');
const { logToConsole } = require('./utils/utils')

const dirPath = path.join(__dirname,'backup','img');
const filePathOut = path.join(__dirname,'output','path');

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
                logToConsole(" Выполнена восстановление папки изображений");
                
              });    
} catch (error) {
        logToConsole("Ошибка при восстановлении изображений: " + error);
 }

