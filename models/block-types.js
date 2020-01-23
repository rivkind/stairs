const { select } = require('../utils/dbQuery');
const TABLE_NAME = 'block_types';


const getBlockTypesWithKey = async (id = false) => {

    const types = await select( TABLE_NAME );
    const newTypes = [];
    types.forEach(t => (id)? newTypes[t.id]=t.code : newTypes[t.code] = t.id );
    return newTypes;
}

const getBlockTypes = async () => {

    return await select( TABLE_NAME );
    
}



module.exports = {
    getBlockTypesWithKey,
    getBlockTypes
}