/** @type {HTMLCanvasElement} */
var canvas;

// Contexto del canvas, lo utilizamos para pintar
/** @type {CanvasRenderingContext2D} */
var ctx;
var w, h, w2, h2;
var pressedLeft = false;
var pressedRight = false;
var x;
var y;
var frameID;
var score = 0;
var wallX = 300;
var wallY = 50;
var ballVx = 0;
var ballAceleracion = 0.05;
var gravity = 0.8;
var posObstY = 250;
var img = new Image();
img.src = "./../textures/jaen-madera.png";
var moveRight = false;
var moveLeft = false;
var isGravity = true;
var vy = Math.random() * -10 - 5;
var dx = 0.3;
var dy = 0.3;
var vy = Math.random() * -10 - 5;

window.onload = function () {
  setup();
};

function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  document.onkeydown = handlerDown;
  document.onkeyup = handlerUp;
  window.onresize = function () {
    setCanvasDimensions();
  };

  //document.getElementById("start").addEventListener("click", startGame);
  startGame();
}

function setCanvasDimensions() {
  w = 600;
  h = 600;
  w2 = w / 2;
  h2 = h / 2;
  canvas.setAttribute("height", h);
  canvas.setAttribute("width", w);
}

function startGame() {
  ctx.save()
  document.querySelector("#start").style.display = "none";
  document.querySelector("#puntuacion").style.display = "block";
  setCanvasDimensions();
  x = w2;
  y = h2 / 8;
  createObsH();
  createObsV();
  createBHoles();
  gameLoop();
  ctx.restore();
}


function gameLoop() {
  frameID = requestAnimationFrame(gameLoop);
  drawBackground();
  drawWalls();
  green.drawgHole();
  drawBall();
  moveBall();
  drawObsH();
  drawObsV();
  moveObsH();
  moveObsV();
  drawBHoles();
  distantBall();
}

/* GAMEBOARD */

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  // ctx.fillStyle = "#e0b126"
  ctx.rect(0, 0, w, h);
  //ctx.fill();
  ctx.restore();
}

function drawWalls() {
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.rect(0, 0, w, 20);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.rect(0, 0, 20, h);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.rect(w - 20, 0, w, h);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.rect(0, h - 20, w, h);
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "brownsmoke";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  if (y < h - 40) {
    gravity += 0.02;
    y += gravity;
  }
  if (y > h - 45) {
    gravity = 0;
  }
  if (gravity || y > 550) {
    if (pressedLeft && x > 30 && moveLeft) {
      ballVx += ballAceleracion;
      x -= ballVx;
    } else if (pressedRight && x < w - 30 && moveRight) {
      ballVx += ballAceleracion;
      x += ballVx;
    } else {
      ballVx = 0;
    }
  }
}

/* KEY MAPS */
function handlerDown(e) {
  if (e.keyCode === 37) {
    pressedLeft = true;
  }
  if (e.keyCode === 39) {
    pressedRight = true;
  }
}

function handlerUp(e) {
  if (e.keyCode === 37) {
    pressedLeft = false;
  }
  if (e.keyCode === 39) {
    pressedRight = false;
  }
}

/* CALCULO DISTANCIA */
function calcDistant(p1x, p2x, p1y, p2y) {
  return parseInt(Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2)));
}

/* HORIZONTAL OBS */
class ObstH {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = Math.floor(Math.random() * (300 - 200 + 1) + 200);
    this.h = 5;
  }
  drawH() {
    ctx.beginPath();
    ctx.fillStyle = "#c24546";
    ctx.strokeStyle = "brown";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
  }
  moveH() {
    this.x += dx;
    for (i = 0; i < arrayObstH.length; i++) {
      if (i % 2 == 0) {
        arrayObstH[i].x -= dx;
      }
    }
    if (this.x + this.w > w - 20) {
      dx = -dx;
    }
    if (this.x < 20) {
      dx = -dx;
    }
  }
}

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var arrayObstH = [];

function createObsH() {
  var posObstY = 60;
  for (i = 0; i < 5; i++) {
    arrayObstH.push(new ObstH(randomPos(30, w - 350), posObstY));
    posObstY = arrayObstH[i].y;
    posObstY += 110;
    //debugger
  }
  console.log(arrayObstH[0]);
}

