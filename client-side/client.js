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

const page =
    {
        "response":
            [
                {
                    "element": "div",
                    "style": "width: 600px;",
                    "children":
                        [
                            {
                                "element": "input",
                                "id": "username",
                                "placeholder": "username"
                            },
                            {
                                "element": "input",
                                "id": "password",
                                "placeholder": "password"
                            },
                            {
                                "element": "button",
                                "id": "logIn",
                                "innerHTML": "log In",
                            },
                        ]
                },
                {
                    "element": "div",
                    "style": "width: 600px; margin-top: 10px;",
                    "children":
                        [
                            {
                                "element": "input",
                                "id": "e-mail",
                                "placeholder": "e-mail"
                            },
                            {
                                "element": "input",
                                "id": "pin",
                                "placeholder": "pin"
                            },
                            {
                                "element": "input",
                                "id": "name",
                                "placeholder": "Name Surname"
                            },
                            {
                                "element": "button",
                                "id": "siqnUp",
                                "innerHTML": "sign Up",
                            },
                        ]
                },
                {
                    "element": "div",
                    "style": "width: 450px; height: 234px; text-align:center;",
                    "children":
                    // copyright: https://www.webnots.com/download-free-keyboard-key-images-in-black/
                    [
                        {
                            "element": "h3",
                            "innerHTML": "Movement",
                            "style": "margin: 10px"
                        },
                        {
                            "element": "img",
                            "id": "leftKey",
                            "src": "https://img.webnots.com/2014/03/Left-Arrow1.png",
                            "style": "width: 100px; height: 100px;"
                        },
                        {
                            "element": "img",
                            "id": "rightKey",
                            "src": "https://img.webnots.com/2014/03/Right-Arrow1.png",
                            "style": "width: 100px; height: 100px;"
                        },
                        {
                            "element": "img",
                            "id": "GKey",
                            "src": "https://img.webnots.com/2014/03/G1.png",
                            "style": "width: 100px; height: 100px; margin-left: 50px;"
                        },
                        {
                            "element": "img",
                            "id": "JKey",
                            "src": "https://img.webnots.com/2014/03/J1.png",
                            "style": "width: 100px; height: 100px;"
                        },
                        {
                            "element": "h3",
                            "innerHTML": "Shoot",
                            "style": "margin: 10px"
                        },
                        {
                            "element": "img",
                            "id": "spaceKey",
                            "src": "https://img.webnots.com/2014/03/Space1.png",
                            "style": "width: 300px; height: 50px;"
                        },
                    ]
                },
                {
                    "element": "div",
                    "children":
                    [
                        {
                            "element": "canvas",
                            "id": "gameCanvas",
                            "style": "width: 400px; height: 400px; border:1px solid #000000; margin-top: 10px;"
                        }
                    ]
                },
                {
                    "element": "div",
                    "style": "margin-top: 10px;",
                    "children":
                    [
                        {
                            "element": "button",
                            "id": "start",
                            "innerHTML": "start"
                        },
                        {
                            "element": "button",
                            "id": "restart",
                            "innerHTML": "rastart"
                        },
                        {
                            "element": "button",
                            "id": "music",
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
                            "id": "spectate",
                            "placeholder": "pin"
                        },
                        {
                            "element": "button",
                            "id": "spectateButton",
                            "innerHTML": "spectate"
                        }
                    ]
                }
            ]
    }
createElementsFromJSON(page.response, document.body);


document.addEventListener('keydown', checkKey);

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        lefKeyImg = document.getElementById("leftKey");
        lefKeyImg.setAttribute("style", "width: 100px; height: 100px;opacity: 0.5;");
        setTimeout(function(){
            lefKeyImg.setAttribute("style", "width: 100px; height: 100px;");
       }, 100);
        console.log("<-");
    }
    else if(e.keyCode == '71'){
        gKeyImg = document.getElementById("GKey");
        gKeyImg.setAttribute("style", "width: 100px; height: 100px; margin-left: 50px; opacity: 0.5;");
        setTimeout(function(){
            gKeyImg.setAttribute("style", "width: 100px; height: 100px; margin-left: 50px;");
       }, 100);
        console.log("G");
    }
    else if (e.keyCode == '39') {
        rightKeyImg = document.getElementById("rightKey");
        rightKeyImg.setAttribute("style", "width: 100px; height: 100px;opacity: 0.5;");
        setTimeout(function(){
            rightKeyImg.setAttribute("style", "width: 100px; height: 100px;");
       }, 100);
        console.log("->");
    }
    else if (e.keyCode == '74'){
        jKeyImg = document.getElementById("JKey");
        jKeyImg.setAttribute("style", "width: 100px; height: 100px;opacity: 0.5;");
        setTimeout(function(){
            jKeyImg.setAttribute("style", "width: 100px; height: 100px;");
       }, 100);
        console.log("J");
    }
    else if (e.keyCode == '32') {
        spaceKeyImg = document.getElementById("spaceKey");
        spaceKeyImg.setAttribute("style", "width: 300px; height: 50px;opacity: 0.5;");
        setTimeout(function(){
            spaceKeyImg.setAttribute("style", "width: 300px; height: 50px;");
       }, 100);
        console.log("space");
    }
}