/*  these are the variables that controll game dificulty
and few other options such as music and pictures
*/


const BULLET_RADIUS = 4;

const ENEMY_RADIUS = 30;

const BULLET_SPEED = 10;

const ENNEMY_INITIAL_SPEED = 3;

const MAX_BULLETS = 5; // number of bullets that can exist at the same time

const INITIAL_SCORE = 10; //how much score you get for each kill in the begining

const ENEMY_SPOWN = 0.98; //when rand() > ENEMY_SPOWN enemy will spown



// images and music used for game
const BG_IMG = new Image();
BG_IMG.src = "./images/bg1.jpg";


const MUSIC = new Audio(); //music used as backgroud song
MUSIC.src = './sounds/music.mp3';

const SHOOTIN_MUSIC = new Audio(); //music played when shooting
SHOOTIN_MUSIC.src = "./sounds/shoot.mp3";

const LOSE_AUDIO = new Audio(); //music played when lost
LOSE_AUDIO.src = "./sounds/lose.mp3";