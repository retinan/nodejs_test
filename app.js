const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// for flash message
const flash = require('connect-flash');

// for passport login
const passport = require('passport');
const session = require('express-session');

// for db 
const db = require('./models');

db.sequelize.authenticate().then(() => {
    console.log('Connection has been estalished successfully.');
    return db.sequelize.sync();
    // return db.sequelize.drop();
}).then(() => {
    console.log('DB Sync complete.');
}).catch( err => {
    console.error('Unable to connect to the database:', err);
});


const admin = require('./routes/admin');
const accounts = require('./routes/accounts');

const app = express();
const port = 3000;

nunjucks.configure('template', {
    autoescape: true,
    express: app
})

// middleware setting
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// 

// 업로드 path 추가
app.use('/uploads', express.static('uploads'));


// session setting
app.use(session({
    secret: 'retin',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 // 지속시간 2시간
    }
}));

// passport setting
app.use(passport.initialize());
app.use(passport.session());

// flash message
app.use(flash());


// Routing
app.get('/', (req, res) => {
    res.send('first test app');
});
app.use('/admin', admin);
app.use('/accounts', accounts);


app.listen(port, () => {
    console.log('Express listening on port', port);
});
