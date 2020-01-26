require('dotenv').config()
//const compression = require('compression');
const express = require('express');
const hbs = require( 'express-handlebars');

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const flashMessage = require('./middleware/flash-message');
const adminAccess = require('./middleware/admin-access');

const bodyParser = require('body-parser');

const webserver = express();

const port = process.env.PORT || 8881;

webserver.engine( 'hbs', hbs( {
    extname: 'hbs',
}));
webserver.disable('x-powered-by');
/*webserver.use(compression({
    threshold: 512
}));*/
//webserver.set('etag', 'strong')
webserver.set("view engine", "hbs");
webserver.set("views", "templates");
webserver.use(cookieParser('secret key'));
webserver.use(session({
    secret: 'itacademy',
    resave: false,
    saveUninitialized: true,
}));
webserver.use(flash());

webserver.use(bodyParser.urlencoded({extended:true}));

webserver.use(flashMessage);

webserver.get('/', async (req, res, next) => { 
    req.url='/main';
    next();
});

webserver.use(
    express.static(path.resolve(__dirname,"static"))
);

//webserver.disable('x-powered-by');
webserver.use("/admin",adminAccess,require('./routes/admin'));
//webserver.use("/admin",require('./routes/admin'));
webserver.use("/news",require('./routes/news'));
webserver.use("/users",require('./routes/users'));
webserver.use("/",require('./routes/page'));

webserver.get('*', async (req, res) => { 
    res.status(404).send('Страница не найдена')
});

webserver.listen(port, () => {
    console.log("web server running on port "+port);
});