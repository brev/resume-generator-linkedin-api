/**
 * Get profile data from LinkedIn, and then build resumes from it.
 * Make sure to run 'node ./get-linkedin-access.js' first,
 *   and put resulting tokens in './config/default.js'.
 * Varying templates for the different resume versions can be found under './templates'
 * @author Brev Patterson <me@brev.name>
 */
var Bliss = require('bliss'),
    config = require('config'),
    events = require('events'),
    exec = require('child_process').exec,
    fs = require('fs'),
    helpers = require('./lib/helpers'),
    prompt = require('prompt'),
    superagent = require('superagent'),
    util = require('util'),
    wrap = require('wordwrap')(65);

var bliss = new Bliss();
var emitter = new events.EventEmitter();


/**
 * Get settings from config
 */
var key_api =     config.key.api;
var key_secret =  config.key.secret;

var token_access =        config.access.token;
var token_access_secret = config.access.secret;

var path_profile =  config.path.profile;
var url_api =       config.url.api;


/**
 * Local settings
 */
var signature_method =      'HMAC-SHA1';
var version =               '1.0';

var outputdir = './output/';


/**
 * Params for getting LinkedIn resources via OAuth
 */ 
var consumer_request_protected_resources = {
  oauth_consumer_key:     key_api,
  oauth_token:            token_access,
  oauth_signature_method: signature_method,
  oauth_timestamp:        helpers.ts(),
  oauth_nonce:            helpers.nonce(),
  oauth_version:          version,
};


/**
 * Make OAuth'ed REST call to LinkedIn to get Profile Data
 */
var getProfileData = function() {
  // data to get from profile API
  var keys = [
    'certifications:(name,authority,start-date,end-date)',
    'educations',
    'first-name',
    'honors-awards:(name,issuer,description,occupation,date)',
    'last-name',
    'main-address',
    'member-url-resources',
    'organizations-memberships:(name,start-date,end-date,occupation,description)',
    'phone-numbers',
    'positions',
    'public-profile-url',
    'skills',
    'summary',
  ]; 
  var path = path_profile + ':(' + keys.join(',') + ')';
  
  var params = consumer_request_protected_resources;
  var ps = []; 
  Object.keys(params).sort().forEach(function(ea) {
    if(ea != 'oauth_signature') {
      ps.push(ea + '=' + helpers.oauth_encode(params[ea]));
    } 
  });
  psstr = ps.join('&');
  
  var outstr = 'GET&' +
    helpers.oauth_encode(url_api + path) + '&' + 
    helpers.oauth_encode(psstr);
  var sig = helpers.oauth_sign(signature_method, outstr, key_secret + '&' + token_access_secret);
  params['oauth_signature'] = sig;
  
  var auths = [];
  Object.keys(params).forEach(function(ea) {
    auths.push(ea + '="' + helpers.oauth_encode(params[ea]) + '"');
  });
  var auth = auths.join(',');
 
  var url = url_api + path;
  superagent.
    get(url).
    set('Authorization', 'OAuth realm="",' + auth).
    set('x-li-format', 'json').
    end(function(res) {
      emitter.emit('gotProfileData', JSON.parse(res.text));
    });
};


/**
 * main
 */
getProfileData();
emitter.on('gotProfileData', function(res) {
  if(! res.mainAddress) { console.log(res); }
  
  // overrides for profile data hash
  var addy = res.mainAddress.split('\n');
  res.country = addy[1]; 
  addy = addy[0].split(', ');
  res.city = addy[0];
  res.state = addy[1];

  res.today = new Date().toDateString();
    
  res.positions.values.forEach(function(val, idx) {
    res.positions.values[idx].startDate.monthname = helpers.monthnames[val.startDate.month];
    res.positions.values[idx].endDate.monthname = helpers.monthnames[val.endDate.month];
  });

  var edu = res.educations.values[0];
  var deg = edu.fieldOfStudy.split(', ');
  res.certifications.values.push({
    endDate: {
      year: edu.endDate.year || null,
    },
    startDate: {
      year: edu.startDate.year || null,
    },
    name:   deg[0] + ' ' + edu.degree,
    name2:  deg[1] + ' Minor',
    authority: {
      name: edu.schoolName
    }
  });
  res.certifications.values.sort(function(a,b) { 
    a = a.endDate ? a.endDate.year : a.startDate.year;
    b = b.endDate ? b.endDate.year : b.startDate.year; 
    return b - a;
  });


  // html desktop resume
  var fnh = outputdir + res.firstName.toLowerCase() + '-resume.html';
  var data = bliss.render('./templates/html/index.html', res);
  fs.writeFile(fnh, data, function(err) {
    if(err) { throw err; }
    else {
      exec('perl -pi -e "s/^\\s*\\n//" ' + fnh); // clean
      console.log('- HTML resume saved to ' + fnh);
      
      // html mobile resume
      res['mobile'] = 'mobile';
      var fnm = outputdir + res.firstName.toLowerCase() + '-resume-mobile.html';
      var data = bliss.render('./templates/html/index.html', res);
      fs.writeFile(fnm, data, function(err) {
        if(err) { throw err; }
        else {
          console.log('- Mobile HTML resume saved to ' + fnm);
          exec('perl -pi -e "s/^\\s*\\n//" ' + fnm); // clean
        }
      });
    }
  });
  
  // txt resume
  var fnt = outputdir + res.firstName.toLowerCase() + '-resume.txt';
  var data = bliss.render('./templates/txt/index.txt', res);
  data = wrap(data);
  fs.writeFile(fnt, data, function(err) {
    if(err) { throw err; }
    else {
      console.log('- Text resume saved to ' + fnt);
    }
  });
  
  // pdf resume
  var fnp = outputdir + res.firstName.toLowerCase() + '-resume.pdf';
  require('./templates/pdf/index.js').render(fnp, res);
  console.log('- PDF resume saved to ' + fnp);
});

