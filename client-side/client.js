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
                "style": "text-align: center; " + backgroundStyle,
                "children":
                [
                    {
                        "element": "canvas",
                        "id": "gameCanvas",
                        "style": "width: 500px; height: 500px; border:1px solid #000000; margin-top: 10px; background-color: black;"
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
                                        "id": "start",
                                        "class": "button",
                                        "innerHTML": "start"
                                    },
                                    {
                                        "element": "button",
                                        "id": "restart",
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
                                        "placeholder": "pin"
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
                                "innerHTML": "pin: ",
                                "children": 
                                [
                                    {
                                        "element": "span",
                                        "id": "pinSpan",
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

// Connect to ws at port 8082
const socket = new WebSocket('ws://localhost:8082');
socket.addEventListener('open', (ev) => {
    console.log(ev);
});
socket.addEventListener('open', (ev) => {
    const payLoad = {
        "method": "pin",
        "content": content
    };
    socket.send(JSON.stringify(payLoad));
});

socket.onclose = function(e){
    const payLoad = {
        "method": "closing",
        "content": "closing"
    };
    socket.send(JSON.stringify(payLoad));
}
// Global variable for user PIN
let pin = -1;

// print message that server send to client
socket.addEventListener('message', (msg) => {
    var json = JSON.parse(msg.data);

    if(json.method === "registrationFailed"){
        alert(json.content);
    }else if(json.method === "registrationSucess"){
        pin = json.content.pin;
        statusSpan = document.getElementById("statusSpan");
        statusSpan.innerHTML = "online";
        statusSpan.style.color = "green";

        pinSpan = document.getElementById("pinSpan");
        pinSpan.innerHTML = pin;

        console.log("Registration sucessfull!!");
    }
    // console.log('Hashed login: ' + json.login);
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
        "pin": pin,
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
// TODO: LOGIN BUTTON (and other stuff...)
loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', function(){
    console.log(usernameInput.value);
    console.log(passwordInput.value);
});



musicButton = document.getElementById('musicButton');
musicButton.addEventListener('click', function(){
    if(musicButton.innerHTML === "music: off"){
        musicButton.innerHTML = "music: on";
        musicButton.style = "color: green;"
    }else{
        musicButton.innerHTML = "music: off";
        musicButton.style = "color: red;"
    }
});




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
}