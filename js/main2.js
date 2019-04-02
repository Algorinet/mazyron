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
var wallY = 100;
var ballVx = 0;
var ballAceleracion = .01;
var gravity = 0.98;
var posObstY = 250;


window.onload = function () {
  setup();
};

function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");

  window.onresize = function () {
    setCanvasDimensions()
  }
  document.getElementById("start").addEventListener("click", startGame);
}


function setCanvasDimensions() {
  w = 600
  h = 600
  w2 = w / 2
  h2 = h / 2
  canvas.setAttribute("height", h);
  canvas.setAttribute("width", w);
}

function startGame() {
  document.querySelector("#start").style.display = "none"
  setCanvasDimensions();
  x = w2 + 50 / 2;
  y = 150;
  gameLoop();

}

function gameLoop() {
  frameID = requestAnimationFrame(gameLoop);
  ctx.save();
  drawBackground();
  drawGameBoard();


}

/* GAMEBOARD */
function drawBackground() {
  ctx.beginPath()
  ctx.fillStyle = "#e0b126"
  ctx.rect(0, 0, w, h)
  ctx.fill();
  ctx.closePath();
}

function drawGameBoard() {
  ctx.beginPath()
  ctx.fillStyle = "gray"
  ctx.lineWidth = "30";
  ctx.strokeStyle = "red";
  ctx.clearRect(wallX - 15, wallY - 10, w - 570, h - 170)
  ctx.rect(wallX, wallY, w - (wallX * 2), h - (wallY * 2))
  ctx.fill();
  ctx.closePath()
}