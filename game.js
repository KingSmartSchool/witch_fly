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

let difficultyTimer = 0;

let witchX = 100;
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (gameOver && e.code === 'Space') location.reload();
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});


// 🟡 產生障礙：根據分數不同，可能是雲朵或閃電
function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    // 雲 or 閃電
    if (score < 10) {
        // ☁️ 雲朵設定
        let randomHeight = Math.random() * 40 + 40;  // 40~80px
        let randomWidth = Math.random() * 40 + 60;   // 60~100px
        let randomTop = Math.random() * (window.innerHeight - randomHeight);

        obstacle.style.width = randomWidth + 'px';
        obstacle.style.height = randomHeight + 'px';
        obstacle.style.left = (window.innerWidth + 100) + 'px';
        obstacle.style.top = randomTop + 'px';

        obstacle.dataset.type = 'cloud';
        obstacle.dataset.speed = (Math.random() * 2 + 4).toFixed(2);  // 每個雲的速度不同
        obstacle.style.backgroundImage = "url('cloud.png')";
        obstacle.style.backgroundSize = 'contain';

    } else {
        // ⚡ 閃電設定
        let lightningX = Math.random() * (window.innerWidth - 80); // 避免出畫面
        obstacle.style.width = '20px';
        obstacle.style.height = '100px';
        obstacle.style.left = lightningX + 'px';
        obstacle.style.top = '-100px';

        obstacle.dataset.type = 'lightning';
        obstacle.dataset.speed = (Math.random() * 3 + 6).toFixed(2);  // 掉落速度
        obstacle.style.backgroundImage = "linear-gradient(yellow, orange)";
    }

    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function update() {
    if (gameOver) return;

    // 移動女巫
    velocity += gravity;
    witchY += velocity;
    if (witchY > window.innerHeight - 50) witchY = window.innerHeight - 50;
    if (witchY < 0) witchY = 0;
    witch.style.top = witchY + 'px';

    difficultyTimer += 1;

    // 移動障礙
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

        // 碰撞判斷
        const witchRect = witch.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if (!(witchRect.right < obsRect.left ||
              witchRect.left > obsRect.right ||
              witchRect.bottom < obsRect.top ||
              witchRect.top > obsRect.bottom)) {
            gameOver = true;
            gameOverText.style.display = 'block';
        }
    });

    scoreDisplay.textContent = 'Score: ' + score;
    requestAnimationFrame(update);
}

// 🎯 每 1.5 秒產生障礙
function scheduleObstacle() {
    spawnObstacle();
    let delay = Math.random() * 800 + 1200; // 1200 ~ 2000 毫秒隨機
    setTimeout(scheduleObstacle, delay);
}

scheduleObstacle(); // 開始第一次呼叫

update();
