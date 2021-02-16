document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const scoreDisplay = document.getElementById("score")
    const startBtn = document.getElementById("start_button")
    const width = 10
    let nextRandom = 0
    let timerId;
    let score = 0

    const colors = ["blue", 'orange','red','purple','green']
    
    // The shapes
    
const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
]
    
const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
]
    
const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
]
    
const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
]
    
const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
]

const theShapes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

// randomly select shape and its rotation
let random = Math.floor(Math.random()*theShapes.length)
console.log(random)

let current = theShapes[random][currentRotation]

// draw the first shape rotation
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add("tetromino")
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

// undraw

function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetromino")
        squares[currentPosition + index].style.backgroundColor = ""
    })
}

// make the shape move down every second
// timerId = setInterval(moveDown, 500)


// Controls

function control(event) {
    if (event.keyCode === 37) {
        moveLeft()
    }
    else if(event.keyCode === 38){
        rotate()
    }
    else if (event.keyCode === 39) {
        moveRight()
    }
    else if (event.keyCode === 40)  {
        moveDown()
    }
}
document.addEventListener("keydown", control)

// move down function
function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
}

function freeze(){
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => squares[currentPosition + index].classList.add("taken"))
    // start another shape fall
    random = nextRandom
    nextRandom = Math.floor(Math.random()* theShapes.length)
    current = theShapes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver( )
    }
}

function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) {
        currentPosition -= 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition -= 1
    }
    draw()
}


// move right function

function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if (!isAtRightEdge) {
        currentPosition += 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition -= 1
    }
    draw()
}


function rotate() {
    undraw()
    currentRotation ++
    if (currentRotation === theShapes[random].length) {
        currentRotation = 0
    }
    current = theShapes[random][currentRotation]
    draw()
}
// show up next shape
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

// shape without rotation
const upNextShapes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth,displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
]



function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove("tetromino")
        square.style.backgroundColor = ""
    })
    upNextShapes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add("tetromino")
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })


}


startBtn.addEventListener("click", startGame)


function startGame(){
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }
    else{
        draw()
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random()*theShapes.length)
        displayShape()
    }


}


function addScore() {
    for (let i = 0; i< 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if (row.every(index => squares[index].classList.contains("taken"))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
            squares[index].classList.remove("taken")
            squares[index].classList.remove("tetromino")
            squares[index].style.backgroundColor = ""
        }) 
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
       
    }
}

// game over function

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) { 
        scoreDisplay.innerHTML = "Game over"
        clearInterval(timerId)
        document.removeEventListener("keydown", control)
        
    }
}



})