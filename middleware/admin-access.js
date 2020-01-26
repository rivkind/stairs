const {getUserSession} = require('../models/users-session');
const {isAdmin} = require('../models/users')

const adminAccess = async (req, res, next) => {
    
    const { user } = req.session;
    if(user && user.length > 0) {
        try {
            const session = await getUserSession(user[0]);
            const admin = await isAdmin(user[0].id);
            if(session && admin)
                next();
            else
                res.status(403).render('admin/forbidden', {layout: 'main'});
        } catch (error) {
            console.log(error);
            res.render('admin/error', {layout: 'main'});
        }
    } else
        res.redirect(302,`/users/login`);
}

module.exports = adminAccess;