const { insert, update, select } = require('../utils/dbQuery');
const { sha256 } = require("js-sha256");
const SALT = 'itacademy';
const TABLE_NAME = 'users';

const addUser = async (data, token) => {
    const { password, email } = data;

    const passHash = await hashPassword(password);

    const insertData = {
        email,
        password: passHash,
        token
    }
    return await insert(TABLE_NAME, insertData);
}

const hasEmail = async (email) => {
    const user = await select(TABLE_NAME, {email});
    return (user && user.length !== 0);
}

const confirmUser = async (token) => {
    const whereData = {
        token,
        status: 0
    }
    const updateData = {status: 1};
    const upd = await update(TABLE_NAME, updateData, whereData);
    return upd;
}

const signin = async (data) => {
    try {
        const { password, email } = data;
        const passHash = await hashPassword(password);
        const whereData = {
            email,
            password: passHash,
            status: 1
        }
        const user = await select(TABLE_NAME, whereData);
        return (user && user.length === 1)? user : false
    } catch (error) {
        console.log(error);
       return false 
    }
    
}

const isAdmin = async (id) => {
    const data = {
        id,
        role_id: 1
    }

    const user = await select(TABLE_NAME, data);
    return (user && user.length > 0);

}

const hashPassword = async (password) => {
    const passSalt = password + SALT;
    return await sha256(passSalt);
}


module.exports = {
    hasEmail,
    addUser,
    signin,
    isAdmin,
    confirmUser
}