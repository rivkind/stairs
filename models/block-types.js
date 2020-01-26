const { select } = require('../utils/dbQuery');
const TABLE_NAME = 'block_types';

const getBlockTypes = async () => await select( TABLE_NAME );

module.exports = {
    getBlockTypes
}