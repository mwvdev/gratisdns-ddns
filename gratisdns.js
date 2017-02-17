if(process.argv.length < 5) {
    console.error('Usage: gratisdns <username> <password> <domain> <hostname>');
    process.exit(1);
}

var request = require('request');
var validator = require('validator');
var config = require('./config');

var username = process.argv[2];
var password = process.argv[3];
var domain = process.argv[4];
var hostname = process.argv[5];

function updateDDNS(ip, callback) {
    var queryString = {u: username, p: password, d: domain, h: hostname, ip: ip};
    request({url: config.url, qs: queryString}, function(error, response, body) {
        if(error) {
            return callback(error);
        }

        return callback(null, domain, hostname, body);
    });
}

function updateDDNSCallback(error, domain, hostname, body) {
    if(error) {
        console.log('Failed submitting DDNS update to GratisDNS for domain: %s and host: %s. Received response: %s',
            domain, hostname, body);
    }
    else {
        console.log('Successfully submitted a DDNS update to GratisDNS for domain: %s and host: %s. Received response: %s',
            domain, hostname, body);
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
