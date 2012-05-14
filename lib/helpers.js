var crypto = require('crypto');

/**
 * 3-letter month names
 */
exports.monthnames = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
 
/**
 * Decode according to OAuth spec.
 * @param {string} content  Stuff to decode 
 * @return {string} Decoded content
 */ 
exports.oauth_decode = function(content) {
  if(content) content = content.replace(/\+/g, " ");
  return decodeURIComponent(content);
};

/**
 * Encode according to OAuth spec.
 * @param {string} content  Stuff to encode
 * @return {string} Encoded content
 */ 
exports.oauth_encode = function(content) {
  var result = encodeURIComponent(content);
  return result.
    replace(/\!/g, "%21").
    replace(/\'/g, "%27").
    replace(/\(/g, "%28").
    replace(/\)/g, "%29").
    replace(/\*/g, "%2A");
};

/**
 * Sign content with key as per OAuth spec
 * HMAC-SHA1 only supported so far!
 * @param {string} method   Signature method (HMAC-SHA1 only so far)
 * @param {string} content  Text to sign
 * @param {string} key      Key to sign text with
 * @return {string} Signed text
 */
exports.oauth_sign = function(method, content, key) {
  if(method == 'HMAC-SHA1') {
    return crypto.createHmac("sha1", key).update(content).digest("base64"); 
  }
};

/**
 * Get timestamp as per OAuth spec
 * @return {string} Timestamp
 */
exports.ts = ts = function() { return Math.round(new Date().getTime() / 1000) };

/**
 * Get unique nonce as per OAuth spec
 * @return {string} Unique ID string
 */
exports.nonce = function() { return(ts()) };

