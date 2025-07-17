const gameArea = document.getElementById('gameArea');
const witch = document.getElementById('witch');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');

let witchY = 200;
let velocity = 0;
const gravity = 0.4;
const lift = -10;
let obstacles = [];
let score = 0;
let gameOver = false;

let baseSpeed = 5;
let difficultyTimer = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) velocity = lift;
    if (e.code === 'Space' && gameOver) location.reload();
});

function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    // 隨機大小
    const width = 40 + Math.random() * 80;
    obstacle.style.width = width + 'px';
    obstacle.style.height = (width * 0.6) + 'px';

    // 雲：左右移動， 閃電：直落
    let isLightning = score >= 10 && Math.random() < 0.5;
    if (isLightning) {
        obstacle.style.background = 'yellow';
        obstacle.style.height = '80px';
        obstacle.style.width = '20px';
        obstacle.style.background = 'linear-gradient(white, yellow)';
        obstacle.dataset.type = 'lightning';
        obstacle.style.left = (Math.random() * (window.innerWidth - 50)) + 'px';
        obstacle.style.top = '-100px';
    } else {
        obstacle.style.background = 'url(images/cloud.png) no-repeat center/contain';
        obstacle.style.left = '100vw';
        obstacle.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        obstacle.dataset.speed = (baseSpeed + Math.random() * 3).toFixed(1);
        obstacle.dataset.type = 'cloud';
    }

    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function update() {
    if (gameOver) return;

    velocity += gravity;
    witchY += velocity;
    if (witchY > window.innerHeight - 50) witchY = window.innerHeight - 50;
    if (witchY < 0) witchY = 0;
    witch.style.top = witchY + 'px';

    difficultyTimer += 1;
    if (difficultyTimer % 300 === 0) {
        baseSpeed += 0.5;
