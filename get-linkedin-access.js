/**
 * 1. Get OAuth Request Token from LinkedIn
 * 2. Show user URL to visit on console to get PIN
 * 3. Get OAuth Access Tokens from LinkedIn
 * 4. Display to user for use with "build-resumes.js" script
 * @author Brev Patterson <me@brev.name>
 */
var config = require('config'),
    events = require('events'),
    helpers = require('./lib/helpers'),
    prompt = require('prompt'),
    superagent = require('superagent');

var emitter = new events.EventEmitter();


/**
 * Get settings from config
 */
var key_api =     config.key.api;
var key_secret =  config.key.secret;

var path_token_request =  config.path.token.request;
var path_token_access =   config.path.token.access;
var url_api =             config.url.api;


/**
 * Internal settings
 */
var path_token_auth =       '';
var token_request =         '';
var token_request_secret =  '';
var token_access =          ''; 
var token_access_secret =   ''; 
var verifier =              ''; 
var signature_method =      'HMAC-SHA1';
var version =               '1.0';


/**
 * OAuth Request & Access token params for calls
 */  
var consumer_request_request_token = {
  oauth_consumer_key:     key_api,
  oauth_signature_method: signature_method,
  oauth_signature:        '',
  oauth_timestamp:        helpers.ts(),
  oauth_nonce:            helpers.nonce(),
  oauth_version:          version,
};
var consumer_request_access_token = {
  oauth_consumer_key:     key_api,
  oauth_token:            token_request,
  oauth_signature_method: signature_method,
  oauth_signature:        '',
  oauth_timestamp:        helpers.ts(),
  oauth_nonce:            helpers.nonce(),
  oauth_version:          version,
  oauth_verifier:         verifier,
};


/**
 * Prepare, encode, sign, and send OAuth token request calls
 * @param {object} params   Hash of http params to send
 * @param {string} path     URL Path to send request to
 * @param {string} secret1  First secret
 * @param {string} secret2  Second secret (optional)
 */
var getToken = function(params, path, secret1, secret2) {
  if(! secret2) secret2 = '';
  
  if(path === path_token_access) {
    params['oauth_token'] = token_request;
    params['oauth_verifier'] = verifier;
  }

  var ps = []; 
  Object.keys(params).sort().forEach(function(ea) {
    if(ea != 'oauth_signature') {
      ps.push(ea + '=' + helpers.oauth_encode(params[ea]));
    } 
  });
  psstr = ps.join('&');
  
  var outstr = 'POST&' +
    helpers.oauth_encode(url_api + path) + '&' + 
    helpers.oauth_encode(psstr);
  var sig = helpers.oauth_sign(signature_method, outstr, secret1 + '&' + secret2);
  params['oauth_signature'] = sig;
  
  var auths = [];
  Object.keys(params).forEach(function(ea) {
    auths.push(ea + '="' + helpers.oauth_encode(params[ea]) + '"');
  });
  var auth = auths.join(',');
  
  superagent.
    post(url_api + path).
    set('Authorization', 'OAuth realm="",' + auth).
    end(function(res) {
      var rp = res.res.text.split('&');
      var rpo = {};
      rp.forEach(function(ea) {
        var eal = ea.split('=');
        rpo[eal[0]] = helpers.oauth_decode(eal[1]);    
      });
      
      if(path === path_token_request) {
        token_request = rpo['oauth_token'];
        token_request_secret = rpo['oauth_token_secret'];
        path_token_auth = rpo['xoauth_request_auth_url']; 
        emitter.emit('gotRequestToken');
      }
      if(path === path_token_access) {
        token_access = rpo['oauth_token'];
        token_access_secret = rpo['oauth_token_secret'];
        emitter.emit('gotAccessToken');
      }
    });
};

/**
 * Directs OAuth Consumer to OAuth Provder
 */
var directToProvider = function() {
  console.log('');
  console.log('Please visit this URL in a browser and get the PIN code:');
  console.log('  ' + path_token_auth + '?oauth_token=' + token_request);
  console.log('');
  prompt.start();
  prompt.get(['pin'], function(err, res) {
    verifier = res.pin;
    emitter.emit('gotVerifier');
  });
};


/**
 * main
 */
getToken(
  consumer_request_request_token, 
  path_token_request, 
  key_secret 
);
emitter.on('gotRequestToken', function() {
  directToProvider();
});
emitter.on('gotVerifier', function() {
  getToken(
    consumer_request_access_token, 
    path_token_access,
    key_secret,
    token_request_secret   
  );
});
emitter.on('gotAccessToken', function() {
  console.log('');
  console.log('Use these values to access LinkedIn API:');
  console.log('(Most likely want to put these in config/default.js)');
  console.log('  Access Token: ' + token_access);
  console.log('  Access Token Secret: ' + token_access_secret);
  console.log('');
});

