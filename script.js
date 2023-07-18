const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");

const paddleW = 8;
const paddleH = 80;
const playerMoveSize = 15;
const winningTotal = 3;

let playerScore = 0;
let systemScore = 1;
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let moveX;
let moveY;
let ballRadius = 10;
let playerPosition = canvas.height/2;
let systemPosition = canvas.height/2;
let gameLoop;
let gameRunning = false;

ctx.fillStyle = 'red';
ctx.font = "30px Helvetica";
ctx.textAlign = "center";
ctx.fillText("Press space to play",canvas.width/2,canvas.height/2);

document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(e) {
    //console.log(e);
    switch (e.code) {
        case "Space":
            gameStart();
            break;
        case "ArrowUp":
            if (playerPosition - paddleH/2 <= 0) return;
            playerPosition -= playerMoveSize;
            break;
        case "ArrowDown":
            if (playerPosition + paddleH/2 >= canvas.height) return;
            playerPosition += playerMoveSize;
            break;
        default:
            break;
    }
}

// change ball direction
function randomMovement() {
    // 1 2 3
    const randomX = Math.ceil(Math.random()*3 + 1);
    // 0 1 2
    const randomY = Math.ceil(Math.random()*3);
    const plusMinusX = Math.random() < .5 ? "-" : "+";
    const plusMinusY = Math.random() < .5 ? "-" : "+";
    const randomNumber = Math.random();
    moveX = Number(plusMinusX+randomX) + randomNumber;
    moveY = Number(plusMinusY+randomY) + randomNumber;
    
}

// start the game
function gameStart() {
    if (gameRunning) {
        return;
    }
    ballX = canvas.width/2;
    gameRunning = true;
    randomMovement();
    playerScore = 0;
    systemScore = 0;
    clearInterval(gameLoop);
    gameLoop = setInterval(loop,15);
}

// draw left paddle
function drawPlayerPaddle() {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(0,playerPosition,paddleW,paddleH);
}


// draw right paddle
function drawSystemPaddle() {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width-paddleW,systemPosition,paddleW,paddleH);
}


// draw ball
function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = 'gray';
    ctx.arc(ballX, ballY, ballRadius, 0, 2*Math.PI);
    ballX += moveX;
    ballY += moveY;
    ctx.fill();
    
}

// Text
function drawScore() {
    ctx.fillStyle = 'green';
    ctx.font = '30px Helvetica';
    ctx.fillText(playerScore,canvas.width/4, 50);
    ctx.fillText(systemScore,canvas.width*.75, 50);
    
}

function drawMiddleLine() {
    // lines moveTo lineTo
    ctx.beginPath();
    //ctx.setLineDash([6]);
    //ctx.setLineDash([10,10,20,20,30]);
    ctx.moveTo(canvas.width/2,0)
    ctx.lineTo(canvas.width/2,canvas.height);
    ctx.stroke();
}

function collide () {
    // test ball on paddle
    ctx.beginPath();
    ctx.fillStyle = 'purple';
    ctx.arc(ballRadius+paddleW,canvas.height/2,ballRadius,0,2*Math.PI);
    ctx.fill();
    // check top bottom
    //console.log('collide start');
    if (ballY > canvas.height - ballRadius) {
        console.log ('hit bottom');
        moveY = -moveY;
    }
    else
    if  (ballY - ballRadius <= 0) {
        console.log ('hit top');
        moveY = -moveY;        
    } else
    // check for score x axis on both sides
    // console.log (`ballX ${ballX} ballRadius ${ballRadius} moveX ${moveX}`);
    if (ballX <= ballRadius) {
        score('system');
        // console.log('score system')
    } else 
    if (ballX + ballRadius >= canvas.width) {
        score('player');
        // console.log('score player');
    } else
    // check player paddle
    if (ballX <= ballRadius + paddleW && Math.abs(ballY-playerPosition) <= paddleH/2+ballRadius) {
        console.log (`hit player paddle moveX ${moveX}`);
        moveX = -moveX + generateRandomBounce();
    } else
    // check system paddle
    if (ballX + ballRadius >= canvas.width - paddleW && Math.abs(ballY-systemPosition) <= paddleH/2+ballRadius) {
        console.log (`hit system paddle moveX ${moveX}`);
        moveX = -moveX + generateRandomBounce();
    }
    //console.log('collide end');
}

function score (player) {
    if (player === 'system') {
        systemScore++;
    } else 
    if (player === 'player') {
        playerScore++;
    }
    // reset ball position
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    // go the other direction
    moveX = -moveX;
    if (systemScore === winningTotal) {
        endGame('system');
        return;
    } else
    if (playerScore === winningTotal) {
        endGame('player');
        return;
    }
}

function endGame(winner) {
    gameRunning = false;
    clearInterval(gameLoop);
    
    if (winner === 'system') {
        ctx.fillStyle = 'blue';
    } else {
        ctx.fillStyle = 'red';
    }
    ctx.textAlign = 'center';
    ctx.fillText(`The winner is: ${winner}`,canvas.width/2, canvas.height/2);
}

// generate move for the ball after bounce
function generateRandomBounce() {
    const number01 = Math.floor(math.random()*2);
    const posNegative = number01===0?"-":"+";
    return Number(posNegative + Math.random()/2);

}

function moveSystem() {
    if (systemPosition < ballY) {
        systemPosition+=2;
    } else {
        systemPosition-=2;
    }
}

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPlayerPaddle();
    drawSystemPaddle();
    drawScore();
    drawMiddleLine();
    drawBall();
    collide();
    moveSystem();
}

