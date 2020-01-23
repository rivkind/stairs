const { insert, update, select } = require('../utils/dbQuery');
const uuidv4 = require('uuid/v4');

const TABLE_NAME = 'users_session';

const addSession = async (user_id) => {
    try {
        const session = uuidv4();
        const insertData = {
            session,
            user_id
        }
    
        await insert(TABLE_NAME, insertData); 
        return session;
    } catch (error) {
       return false; 
    }
}

const getUserSession = async (data) => {
    const dataSelect = {
        session: data.session,
        user_id: data.id
    }
    const session = await select(TABLE_NAME,dataSelect);

    return (session && session.length === 1);
}




module.exports = {
    addSession,
    getUserSession
}