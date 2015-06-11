// config/database.js
var express = require('express'),
    app = express();

if('development' == app.get('env')) {
    module.exports = {
        'url': 'mongodb://localhost/benvenuto',
        'url2': 'mongodb://localhost/benvenutossessions'
    }
}else{
    module.exports = {
        'url': process.env.CUSTOMCONNSTR_MONGOLAB_URI,
        'url2': process.env.CUSTOMCONNSTR_MONGOLAB_URIA
    }
}