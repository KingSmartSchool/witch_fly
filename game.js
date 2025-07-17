let bestScore = localStorage.getItem('bestScore') || 0;

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

let witchX = 100;
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (gameOver && e.code === 'Space') location.reload();
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

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
        obstacle.style.backgroundImage = "linear-gradient(yellow, orange)";
    }

    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function update() {
    if (gameOver) return;

    if (keys['ArrowUp'] || keys['Space']) velocity = lift;
    if (keys['ArrowLeft']) witchX -= 5;
    if (keys['ArrowRight']) witchX += 5;

    velocity += gravity;
    witchY += velocity;

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

function scheduleObstacle() {
    spawnObstacle();
    let delay = Math.random() * 800 + 1200;
    setTimeout(scheduleObstacle, delay);
}

scheduleObstacle();
update();

document.getElementById('restartBtn').addEventListener('click', () => {
    location.reload();
});
