var request = require('request');
var validator = require('validator');

var config = require('./config');

function updateDDNS(ip, callback) {
    var queryString = {u: config.user, p: config.password, d: config.domain, h: config.host, ip: ip};
    request({url: config.url, qs: queryString}, function(error, response, body) {
        if(error) {
            return callback(error);
        }

        return callback(null, body);
    });
}

function updateDDNSCallback(error, body) {
    if(error) {
        console.log('An error occurred while submitting DDNS update to GratisDNS: ' + error);
    }
    else {
        console.log('Submitted a DDNS update to GratisDNS successfully! Received response: ' + body);
    }
}

function lookupExternalIP(callback) {
    request({url: config.externalIPLookupUrl}, function(error, response, body) {
        if(error) {
            return callback(error);
        }
        if(!validator.isIP(body)) {
            return callback('External IP lookup did not provide a valid IP. Received: "' + body + '"');
        }

        return callback(null, body);
    });
}

var lookupCallback = function(error, ip) {
    if(error) {
        console.log("An error occurred while looking up external IP: " + error);
        return;
    }

    console.log('Found external IP: ' + ip);
    updateDDNS(ip, updateDDNSCallback);
};

lookupExternalIP(lookupCallback);
