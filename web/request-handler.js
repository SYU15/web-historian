var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var headers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.url.match('/')) {
    if(req.method === 'GET') {
      res.writeHead(200, headers.headers);
      res.end(archive.paths.list);
      console.log(headers.headers);
    }
  }
  res.end(archive.paths.list);
};

exports.sendResponse = function (response, data, statusCode) {
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
}
