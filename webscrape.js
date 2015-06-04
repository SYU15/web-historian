var request = require('request');
var path = require('path');
// var archive = require('/helpers/archive-helpers');
var fs = require('fs');

request('http://www.google.com', function(error, response, html){
  var newPath = '/Users/HR10/Desktop/2015-05-web-historian/archives/sites' + '/www.google.com'
  if(!error && response.statusCode === 200) {
    fs.open(newPath, 'w', function(err, fd){
      fs.writeFile(newPath, html, function(err){
        if(err){
          console.log('not working');
        }
      });
    });
  }
    // console.log(html);
});
