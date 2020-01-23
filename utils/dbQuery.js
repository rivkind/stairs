const knex = require('./dbClient'); 




const insert = ( tableName, data ) => {
    return new Promise((resolve,reject)=>{
        knex(tableName).insert(data).then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
}

const select = ( tableName, where = {}, limit = null, orderBy = null ) => {
    return new Promise((resolve,reject)=>{
        const query = knex(tableName).where(where).select();

        if(limit) {
            query.limit(limit)
        }

        if(orderBy) {
            const ord = [];
            orderBy.forEach(o => {
                ord.push({
                    column: o[0],
                    order: o[1]
                })
            });
            query.orderBy(ord)
        }
        
        query.then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
}

const selectById = ( tableName, id, nameId = 'id' ) => {
    return new Promise((resolve,reject)=>{
        knex(tableName).where(nameId, id).first().then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
}

const selectIn = ( tableName, attr, data = [], orderBy = [] ) => {
    return new Promise((resolve,reject)=>{
        knex(tableName).whereIn(attr, data).orderBy(orderBy).then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
}

const selectInnerJoin = ( tableName, where, ad = [], orderBy = null ) => {
    return new Promise((resolve,reject)=>{
        
        knex.from(tableName).innerJoin(ad[0], ad[1], ad[2]).where(where[0],where[1]).orderBy(orderBy).then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
}

const update = ( tableName, updateData, whereData ={} ) => {
    return new Promise((resolve,reject)=>{
        knex(tableName).where(whereData).update(updateData).then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
    
}

const remove = ( tableName, whereData ={} ) => {

    return new Promise((resolve,reject)=>{
        knex(tableName).where(whereData).del().then(data => {
            resolve(data);
        }).catch((err) => reject(err));
    });
    
}

module.exports = {
    insert,
    update,
    select,
    selectById,
    remove,
    selectInnerJoin,
    selectIn
}