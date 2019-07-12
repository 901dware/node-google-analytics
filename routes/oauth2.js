var express = require('express');
const url = require('url');
const { google } = require('googleapis');

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = '../credentials/oauth2.keys.json';
var keys = require(keyPath).web;

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

const scopes = ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/analytics.readonly'];

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});


var router = express.Router();

/* GET home page. */
router.get('/success', function(req, res, next) {
	res.render('oauth2');
});

router.get('/login', function(req, res, next) {

	// grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
  res.redirect(authorizeUrl);
});

router.get('/callback', async function(req, res, next) {
	
	if (req.url.indexOf('/callback') > -1) {		
		const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
		const {tokens} = await oauth2Client.getToken(qs.get('code'));
		oauth2Client.credentials = tokens;		
		res.redirect('/oauth2/success');
	}
  
});

module.exports = router;
