let crypto = require('crypto');
let mysalt = 'retin';

module.exports = function (password) { 
    return crypto.createHash('sha512').update(password + mysalt).digest('base64');
 };