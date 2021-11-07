var path = require('path');
// const http = require('http');
const webSocket = require('ws');
const express = require('express');
const crypto = require('crypto');
const fs = require("fs");
var gameLogic = require('./gameLogic.js');
const { stringify } = require('querystring');
const { WSAEAFNOSUPPORT } = require('constants');

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

// all values necessary for game
gameValues = {};



httpPort = 8080;
const app = express();
var htmlPath = path.join(__dirname, 'client-side');

app.use(express.static(htmlPath));

var server = app.listen(httpPort, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});

const wsServer = new webSocket.Server({ port: 8082 });
wsServer.on('connection', (ws) => {
    ws.running = false;
    ws.spectate = false;
    ws.spectators = [];
    ws.session = -1;

    gameValues[ws] =  {
        'ship': [104, 114, 115, 116],
        'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
        'missiles': [],
        'direction': 1,
        'level': 1,
        'speed': 512,
        'intervals': [],
        'score': 0,
        'levelCounter': 1,
    }

    ws.on('open', () => console.log("opened!"));
    ws.on('close', (e) => {
        // If client turn off the fame remove him from activeClients.
        delete activeClients[ws.session];
        console.log("closed!");
        if(gameValues[ws].intervals.length !== 0 ){
            for(i in gameValues[ws].intervals){
                clearInterval(gameValues[ws].intervals[i]);
            }
        }
        if(ws.spectate !== false){
            const index = ws.spectate.spectators.indexOf(ws);
            ws.spectate.spectators.splice(index, 1);
            ws.spectate = false;
        }
    });
    ws.on('message', (msg) => {
        let json = JSON.parse(msg);
        let payLoad = {};

        // User want to register
        if (json.method === "register" && ws.spectate === false){
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
        } else if (json.method === "login" && ws.spectate === false){
            if(activeClients[ws.session] !== undefined){
                payLoad = {
                    "method": "registrationFailed",
                    "content": "You are already online!!"
                }  
            }else{
                var admin = false;
                if(json.content.username === "admin" && json.content.username === "admin"){
                    admin = true;   
                }
                
                const  errorMessage = loginConditions(json.content, admin);

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
                    
                    if(admin){
                        const content = {
                            "session": session,
                            "users": clientsData
                        };
                        payLoad = {
                            "method": "loginAdmin",
                            "content": content
                        };
                    }else{
                        const content = {
                            "session": session,
                        };
                        payLoad = {
                            "method": "loginSucess",
                            "content": content
                        };
                    }
                }
            }
            ws.send(JSON.stringify(payLoad))
        }

        // User wants to start the game
        else if(json.method === "start" && ws.spectate === false){
            if(!isActive(json.content)){
                payLoad = {
                    "method": "startFail",
                    "content": "You are not logged in!!"
                }
            }else{
                const content = {
                    "ship": gameValues[ws].ship
                }
                payLoad = {
                    "method": "startSucess",
                    "content": content
                }
                updateGameState(ws);
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
        }

        // User pressed key
        else if(json.method === "keyPress" && ws.running == true && ws.spectate == false){
            const key = json.content.key;
            if([37, 71, 39, 74].includes(key)){
                // Move ship left (<-, G)
                if([37, 71].includes(key) && gameValues[ws].ship[0] > 100){
                    for (i = 0; i < gameValues[ws].ship.length; i++) {
                        gameValues[ws].ship[i]--;
                    }
                }
                // Move ship right (->, J)
                else if([39, 74].includes(key) && gameValues[ws].ship[0] < 108){
                    for (i = 0; i < gameValues[ws].ship.length; i++) {
                        gameValues[ws].ship[i]++;
                    }
                }
                content = {
                    "ship": gameValues[ws].ship,
                }
                payLoad = {
                    "method": "shipMove",
                    "content": content
                }
            }else if(key === 32){
                gameValues[ws].missiles.push(gameValues[ws].ship[0] - 11);
            }
        }

        // User wants to spectate someone or end spectation
        else if(json.method === "spectate"){
            var errorMessage = "";
            var content = {};
            if(ws.spectate === false){
                errorMessage = "Session (" + json.content.session + ") doesn't exist";
                for(i in activeClients){
                    if(json.content.session == activeClients[i].session){
                        activeClients[i].spectators.push(ws);
                        spectatedClient = activeClients[i];
                        errorMessage = "";
                        break;
                    }
                }
                ws.spectate = spectatedClient;
                content["status"] = "online";
            }else{
                const index = ws.spectate.spectators.indexOf(ws);
                ws.spectate.spectators.splice(index, 1);
                ws.spectate = false;
                content["status"] = "spectate";
            }

            if(errorMessage !== ""){
                content = {
                    "error": errorMessage
                }
                payLoad = {
                    "method": "spectateFail",
                    "content": content
                }
            }else{
                payLoad = {
                    "method": "spectateSucess",
                    "content": content
                }
            }
            ws.send(JSON.stringify(payLoad));
        } 

        // User wants to restart the game
        else if(json.method === "restart"){
            if(ws.running == true){
                for(i in gameValues[ws].intervals){
                    clearInterval(gameValues[ws].intervals[i]);
                }
                gameValues[ws] =  {
                    'ship': [104, 114, 115, 116],
                    'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
                    'missiles': [],
                    'direction': 1,
                    'level': 1,
                    'speed': 512,
                    'intervals': [],
                    'score': 0,
                    'levelCounter': 1,
                }
                ws.running = false;
                payLoad = {
                    "method": "restartSucess",
                }
            }else{
                payLoad = {
                    "method": "restartFail",
                    "content": "User is not in the game!!"
                }
            }
            ws.send(JSON.stringify(payLoad));
        }
    });
});









