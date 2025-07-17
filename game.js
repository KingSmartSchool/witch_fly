// 遊戲常量定義
const CONFIG = {
    WITCH: {
        INITIAL_Y: 50,
        GRAVITY: 0.4,
        JUMP_FORCE: -10
    },
    GAME: {
        SPEED: 5,
        SPEED_INCREASE: 0.5,
        OBSTACLE_INTERVAL: 1500
    }
};

class WitchGame {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.startGame();
    }

    initElements() {
        // DOM元素引用
        this.witch = document.getElementById('witch');
        this.gameContainer = document.getElementById('game-container');
        this.scoreDisplay = document.getElementById('score-display');
        // [其他元素引用...]
    }

    initEventListeners() {
        // 事件監聽器
        document.addEventListener('keydown', (e) => this.handleControls(e));
        this.restartBtn.addEventListener('click', () => this.resetGame());
    }

    // [其他遊戲方法保持不變...]
}

// 遊戲啟動
document.addEventListener('DOMContentLoaded', () => {
    new WitchGame();
});
