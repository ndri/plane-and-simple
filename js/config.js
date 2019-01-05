// Game
// const gameWidth = 800;
// const gameHeight = 500;
//TODO: better canvas size (current not responsive)
const gameWidth = document.documentElement.clientWidth - 20;
const gameHeight = document.documentElement.clientHeight - 200;


// World  TODO: doesn't work with some values. fix or value guide
const worldSize = 2000; // Side length of the square world
var meshSlices = 10;
var slices = 4; // powers of 2?
const viewDistance = 1800;
const treeAmount = 0.5; // 0=min, 1=max
const cloudAmount = 7; // (2*cloudAmount)^2 clouds will be created
const shadows = true;


// Plane
const startPosX = 0;
const startPosY = 300;
const startPosZ = 500;
const startRotX = Math.PI;
const startRotY = - Math.PI / 2;
const startRotZ = Math.PI;

const aileronPower = 100;
const elevatorPower = 100;
const rudderPower = 50;


// Keyboard controls
const acceleration = 0.3; // How much throttle holding down W does (dynamic for controller with sticks)
const maxAileronPosition = 0.8; // Aileron position limit for the keyboard (1.0 for controller)
const aileronSpeed = 0.05; // How fast the aileron moves to the limit per tick if the key is held down
const maxElevatorPosition = 0.8;
const elevatorSpeed = 0.05;
const maxRudderPosition = 0.8;
const rudderSpeed = 0.05;