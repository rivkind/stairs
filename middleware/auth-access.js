const {getUserSession} = require('../models/users-session');
const { logLineAsync } = require('../utils/utils');

const authAccess = async (req, res) => {
    const { user } = req.session;
    if(user && user.length > 0) {
        try {
            const session = await getUserSession(user[0]);
            if(session) {
                return false;
            }
        } catch (error) {
            logLineAsync(error);
           return false; 
        }
    }
    return true;
   
}

module.exports = authAccess;