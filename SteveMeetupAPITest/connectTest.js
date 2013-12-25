var express = require("express");
var http = require("http");
var app = express();

app.use(express.logger());
// Fun fact: connect.logger() returns a function.

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);
