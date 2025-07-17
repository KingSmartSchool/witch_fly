// 儲存與讀取最高分
let bestScore = localStorage.getItem('bestScore') || 0;

// 選取 DOM 元素
const gameArea = document.getElementById('gameArea');
const witch = document.getElementById('witch');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');

// 遊戲初始狀態
let witchY = 200;
let velocity = 0;
const gravity = 0.4;
const lift = -10;
let obstacles = [];
let score = 0;
let gameOver = false;

let witchX = 100;
let keys = {};

// 控制鍵盤按鍵
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (gameOver && e.code === 'Space') location.reload();
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// 生成障礙物（雲 or 閃電）
function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    if (score < 10) {
        let randomHeight = Math.random() * 40 + 40;
        let randomWidth = Math.random() * 40 + 60;
        let randomTop = Math.random() * (window.innerHeight - randomHeight);

        obstacle.style.width = randomWidth + 'px';
        obstacle.style.height = randomHeight + 'px';
        obstacle.style.left = (window.innerWidth + 100) + 'px';
        obstacle.style.top = randomTop + 'px';

        obstacle.dataset.type = 'cloud';
        obstacle.dataset.speed = (Math.random() * 2 + 4).toFixed(2);
        obstacle.style.backgroundImage = "url('cloud.png')";
        obstacle.style.backgroundSize = 'contain';
    } else {
        let lightningX = Math.random() * (window.innerWidth - 80);
        obstacle.style.width = '20px';
        obstacle.style.height = '100px';
        obstacle.style.left = lightningX + 'px';
        obstacle.style.top = '-100px';

        obstacle.dataset.type = 'lightning';
        obstacle.dataset.speed = (Math.random() * 3 + 6).toFixed(2);
        obstacle.style.backgroundImage = "url('lightning.png')";
        obstacle.style.backgroundSize = 'contain';
    }

    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

// 遊戲主迴圈
function update() {
    if (gameOver) return;

    if (keys['ArrowUp'] || keys['Space']) velocity = lift;
    if (keys['ArrowLeft']) witchX -= 5;
    if (keys['ArrowRight']) witchX += 5;

    velocity += gravity;
    witchY += velocity;

    // 邊界限制
    if (witchY > window.innerHeight - 50) witchY = window.innerHeight - 50;
    if (witchY < 0) witchY = 0;
    if (witchX < 0) witchX = 0;
    if (witchX > window.innerWidth - 50) witchX = window.innerWidth - 50;

    witch.style.top = witchY + 'px';
    witch.style.left = witchX + 'px';

    obstacles.forEach((obs, idx) => {
        let speed = parseFloat(obs.dataset.speed);
        let type = obs.dataset.type;

        if (type === 'cloud') {
            let x = parseFloat(obs.style.left);
            x -= speed;
            obs.style.left = x + 'px';

            if (x < -parseFloat(obs.style.width)) {
                gameArea.removeChild(obs);
                obstacles.splice(idx, 1);
                score++;
            }
        } else if (type === 'lightning') {
            let y = parseFloat(obs.style.top);
            y += speed;
            obs.style.top = y + 'px';

            if (y > window.innerHeight) {
                gameArea.removeChild(obs);
                obstacles.splice(idx, 1);
                score++;
            }
        }

        // 碰撞偵測
        const witchRect = witch.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if (!(witchRect.right < obsRect.left ||
            witchRect.left > obsRect.right ||
            witchRect.bottom < obsRect.top ||
            witchRect.top > obsRect.bottom)) {

            gameOver = true;
            gameOverText.style.display = 'block';

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
            }

            document.getElementById('finalScore').innerHTML = `
                Final Score: ${score}<br>
                Best Score: ${bestScore}
            `;
        }
    });

    scoreDisplay.textContent = `Score: ${score} | Best: ${bestScore}`;
    requestAnimationFrame(update);
}

// 隨機間隔生成障礙
function scheduleObstacle() {
    spawnObstacle();
    let delay = Math.random() * 800 + 1200;
    setTimeout(scheduleObstacle, delay);
}

// 開始遊戲
scheduleObstacle();
update();

// Restart 按鈕
document.getElementById('restartBtn').addEventListener('click', () => {
    location.reload();
});
