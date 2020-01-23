const fs = require('fs');
const path = require('path');
const { insert, select, selectById, remove } = require('../utils/dbQuery');
const TABLE_NAME = 'turnir_type';

const updateType = async ( id, body, file ) => {
    const {name, name_en} = body;
    if(file !== null) {
        const tmp_path = file.path;
        const target_path = path.join(__dirname,"..","static","img","flag",file.originalname);
    }
}


const removeType = async ( id ) => {

    return new Promise(async (resolve,reject)=>{
        try {
            const types = await getType(id);
            if(types) {
               const t = await remove(TABLE_NAME,{id});
               if(t) {
                    const target_path = path.join(__dirname,"..","static","img","flag",types.flag);
                    await fs.unlink(target_path, (err)=> {return reject('Не удалось удалить файл')});
                    resolve(true);
               }
            }else{
                reject('Не существующая позиция');
            }
        } catch (error) {
            reject(error);
        }
    });

    
    //getType();
    //return await remove(TABLE_NAME,{id});
}

const addType = async (body,file) => {
    const {name, name_en} = body;
    const tmp_path = file.path;
    const target_path = path.join(__dirname,"..","static","img","flag",file.originalname);

    return new Promise((resolve,reject)=>{
        fs.rename(tmp_path, target_path, async function(err) {
            if (err) {
                reject(err);
                fs.unlink(tmp_path, (err)=>reject(err));
            }else {
                const data = {
                    name: name || null,
                    name_en:  name_en || null,
                    flag: file.originalname
                }
                insert(TABLE_NAME, data)
                    .then(res=>resolve(res))
                    .catch(err=>fs.unlink(target_path, (err)=>reject(err)));
            };
        });
    });
}

const getType = async (id = 0) => {

    if(id) {
        return await selectById(TABLE_NAME, id);
    } else {
        return await select(TABLE_NAME);
    }
}

module.exports = {
    addType,
    getType,
    removeType
}