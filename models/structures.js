const { select, selectById } = require('../utils/dbQuery');
const TABLE_NAME = 'structures';

const getStructures = async (id = 0) => (id)? await selectById(TABLE_NAME, id) : await select(TABLE_NAME)

module.exports = {
    getStructures
}