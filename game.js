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

let obstacleSpeed = 5;   // 【新增】一開始障礙速度
let difficultyTimer = 0; // 【新增】累積時間調整難度

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) velocity = lift;
    if (e.code === 'Space' && gameOver) location.reload();
});

function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = '100vw';
    obstacle.style.top = Math.random() * (window.innerHeight - 100) + 'px';
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

    difficultyTimer += 1;  // 【新增】累積 frame 數
    if (difficultyTimer % 300 === 0) {  // 【新增】每 300 幀提升一次速度（大約 5 秒）
        obstacleSpeed += 0.5;
    }

    obstacles.forEach((obs, idx) => {
        let x = parseFloat(obs.style.left);
        x -= obstacleSpeed; // 【變更】用變速變數
        obs.style.left = x + 'px';

        const witchRect = witch.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if (!(witchRect.right < obsRect.left ||
              witchRect.left > obsRect.right ||
              witchRect.bottom < obsRect.top ||
              witchRect.top > obsRect.bottom)) {
            gameOver = true;
            gameOverText.style.display = 'block';
        }
        if (x < -100) {
            gameArea.removeChild(obs);
            obstacles.splice(idx, 1);
            score += 1;
        }
    });

    scoreDisplay.textContent = 'Score: ' + score;
    requestAnimationFrame(update);
}

setInterval(spawnObstacle, 1500);
update();
