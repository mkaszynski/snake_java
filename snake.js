const canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let snake = [[20, 10]];

let direction = 1;
let fruit = [Math.floor(Math.random()*40), Math.floor(Math.random()*20)];

let length = 3;

let keys = {};
let mouse = { x: 0, y: 0, held: [false, false, false] };

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function draw_circle(x, y, radius, color) {
  ctx.fillStyle = color;        // color
  ctx.beginPath();              // start a new path
  ctx.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("touchstart", e => {
  let t = e.touches[0];
  mouse.x = t.clientX - canvas.getBoundingClientRect().left;
  mouse.y = t.clientY - canvas.getBoundingClientRect().top;
  mouse.held[0] = true;
  e.preventDefault();
});

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("touchmove", e => {
  let touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
  e.preventDefault();
});

canvas.addEventListener("touchend", e => {
  mouse.held[0] = false;
  e.preventDefault();
});

canvas.addEventListener("mousedown", e => mouse.held[e.button] = true);
canvas.addEventListener("mouseup", e => mouse.held[e.button] = false);


let time1 = 0;
let speed = 7;

let first_direction = direction;

let running = true;
function loop() {
  if (!running) return;

  time1 += 1;

  ctx.fillStyle = "rgb(0, 175, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (keys["a"] || mouse.held[0] || mouse.x) {
    let a = 1;
  }

  if (keys["a"] && !(first_direction === 2)) {
    direction = 4;
  }
  if (keys["d"] && !(first_direction === 4)) {
    direction = 2;
  }
  if (keys["s"] && !(first_direction === 3)) {
    direction = 1;
  }
  if (keys["w"] && !(first_direction === 1)) {
    direction = 3;
  }

  if (time1 % speed === 0) {
    cor_dir = [0, 1];
    if (direction === 2) {
      cor_dir = [1, 0];
    } else if (direction === 3) {
      cor_dir = [0, -1];
    } else if (direction === 4) {
      cor_dir = [-1, 0];
    }
    snake.push([snake[snake.length - 1][0] + cor_dir[0], snake[snake.length - 1][1] + cor_dir[1]]);
    first_direction = direction;
  }

  if (snake.length > length) {
    snake.splice(0, 1);
  }

  if (snake[snake.length - 1][0] === fruit[0] && snake[snake.length - 1][1] === fruit[1]) {
    fruit = [Math.floor(Math.random()*40), Math.floor(Math.random()*20)];
    length += 1;
  }

  if (!(0 <= snake[snake.length - 1][0] && snake[snake.length - 1][0] < 40) ||
    !(0 <= snake[snake.length - 1][1] && snake[snake.length - 1][1] < 20)) {
    running = false;
  }

  for (let i = 0; i < snake.length; i++) {
    if (snake.length - 1 != i) {
      if (snake[snake.length - 1][0] === snake[i][0] && snake[snake.length - 1][1] === snake[i][1]) {
        running = false;
      }
    }
  }

  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(fruit[0]*30, fruit[1]*30, 30, 30);

  for (let i of snake) {
    ctx.fillStyle = "rgb(0, 255, 0)";
    if (i[0] === snake[snake.length - 1][0] && i[1] === snake[snake.length - 1][1]) {
      ctx.fillRect(i[0]*30 - 2, i[1]*30 - 2, 34, 34);
    } else {
      ctx.fillRect(i[0]*30, i[1]*30, 30, 30);
    }
  };

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Score " + String(Math.floor(length - 3)), 0, 50);
  

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
