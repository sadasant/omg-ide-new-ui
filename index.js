var connect = require('connect');
var path = __dirname+'/';
var port = process.env.PORT || 8080;
connect.createServer(
    connect.static(path)
).listen(port);
console.log("Serving "+path+" at: localhost:"+port);
