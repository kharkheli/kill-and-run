

const can = document.getElementById("run");
can.setAttribute('width', window.innerWidth);
can.setAttribute('height', window.innerHeight);
const ctx = can.getContext("2d");
ctx.lineWidth = 2;




// declaring game variables

var bodyIcon = new Image();

var enemyIcon = new Image();

let pause;

let enemy_speed;

let gameOver;

let bullets;


let enemies;

let combo;

let score;


let scoreGet;

let killed;





let body;

//this is a function that assigns game variables and start game
//when the game is over and play agains is pressed this function is called to reset game variables and start game again
function gameStart(){
    body = {
        radius: 15,
        x: can.width / 2,
        y: can.height / 2,
        speed: 5
    }
    pause = false;
    enemy_speed =  ENNEMY_INITIAL_SPEED;
    gameOver = false;
    bullets = [];
    enemies = [];
    combo = 0;
    score = 0;
    scoreGet = INITIAL_SCORE;
    killed = 0;
    loop();
}


//this is the main game loop that calls the necesary functions to keep game oing and stops when game is over or paused
function loop() {

    ctx.drawImage(BG_IMG, 0, 0, width = can.width, height = can.height);

    update()

    draw();

    if (pause){
        return;
    }

    if (gameOver){
        
        ctx.fillStyle = "white";
        ctx.font = '50px one';
        ctx.fillText('GAME OVER', can.width/2-50, can.height/2);
        MUSIC.pause();
        LOSE_AUDIO.play();
        gameOver = false;
        document.getElementById('playAgain').style.display = 'block';
        return;
    }

    requestAnimationFrame(loop);
}
// window.onload = function () {
//     MUSIC.play();
//     gameStart();
// }

function draw() {


    drawBody();

    enemies.forEach(drawEnemy);

    bullets.forEach(drawBullets);

    drawStats();

}

function update() {
    moveBody();

    createEnemy();
    
    bullets.forEach(moveBullets);

    enemies.forEach(moveEnemy);

    enemies.forEach(hitEnemy);

}

function drawBody() {
    ctx.beginPath();

    //drawing canvas circle of body
    ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill()

    //drawing selected image of body at the possition of body
    ctx.drawImage(bodyIcon, body.x-body.radius, body.y-body.radius, width=2*body.radius, height=2*body.radius);

    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.closePath();
}

//initially body doesn't move
var movement = {
    Left: false,
    Right: false,
    Up: false,
    Down: false
}

//check for key presses so body should move to the dirrection
document.addEventListener("keydown", function(event) {
    if (event.key == 'a') {
        movement.Left = true;
    }
    else if (event.key == 'd') {
        movement.Right = true;
    }
    if (event.key == 'w') {
        movement.Up = true;
    }
    else if (event.key == 's') {
        movement.Down = true;
    }
})

// keyups so body should no longer move to the dirreection
document.addEventListener("keyup", function (event) {
    if (event.key == 'a') {
        movement.Left = false;
    }
    else if (event.key == 'd') {
        movement.Right = false;
    }
    if (event.key == 'w') {
        movement.Up = false;
    }
    else if (event.key == 's') {
        movement.Down = false;
    }
})

function moveBody() {
    if (movement.Left && movement.Up) {
        //when body moves diagonaly speed splits on 2 axes but module stays same
        body.x -= body.speed/Math.sqrt(2);
        body.y -=  body.speed/Math.sqrt(2);
    }
    else if (movement.Left && movement.Down) {
        body.x -=  body.speed/Math.sqrt(2);
        body.y +=  body.speed/Math.sqrt(2);
    }
    else if (movement.Right && movement.Down) {
        body.x +=  body.speed/Math.sqrt(2);
        body.y +=  body.speed/Math.sqrt(2);
    }
    else if (movement.Right && movement.Up) {
        body.x +=  body.speed/Math.sqrt(2);
        body.y -=  body.speed/Math.sqrt(2);
    }
    else if (movement.Right) {
        body.x += body.speed;
    }
    else if (movement.Down) {
        body.y += body.speed;
    }
    else if (movement.Up) {
        body.y -= body.speed;
    }
    else if (movement.Left) {
        body.x -= body.speed;
    }
    if (body.x - body.radius < 0) {
        body.x = body.radius;
    }
    if (body.y - body.radius < 0) {
        body.y = body.radius;
    }
    if (body.x + body.radius > can.width) {
        body.x = can.width - body.radius;
    }
    if (body.y + body.radius > can.height) {
        body.y = can.height - body.radius;
    }

}

can.addEventListener('click', function (event) {
    if (bullets.length >= MAX_BULLETS){
        //checking if player has already have max number of active bullets
        return;
    }
    SHOOTIN_MUSIC.play();
    let x = event.clientX;
    let y = event.clientY;
    let alpha = Math.atan((x - body.x) / (y - body.y));
    //detecting current location of bullet and calculating dx and dy and adding it to bullets list
    // bullet speed is always the same
    if (y > body.y) {
        bullets.push({ x: body.x, y: body.y, dx: BULLET_SPEED * Math.sin(alpha), dy: BULLET_SPEED * Math.cos(alpha) });
    }
    else {
        bullets.push({ x: body.x, y: body.y, dx: -BULLET_SPEED * Math.sin(alpha), dy: -BULLET_SPEED * Math.cos(alpha) });
    }
})

function moveBullets(bullet) {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
}

