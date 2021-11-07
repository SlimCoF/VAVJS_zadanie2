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
            }"
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
                "style": backgroundStyle,
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
                        "style": "margin-left: 350px",
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
        "style": "width: 450px; height: 234px; text-align:center; float : left; margin-left: 10px;" + backgroundStyle,
    }
]
// copyright: https://vectorpixelstar.itch.io/space
document.body.style.background = "url('https://img.itch.zone/aW1hZ2UvNjQ5NDc4LzM0ODI3MTcuanBn/original/pnLeLg.jpg')"
createElementsFromJSON(page, document.body);

// Add 2D context to variable
ctx = document.getElementById('gameCanvas').getContext("2d");
ctx.fillStyle = "White";
ctx.font = "50px Arial";
ctx.fontColor = "White";

// Copyright: https://www.flaticon.com/free-icon/alien_3306625
alien = document.createElement("img");
alien.src = "https://cdn-icons-png.flaticon.com/512/3306/3306625.png";
// Copytight: https://www.flaticon.com/free-icon/space-ship_1970155
spaceShip = document.createElement("img");
spaceShip.src = "https://cdn-icons-png.flaticon.com/512/1970/1970155.png";
// Copyright: https://www.flaticon.com/free-icon/missile_1261875
missile = document.createElement("img");
missile.src = "https://cdn-icons-png.flaticon.com/512/1261/1261875.png";

let audio = document.createElement("audio");
// Copyright: https://www.chosic.com/download-audio/28670/
audio.src = "https://www.chosic.com/wp-content/uploads/2021/08/Loyalty_Freak_Music_-_04_-_It_feels_good_to_be_alive_too.mp3";

const map = [{}];

function initSpace(){
    var counter = 0;
    for (var y = 0; y < 11 * 48; y += 48) {
        for (var x = 0; x < 11 * 48; x += 48) {
            map.push({ "id": counter, "x": x, "y": y });
            counter++;
        }
    }
    console.log("SPACE IS INITED");
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

    // Registration response handle
    if(json.method === "registrationFailed"){
        alert(json.content);
    }else if(json.method === "registrationSucess"){
        session = json.content.session;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";

        sessionSpan = document.getElementById("sessionSpan");
        sessionSpan.innerHTML = session;

        console.log("Registration sucessfull!!");

    // Login response handle
    }else if(json.method === "loginFailed"){
        alert(json.content);
    }else if(json.method === "loginSucess"){
        session = json.content.session;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";

        sessionSpan = document.getElementById("sessionSpan");
        sessionSpan.innerHTML = session;
        
        console.log("Logged In");
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

        console.log("Logged In as Admin");
    }

    // Start response handle
    else if(json.method === "startFail"){
        alert(json.content);
    }
    else if(json.method === "startSucess"){
        ctx.clearRect(0, 0, 528, 528);
        var ship = json.content.ship;
        for (var i = 0; i < ship.length; i++) {
            var spaceShipOBJ = map.find(spaceShip => spaceShip.id === ship[i]);
            var x = spaceShipOBJ.x;
            var y = spaceShipOBJ.y;
            ctx.drawImage(spaceShip, x, y, 48, 48);
        }
        console.log("YOU ARE PLAYING!");
    
    // Restart response handle
    }else if(json.method === "restartFail"){
        alert(json.content);
    }else if(json.method === "restartSucess"){
        ctx.fillText("Game was restarted", 200, 200)
        setTimeout(function() {
            ctx.clearRect(0, 0, 528, 528);
        }, 1000);

    // Spectate response handle
    }else if(json.method === "spectateFail"){
        alert(json.content);
    }else if(json.method === "spectateSucess"){
        if(json.content.status === "online"){
            session = json.content.session;
            statusSpan = document.getElementById("statusSpan");
            statusSpan.innerHTML = "spectate";
            statusSpan.style.color = "blue";
        }else{
            session = json.content.session;
            statusSpan = document.getElementById("statusSpan");
            statusSpan.innerHTML = "online";
            statusSpan.style.color = "green";
        }

        console.log(json.content);

    // Update game state handle
    }else if(json.method === "updateScene"){
        ctx.clearRect(0, 0, 528, 432);

        // Draw score and level
        var score = json.content.score;
        var level = json.content.level;
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 5, 20);
        ctx.fillText("Level: " + level, 5, 41);


        // Draw aliens
        var aliens = json.content.aliens;
        for (var i = 0; i < aliens.length; i++) {
            var alienOBJ = map.find(alien => alien.id === aliens[i]);
            var x = alienOBJ.x;
            var y = alienOBJ.y;
            ctx.drawImage(alien, x, y, 48, 48);
        }

        // Draw missiles
        var missiles = json.content.missiles
        for (var i = 0; i < missiles.length; i++) {
            var missileOBJ = map.find(missile => missile.id === missiles[i]);
            var x = missileOBJ.x;
            var y = missileOBJ.y;
            ctx.drawImage(missile, x, y, 48, 48);
        }

        // Draw ship
        var ship = json.content.ship;
        for (i = 99; i < 121; i++) {
            var mapBox = map.find(box => box.id === i);
            var x = mapBox.x;
            var y = mapBox.y;
            ctx.clearRect(x, y, x+48, y+48);
        }
        for (var i = 0; i < ship.length; i++) {
            var spaceShipOBJ = map.find(spaceShip => spaceShip.id === ship[i]);
            var x = spaceShipOBJ.x;
            var y = spaceShipOBJ.y;
            ctx.drawImage(spaceShip, x, y, 48, 48);
        }

    // TODO: loose screen
    }else if(json.method === "looseScreen"){
        var score = json.content.score;
        var level = json.content.level;

        ctx.font = "20px Arial";
        ctx.clearRect(0, 0, 528, 528);
        ctx.fillText("GAME OVER\nLevel: " + level + " Score: " + score, 200, 200);

    //TODO: win screen
    }else if(json.method === "winScreen"){
        var score = json.content.score;
        var level = json.content.level;

        ctx.font = "20px Arial";
        ctx.clearRect(0, 0, 528, 528);
        ctx.fillText("YOU WIN\nLevel: " + level + " Score: " + score, 200, 200);
    }
});

// ALL INPUTS
usernameInput = document.getElementById('usernameInput');
passwordInput = document.getElementById('passwordInput');
emailInput = document.getElementById('emailInput');
fullNameInput = document.getElementById('fullNameInput');
spectateInput = document.getElementById('spectateInput');

// ALL BUTTONS
// Register button (sending register infromation)
registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', () => {    
    const content = {
        "username": usernameInput.value,
        "password": passwordInput.value,
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
    tableDiv.style = "background-color: #c182e3; height: 150px; overflow-y:auto; box-shadow: inset 0 0 5px #000000;"
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

    row.appendChild(heading_1);
    row.appendChild(heading_2);
    row.appendChild(heading_3);
    thead.appendChild(row);

    for(i in users){
        // console.log(users[i]);

        let row = document.createElement('tr');
        let data_1 = document.createElement('td');
        data_1.innerHTML = users[i].username;
        let data_2 = document.createElement('td');
        data_2.innerHTML = users[i].email;
        let data_3 = document.createElement('td');
        data_3.innerHTML = users[i].name;

        row.appendChild(data_1);
        row.appendChild(data_2);
        row.appendChild(data_3);
        tbody.appendChild(row);
    }
  }
