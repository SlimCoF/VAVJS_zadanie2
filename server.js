var path = require('path');
// const http = require('http');
const webSocket = require('ws');
const express = require('express');
const crypto = require('crypto');
const fs = require("fs");

// load CSV containing client information
var file = fs.readFileSync("profiles.csv", "utf8");
fileData = file.split("\r\n");
clientsData = [];
for (let i of fileData){
    tmp = i.split(";");
    if (tmp[0] !== ''){
        clientsData.push({
                // "session": tmp[0],
                "username": tmp[0],
                "password": tmp[1],
                "email": tmp[2],
                "name": tmp[3]
        });
    }
}
// console.log(clientsData);
// all active clients {session: connection}
activeClients = {};

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
var counter = 0;

const wsServer = new webSocket.Server({ port: 8082 });
wsServer.on('connection', (ws) => {
    ws.on('open', () => console.log("opened!"));
    ws.on('close', (e) => {
        // If client turn off the fame remove him from activeClients.
        delete activeClients[ws.session];
        console.log("closed!");
    });
    ws.on('message', (msg) => {
        let json = JSON.parse(msg);
        let payLoad = {};

        // User want to register
        if (json.method === "register"){
            if(activeClients[ws.session] !== undefined){
                payLoad = {
                    "method": "registrationFailed",
                    "content": "You are already online!!"
                }
            }else{
                const errorMessage = registerConditions(json.content);
                if(errorMessage !== ""){
                    payLoad = {
                        "method": "registrationFailed",
                        "content": errorMessage
                    }
                }else{

                    // Write data to CSV file and clientsData
                    addUser(json.content);
                    // Get unique session code 
                    const session = getSession();

                    // Add user to activeClients
                    activeClients[session] = ws;
                    ws.session = session;
                    ws.username = json.content.username;

                    const content = {
                        "session": session,
                    };
                    payLoad = {
                        "method": "registrationSucess",
                        "content": content
                    };
                }
            }
            ws.send(JSON.stringify(payLoad));  
        
        // User wants to log in
        } else if (json.method === "login"){
            if(activeClients[ws.session] !== undefined){
                payLoad = {
                    "method": "registrationFailed",
                    "content": "You are already online!!"
                }  
            }else{
                
                const errorMessage = loginConditions(json.content);

                if(errorMessage !== ""){
                    payLoad = {
                        "method": "loginFailed",
                        "content": errorMessage
                    }
                }else{

                    // Get unique session code 
                    const session = getSession();

                     // Add user to activeClients
                    activeClients[session] = ws;
                    ws.session = session;
                    ws.username = json.content.username;

                    const content = {
                        "session": session,
                    };
                    payLoad = {
                        "method": "registrationSucess",
                        "content": content
                    };
                }
            }
            ws.send(JSON.stringify(payLoad))
        }
    });
});

// Adding user to file and to clientsData
function addUser(json){
    // Create hash from users password
    json.password = crypto.createHash('md5').update(json.password ).digest('hex');

    // const session = clientsData.length;
    // Add user to clientsData
    clientsData.push({
        // "session": session,
        "username": json.username,
        "password": json.password,
        "email": json.email,
        "name": json.name
    });
    // console.log(clientsData.length);

    // Add user to CSV table
    const row = json.username + ";" + json.password + ";" + json.email + ";" + json.name + ";\r\n";
    fs.appendFileSync("profiles.csv", row, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("profiles.csv", "utf8"));
        }
    });
    // return sessionn;
}


// Checking conditions of register parameters
function notFilled(json){
    var errorString = "";
    for(i in json){
        // if(json[i] == "" && i !== "session"){
        if(json[i] == ""){
            errorString += "- " +i + " field is not filled!\n"
        }
    }
    return errorString;
}
function registerConditions(json){
    var errorString = notFilled(json);
    if(errorString === ""){
        // If email/username is not duplicate
        var tmp = 1;
        for(i in clientsData){
            if((tmp === 1 || tmp === 2) && clientsData[i].email === json.email){
                errorString += "email (" + json.email +") is already registered!\n";
                tmp += 2;
            }
            if((tmp === 1 || tmp === 3) && clientsData[i].username === json.username){
                errorString += "username (" + json.username +") is already registered!\n";
                tmp += 1;
            }
            if(tmp == 4){
                break;
            }
        }
        // correct e-mail format
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(json.email))){
            console.log(json.email);
            errorString += "email (" + json.email +") have a bad format! Good format example: r.batzbak@email.com \n";
        }
        // correct username format
        if (!(/^[a-zA-Z]+$/.test(json.username))){
            errorString += "username (" + json.username +") have a bad format! Good format example: Riso\n";
        }
        // correct full name format
        if(!(/^([A-Z][a-z]+)\s([A-Z][a-z]+)$/.test(json.name))){
            errorString += "Full name (" + json.name +") have a bad format! Good format example: Richard Batzbak\n";
        }
    }
    return errorString;
}

// Checking conditions of login parameters
function loginConditions(json){
    var errorString = notFilled(json);
    if(errorString === ""){
        json.password = crypto.createHash('md5').update(json.password ).digest('hex');
        errorString = "User (" + json.username + ") doesn't exist!";
        for(i in clientsData){
            if(json.username === clientsData[i].username){
                errorString = "";
                if(json.password !== clientsData[i].password){
                    errorString = "Bad password for user (" + json.username + ")!";
                }
                break;
            }
        }
    }
    if(errorString === ""){
        for(i in activeClients){
            if(json.username === activeClients[i].username){
                errorString = "User (" + json.username + ") is already logged in!";
                break;
            }
        }
    }
    return errorString;
}

// Get unique session code for active user
function getSession(){
    if(Object.keys(activeClients).length == 0){
        return 0;
    }
    let counter = 0;
    for(i in activeClients){
        if(parseInt(i) === counter){
            counter++;
        }
    }
    return counter;
}