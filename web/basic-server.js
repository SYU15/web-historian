var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var fs = require("fs");
var url = require("url");
var path = require("path");
var static = require("node-static");

var file = new static.Server("./web/public");

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(function(request, response) {
  handler.requestHandler(request, response);
});

// http.createServer(function(request, response) {

//   var uri = url.parse(request.url).pathname
//     , filename = path.join(process.cwd(), uri);

//   path.exists(filename, function(exists) {
//     if(!exists) {
//       response.writeHead(404, {"Content-Type": "text/plain"});
//       response.write("404 Not Found\n");
//       response.end();
//       return;
//     }

//     if (fs.statSync(filename).isDirectory()) filename += 'public/index.html';

//     fs.readFile(filename, "binary", function(err, file) {
//       if(err) {
//         response.writeHead(500, {"Content-Type": "text/plain"});
//         response.write(err + "\n");
//         response.end();
//         return;
//       }

//       response.writeHead(200);
//       response.write(file, "binary");
//       response.end();
//     });
//   });
// }).listen(port, ip)

// console.log("Static file server running at\n  => http://localhost:" + port);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
