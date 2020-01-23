const {getUserSession} = require('../models/users-session') 

const guestAccess = (req, res, next) => {
    const { user } = req.session;
    if(user && user.length > 0) {
        if(getUserSession(user[0])) {
            res.redirect(302,`/`);
            return;
        }
    }
    next();
}

module.exports = guestAccess;