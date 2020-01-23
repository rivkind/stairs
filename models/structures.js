const { select } = require('../utils/dbQuery');
const TABLE_NAME = 'structures';


const getStructures = async (id = 0) => {

    if(id) {
        return await selectById(TABLE_NAME, id);
    } else {
        return await select(TABLE_NAME);
    }
}

module.exports = {
    getStructures
}