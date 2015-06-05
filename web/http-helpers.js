var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};



exports.sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers.headers);
  response.end(data);
}

exports.collectData = function (request, callback) {
  var data = '';
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

exports.send404 = function (response) {
  exports.sendResponse(response, '404: Page not found', 404);
}

exports.sendRedirect = function (response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

exports.serveAssets = function(res, asset, callback) {

  var encoding = {encoding: 'utf8'};

  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data){
    if(err){
      fs.readFile(archive.paths.archivedSites + asset, encoding, function(err, data){
        if (err){
          if(callback){callback();} else {exports.send404(res);}
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};
