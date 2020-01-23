const flashMessage = (req, res, next) => {
    const r = req.flash('success');
    if(r.length > 0) {
        res.locals.success = r[0];
    }
    const err = req.flash('error');
    if(err.length > 0) {
        res.locals.error = err[0];
    }

    const session = req.flash('session');
    if(session.length > 0) {
        req.session.user = session;
    }
    next();
}

module.exports = flashMessage;