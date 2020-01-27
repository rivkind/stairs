const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const async = require('async');

const folder = path.join(__dirname, 'static');

const readDirectory = (dirPath) => {
    try {
        const files = fs.readdirSync(dirPath);

        async.eachSeries(files, async file => {
            if((/(css|js)$/.test(file))){
                const filePath = path.join(dirPath, file);
                const fileInFolder = fs.statSync(filePath);
                if (fileInFolder.isDirectory()) {
                    readDirectory(filePath);
                } else if(fileInFolder.isFile()) {
                    const gzipFN = filePath + '.gz';
                    try {
                        const gzipFile = fs.statSync(gzipFN);
                        if(fileInFolder.mtime > gzipFile.mtime) {
                            await createGzip(filePath,gzipFN);
                        }
                    }catch (e) {
                        await createGzip(filePath,gzipFN);
                    }
                }
            }
        })
    }catch (e) {
        console.log('Directory not found')
    }
}

const createGzip = async (originFile, gzFile) => {
    
    await new Promise((resolve, reject) => {
        const inp = fs.createReadStream(originFile);
        const out = fs.createWriteStream(gzFile);
        inp.pipe(zlib.createGzip()).pipe(out);
        out.on('close', () => {
            console.log(`File created ${gzFile}`);
            resolve(out);
        })
    });
}

readDirectory(folder);