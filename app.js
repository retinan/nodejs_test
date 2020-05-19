const express = require('express');
const nunjucks = require('nunjucks');

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

app.get('/', (req, res) => {
    res.send('first test app');
});

// Routing
app.use('/admin', admin);


app.listen(port, () => {
    console.log('Express listening on port', port);
});
