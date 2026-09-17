 let canvas = document.getElementById("gameCanvas");

let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let enemyImage = new Image();
enemyImage.src = "enemy copy.png";

let shooterImage = new Image();
shooterImage.src = "shooter copy.png";

let player = {
    x: 350,
    y: 440,
    width: 100,
    height: 70,
    speed: 7
};

let bullets = [];
let enemies = [];

let score = 0;
let lives = 3;

let gameRunning = false;

let keys = {};
 

let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").textContent = highScore;

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {
        event.preventDefault();
        shoot();
        return;
    }

    keys[event.key] = true;

});

document.addEventListener("keyup", function(event) {

    keys[event.key] = false;

});

function movePlayer() {

    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    let leftBtn= document.getElementById("leftBtn");
    let rightBtn= document.getElementById("rightBtn");
    let Shoot = document.getElementById("Shoot");

    leftBtn.addEventListener("touchstart" ,function(e){
        e.preventDefault();
        player.x -=player.speed;
    })

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

}

 

function drawPlayer() {

    ctx.drawImage(
        shooterImage,
        player.x,
        player.y,
        player.width,
        player.height
    );

}

function shoot() {

    if (!gameRunning) {
        return;
    }

    let bullet = {
        x: player.x + player.width / 2 - 4,
        y: player.y,
        width: 8,
        height: 20,
        speed: 10
    };

    bullets.push(bullet);

}

function drawBullets() {

    ctx.fillStyle = "yellow";

    for (let i = bullets.length - 1; i >= 0; i--) {

        let bullet = bullets[i];

        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }

    }

}

function createEnemy() {

    if (!gameRunning) {
        return;
    }

    let enemy = {
        x: Math.random() * (canvas.width - 70),
        y: -60,
        width: 70,
        height: 50,
        image: enemyImage,
        speed: Math.random() * 3
    };

    enemies.push(enemy);

}

setInterval(function() {
    createEnemy();
}, 1000);

function drawEnemies() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        let enemy = enemies[i];

        ctx.drawImage(
            enemy.image,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

        enemy.y += enemy.speed;

        if (enemy.y > canvas.height) {

            enemies.splice(i, 1);

            lives--;

            document.getElementById("lives").textContent = lives;

            if (lives <= 0) {
                gameOver();
            }

        }

    }

}

function checkCollision(bullet, enemy) {

    return (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    );

}

function checkBulletCollision() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        for (let j = enemies.length - 1; j >= 0; j--) {

            if (checkCollision(bullets[i], enemies[j])) {

                bullets.splice(i, 1);
                enemies.splice(j, 1);

                score += 10;

                document.getElementById("score").textContent = score;

                break;

            }

        }

    }

}

function checkPlayerCollision() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        if (checkCollision(player, enemies[i])) {

            enemies.splice(i, 1);

            lives--;

            document.getElementById("lives").textContent = lives;

            if (lives <= 0) {
                gameOver();
            }

        }

    }

}

function clearScreen() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

function gameOver() {

    gameRunning = false;

    clearScreen();

    ctx.fillStyle = "white";

    ctx.font = "50px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        230
    );

    ctx.font = "25px Arial";

    ctx.fillText(
        "Score: " + score,
        canvas.width / 2,
        280
    );

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        document.getElementById("highScore").textContent = highScore;

    }

    document.getElementById("startBtn").textContent = "Restart Game";

}

function gameLoop() {

    if (!gameRunning) {
        return;
    }
     
   clearScreen();

    movePlayer();

    drawPlayer();

    drawBullets();

    drawEnemies();

    checkBulletCollision();

    checkPlayerCollision();

    requestAnimationFrame(gameLoop);

}

document.getElementById("startBtn").addEventListener(
    "click",
    function() {

        score = 0;

        lives = 3;

        bullets = [];

        enemies = [];

        player.x = 350;

        gameRunning = true;

        document.getElementById("score").textContent = score;

        document.getElementById("lives").textContent = lives;

        this.textContent = "Restart Game";
       
        

        gameLoop();

    }
);