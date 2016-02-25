// config/database.js
var express = require('express'),
    app = express();

if('development' == app.get('env')) {
    module.exports = {

	    'facebookAuth' : {
		    'clientID' 		: '1626434297573271', // your App ID
		    'clientSecret' 	: '4dc6ae549cc27afdc0a567fd4df1e2c8', // your App Secret
		    'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	    },

	    'twitterAuth' : {
		    'consumerKey' 		: 'd7Nm9kGmddTbp8bVPd3IRWpAq',
		    'consumerSecret' 	: 'x2FJbmrix0HaHd0HXWpw5mLVbRvmalCnWLc83bxv481KMd9QeL',
		    'callbackURL' 		: 'http://localhost:46066/auth/twitter/callback'
	    },

	    'googleAuth' : {
		    'clientID' 		: '255367409904.apps.googleusercontent.com',
		    'clientSecret' 	: '99dda7gFKNaONJL6rg23odNZ',
		    'callbackURL' 	: 'http://localhost:46066/auth/google/callback'
	    }

    };
}else{
    module.exports = {

	    'facebookAuth' : {
		    'clientID' 		: '1626434297573271', // your App ID
		    'clientSecret' 	: '4dc6ae549cc27afdc0a567fd4df1e2c8', // your App Secret
		    'callbackURL' 	: 'http://guia.azurewebsites.net/auth/facebook/callback'
	    },

	    'twitterAuth' : {
		    'consumerKey' 		: 'd7Nm9kGmddTbp8bVPd3IRWpAq',
		    'consumerSecret' 	: 'x2FJbmrix0HaHd0HXWpw5mLVbRvmalCnWLc83bxv481KMd9QeL',
		    'callbackURL' 		: 'http://www.benvenuto.com.br/auth/twitter/callback'
	    },

	    'googleAuth' : {
		    'clientID' 		: '255367409904.apps.googleusercontent.com',
		    'clientSecret' 	: '99dda7gFKNaONJL6rg23odNZ',
		    'callbackURL' 	: 'http://www.benvenuto.com.br/auth/google/callback'
	    }

    };
}

// config/auth.js

// expose our config directly to our application using module.exports