function drawBullets(bullet) {
    ctx.beginPath();
    if (bullet.x < 0 || bullet.x > can.width || bullet.y < 0 || bullet.y > can.height) {
        let index = bullets.indexOf(bullet);
        bullets.splice(index, 1);
        combo = 0;
        return;
    }

    ctx.arc(bullet.x, bullet.y, BULLET_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill()

    ctx.strokeStyle = 'blue';
    ctx.stroke();

    ctx.closePath();
}


function drawStats() {
    ctx.fillStyle = "black";
    ctx.font = '30px one';
    ctx.fillText('Score '+score, 40, 40);
    ctx.fillText('Combo X'+combo, 350, 40);
    ctx.fillText('Killed '+killed, 600, 40);
}




function createEnemy() {
    //enemy spawns randomly when random number is grater than ENEMY_SPAWN
    if (Math.random() > ENEMY_SPOWN) {
        //after enemy spawn has confirmed enemy possition is also randomly calculated
        //this calculation is same as getting random number in range of perimeter and realising enemy from the randomly generated point
        let pos = Math.random() * 2 * (can.width + can.height) - (can.width + can.height);
        if (pos > 0 && pos < can.width) {
            enemies.push({x: Math.random() * can.width, y: 0});
        }
        else if (pos > 0) {
            enemies.push({x: 0, y: Math.random() * can.height});
        }
        else if (pos < 0 && pos > -can.width) {
            enemies.push({x: Math.random() * can.width, y: can.height});
        }
        else {
            enemies.push({x: can.width, y: Math.random() * can.height});
        }
    }
}

function drawEnemy(enemy){
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, ENEMY_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill()

    //drawing selected image at the position of image
    ctx.drawImage(enemyIcon, enemy.x-ENEMY_RADIUS, enemy.y-ENEMY_RADIUS, width=2*ENEMY_RADIUS, height=2*ENEMY_RADIUS);


    ctx.strokeStyle = 'green';
    ctx.stroke();

    ctx.closePath();
}

function moveEnemy(enemy){
    let alpha = Math.atan((enemy.x - body.x) / (enemy.y - body.y));
    //enemy olways moves toward the body with the best possible way and it speed never changes
    if (enemy.y >= body.y) {
        enemy.x -= enemy_speed * Math.sin(alpha);
        enemy.y -= enemy_speed* Math.cos(alpha);
    }
    else {
        enemy.x += enemy_speed * Math.sin(alpha);
        enemy.y += enemy_speed * Math.cos(alpha);
    }
}

function hitEnemy(enemy){
    enemy_speed = ENNEMY_INITIAL_SPEED + 0.5*  parseInt(killed/30);
    scoreGet = INITIAL_SCORE + parseInt(killed/30)*10;
    scoreGet = scoreGet * (parseInt(combo/10) + 1);
    for (let i = 0; i < bullets.length; i ++){
        bullet = bullets[i];
        // checking enemy collision for every bullet
        if (colide(enemy.x, enemy.y, bullet.x, bullet.y, BULLET_RADIUS+ENEMY_RADIUS)){
            let index = enemies.indexOf(enemy);
            //if colision hapens deleting bullet and enemy that colided
            enemies.splice(index, 1);
            let index1 = bullets.indexOf(bullet);
            bullets.splice(index1, 1);
            combo += 1;
            score += scoreGet;
            killed += 1;
        }
    }
    //detecting body collision with enemy
    if (colide(enemy.x, enemy.y, body.x, body.y, body.radius+ENEMY_RADIUS)){
        gameOver = true;
    }
}

//checking colisions, if distance between two circle is less than distance between their centers they colided and return true
function colide(x1, y1, x2, y2, r){
    let a2 = Math.pow(x1 - x2, 2);
    let b2 = Math.pow(y1 - y2, 2);
    let d = Math.sqrt(a2 + b2);
    if (d < r){
        return true;
    }
    else{
        return false;
    }
}



let play = document.getElementById('play'); //play button that will pop up only when game is paused

play.addEventListener('click', function(){ 
    pause=false
    play.parentElement.style.display = 'none';
    requestAnimationFrame(loop);
});

let pausebut = document.getElementById('pause'); //pause button

pausebut.addEventListener('click', function(){
    pause=true;
    play.parentElement.style.display = 'block';

});


//info button events
let info = document.getElementById('info');

info.addEventListener('click', function(){
    pause=true;
    document.getElementById('infoContainer').style.display = 'block';
});


let outClick = document.getElementById('outClick');

outClick.addEventListener('click', function(){
    document.getElementById('infoContainer').style.display = 'none';
    pause = false;
    requestAnimationFrame(loop);
});

let close = document.getElementById('close');

close.addEventListener('click', function(){
    document.getElementById('infoContainer').style.display = 'none';
    pause = false;
    requestAnimationFrame(loop);
});

document.getElementById('playAgain').addEventListener('click', function(){
    this.style.display = 'none';
    gameStart();
});


//getting result of forms and setting variables to proper images
document.getElementById('startGame').addEventListener('click', function(){
    document.getElementById('beforegame').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    let bIcon = document.forms['bodyIcon']['body'].value;
    bodyIcon.src = './images/' + bIcon + '.png';
    let eIcon = document.forms['bodyIcon']['enemy'].value;
    enemyIcon.src = './images/' + eIcon + '.png';
    MUSIC.play();
    gameStart();
});












