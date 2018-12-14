// Game
// const gameWidth = 800;
const gameWidth = document.documentElement.clientWidth - 20;
// const gameHeight = 500;
const gameHeight = document.documentElement.clientHeight - 200;
//TODO: better canvas size (current not responsive)

// World
const worldSize = 1600; // Side length of the square world
const viewDistance = 1000;
const treeAmount = 10; // (2*treeAmount)^2 trees will be created
const cloudAmount = 5; // (2*cloudAmount)^2 clouds will be created

// Plane
const startPosX = 0;
const startPosY = 500;
const startPosZ = 0;
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