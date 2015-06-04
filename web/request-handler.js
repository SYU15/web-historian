var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var headers = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function (response, data, statusCode) {
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers.headers);
  response.end(data);
}

var actions = {
  'GET': function (request, response) {
    fs.readFile('/Users/HR10/Desktop/historian/web/archives/sites.json', {encoding: 'utf8'}, function (err, data) {
    sendResponse(response, data, 200);
  });
  },
  'POST': function(request, response) {
    // console.log('data :'+data);
    console.log('sending POST request');
    // collectData(request, function (message) {
      // fs.readFile('/Users/HR10/Desktop/historian/web/archives/sites.txt', {encoding: 'utf8'}, function (err, data) {
    //     console.log(data);
    //     var newData = JSON.parse(data);
    //     console.log(newData);
    //     if (err) {
    //       console.log('oh nah');
    //     }
    //   });

    // })x
    var requestBody ='';
    var fileStuff;
    request.on('data', function(data){
      requestBody += data;
    });
    request.on('end', function(){
        // console.log(requestBody);
      fs.readFile('/Users/HR10/Desktop/historian/web/archives/sites.json', {encoding: 'utf8'}, function (err, data) {
        fileStuff = data;
        var parsedSites = JSON.parse(fileStuff);
        var newData = JSON.parse(requestBody);
        // console.log(fileStuff);
        if(parsedSites['url'].indexOf(newData['url']) < 0) {
          console.log('working');
        } else {
          console.log('still working');
        }
        sendResponse(response, 'sent', 201);
       });
      console.log(requestBody);
      // console.log(fileStuff);
        // console.log(parsedSites);
        // if (parsedSites['url'].indexOf(newData) > 0) {
        //   console.log('not here');
        // } else {
        //   console.log('here');
        // }
        // console.log(newData);;
      // console.log(requestBody);
      // response.end("Hello, world");
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(response);
  }
};

var collectData = function (request, callback) {
  var data = '';
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

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
