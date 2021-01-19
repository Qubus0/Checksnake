const length = 5 // lenght at the start of a game
let inputs = ["up"] // starting direction
let newPoint = true
let points = 0
let gameRunning = false
let startTime


let upKey = 87,
    leftKey = 65,
    downKey = 83,
    rightKey = 68

function updateKeybindings(event, keyName) {
    let pressedChar = event.keyCode
    let target = document.getElementById(keyName)
    target.innerHTML = event.key
    target.blur()
    eval(keyName + ' = ' + pressedChar)
}


function sanitiseDirection(newDir) {
    let oldDir = inputs[inputs.length - 1]
    let out
    if (newDir !== oldDir) {
        if (newDir === "up" && oldDir !== "down") {
            out = "up"
        } else if (newDir === "left" && oldDir !== "right") {
            out = "left"
        } else if (newDir === "down" && oldDir !== "up") {
            out = "down"
        } else if (newDir === "right" && oldDir !== "left") {
            out = "right"
        }
    }
    if (inputs.length < 3 && out !== undefined) {
        inputs.push(out)
    }
}

function keyboardControl(event) {
    let char = event.keyCode
    let dir
    if (char === upKey) {
        dir = "up"
    } else if (char === leftKey) {
        dir = "left"
    } else if (char === downKey) {
        dir = "down"
    } else if (char === rightKey) {
        dir = "right"
    }
    sanitiseDirection(dir)
}

swipeControl("swipable", (el, dir) => {
    sanitiseDirection(dir)
})


function randNumZeroToMax(maximum) {
    return Math.floor(Math.random() * Math.floor(maximum))
}

function clearField() {
    for (let element of document.getElementsByClassName("field")) {
        element.classList.remove("point")
        element.classList.remove("snakebody")
        element.classList.remove("snakehead")
        element.checked = false
    }
}

function createSnakeGame(fieldsize = 15, speed = 120) {
    for (let rowcount = 0; rowcount < fieldsize; rowcount++) {
        let row = document.createElement("DIV");
        row.classList.add("row")
        row.id = "r-" + rowcount
        document.getElementById("snek").appendChild(row);

        for (let colcount = 0; colcount < fieldsize; colcount++) {
            let check = document.createElement("INPUT")
            check.type = "checkbox"
            check.id = "r-" + rowcount + "ch-" + colcount
            check.classList.add("field")
            check.classList.add("colored")

            check.onchange = function () {
                if (!gameRunning) {
                    gameRunning = true
                    startTime = new Date().getTime()
                }
                document.getElementById("timedisplay").innerHTML = displayTime(startTime)

                function displayTime(sTime, eTime = new Date().getTime(), precise = false) {
                    let difference = (eTime - sTime)

                    let minutes = Math.floor(difference / (1000 * 60))
                    let seconds = Math.floor((difference % (1000 * 60)) / 1000)
                    let decisec = Math.floor((difference % 1000) / 100)
                    let millisec = Math.floor(difference % 1000)
                    let elapsedTime
                    if (precise) {
                        elapsedTime = leftFillNum(minutes, 2) + ":" + leftFillNum(seconds, 2) + "." + millisec
                    } else {
                        elapsedTime = leftFillNum(minutes, 2) + ":" + leftFillNum(seconds, 2) + "." + decisec
                    }

                    return elapsedTime
                }

                function death() {
                    let t = displayTime(startTime, new Date().getTime(), true)
                    document.getElementById("timedisplay").innerHTML = t
                    gameRunning = false
                    clearField()

                    newPoint = true
                    displaySavedHighscore()
                    alert(`Game Over \n\nYou got ${points} Points in a time of ${t}`)
                    points = 0
                    document.getElementById("point-counter").innerHTML = "Points: " + points
                }

                //snake head
                setTimeout(() => {
                    this.blur()
                    let noloop = document.getElementById("noloop").checked
                    let vert
                    let horiz

                    switch (inputs[0]) {
                        case "up":
                            if (noloop) {
                                vert = rowcount - 1
                            } else {
                                vert = fieldsize + rowcount - 1
                            }
                            horiz = colcount
                            break

                        case "left":
                            vert = rowcount
                            if (noloop) {
                                horiz = colcount - 1
                            } else {
                                horiz = fieldsize + colcount - 1
                            }
                            break

                        case "down":
                            vert = rowcount + 1
                            horiz = colcount
                            break

                        case "right":
                            vert = rowcount
                            horiz = colcount + 1
                            break
                    }

                    if (inputs.length > 1) {
                        inputs.shift()
                    }

                    this.classList.add("snakebody")
                    this.classList.remove("snakehead")
                    let nextHead = document.getElementById("r-" + (vert % fieldsize) + "ch-" + (horiz % fieldsize))
                    if (noloop) {
                        nextHead = document.getElementById("r-" + (vert) + "ch-" + (horiz))
                    }


                    if (nextHead === undefined || (nextHead.checked === true && !(nextHead.classList.contains("point")))) {
                        death()
                        return
                    } else if (nextHead.classList.contains("point")) {
                        nextHead.classList.remove("point")
                        nextHead.checked = false
                        newPoint = true
                        points++
                        document.getElementById("point-counter").innerHTML = "Points: " + points
                    }
                    nextHead.classList.add("snakehead")
                    nextHead.click()
                }, speed)


                //snake tail deletion
                setTimeout(() => {
                    this.checked = false
                    this.classList.remove("snakebody")
                }, speed * (points + length))
                setTimeout(() => {
                    this.classList.remove("snakehead")
                }, speed)


                // point spawning
                while (newPoint) {
                    let nextPoint = document.getElementById("r-" + randNumZeroToMax(fieldsize) + "ch-" + randNumZeroToMax(fieldsize))
                    if (!(nextPoint.classList.contains("snakebody") || nextPoint.classList.contains("snakehead"))) {
                        nextPoint.classList.add("point")
                        nextPoint.checked = true
                        newPoint = false
                    }
                }
            } // onchange end

            document.getElementById("r-" + rowcount).appendChild(check)
        }
    }
}

