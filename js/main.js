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
var gravity = -0.8;
var posObstY = 250;
var img = new Image();
img.src = "./../textures/jaen-madera.png";
var moveRight = false;
var moveLeft = false;
var isGravity = true;
var vy = Math.random() * -10 - 5;

window.onload = function() {
  setup();
};

function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  document.onkeydown = handlerDown;
  document.onkeyup = handlerUp;
  window.onresize = function() {
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
  document.querySelector("#start").style.display = "none";
  document.querySelector("#puntuacion").style.display = "block";
  setCanvasDimensions();

  x = w2;
  y = h2 / 8;
  gameLoop();
  createObsH();
  createObsV();
}

function gameLoop() {
  frameID = requestAnimationFrame(gameLoop);
  ctx.save();
  drawBackground();
  drawWalls();
  drawBall();
  moveBall();
  ctx.closePath();
  drawObsH();
  drawObsV();
  moveObsH();
  moveObsV();
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
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "brownsmoke";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  if (y < h - 30) {
    gravity = gravity += 0.02;
    y += gravity;
    console.log(y);
  }
  if (gravity < 0.8 || y > 570) {
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
  move() {
    this.y;
  }
}

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var arrayObstH = [];

function createObsH() {
  var posObstY = 60;
  for (i = 0; i < 7; i++) {
    arrayObstH.push(new ObstH(randomPos(0, w - 350), posObstY));
    posObstY = arrayObstH[i].y;
    posObstY += 80;
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
}

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var arrayObstV = [];

function createObsV() {
  var posObstX = 60;
  for (i = 0; i < 6; i++) {
    arrayObstV.push(new ObstV(posObstX, randomPos(0, 350)));
    posObstX = arrayObstV[i].x;
    posObstX += 95;
    //debugger
    console.log(arrayObstV[i]);
  }
}

function drawObsV() {
  arrayObstV.forEach(obs => {
    obs.drawV();
  });
}

/* COLLISIONS */
function moveObsH() {
  arrayObstH.forEach(obstH => {
    //obsH.move()
    collisionH(obstH.x, obstH.y, obstH.w, obstH.h);
  });
}
function moveObsV() {
  arrayObstV.forEach(obstV => {
    //obshV.move()
    collisionV(obstV.x, obstV.y, obstV.w, obstV.h);
  });
}

function collisionH(xObs, yObs, wObs, hObs) {
  if (xObs < x && x < xObs + wObs && y + 15 > yObs && y < yObs + hObs) {
    gravity = -0.2;
    y += gravity;
    isGravity = false;
    //cancelAnimationFrame(frameID);
    //gameOver();
  } else {
    isGravity = true;
  }
}

function collisionV(xObs, yObs, wObs, hObs) {
  if (x > xObs - 15 && x < xObs + wObs && y > yObs && y < yObs + hObs) {
    moveRight = false;
  } else if (x > xObs - 30) {
    moveRight = true;
  }
  if (x > xObs + wObs && y > yObs && y < yObs + hObs) {
    moveLeft = false;
  } else if (x > xObs - 80 + wObs) {
    moveLeft = true;
  }
}
