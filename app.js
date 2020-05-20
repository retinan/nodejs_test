const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');

const db = require('./models');

db.sequelize.authenticate().then(() => {
    console.log('Connection has been estalished successfully.');
    return db.sequelize.sync();
}).then(() => {
    console.log('DB Sync complete.');
}).catch( err => {
    console.error('Unable to connect to the database:', err);
});


const admin = require('./routes/admin');
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
// 

// Routing
app.get('/', (req, res) => {
    res.send('first test app');
});
app.use('/admin', admin);


app.listen(port, () => {
    console.log('Express listening on port', port);
});