//document.getElementById("r-" + Math.floor(fieldsize/2) + "ch-" + Math.floor(fieldsize/2)).click()


function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0)
}

function restyle() {
    for (let box of document.getElementsByClassName("field")) {
        if (box.classList.contains("colored")) {
            box.classList.remove("colored")
        } else {
            box.classList.add("colored")
        }
    }
}

let autoclose

function openOptions() {
    clearTimeout(autoclose)
    document.getElementById("options").style = "height: fit-content;"
    autoclose = setTimeout(closeOptions, 15000)
}

function closeOptions() {
    clearTimeout(autoclose)
    document.getElementById("options").style = "height: 0; padding: 0 5px;"
}


function displaySavedHighscore() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("highscore") === null) {
            localStorage.setItem("highscore", 0)
        }
        if (points > localStorage.getItem("highscore")) {
            localStorage.setItem("highscore", points)
        }
        document.getElementById("high").innerHTML = "Highscore: " + localStorage.getItem("highscore")
    } else {
        let nostoragehigh
        if (points > nostoragehigh) {
            nostoragehigh = points
        }
        document.getElementById("high").innerHTML = "Highscore: " + nostoragehigh
    }
}


// Tune deltaMin according to your needs. Near 0 it will almost
// always trigger, with a big value it can never trigger.
function swipeControl(id, func, deltaMin = 30) {
    const swipe_det = {
        sX: 0,
        sY: 0,
        eX: 0,
        eY: 0
    }
    // Directions enumeration
    const directions = Object.freeze({
        UP: "up",
        DOWN: "down",
        RIGHT: "right",
        LEFT: "left"
    })
    let direction = null
    const el = document.getElementById(id)
    el.addEventListener(
        "touchstart",
        function (e) {
            const t = e.touches[0]
            swipe_det.sX = t.screenX
            swipe_det.sY = t.screenY
        },
        false
    )
    el.addEventListener(
        "touchmove",
        function (e) {
            // Prevent default will stop user from scrolling, use with care
            e.preventDefault()
            const t = e.touches[0]
            swipe_det.eX = t.screenX
            swipe_det.eY = t.screenY
        },
        false
    )
    el.addEventListener(
        "touchend",
        function (e) {
            const deltaX = swipe_det.eX - swipe_det.sX
            const deltaY = swipe_det.eY - swipe_det.sY
            // Min swipe distance
            if (deltaX ** 2 + deltaY ** 2 < deltaMin ** 2) return
            // horizontal
            if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
                direction = deltaX > 0 ? directions.RIGHT : directions.LEFT
            // vertical
            else direction = deltaY > 0 ? directions.DOWN : directions.UP

            if (direction && typeof func === "function") func(el, direction)

            direction = null
        },
        false
    )
}