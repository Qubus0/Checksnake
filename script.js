const length = 5; // lenght at the start of a game
let fieldsize = 15, // side lenght of the playing field
    speed = 120; // higher is slower
let direction,
    inputs = ["up"]; // starting direction
let newPoint = true;
let points = 0,
    high = 0;
let char, prevChar;

let upKey = 87,
    leftKey = 65,
    downKey = 83,
    rightKey = 68;

function updateKeys(event, keyName) {
    let pressedChar = event.keyCode || event.which;
    let target = document.getElementById(keyName)
    target.innerHTML = event.key;
    target.blur()
    eval(keyName + ' = ' + pressedChar)
}

function keyboardControl(event) {
    input = event.keyCode || event.which;
    if (input === upKey || input === leftKey || input === downKey || input === rightKey) {
        char = event.keyCode || event.which;
        if (prevChar != char) {
            cooldown = true;
            prevChar = char;
            if (char === upKey && direction != "down") {
                direction = "up";
            } else if (char === leftKey && direction != "right") {
                direction = "left";
            } else if (char === downKey && direction != "up") {
                direction = "down";
            } else if (char === rightKey && direction != "left") {
                direction = "right";
            }
            if (inputs[inputs.length - 1] != direction && inputs.length < 3) {
                inputs.push(direction);
            }
        }
    }
}

function randNumZeroToMax(maximum) {
    return Math.floor(Math.random() * Math.floor(maximum));
}

function clearField() {
    for (let element of document.getElementsByClassName("field")) {
        element.classList.remove("point")
        element.checked = false;
    }
}

function createSnakeGame() {
    for (let j = 0; j < fieldsize; j++) {
        let row = document.createElement("DIV");
        row.classList.add("row");
        row.id = "r-" + j;
        document.getElementById("snek").appendChild(row);

        for (let i = 0; i < fieldsize; i++) {
            let check = document.createElement("INPUT");
            check.type = "checkbox";
            check.id = "r-" + j + "ch-" + i;
            check.classList.add("field");
            check.classList.add("colored");
            check.onchange = function () {
                //snake head
                setTimeout(() => {
                    this.blur();
                    let vert;
                    let horiz;

                    switch (inputs[0]) {
                        case "up":
                            vert = fieldsize + j - 1;
                            horiz = i;
                            break;

                        case "left":
                            vert = j;
                            horiz = fieldsize + i - 1;
                            break;

                        case "down":
                            vert = j + 1;
                            horiz = i;
                            break;

                        case "right":
                            vert = j;
                            horiz = i + 1;
                            break;
                    }

                    if (inputs.length > 1) {
                        inputs.shift();
                    }

                    let nextHead = document.getElementById(
                        "r-" + (vert % fieldsize) + "ch-" + (horiz % fieldsize)
                    );
                    nextHead.classList.add("snakehead");
                    this.classList.add("snakebody");
                    this.classList.remove("snakehead");




                    if (nextHead.checked == true && !(nextHead.classList.contains("point"))) {     //death
                        if (points > high) { high = points; }
                        clearField()
                        newPoint = true;
                        setCookie('highscore', high, 120);
                        let newHigh = checkHighscore() || high;
                        document.getElementById("high").innerHTML = "Highscore: " + newHigh;
                        points = 0;
                        document.getElementById("point-counter").innerHTML = "Points: " + points;
                        alert("\n\n\n\n\nGame Over");
                        return;
                    } else if (nextHead.classList.contains("point")) {
                        nextHead.classList.remove("point");
                        nextHead.checked = false;
                        newPoint = true;
                        points++;
                        document.getElementById("point-counter").innerHTML = "Points: " + points;
                    }
                    nextHead.click();
                }, speed);


                //snake tail deletion
                setTimeout(() => {
                    this.checked = false;
                    this.classList.remove("snakebody");
                }, speed * (points + length));
                setTimeout(() => {
                    this.classList.remove("snakehead");
                }, speed);


                // point spawning
                while (newPoint) {
                    let nextPoint = document.getElementById("r-" + randNumZeroToMax(fieldsize) + "ch-" + randNumZeroToMax(fieldsize));
                    if (!(nextPoint.classList.contains("snakebody") || nextPoint.classList.contains("snakehead"))) {
                        nextPoint.classList.add("point");
                        nextPoint.checked = true;
                        newPoint = false;
                    }
                }
            }; // onchange end

            document.getElementById("r-" + j).appendChild(check);
        }
    }
}

//document.getElementById("r-" + Math.floor(fieldsize/2) + "ch-" + Math.floor(fieldsize/2)).click();

function restyle() {
    for (let box of document.getElementsByClassName("field")) {
        if (box.classList.contains("colored")) {
            box.classList.remove("colored")
        } else {
            box.classList.add("colored")
        }
    }
}

function openOptions() {
    document.getElementById("options").style = "height: fit-content;";
}

function closeOptions() {
    document.getElementById("options").style = "height: 0; padding: 0";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkHighscore() {
    var highscore = getCookie("highscore");
    if (highscore != "") {
        return highscore;
    } else {
        return 0;
    }

}