// PAGE LOGIC
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
    if(json.username === "admin"){
        return "username cant be \"admin\"!"
    }
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
function loginConditions(json, admin){
    var errorString = notFilled(json);
    if(errorString === "" && !admin){
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

// Check if user is online (in activeClients)
function isActive(json){
    for(i in activeClients){
        if(json.session === activeClients[i].session){
            return true;
        }
    }
    return false;
}









// GAME LOGIC

function nextLevel(ws) {
    gameValues[ws].level++;
    console.log('level: ' + gameValues[ws].level);
    if (gameValues[ws].level == 1) gameValues[ws].aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
    if (gameValues[ws].level == 2) gameValues[ws].aliens = [1, 3, 5, 7, 9, 13, 15, 17, 19, 23, 25, 27, 29, 31];
    if (gameValues[ws].level == 3) gameValues[ws].aliens = [1, 5, 9, 23, 27, 31];
    if (gameValues[ws].level == 4) gameValues[ws].aliens = [45, 53];
    if (gameValues[ws].level > 4) {
        gameValues[ws].level = 1;
        gameValues[ws].aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
        gameValues[ws].speed = gameValues[ws].speed / 2;
    }
    gameValues[ws].levelCounter++;
    updateGameState(ws);
}

function RaketaKolidujeSVotrelcom(ws) {
    for (var i = 0; i < gameValues[ws].aliens.length; i++) {
        if (gameValues[ws].aliens[i] > 98) {
            return true;
        }
    }
    return false;
}

function checkCollisionsMA(ws) {
    for (var i = 0; i < gameValues[ws].missiles.length; i++) {
        if (gameValues[ws].aliens.includes(gameValues[ws].missiles[i])) {
            var alienIndex = gameValues[ws].aliens.indexOf(gameValues[ws].missiles[i]);
            gameValues[ws].aliens.splice(alienIndex, 1);
            gameValues[ws].missiles.splice(i, 1);
            gameValues[ws].score += 10;
        }
    }
}

function moveMissiles(ws) {
    var i = 0;
    for (i = 0; i < gameValues[ws].missiles.length; i++) {
        gameValues[ws].missiles[i] -= 11;
        if (gameValues[ws].missiles[i] < 0) gameValues[ws].missiles.splice(i, 1);
    }
}

function moveAliens(ws) {
    var i = 0;
    for (i = 0; i < gameValues[ws].aliens.length; i++) {
        gameValues[ws].aliens[i] = gameValues[ws].aliens[i] + gameValues[ws].direction;
    }
    return gameValues[ws].direction *= -1;
}
function lowerAliens(ws) {
    var i = 0;
    for (i = 0; i < gameValues[ws].aliens.length; i++) {
        gameValues[ws].aliens[i] += 11;
    }
}

// Game loop
var a = 0;

function updateGameState(ws){
    ws.running = true;
    var loop1 = setInterval(function () {
        moveAliens(ws);
        moveMissiles(ws);
        checkCollisionsMA(ws);
        if (a % 4 == 3) lowerAliens(ws);
        if (RaketaKolidujeSVotrelcom(ws)) {
            for(i in gameValues[ws].intervals){
                clearInterval(gameValues[ws].intervals[i]);
            }
            content = {
                "score": gameValues[ws].score,
                "level": gameValues[ws].levelCounter
            }
            ws.running = false;
            gameValues[ws].missiles = [];
            gameValues[ws].aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
            gameValues[ws].ship = [104, 114, 115, 116];
            gameValues[ws].direction = 1;
            gameValues[ws].level = 1;
            gameValues[ws].speed = 512;
            gameValues[ws].score = 0;
            gameValues[ws].levelCounter = 0;
            payLoad = {
                "method": "looseScreen",
                "content": content
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
        }
        if (gameValues[ws].aliens.length === 0){
            ws.running = false;
            clearInterval(loop1);
            clearInterval(loop2);
            gameValues[ws].missiles = [];
            gameValues[ws].ship = [104, 114, 115, 116];
            gameValues[ws].direction = 1;
            content = {
                "score": gameValues[ws].score,
                "level": gameValues[ws].levelCounter
            }
            payLoad = {
                "method": "winScreen",
                "content": content
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
            setTimeout(function () {
                nextLevel(ws);
            }, 1000);
        }
        a++;
    }, gameValues[ws].speed);
    gameValues[ws].intervals.push(loop1);

    var loop2 = setInterval(function () {
        content = {
            "aliens": gameValues[ws].aliens,
            "missiles": gameValues[ws].missiles,
            "ship": gameValues[ws].ship,
            "score": gameValues[ws].score,
            "level": gameValues[ws].levelCounter
        }
        payLoad = {
            "method": "updateScene",
            "content": content
        }
        ws.send(JSON.stringify(payLoad));
        for(i in ws.spectators){
            ws.spectators[i].send(JSON.stringify(payLoad));
        }
    }, 100);
    gameValues[ws].intervals.push(loop2);

    return [loop1,loop2];
}