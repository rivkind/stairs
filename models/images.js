const { select, insert, update } = require('../utils/dbQuery');
const TABLE_NAME = 'images';
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const getImages = async () => await select(TABLE_NAME);
    
const getImageById = async (id) => await select(TABLE_NAME, {id});

const getImageByCode = async (code) => await select(TABLE_NAME, {code});

const deleteTmpFile = (file) => fs.unlink(file.path, (err)=>{if(err) console.log(err)});

const updateImages = async (body,file, imageOld) => {
    const {id, url} = imageOld;
    return new Promise( async (resolve,reject)=>{
        const code = body.name.toLowerCase();
        
        if(Object.keys(file).length !== 0) {
            try {
                const uploadFile = await processFile(file.image[0], code);

                const data = {
                    code: code || null,
                    url: uploadFile.url
                }
                update(TABLE_NAME,data,{id}).then(res=>{
                    const arr = url.split('/');
                    const remove_path = path.join(__dirname,"..","static",arr[1],arr[2]);
                    fs.unlink(remove_path, (err)=>reject(err))
                    resolve(res)
                }).catch(err=>fs.unlink(uploadFile.path, (err)=>reject(err)));
            } catch (error) {
                reject(error)
            }
        } else {
            try {
                await update(TABLE_NAME,{code},{id}); 
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        }
    });
}

const addImages = async (body,file) => {
    return new Promise( async (resolve,reject)=>{
        const name = body.name.toLowerCase();
        try {
            const uploadFile = await processFile(file, name);
            const data = {
                code: name || null,
                url: uploadFile.url
            }
            insert(TABLE_NAME, data)
            .then(res=>resolve(res))
            .catch(err=>fs.unlink(uploadFile.path, (err)=>reject(err)));
        } catch (error) {
            reject(error)
        }
    });
    
    
    
}

const processFile = (file, name) => {
    return new Promise((resolve,reject)=>{
        const tmp_path = file.path;
        const tmp_target_path = path.join(__dirname,"..","static","img","tmp"+file.originalname);
        let ext = '';
        fs.rename(tmp_path, tmp_target_path, async function(err) {
            if (err) {
                reject(err);
                fs.unlink(tmp_path, (err)=>reject(err));
            }else {
                try {
                    let result = await Jimp.read(tmp_target_path);
                    ext = result.getExtension();
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                    await result.print(font, 10, 10, 'stairs');
                    await result.quality(30);
                    await result.write(tmp_target_path);
                } catch (error) {
                    reject(error);
                    fs.unlink(tmp_target_path, (err)=>reject(err));
                    return ;
                }
                const url = `/img/${name}.${ext}`;
                
                const target_path = path.join(__dirname,"..","static",url);
                
                fs.rename(tmp_target_path, target_path, async function(err) {
                    if (err) {
                        fs.unlink(tmp_target_path, (err)=>reject(err));
                        reject(err);
                    }else {
                        const d = {
                            url,
                            path: target_path 
                        }
                        resolve(d);
                    }
                })
            };
        });
    });
}

module.exports = {
    getImages,
    addImages,
    getImageByCode,
    deleteTmpFile,
    updateImages,
    getImageById
}