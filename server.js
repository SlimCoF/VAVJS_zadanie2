var path = require('path');
const webSocket = require('ws');
const express = require('express');
const crypto = require('crypto');
const fs = require("fs");
var gameLogic = require('./gameLogic.js');

// load CSV containing client information
var file = fs.readFileSync("profiles.csv", "utf8");
fileData = file.split("\r\n");
clientsData = [];
for (let i of fileData){
    tmp = i.split(";");
    if (tmp[0] !== ''){
        clientsData.push({
                "username": tmp[0],
                "password": tmp[1],
                "email": tmp[2],
                "name": tmp[3],
                "score": tmp[4],
                "level": tmp[5]
        });
    }
}

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
        'a': 0,
        'ship': [104, 114, 115, 116],
        'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
        'missiles': [],
        'direction': 1,
        'level': 1,
        'bestLevel': 1,
        'speed': 512,
        'intervals': [],
        'score': 0,
        'bestScore': 0,
        'levelCounter': 1,
    }

    ws.on('open', () => console.log("opened!"));
    ws.on('close', () => {
        // If client turn off the fame remove him from activeClients.
        delete activeClients[ws.session];
        console.log("closed!");

        if(ws.running === true){
            editActiveGames(false, ws);
        }

        // Clear all intervlas
        if(ws.gameValues.intervals.length !== 0){
            for(i in ws.gameValues.intervals){
                clearInterval(ws.gameValues.intervals[i]);
            }
        }

        // If client was spectator remove him from spectaded client spectator list
        if(ws.spectate !== false){
            const index = ws.spectate.spectators.indexOf(ws);
            ws.spectate.spectators.splice(index, 1);
            ws.spectate = false;
        }

        // Announce all client spectators, if any, about closing
        for(i in ws.spectators){
            ws.spectators[i].spectate = false;
            const payLoad = {
                "method": "spectatedClose",
            }
            if(ws.spectators !== undefined){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
        }

        // Write score to CSV
        if(ws.gameValues.bestScore !== 0){
            var data = "";
            var isBigger = false;
            clientsData.forEach(element => {
                if(element.username === ws.username){
                    if(element.score < ws.gameValues.bestScore){
                        element.score = ws.gameValues.bestScore;
                        isBigger = true;
                    }
                    if(element.level < ws.gameValues.bestLevel){
                        element.level = ws.gameValues.bestLevel;
                        isBigger = true;
                    }
                }
                data += element.username + ";" + element.password + ";" + element.email + ";" + element.name + ";" + element.score + ";" + element.level + ";\r\n";
            });
            if(isBigger){
                fs.writeFileSync("profiles.csv", data);
            }
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
                        "ship": ws.gameValues.ship
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
                            "ship": ws.gameValues.ship
                        };
                        payLoad = {
                            "method": "loginAdmin",
                            "content": content
                        };
                    }else{
                        const content = {
                            "session": session,
                            "ship": ws.gameValues.ship
                        };
                        payLoad = {
                            "method": "loginSucess",
                            "content": content
                        };
                    }
                }
            }
            ws.send(JSON.stringify(payLoad));
            if(payLoad.method !== "loginFailed"){
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
                editActiveGames(true, ws);
                updateGameState(ws);
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
                    'a': 0,
                    'ship': [104, 114, 115, 116],
                    'aliens': [1, 3, 5, 7, 9, 23, 25, 27, 29, 31],
                    'missiles': [],
                    'direction': 1,
                    'level': 1,
                    'bestLevel': ws.gameValues.bestLevel,
                    'speed': 512,
                    'intervals': [],
                    'score': 0,
                    'bestScore': ws.gameValues.bestScore,
                    'levelCounter': 1,
                }
                ws.running = false;
                const content = {
                    "ship": ws.gameValues.ship
                }
                payLoad = {
                    "method": "restartSucess",
                    "content": content
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

            editActiveGames(false, ws);

        }

        // User pressed key
        else if(json.method === "keyPress" && (ws.running === true || ws.spectate !== false)){
            const key = json.content.key;
            
            var wsConn = ws;
            if(ws.spectate !== false){
                wsConn = ws.spectate
            }
            gameLogic.controlShip(wsConn, key);
        }

        // User wants to spectate someone or end spectation
        else if(json.method === "spectate" && ws.running !== true){
            var errorMessage = "";
            var content = {};
            if(ws.username === undefined){
                errorMessage = "You are offline!!";
            }else if(ws.spectate === false){
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
        

        // User wants to change ship
        }else if(json.method === "changeShip" && ws.spectate === false && ws.session !== -1){
            const content = {
                "shipNumber": json.content,
                "ship": ws.gameValues.ship
            }
            payLoad = {
                "method": "changeShip",
                "content": content
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            }
        
        // User wants to change background
        }else if(json.method === "changeBackground" && ws.spectate === false && ws.session !== -1){
            const content = {
                "backgroundImg": true,
                "ship": ws.gameValues.ship
            };
            if(json.content){
                content.backgroundImg = false;
            }
            payLoad = {
                "method": "changeBackground",
                "content": content
            }
            ws.send(JSON.stringify(payLoad));
            for(i in ws.spectators){
                ws.spectators[i].send(JSON.stringify(payLoad));
            } 
        }
    });
});

// PAGE LOGIC
// Adding user to file and to clientsData
function addUser(json){
    // Create hash from users password
    json.password = crypto.createHash('md5').update(json.password ).digest('hex');

    // Add user to clientsData
    clientsData.push({
        // "session": session,
        "username": json.username,
        "password": json.password,
        "email": json.email,
        "name": json.name,
        "score": "0",
        "level": "1"
    });

    // Add user to CSV table
    const row = json.username + ";" + json.password + ";" + json.email + ";" + json.name + ";0;0;\r\n";
    fs.appendFileSync("profiles.csv", row, (err) => {
        if (err)
            console.log(err);
    });
}

// Checking conditions of registration parameters
function notFilled(json){
    var errorString = "";
    for(i in json){
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

// Edit active game tables
function editActiveGames(add, ws){
    const payload = {};
    if(add){
        activeGames.push(ws.session);
        payLoad = {
            "method": "updateActives",
            "content": activeGames
        }
    }else{
        const index = activeGames.indexOf(ws.session);
        activeGames.splice(index, 1);
        payLoad = {
            "method": "updateActives",
            "content": activeGames
        }
    }
    for(i in activeClients){
        activeClients[i].send(JSON.stringify(payLoad));
    }
}

// Next level
function nextLevel(ws) {
    ws.gameValues.level++;
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
    if(ws.gameValues.levelCounter > ws.gameValues.bestLevel){
        ws.gameValues.bestLevel = ws.gameValues.levelCounter;
    }
    updateGameState(ws);
}

// GAME LOOP
function updateGameState(ws){
    ws.running = true;
    var loop1 = setInterval(function () {
        gameLogic.moveAliens(ws);
        gameLogic.moveMissiles(ws);
        gameLogic.checkCollisionsMA(ws);
        if (ws.gameValues.a % 4 == 3) gameLogic.lowerAliens(ws);
        if (gameLogic.RaketaKolidujeSVotrelcom(ws)) {
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
            ws.gameValues.a = 0;
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
            editActiveGames(false, ws);

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
        ws.gameValues.a++;
    }, ws.gameValues.speed);
    ws.gameValues.intervals.push(loop1);

    var loop2 = setInterval(function () {
        content = {
            "aliens": ws.gameValues.aliens,
            "missiles": ws.gameValues.missiles,
            "ship": ws.gameValues.ship,
            "score": ws.gameValues.score,
            "bestScore": ws.gameValues.bestScore,
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