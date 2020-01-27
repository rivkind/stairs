const {getUserSession} = require('../models/users-session')
const { logLineAsync } = require('../utils/utils'); 

const guestAccess = async (req, res, next) => {
    const { user } = req.session;
    if(user && user.length > 0) {
        try {
           const session = await getUserSession(user[0]);
            if(session) {
                res.redirect(302,`/`);
                return;
            } 
        } catch (error) {
            logLineAsync(error); 
        }
    }
    next();
}

module.exports = guestAccess;