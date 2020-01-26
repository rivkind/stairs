const {getUserSession} = require('../models/users-session');

const authAccess = async (req, res) => {
    const { user } = req.session;
    if(user && user.length > 0) {
        try {
            const session = await getUserSession(user[0]);
            if(session) {
                return false;
            }
        } catch (error) {
           console.log(error);
           return false; 
        }
    }
    return true;
   
}

module.exports = authAccess;