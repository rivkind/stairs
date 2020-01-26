const {getUserSession} = require('../models/users-session') 

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
           console.log(error); 
        }
    }
    next();
}

module.exports = guestAccess;