const knex = require('knex');
const db = require('../config/db')

const dbClient = knex({
    client: 'mysql',
    connection: db,
    pool: { min: 0, max: 10 },
    useNullAsDefault: true,
    //debug: true
})

module.exports = dbClient