function drawObsH() {
  arrayObstH.forEach(obs => {
    obs.drawH();
  });
}

/* VERTICAL OBS */
class ObstV {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 3;
    this.h = Math.floor(Math.random() * (300 - 200 + 1) + 200);
  }
  drawV() {
    ctx.beginPath();
    ctx.fillStyle = "#c24546";
    ctx.strokeStyle = "brown";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
  }
  moveV() {
    this.y++;
  }
}

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var arrayObstV = [];

function createObsV() {
  var posObstX = 60;
  for (i = 0; i < 5; i++) {
    arrayObstV.push(new ObstV(posObstX, randomPos(100, 350)));
    posObstX = arrayObstV[i].x;
    posObstX += 120;
    console.log(arrayObstV[i]);
  }
}

function drawObsV() {
  arrayObstV.forEach(obs => {
    obs.drawV();
  });
}

/* BLACK HOLES */
class bHoles {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
  }
  drawBH() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "brownsmoke";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var arrayBlackH = [];

function createBHoles() {
  for (i = 0; i < 5; i++) {
    var arrayPosX = [120, 240, 360, 480];
    var numXaleatorio = parseInt(Math.random() * arrayPosX.length);
    var arrayPosY = [150, 260, 370, 480];
    var numYaleatorio = parseInt(Math.random() * arrayPosY.length);
    var posX = arrayPosX[numXaleatorio];
    var posY = arrayPosY[numYaleatorio];
    arrayBlackH.push(new bHoles(posX, posY));
  }
}

function drawBHoles() {
  arrayBlackH.forEach(hole => {
    hole.drawBH();
  });
}

/* GREEN HOLE */

class gHole {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 18;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
  }
  drawgHole() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle);
    ctx.fillStyle = "green";
    ctx.strokeStyle = "brownsmoke";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

var posHGX = createGHole(x)
var posHGY = 560
console.log(posHGX)
var green = new gHole(posHGX, posHGY)


function createGHole(x) {
  var arrayGreenH = [120, 240, 360, 480];
  var numXaleatorio = parseInt(Math.random() * arrayGreenH.length);
  var posX = arrayGreenH[numXaleatorio];
  return posX
}

console.log(green)


/* COLLISIONS */
function moveObsH() {
  arrayObstH.forEach(obstH => {
    obstH.moveH();
    collisionH(obstH.x, obstH.y, obstH.w, obstH.h);
  });
}

function moveObsV() {
  arrayObstV.forEach(obstV => {
    //obshV.move();
    collisionV(obstV.x, obstV.y, obstV.w, obstV.h);
  });
}

function collisionH(xObs, yObs, wObs, hObs) {
  if (xObs < x && x < xObs + wObs && y + 15 > yObs && y < yObs + hObs) {
    gravity = -0.2;

    isGravity = false;
    //cancelAnimationFrame(frameID);
    //gameOver();
  } else {
    y += gravity;
    isGravity = true;
  }
}

function collisionV(xObs, yObs, wObs, hObs) {
  if (x > xObs - 15 && x < xObs + wObs && y > yObs - 15 && y < yObs + hObs) {
    gravity = 0
    moveRight = false;
  } else if (x > xObs - 30) {
    moveRight = true;
  }
  if (x > xObs + wObs && y > yObs && y < yObs + hObs) {
    moveLeft = false;
  } else if (x > xObs - 100 + wObs) {
    moveLeft = true;
  }
}

/* COLLISION BALL AND HOLES */
function distantBall() {
  var p1x = parseInt(x);
  var p1y = parseInt(y);
  arrayBlackH.forEach(bHole => {
    var p2x = bHole.x;
    var p2y = bHole.y;
    var distancia = calcDistant(p1x, p2x, p1y, p2y);
    if (distancia < 20) {
      cancelAnimationFrame(frameID);
      gameOver();
    }


  });
  var distanciaToGreen = calcDistant(p1x, green.x, p1y, green.y)
  console.log(distanciaToGreen)
  if (distanciaToGreen < 50) {
    cancelAnimationFrame(frameID);
    arrayBlackH = []
    arrayObstH = []
    arrayObstV = []
    startGame();
  }
}

/* GAME OVER */
function gameOver() {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.rect(0, 0, w, h);
  ctx.fill();
  ctx.closePath();
  // createText();
  //createScore();
  //finalScore();
}