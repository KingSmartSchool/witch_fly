const witch = document.getElementById('witch');
const obstacle = document.getElementById('obstacle');
let witchY = 200;
let velocity = 0;
const gravity = 0.5;
const lift = -10;

let obstacleX = window.innerWidth;
let obstacleY = Math.random() * (window.innerHeight - 50);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        velocity = lift;
    }
});

function update() {
    velocity += gravity;
    witchY += velocity;
    if (witchY > window.innerHeight - 30) witchY = window.innerHeight - 30;
    if (witchY < 0) witchY = 0;
    witch.style.top = witchY + 'px';

    obstacleX -= 5;
    if (obstacleX < -50) {
        obstacleX = window.innerWidth;
        obstacleY = Math.random() * (window.innerHeight - 50);
    }

    obstacle.style.left = obstacleX + 'px';
    obstacle.style.top = obstacleY + 'px';

    if (collisionCheck()) {
        alert('💀 Game Over');
        window.location.reload();
    }

    requestAnimationFrame(update);
}

function collisionCheck() {
    const witchRect = witch.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    return !(
        witchRect.right < obsRect.left ||
        witchRect.left > obsRect.right ||
        witchRect.bottom < obsRect.top ||
        witchRect.top > obsRect.bottom
    );
}

update();
