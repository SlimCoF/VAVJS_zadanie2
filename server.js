var path = require('path');
const http = require('http');
const webSocket = require('ws');
const express = require('express');
const { type } = require('os');

var file = require("fs").readFileSync("profiles.csv", "utf8");
file_data = file.split("\r\n");
arr_data = [];
for (let i of file_data){
    tmp = i.split(";");
    arr_data.push({
        "e-mail": tmp[0],
        "login": tmp[1],
        "password": tmp[2],
        "pin": tmp[3],
        "name": tmp[4]
    });
}
console.log(arr_data);


httpPort = 8080;
const app = express();
var htmlPath = path.join(__dirname, 'client-side');

app.use(express.static(htmlPath));

var server = app.listen(httpPort, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});
// app.get('/', (req, res) => res.sendFile(__dirname + '/client-side/index.html'));
// app.get('/', (req, res) => res.sendFile(__dirname + '/client-side/client.js'));
// app.listen(httpPort, () => console.log('Express listening on port ' + httpPort));

// const httpServer = http.createServer();
// httpServer.listen(httpPort, () => console.log('listening on port ' + httpPort));

wsPort = 8082
const wsServer = new webSocket.Server({ port: wsPort });
wsServer.on('request', request => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed"));
    connection.on("message", message => {
        // recived message from the client

    });

    
})



