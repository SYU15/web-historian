var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var headers = require('./http-helpers.js');
// require more modules/folders here!

var sendResponse = function (response, data, statusCode) {
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers.headers);
  response.end(data);
}

var actions = {
  'GET': function (request, response) {
    sendResponse(response, data, 200);
  },
  'POST': function(request, response) {
    // console.log('data :'+data);
    console.log('sending POST request');
    // collectData(request, function (message) {
    //   console.log(data);
    //   var newData
    // })
    var requestBody ='';
    request.on('data', function(data){
      requestBody += data;
    });
    request.on('end', function(){
      console.log(requestBody);
      sendResponse(response, requestBody, 201);
      response.end("Hello, world");
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(response);
  }
};

// var collectData = function (request, callback) {
//   var data = '';
//   request.on('data', function (chunk) {
//     data += chunk;
//   });
//   request.on('end', function() {
//     callback(data);
//   });
// };

var requestHandler = function (request, response) {
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    throw new Error('action not found');
  }
};

exports.requestHandler = requestHandler;
exports.sendResponse = sendResponse;
