function createElementsFromJSON(json, parent) {
    for (var i in json) {
        var object = json[i];

        content = object.innerHTML;
        delete object.innerHTML;

        var obj = document.createElement(object.element);

        for (var tag in object)
            if (tag != "children" && tag != "element")
                obj.setAttribute(tag, object[tag]);
    
        
        if (typeof content !== 'undefined')
            obj.innerHTML = content;
        
        parent.appendChild(obj);
        if (typeof (object.children) == "object")
            createElementsFromJSON(object.children, obj);
    }
}
const backgroundStyle = "background-color: #a041d4; padding: 10px; margin-top: 10px; box-shadow: 1px 1px 1px black, 0 0 7px magenta, 0 0 5px darkblue;";
const inputStyle = "border: none;border-bottom: 2px solid #5b1c7d; border-left: 2px solid #5b1c7d; background-color:  #ac59d9; margin-left: 5px;"
const page =
[
    {
        "element": "style",
        "innerHTML": "\
            .button {\
                background-color: #c182e3;\
                border: 2px solid #5b1c7d;\
                border-radius: 12px;\
                color: #5b1c7d;\
                font-weight: bold;\
                padding: 7px 14px;\
                font-size: 13px;\
                margin-left: 5px;\
                transition-duration: 0.4s;\
            }\
            .buttonMusic{\
                background-color: #c182e3;\
                border: 2px solid #5b1c7d;\
                border-radius: 12px;\
                color: red;\
                font-weight: bold;\
                padding: 7px 14px;\
                font-size: 13px;\
                margin-left: 5px;\
                transition-duration: 0.4s;\
            }\
            .button:hover {\
                background-color: #5b1c7d;\
                color: #c182e3;\
            }\
            .buttonMusic:hover{\
                background-color: #5b1c7d;\
            }\
            ::placeholder {\
                color: #5b1c7d;\
                opacity: 1;\
            }\
            .shipImg{\
                transition-duration: 0.4s;\
                width: 100px; \
                height: 100px; \
                opacity: 0.6; \
            }\
            .shipImg:hover {\
                width: 110px;\
                height: 110px;\
                opacity: 1; \
            }\
            .bckImg{\
                transition-duration: 0.4s;\
                width: 80px; \
                height: 80px; \
                opacity: 0.6; \
            }\
            .bckImg:hover {\
                width: 88px;\
                height: 88px;\
                opacity: 1; \
            }\
            \
            "
    },
    {
        "element": "div",
        "style": "float: left;",
        "children": 
        [
            {
                "element": "div",
                "style": backgroundStyle,
                "children":
                [
                    {
                        "element": "div",
                        "children": 
                        [
                            {
                                "element": "input",
                                "id": "usernameInput",
                                "style": inputStyle,
                                "placeholder": "username"
                            },
                            {
                                "element": "input",
                                "id": "passwordInput",
                                "style": inputStyle,
                                "placeholder": "password"
                            },
                            {
                                "element": "button",
                                "id": "loginButton",
                                "class": "button",
                                "innerHTML": "log In",
                            },
                        ]
                    },
                    {
                        "element": "div",
                        "style": "margin-top: 10px;",
                        "children":
                        [
                            {
                                "element": "input",
                                "id": "secondPassword",
                                "style": inputStyle,
                                "placeholder": "password again"
                            },
                            {
                                "element": "input",
                                "id": "emailInput",
                                "style": inputStyle,
                                "placeholder": "e-mail"
                            },
                            {
                                "element": "input",
                                "id": "fullNameInput",
                                "style": inputStyle,
                                "placeholder": "Name Surname"
                            },
                            {
                                "element": "button",
                                "id": "registerButton",
                                "class": "button",
                                "innerHTML": "sign up",
                            },
                        ]
                    },

                ]
            },
            {
                "element": "div",
                "id": "canvasDiv",
                "style": "text-align: center; " + backgroundStyle,
                "children":
                [
                    {
                        "element": "canvas",
                        "id": "gameCanvas",
                        "width": "528",
                        "height": "528",
                        "style": "background-color: black;" 
                    }
                ]
            },
            {
                "element": "div",
                "style": backgroundStyle + "height: 80px;",
                "children":
                [
                    {
                        "element": "div",
                        "style": "float: left",
                        "children":
                        [
                            {
                                "element": "div",
                                "children":
                                [
                                    {
                                        "element": "button",
                                        "id": "startButton",
                                        "class": "button",
                                        "innerHTML": "start"
                                    },
                                    {
                                        "element": "button",
                                        "id": "restartButton",
                                        "class": "button",
                                        "innerHTML": "rastart"
                                    },
                                    {
                                        "element": "button",
                                        "id": "musicButton",
                                        "class": "buttonMusic",
                                        "innerHTML": "music: off"
                                    },
                                ]
                            },
                            {
                                "element": "div",
                                "style": "margin-top: 10px;",
                                "children":
                                [
                                    {
                                        "element": "input",
                                        "id": "spectateInput",
                                        "style": inputStyle,
                                        "placeholder": "session"
                                    },
                                    {
                                        "element": "button",
                                        "id": "spectateButton",
                                        "class": "button",
                                        "innerHTML": "spectate"
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "element": "div",
                        "style": "margin-left: 30px; float: left;",
                        "children":
                        [
                            {
                                "element": "p",
                                "innerHTML": "Status: ",
                                "children": 
                                [
                                    {
                                        "element": "span",
                                        "id": "statusSpan",
                                        "innerHTML": "offline",
                                        "style": "color: red;"
                                    }
                                ]
                            },
                            {
                                "element": "p",
                                "innerHTML": "session: ",
                                "children": 
                                [
                                    {
                                        "element": "span",
                                        "id": "sessionSpan",
                                        "innerHTML": "-",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "element": "div",
                        "id": "bckImg",
                        "style": "margin-left:50px; float: left; width: 110px",
                        "children": 
                        [
                            {
                                "element": "img",
                                "class": "bckImg",
                                "src": "https://cdn-icons-png.flaticon.com/512/2909/2909506.png",
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        "element": "div",
        "style": "width: 450px; height: 234px; text-align:center; float : left; margin-left: 10px;" + backgroundStyle,
        "children":
        // copyright: https://www.webnots.com/download-free-keyboard-key-images-in-black/
        [
            {
                "element": "h3",
                "innerHTML": "Movement",
                "style": "margin: 5px; font-family: Fantasy;"
            },
            {
                "element": "img",
                "id": "leftKey",
                "src": "https://img.webnots.com/2014/03/Left-Arrow1.png",
                "style": "width: 100px; height: 100px; opacity: 0.7;"
            },
            {
                "element": "img",
                "id": "rightKey",
                "src": "https://img.webnots.com/2014/03/Right-Arrow1.png",
                "style": "width: 100px; height: 100px; opacity: 0.7"
            },
            {
                "element": "img",
                "id": "GKey",
                "src": "https://img.webnots.com/2014/03/G1.png",
                "style": "width: 100px; height: 100px; margin-left: 50px; opacity: 0.7"
            },
            {
                "element": "img",
                "id": "JKey",
                "src": "https://img.webnots.com/2014/03/J1.png",
                "style": "width: 100px; height: 100px; opacity: 0.7"
            },
            {
                "element": "h3",
                "innerHTML": "Shoot",
                "style": "margin: 5px; font-family: Fantasy;"
            },
            {
                "element": "img",
                "id": "spaceKey",
                "src": "https://img.webnots.com/2014/03/Space1.png",
                "style": "width: 300px; height: 50px; opacity: 0.7"
            },
        ]
    },
    {
        "element": "div",
        "style": "width: 450px; height: 234px; float : left; margin-left: 10px;" + backgroundStyle,
        "children":
        [
            {
                "element": "div",
                "id": "activeListDiv",
                "style": "background-color: #c182e3; height: 224px; width: 150px; overflow-y:auto; box-shadow: inset 0 0 5px #000000; float: left",
                "children":
                [
                    {
                        "element": "h3",
                        "innerHTML": "Active Games",
                        "style": "margin-left: 20px; font-family: Fantasy;"
                    },
                    {
                        "element": "ul",
                        "id": "activeList"
                    }
                ]
            },
            {
                "element": "div",
                "id": "activeListDiv",
                "style": "height: 110px; margin-left: 180px;",
                "children":
                [
                    {
                        "element": "div",
                        "id": "starship1",
                        "style": "float: left; width: 110px",
                        "children": 
                        [
                            {
                                "element": "img",
                                "class": "shipImg",
                                // Copytight: https://www.flaticon.com/free-icon/space-ship_1970155
                                "src": "https://cdn-icons-png.flaticon.com/512/1970/1970155.png",
                            }
                        ]
                    },
                    {
                        "element": "div",
                        "id": "starship2",
                        "style": "margin-left: 20px; float: left; width: 110px",
                        "children": 
                        [
                            {
                                "element": "img",
                                "class": "shipImg",
                                //Copyright: https://www.flaticon.com/free-icon/space-ship_1789873
                                "src": "https://cdn-icons-png.flaticon.com/512/1789/1789873.png",
                            }
                        ]
                    },
                ]
            },
            {
                "element": "div",
                "id": "activeListDiv",
                "style": "margin-left: 180px; margin-top: 5px",
                "children":
                [
                    {
                        "element": "div",
                        "id": "starship3",
                        "style": "margin-top:10px; float: left; width: 110px",
                        "children": 
                        [
                            {
                                "element": "img",
                                "class": "shipImg",
                                //Copyright: https://www.flaticon.com/free-icon/spaceship_1114780
                                "src": "https://cdn-icons-png.flaticon.com/512/1114/1114780.png",
                            }
                        ]
                    },
                    {
                        "element": "div",
                        "id": "starship4",
                        "style": "margin-left: 20px; float: left; width: 110px",
                        "children": 
                        [
                            {
                                "element": "img",
                                "class": "shipImg",
                                //Copyright: https://www.flaticon.com/free-icon/rocket_3204744
                                "src": "https://cdn-icons-png.flaticon.com/512/3204/3204744.png",
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
// copyright: https://vectorpixelstar.itch.io/space
document.body.style.background = "url('https://img.itch.zone/aW1hZ2UvNjQ5NDc4LzM0ODI3MTcuanBn/original/pnLeLg.jpg')"
createElementsFromJSON(page, document.body);

// Add 2D context to variable
ctx = document.getElementById('gameCanvas').getContext("2d");
ctx.fillStyle = "White";
ctx.font = "50px Arial";

// Copyright: https://www.flaticon.com/free-icon/alien_3306625
alien = document.createElement("img");
alien.src = "https://cdn-icons-png.flaticon.com/512/3306/3306625.png";
// Copytight: https://www.flaticon.com/free-icon/space-ship_1970155
spaceShip = document.createElement("img");
spaceShip.src = "https://cdn-icons-png.flaticon.com/512/1970/1970155.png";
//Copyright: https://www.flaticon.com/free-icon/missile_1261986?term=missile&page=1&position=61&page=1&position=61&related_id=1261986&origin=search
missile = document.createElement("img");
missile.src = "https://cdn-icons-png.flaticon.com/512/1261/1261986.png";
// Copyright: https://www.flaticon.com/free-icon/universe_2909506?related_id=2909458&origin=search
space = document.createElement("img");
space.src = "https://cdn-icons-png.flaticon.com/512/2909/2909506.png";
// https://www.vecteezy.com/vector-art/2267289-level-up-neon-signs-style-text-vector
win = document.createElement("img");
win.src = "https://static.vecteezy.com/system/resources/previews/002/267/289/non_2x/level-up-neon-signs-style-text-free-vector.jpg";
win.width = "528px";
win.height = "528px";
// https://www.vecteezy.com/vector-art/2241291-game-over-neon-signs-style-text-vector
loose = document.createElement("img");
loose.src = "https://static.vecteezy.com/system/resources/previews/002/241/291/non_2x/game-over-neon-signs-style-text-free-vector.jpg"
loose.width = "528px";
loose.height = "528px";

var audio = document.createElement("audio");
// Copyright: https://www.chosic.com/download-audio/28670/
audio.src = "https://www.chosic.com/wp-content/uploads/2021/08/Loyalty_Freak_Music_-_04_-_It_feels_good_to_be_alive_too.mp3";

var backgroundImg = false;
const map = [{}];

function initSpace(){
    var counter = 0;
    for (var y = 0; y < 11 * 48; y += 48) {
        for (var x = 0; x < 11 * 48; x += 48) {
            map.push({ "id": counter, "x": x, "y": y });
            counter++;
        }
    }
}
initSpace();

// Connect to ws at port 8082
const socket = new WebSocket('ws://localhost:8082');
socket.addEventListener('open', (ev) => {
    console.log(ev);
});

// Global variable for user session
let session = -1;

// print message that server send to client
socket.addEventListener('message', (msg) => {
    var json = JSON.parse(msg.data);

    // Registration response
    if(json.method === "registrationFailed"){
        alert(json.content);
    }else if(json.method === "registrationSucess"){
        session = json.content.session;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";

        sessionSpan = document.getElementById("sessionSpan");
        sessionSpan.innerHTML = session;

        clearScene();
        drawShip(json);

    // Login response
    }else if(json.method === "loginFailed"){
        alert(json.content);
    }else if(json.method === "loginSucess"){
        session = json.content.session;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";

        sessionSpan = document.getElementById("sessionSpan");
        sessionSpan.innerHTML = session;
        
        clearScene();
        drawShip(json);
    }else if(json.method === "loginAdmin"){
        session = json.content.session;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "admin";
        statusSpan.style.color = "green";

        sessionSpan = document.getElementById("sessionSpan");
        sessionSpan.innerHTML = session;
        
        adminDiv = document.createElement('div');
        adminDiv.style = "width: 450px; height: 208px; text-align:center; float : left; margin-left: 10px;" + backgroundStyle;
        document.body.appendChild(adminDiv);

        adminText = document.createElement('h3');
        adminText.style = "margin: 5px; font-family: Fantasy;";
        adminText.innerHTML = "All players";
        adminDiv.appendChild(adminText);

        adminTableCreate(adminDiv, json.content.users);

        clearScene();
        drawShip(json);
    
    // Start response
    }else if(json.method === "startFail"){
        alert(json.content);

    // Update actives response
    }else if(json.method === "updateActives"){
        updateList(json.content);
    
    // Restart response
    }else if(json.method === "restartFail"){
        alert(json.content);
    }else if(json.method === "restartSucess"){
        ctx.fillText("Game was restarted", 200, 200)
        setTimeout(function() {
            ctx.clearRect(0, 0, 528, 528);
            clearScene();
            drawShip(json);
        }, 1000);
    // Spectate response
    }else if(json.method === "spectateFail"){
        alert(json.content.error);
    }else if(json.method === "spectateSucess"){
        if(json.content.status === "online"){
            session = json.content.session;
            statusSpan = document.getElementById("statusSpan");
            statusSpan.innerHTML = "spectate";
            statusSpan.style.color = "blue";
            ctx.clearRect(0, 0, 528, 528);
        }else{
            session = json.content.session;
            statusSpan = document.getElementById("statusSpan");
            statusSpan.innerHTML = "online";
            statusSpan.style.color = "green";
        }

        console.log(json.content);

    // Update game state
    }else if(json.method === "updateScene"){
        // clear scene before drawing
        clearScene(json);
        drawScore(json);
        drawAliens(json);
        drawMissiles(json);
        drawShip(json);

    // Loose screen
    }else if(json.method === "looseScreen"){
        var score = json.content.score;
        var level = json.content.level;

        ctx.clearRect(0, 0, 528, 528);
        ctx.drawImage(loose, 0, 0, 528, 528);
        ctx.font = "50px Arial";
        ctx.textAlign = 'center';
        ctx.shadowColor="#0f9fff";
        ctx.shadowBlur=7;
        ctx.lineWidth=5;
        ctx.strokeText("level: " + level + " Score: " + score, 528/2, 50);
        ctx.shadowBlur=0;
        ctx.fillStyle="#69f0ff";
        ctx.fillText("level: " + level + " Score: " + score, 528/2, 50);
        
        ctx.fillStyle="white";
        ctx.textAlign = 'left';
        ctx.font = "20px Arial";

    // Win screen
    }else if(json.method === "winScreen"){
        var score = json.content.score;
        var level = json.content.level;

        ctx.clearRect(0, 0, 528, 528);
        ctx.drawImage(win, 0, 0, 528, 528);
        ctx.font = "50px Arial";
        ctx.textAlign = 'center';
        ctx.shadowColor="#0f9fff";
        ctx.shadowBlur=7;
        ctx.lineWidth=5;
        ctx.strokeText("level: " + level + " Score: " + score, 528/2, 50);
        ctx.shadowBlur=0;
        ctx.fillStyle="#69f0ff";
        ctx.fillText("level: " + level + " Score: " + score, 528/2, 50);
        
        ctx.fillStyle="white";
        ctx.textAlign = 'left';
        ctx.font = "20px Arial";

    // Spectated close
    }else if (json.method === "spectatedClose"){
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";
        
        ctx.clearRect(0, 0, 528, 528);
        ctx.font = "20px Arial";
        ctx.fillText("Spectated client left!!", 200, 200)
        setTimeout(function() {
            ctx.clearRect(0, 0, 528, 528);
        }, 1000);

    // Change ship
    }else if(json.method === "changeShip"){
        console.log("CHANGE SHIP: " + json.content);
        if(json.content.shipNumber === 1){
            spaceShip.src = "https://cdn-icons-png.flaticon.com/512/1970/1970155.png";
            missile.src = "https://cdn-icons-png.flaticon.com/512/1261/1261986.png";
        }else if(json.content.shipNumber === 2){
            spaceShip.src = "https://cdn-icons-png.flaticon.com/512/1789/1789873.png";
            // Copyright: https://www.flaticon.com/free-icon/missile_1261875
            missile.src = "https://cdn-icons-png.flaticon.com/512/1261/1261875.png";
        }else if(json.content.shipNumber === 3){
            spaceShip.src = "https://cdn-icons-png.flaticon.com/512/1114/1114780.png";
            // Copyright: https://www.flaticon.com/free-icon/missile_5328877?term=missile&page=2&position=23&page=2&position=23&related_id=5328877&origin=search
            missile.src = "https://cdn-icons-png.flaticon.com/512/5328/5328877.png";
        }else if(json.content.shipNumber === 4){
            spaceShip.src = "https://cdn-icons-png.flaticon.com/512/3204/3204744.png";
            // Copyright: https://www.flaticon.com/free-icon/laser_1374387?term=laser&page=1&position=4&page=1&position=4&related_id=1374387&origin=search
            missile.src = "https://cdn-icons-png.flaticon.com/512/1374/1374387.png"
        }
        clearScene();
        drawShip(json);
    // Change background
    }else if(json.method === "changeBackground"){
        backgroundImg = json.content.backgroundImg;
        clearScene();
        drawShip(json);
    }
});

function drawShip(json){
    var ship = json.content.ship;
    if(backgroundImg){
        ctx.globalAlpha = 0.5;
        for (i = 99; i < 121; i++) {
            var mapBox = map.find(box => box.id === i);
            var x = mapBox.x;
            var y = mapBox.y;
            ctx.drawImage(space, x, y, 48, 48);
        }
        ctx.globalAlpha = 1;
    }
    for (var i = 0; i < ship.length; i++) {
        var spaceShipOBJ = map.find(spaceShip => spaceShip.id === ship[i]);
        var x = spaceShipOBJ.x;
        var y = spaceShipOBJ.y;
        ctx.drawImage(spaceShip, x, y, 48, 48);
    }
}

function drawMissiles(json){
    var missiles = json.content.missiles
    for (var i = 0; i < missiles.length; i++) {
        var missileOBJ = map.find(missile => missile.id === missiles[i]);
        var x = missileOBJ.x;
        var y = missileOBJ.y;
        ctx.drawImage(missile, x, y, 48, 48);
    }
}

function drawAliens(json){
    var aliens = json.content.aliens;
    for (var i = 0; i < aliens.length; i++) {
        var alienOBJ = map.find(alien => alien.id === aliens[i]);
        var x = alienOBJ.x;
        var y = alienOBJ.y;
        ctx.drawImage(alien, x, y, 48, 48);
    }
}

function drawScore(json){
    var score = json.content.score;
    var level = json.content.level;
    var actualBest = json.content.bestScore;

    ctx.font = "20px Arial";
    ctx.fillText("Actual Best: " + actualBest, 5, 20);
    ctx.fillText("Score: " + score, 5, 41);
    ctx.fillText("Level: " + level, 5, 61);
}

function clearScene(){
    ctx.clearRect(0, 0, 528, 528);
    if(backgroundImg){
        ctx.globalAlpha = 0.7;
        map.forEach(function draw(element) {
            ctx.drawImage(space, element.x, element.y, 48, 48);
        });
        ctx.globalAlpha = 1;
    }
}
// ALL INPUTS
usernameInput = document.getElementById('usernameInput');
passwordInput = document.getElementById('passwordInput');
emailInput = document.getElementById('emailInput');
fullNameInput = document.getElementById('fullNameInput');
spectateInput = document.getElementById('spectateInput');
secondPasswordInput = document.getElementById('secondPassword');
// ALL BUTTONS
// Register button (sending register infromation)
registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', () => {    
    const content = {
        "username": usernameInput.value,
        "password": passwordInput.value,
        "secondPassword": secondPasswordInput.value,
        "email": emailInput.value,
        "name": fullNameInput.value,
    };
    const payLoad = {
        "method": "register",
        "content": content
    };
    socket.send(JSON.stringify(payLoad));
});

// Login Button
loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', function(){
    const content = {
        "username": usernameInput.value,
        "password": passwordInput.value,
    };
    const payLoad = {
        "method": "login",
        "content": content
    };
    socket.send(JSON.stringify(payLoad));
});

// Start button
startButton = document.getElementById('startButton');
startButton.addEventListener('click', function(){
    const content = {
        "session": session
    };
    const payLoad = {
        "method": "start",
        "content": content,
    }
    socket.send(JSON.stringify(payLoad));
});

// Spectate button
startButton = document.getElementById('spectateButton');
startButton.addEventListener('click', function(){
    const content = {
        "session": spectateInput.value
    };
    const payLoad = {
        "method": "spectate",
        "content": content,
    }
    socket.send(JSON.stringify(payLoad));
});

// Restart button
restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function(){
    const content = {
        "session": session
    };
    const payLoad = {
        "method": "restart",
        "content": content,
    }
    socket.send(JSON.stringify(payLoad));
})

// Music button
musicButton = document.getElementById('musicButton');
musicButton.addEventListener('click', function(){
    if(musicButton.innerHTML === "music: off"){
        musicButton.innerHTML = "music: on";
        musicButton.style = "color: green;"
        audio.play();
    }else{
        musicButton.innerHTML = "music: off";
        musicButton.style = "color: red;"
        audio.pause();
    }
});

// If keyboard key is pressed
document.addEventListener('keydown', checkKey);
document.addEventListener('keyup', checkKey);

function checkKey(e) {

    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    e = e || window.event;
    if (e.keyCode == '37') {
        lefKeyImg = document.getElementById("leftKey");
        if(e.type === 'keydown'){
            lefKeyImg.setAttribute("style", "width: 100px; height: 100px;");
        }else if(e.type === 'keyup'){
            lefKeyImg.setAttribute("style", "width: 100px; height: 100px; opacity: 0.7");
        }
        // console.log("<-");
    }
    else if(e.keyCode == '71'){
        gKeyImg = document.getElementById("GKey");
        if(e.type === 'keydown'){
            gKeyImg.setAttribute("style", "width: 100px; height: 100px; margin-left: 50px;");
        }else if(e.type === 'keyup'){
            gKeyImg.setAttribute("style", "width: 100px; height: 100px; margin-left: 50px; opacity: 0.7");
        }
        // console.log("G");
    }
    else if (e.keyCode == '39') {
        rightKeyImg = document.getElementById("rightKey");
        if(e.type === 'keydown'){
            rightKeyImg.setAttribute("style", "width: 100px; height: 100px;");
        }else if(e.type === 'keyup'){
            rightKeyImg.setAttribute("style", "width: 100px; height: 100px; opacity: 0.7");
        }
        // console.log("->");
    }
    else if (e.keyCode == '74'){
        jKeyImg = document.getElementById("JKey");
        if(e.type === 'keydown'){
            jKeyImg.setAttribute("style", "width: 100px; height: 100px;");
        }else if(e.type === 'keyup'){
            jKeyImg.setAttribute("style", "width: 100px; height: 100px; opacity: 0.7");
        }
        // console.log("J");
    }
    else if (e.keyCode == '32') {
        spaceKeyImg = document.getElementById("spaceKey");
        if(e.type === 'keydown'){
            spaceKeyImg.setAttribute("style", "width: 300px; height: 50px;");
        }else if(e.type === 'keyup'){
            spaceKeyImg.setAttribute("style", "width: 300px; height: 50px; opacity: 0.7");
        }
        // console.log("space");
    }

    // Send pressed key to server
    if(e.type === 'keydown'){
        const content = {
            "key": e.keyCode
        };
        const payLoad = {
            "method": "keyPress",
            "content": content
        };
        socket.send(JSON.stringify(payLoad));
    }
}

// Create a table for admin
function adminTableCreate(place, users) {
    let tableDiv = document.createElement('div');
    tableDiv.style = "background-color: #c182e3; height: 150px; overflow-y:auto; overflow-x:auto; box-shadow: inset 0 0 5px #000000;"
    place.appendChild(tableDiv);

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    tableDiv.appendChild(table);

    let row = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "username";
    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "e-mail";
    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "Full name";
    let heading_4 = document.createElement('th');
    heading_4.innerHTML = "TOP Score";
    let heading_5 = document.createElement('th');
    heading_5.innerHTML = "TOP Level";

    row.appendChild(heading_1);
    row.appendChild(heading_2);
    row.appendChild(heading_3);
    row.appendChild(heading_4);
    row.appendChild(heading_5);
    thead.appendChild(row);

    for(i in users){
        let row = document.createElement('tr');
        let data_1 = document.createElement('td');
        data_1.innerHTML = users[i].username;
        let data_2 = document.createElement('td');
        data_2.innerHTML = users[i].email;
        let data_3 = document.createElement('td');
        data_3.innerHTML = users[i].name;
        let data_4 = document.createElement('td');
        data_4.innerHTML = users[i].score;
        let data_5 = document.createElement('td');
        data_5.innerHTML = users[i].level;

        row.appendChild(data_1);
        row.appendChild(data_2);
        row.appendChild(data_3);
        row.appendChild(data_4);
        row.appendChild(data_5);
        tbody.appendChild(row);
    }
  }

function updateList(sessions){
    var ul = document.getElementById('activeList');
    ul.remove();

    var listDiv = document.getElementById('activeListDiv')
    ul = document.createElement('ul');
    ul.id = 'activeList'
    listDiv.appendChild(ul);

    sessions.forEach(element => {
        var li = document.createElement('li');
        li.innerHTML = 'session: ' + element;
        ul.appendChild(li);
    });
}

// Image buttons for changing ship
starship1 = document.getElementById('starship1');
starship1.addEventListener('click', () => {
    const payLoad = {
        "method": "changeShip",
        "content": 1
    }
    socket.send(JSON.stringify(payLoad));
});
starship2 = document.getElementById('starship2');
starship2.addEventListener('click', () => {
    const payLoad = {
        "method": "changeShip",
        "content": 2
    }
    socket.send(JSON.stringify(payLoad));
});
starship3 = document.getElementById('starship3');
starship3.addEventListener('click', () => {
    const payLoad = {
        "method": "changeShip",
        "content": 3
    }
    socket.send(JSON.stringify(payLoad));
});
starship4 = document.getElementById('starship4');
starship4.addEventListener('click', () => {
    const payLoad = {
        "method": "changeShip",
        "content": 4
    }
    socket.send(JSON.stringify(payLoad));
});

// Image button for changing background
bckgImg = document.getElementById('bckImg');
bckgImg.addEventListener('click', () => {
    const payLoad = {
        "method": "changeBackground",
        "content": backgroundImg
    }
    socket.send(JSON.stringify(payLoad));
})