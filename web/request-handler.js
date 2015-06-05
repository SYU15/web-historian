var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var utilities = require('./http-helpers.js');
var fs = require('fs');
var urlParser = require('url');
var static = require("node-static");
// require more modules/folders here!

var file = new static.Server("./web/public");


var actions = {
  'GET': function (request, response) {
    var parsedUrl = urlParser.parse(request.url);
    // console.log(parsedUrl);
    if(parsedUrl.pathname === '/'){
      var urlPath = '/index.html';
    } else {
      var urlPath = parsedUrl.pathname;
    }
    console.log(urlPath);
    utilities.serveAssets(response, parsedUrl, function() {
      archive.isUrlInList(urlPath.slice(1), function (found) {
        // console.log(urlPath.slice(1));
        if (found) {
          //redirect to loading
          utilities.sendRedirect(response, '/loading.html');
        } else {
          if(urlPath.slice(1) === 'index.html'){
            console.log(true);
            utilities.sendRedirect(response, '/index.html');
          } else{
            console.log('or here');
            utilities.send404(response);
          }
        }
      });
    });
  },
  'POST': function(request, response) {
    console.log('sending POST request');
      utilities.collectData(request, function(data){
        //url sent from client sid
        var url = data['url'];
        //check in sites.txt
        archive.isUrlInList(url, function(found) {
          if (found) {
            //check if its archived
            archive.isURLArchived(url, function(exists) {
              if(exists) {
                // if yes, redirect to that saved copy
                utilities.sendRedirect(response, '/'+url);
              } else {
                // if not, redirect to the loading page
                utilities.sendRedirect(response, '/loading.html');
              }
            });
          } else {
            // if not in sites.txt
            // append the url sent from client to sites.txt & redirect to loading page
            archive.addUrlToList(url, function() {
              utilities.sendRedirect(response, '/loading.html');
            });
          }
        });
      });
    // var requestBody ='';
    // var fileStuff;
    // request.on('data', function(data){
    //   requestBody += data;
    // });
    // request.on('end', function(){
    //   console.log(requestBody)
    //     // console.log(requestBody);
    //   fs.readFile('web/archives/sites.json', {encoding: 'utf8'}, function (err, data) {
    //     fileStuff = data;
    //     console.log(fileStuff);
    //     if(err){
    //       console.log('error reading sites.json')
    //     }
    //     var parsedSites = JSON.parse(fileStuff);
    //     var newData = JSON.parse(requestBody);
    //     // console.log(fileStuff);
    //     if(parsedSites['url'].indexOf(newData['url']) < 0) {
    //       console.log('new url, send to loading page');
    //     } else {
    //       console.log('old url already loaded, send to archive');
    //     }
    //     sendResponse(response, 'sent', 201);
    //    });

    // });
  },
  'OPTIONS': function(request, response) {
    utilities.sendResponse(response, 'ok');
  }
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
