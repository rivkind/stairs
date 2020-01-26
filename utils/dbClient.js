const knex = require('knex');

const dbClient = knex({
    client: 'mysql',
    connection: {
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'stairs',
    },
    pool: { min: 0, max: 10 },
    useNullAsDefault: true,
    //debug: true
})

module.exports = dbClient