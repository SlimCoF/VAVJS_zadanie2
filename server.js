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
activeGames = [];

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
    ws.gameValues = {
        'ship': [104, 114, 115, 116],
        'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
        'missiles': [],
        'direction': 1,
        'level': 1,
        'speed': 512,
        'intervals': [],
        'score': 0,
        'actualBest': 0,
        'levelCounter': 1,
    }

    ws.on('open', () => console.log("opened!"));
    ws.on('close', (e) => {
        // If client turn off the fame remove him from activeClients.
        delete activeClients[ws.session];
        console.log("closed!");

        if(ws.running === true){
            
            // CAN BE IN FUNCTION
            const index = activeGames.indexOf(ws.session);
            activeGames.splice(index, 1);
            payLoad = {
                "method": "updateActives",
                "content": activeGames
            }
            for(i in activeClients){
                activeClients[i].send(JSON.stringify(payLoad));
            }
        }

        // Clear all intervlas
        if(ws.gameValues.intervals.length !== 0){
            for(i in ws.gameValues.intervals){
                clearInterval(ws.gameValues.intervals[i]);
            }
        }

        // If client was spectator remove him from another clients spectator list
        if(ws.spectate !== false){
            const index = ws.spectate.spectators.indexOf(ws);
            ws.spectate.spectators.splice(index, 1);
            ws.spectate = false;
        }

        // TODO: Announce all client spectators, if any, about closing
        for(i in ws.spectators){
            const content = {};
            ws.spectators[i].spectate = false;
            if(isActive(ws.spectators[i])){
                content["status"] = "online";  
            }else{
                content["status"] = "offline";
            }
            const payLoad = {
                "method": "spectatedClose",
                "content": content
            }
            ws.spectators[i].send(JSON.stringify(payLoad));
        }
    });
    ws.on('message', (msg) => {
        let json = JSON.parse(msg);
        let payLoad = {};

        // User want to sign up
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
                    "method": "loginFailed",
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
                            "users": clientsData,
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
            ws.send(JSON.stringify(payLoad));
            if(errorMessage !== ""){
                payLoad = {
                    "method": "updateActives",
                    "content": activeGames
                }
                ws.send(JSON.stringify(payLoad));
            }
        }

        // User wants to start the game
        else if(json.method === "start" && ws.running === false && ws.spectate === false){
            if(!isActive(json.content)){
                payLoad = {
                    "method": "startFail",
                    "content": "You are not logged in!!"
                }
                ws.send(JSON.stringify(payLoad));
            }else{
                activeGames.push(ws.session);
                payLoad = {
                    "method": "updateActives",
                    "content": activeGames
                }

                updateGameState(ws);
                for(i in activeClients){
                    activeClients[i].send(JSON.stringify(payLoad));
                }
            }
        }

        // User wants to restart the game
        else if(json.method === "restart" && ws.spectate === false){
            if(ws.running == true){
                for(i in ws.gameValues.intervals){
                    clearInterval(ws.gameValues.intervals[i]);
                }

                // Set gameValues to initial
                ws.gameValues =  {
                    'ship': [104, 114, 115, 116],
                    'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
                    'missiles': [],
                    'direction': 1,
                    'level': 1,
                    'speed': 512,
                    'intervals': [],
                    'score': 0,
                    'actualBest': ws.gameValues.actualBest,
                    'levelCounter': 1,
                }
                ws.running = false;
                payLoad = {
                    "method": "restartSucess",
                }
            }else{
                payLoad = {
                    "method": "restartFail",
                    "content": "You are not in the game!!"
                }
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }

            // CAN BE IN FUNCTION
            const index = activeGames.indexOf(ws.session);
            activeGames.splice(index, 1);
            payLoad = {
                "method": "updateActives",
                "content": activeGames
            }
            for(i in activeClients){
                activeClients[i].send(JSON.stringify(payLoad));
            }
        }

        // User pressed key
        else if(json.method === "keyPress" && (ws.running === true || ws.spectate !== false)){
            const key = json.content.key;
            
            var wsConn = ws;
            if(ws.spectate !== false){
                wsConn = ws.spectate
            }
            controllShp(wsConn, key)
        }

        // User wants to spectate someone or end spectation
        else if(json.method === "spectate" && ws.running !== true){
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
                if(errorMessage === ""){
                    ws.spectate = spectatedClient;
                    content["status"] = "online";
                }
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
    const row = json.username + ";" + json.password + ";" + json.email + ";" + json.name + "0;0;\r\n";
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

        // password === secondPassword ?
        if(json.password !== json.secondPassword){
            errorString += "passwords do not match!!\n";
        }
        // correct e-mail format
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(json.email))){
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
function controllShp(wsConn, key){
    if([37, 71, 39, 74].includes(key)){
        // Move ship left (<-, G)
        if([37, 71].includes(key) && wsConn.gameValues.ship[0] > 100){
            for (i = 0; i < wsConn.gameValues.ship.length; i++) {
                wsConn.gameValues.ship[i]--;
            }
        }
        // Move ship right (->, J)
        else if([39, 74].includes(key) && wsConn.gameValues.ship[0] < 108){
            for (i = 0; i < wsConn.gameValues.ship.length; i++) {
                wsConn.gameValues.ship[i]++;
            }
        }
    }else if(key === 32){
        wsConn.gameValues.missiles.push(wsConn.gameValues.ship[0] - 11);
    }
}
function nextLevel(ws) {
    ws.gameValues.level++;
    console.log('level: ' + ws.gameValues.level);
    if (ws.gameValues.level == 1) ws.gameValues.aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
    if (ws.gameValues.level == 2) ws.gameValues.aliens = [1, 3, 5, 7, 9, 13, 15, 17, 19, 23, 25, 27, 29, 31];
    if (ws.gameValues.level == 3) ws.gameValues.aliens = [1, 5, 9, 23, 27, 31];
    if (ws.gameValues.level == 4) ws.gameValues.aliens = [45, 53];
    if (ws.gameValues.level > 4) {
        ws.gameValues.level = 1;
        ws.gameValues.aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
        ws.gameValues.speed = ws.gameValues.speed / 2;
    }
    ws.gameValues.levelCounter++;
    updateGameState(ws);
}

function RaketaKolidujeSVotrelcom(ws) {
    for (var i = 0; i < ws.gameValues.aliens.length; i++) {
        if (ws.gameValues.aliens[i] > 98) {
            return true;
        }
    }
    return false;
}

function checkCollisionsMA(ws) {
    for (var i = 0; i < ws.gameValues.missiles.length; i++) {
        if (ws.gameValues.aliens.includes(ws.gameValues.missiles[i])) {
            var alienIndex = ws.gameValues.aliens.indexOf(ws.gameValues.missiles[i]);
            ws.gameValues.aliens.splice(alienIndex, 1);
            ws.gameValues.missiles.splice(i, 1);
            ws.gameValues.score += 10;
            if(ws.gameValues.score > ws.gameValues.actualBest){
                ws.gameValues.actualBest = ws.gameValues.score;
            }
        }
    }
}

function moveMissiles(ws) {
    var i = 0;
    for (i = 0; i < ws.gameValues.missiles.length; i++) {
        ws.gameValues.missiles[i] -= 11;
        if (ws.gameValues.missiles[i] < 0) ws.gameValues.missiles.splice(i, 1);
    }
}

function moveAliens(ws) {
    var i = 0;
    for (i = 0; i < ws.gameValues.aliens.length; i++) {
        ws.gameValues.aliens[i] = ws.gameValues.aliens[i] + ws.gameValues.direction;
    }
    return ws.gameValues.direction *= -1;
}
function lowerAliens(ws) {
    var i = 0;
    for (i = 0; i < ws.gameValues.aliens.length; i++) {
        ws.gameValues.aliens[i] += 11;
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
            clearInterval(loop1);
            clearInterval(loop2);
            for(i in ws.gameValues.intervals){
                clearInterval(ws.gameValues.intervals[i]);
            }
            content = {
                "score": ws.gameValues.score,
                "level": ws.gameValues.levelCounter
            }
            ws.running = false;
            ws.gameValues.missiles = [];
            ws.gameValues.aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
            ws.gameValues.ship = [104, 114, 115, 116];
            ws.gameValues.direction = 1;
            ws.gameValues.level = 1;
            ws.gameValues.speed = 512;
            ws.gameValues.score = 0;
            ws.gameValues.levelCounter = 0;
            payLoad = {
                "method": "looseScreen",
                "content": content
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
            // CAN BE IN FUNCTION
            const index = activeGames.indexOf(ws.session);
            activeGames.splice(index, 1);
            payLoad = {
                "method": "updateActives",
                "content": activeGames
            }
            for(i in activeClients){
                activeClients[i].send(JSON.stringify(payLoad));
            }

        }
        if (ws.gameValues.aliens.length === 0){
            ws.running = false;
            clearInterval(loop1);
            clearInterval(loop2);
            for(i in ws.gameValues.intervals){
                clearInterval(ws.gameValues.intervals[i]);
            }
            ws.gameValues.missiles = [];
            ws.gameValues.ship = [104, 114, 115, 116];
            ws.gameValues.direction = 1;
            content = {
                "score": ws.gameValues.score,
                "level": ws.gameValues.levelCounter
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
    }, ws.gameValues.speed);
    ws.gameValues.intervals.push(loop1);

    var loop2 = setInterval(function () {
        content = {
            "aliens": ws.gameValues.aliens,
            "missiles": ws.gameValues.missiles,
            "ship": ws.gameValues.ship,
            "score": ws.gameValues.score,
            "actualBest": ws.gameValues.actualBest,
            "level": ws.gameValues.levelCounter
        }
        payLoad = {
            "method": "updateScene",
            "content": content
        }
        ws.send(JSON.stringify(payLoad));
        for(i in ws.spectators){
            ws.spectators[i].send(JSON.stringify(payLoad));
        }
    }, 41);
    ws.gameValues.intervals.push(loop2);

    return [loop1,loop2];
}