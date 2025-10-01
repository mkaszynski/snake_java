const canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let last = performance.now();

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

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
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

let start = false;

let running = true;

function mouse_snake_direction1(direction, mousem, snakem) {
  let correct = false;
  if (mousem[0]/2 < mousem[1] && 560 - mousem[0]/2 < mousem[1] && direction === 1) {
    correct = true;
  } else if (mousem[0]/2 > mousem[1] && 560 - mousem[0]/2 < mousem[1] && direction === 2) {
    correct = true;
  } else if (mousem[0]/2 < 560 - mousem[1] && 560 - mousem[0]/2 < 560 - mousem[1] && direction === 3) {
    correct = true;
  } else if (560 - mousem[0]/2 > mousem[1] && mousem[0]/2 < mousem[1] && direction === 4) {
    correct = true;
  }
  if (!mousem[2]) {
    correct = false;
  }
  return correct;
}

function mouse_snake_direction(direction, mousem, snakem) {
  let correct = false;
  if (980 > mousem[0] && mousem[0] > 800 && 580 > mousem[1] && mousem[1] > 400 && direction === 1) {
    correct = true;
  }
  if (1180 > mousem[0] && mousem[0] > 1000 && 580 > mousem[1] && mousem[1] > 400 && direction === 2) {
    correct = true;
  }
  if (980 > mousem[0] && mousem[0] > 800 && 380 > mousem[1] && mousem[1] > 200 && direction === 3) {
    correct = true;
  }
  if (780 > mousem[0] && mousem[0] > 600 && 580 > mousem[1] && mousem[1] > 400 && direction === 4) {
    correct = true;
  }
  if (!mousem[2]) {
    correct = false;
  }
  return correct;
}

let dt_now = 0.016;

function loop() {
  if (!running) return;

  let now = performance.now();
  let dt = (now - last) / 1000; // seconds since last frame
  last = now;

  if (dt > 1) dt = 1/60;

  if (time1 < 10) dt_now = dt;

  time1 += 1;

  ctx.fillStyle = "rgb(0, 175, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let snake_head = [snake[snake.length - 1][0], snake[snake.length - 1][1]];

  if ((keys["a"] || mouse_snake_direction(4, [mouse.x, mouse.y, mouse.held[0]], snake_head)) && !(first_direction === 2)) {
    direction = 4;
  }
  if ((keys["d"] || mouse_snake_direction(2, [mouse.x, mouse.y, mouse.held[0]], snake_head)) && !(first_direction === 4)) {
    direction = 2;
  }
  if ((keys["s"] || mouse_snake_direction(1, [mouse.x, mouse.y, mouse.held[0]], snake_head)) && !(first_direction === 3)) {
    direction = 1;
  }
  if ((keys["w"] || mouse_snake_direction(3, [mouse.x, mouse.y, mouse.held[0]], snake_head)) && !(first_direction === 1)) {
    direction = 3;
  }

  if (time1 % Math.floor(speed/dt_now/60) === 0) {
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
      start = true;
      time1 = 0;
  }

  for (let i = 0; i < snake.length; i++) {
    if (snake.length - 1 != i) {
      if (snake[snake.length - 1][0] === snake[i][0] && snake[snake.length - 1][1] === snake[i][1]) {
        start = true;
        time1 = 0;
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
    if (i[0] === fruit[0] && i[1] === fruit[1]) {
        fruit = [Math.floor(Math.random()*40), Math.floor(Math.random()*20)];
    }
  };

  if (isMobile()) {
    ctx.fillStyle = "rgba(0, 200, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(800, 400, 180, 180);

    ctx.fillStyle = "rgba(0, 200, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(1000, 400, 180, 180);

    ctx.fillStyle = "rgba(0, 200, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(800, 200, 180, 180);

    ctx.fillStyle = "rgba(0, 200, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(600, 400, 180, 180);
  }

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Score " + String(Math.floor(length - 3)), 0, 50);

  if (start) {
    ctx.fillStyle = "rgb(0, 175, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";          // text color
    ctx.font = "60px Arial";          // font size and family
    ctx.fillText("You died!", 450, 300);

    ctx.fillStyle = "white";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("Score " + String(Math.floor(length - 3)), 0, 50);


    snake = [[20, 10]];

    direction = 1;
    fruit = [Math.floor(Math.random()*40), Math.floor(Math.random()*20)];

    first_direction = direction;

    if (time1 >= 100/dt/60) {
      start = false;
      length = 3;
    }

  }
  
  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
