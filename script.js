class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    const l = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= l;
    this.y /= l;
    return this;
  }
}

class Ball {
  constructor(c, r) {
    this.c = c;
    this.r = r;
    this.v = new Point(0, 0);
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.c.x, this.c.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  clicked(click) {
    const v = new Point(this.c.x - click.x, this.c.y - click.y);
    return (Math.sqrt(v.x * v.x + v.y * v.y) <= this.r);
  }
}

function clickedAt(click) {
  for (let i in balls) {
    if (balls[i].clicked(click)) {
        return i;
    }
  }
  return -1;
}

function drawBalls() {
  for (let b of balls) {
    b.draw();
  }
}

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, .05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (balls.length > 0) {
    drawBalls();
  }
}

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let balls = [];
let index = -1;
let move = false;

resizeCanvas();

canvas.addEventListener('mousedown', e => {
  const click = new Point(e.offsetX, e.offsetY);
  index = clickedAt(click);
  if (index === -1) {
    let b = new Ball(click, 10);
    balls.push(b);
    draw();
  } else {
    move = true;
  }
});

canvas.addEventListener('mousemove', e => {
  if (move) {
    const old = balls[index].c;
    balls[index].c = new Point(e.offsetX, e.offsetY);
    balls[index].v = new Point(e.offsetX - old.x, e.offsetY - old.y).normalize();
    draw();
  }
});

canvas.addEventListener('mouseup', e => {
  move = false;
  index = -1;
});

canvas.addEventListener('dblclick', e => {
  const click = new Point(e.offsetX, e.offsetY);
  index = clickedAt(click);
  if (index !== -1) {
      balls.splice(index, 1);
      draw();
  }
});

setInterval(() => {
  for (let i in balls) {
    if (i === index) continue;
    const pos = new Point(balls[i].c.x + balls[i].v.x, balls[i].c.y + balls[i].v.y);
    if (pos.x < 0 || pos.x > canvas.width) {
      balls[i].v.x *= -1;
    } if (pos.y < 0 || pos.y > canvas.height) {
      balls[i].v.y *= -1;
    }
    balls[i].c.x += balls[i].v.x * 5;
    balls[i].c.y += balls[i].v.y * 5;
  }
  draw();
}, 1000 / 30);
