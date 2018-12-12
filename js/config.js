// Game
// const gameWidth = 800;
const gameWidth = document.documentElement.clientWidth - 20;
// const gameHeight = 500;
const gameHeight = document.documentElement.clientHeight - 200;
//TODO: better canvas size (current not responsive)

// World
const worldSize = 3000; // Side length of the square world
const viewDistance = 2000;
const treeAmount = 10; // (2*treeAmount)^2 trees will be created
const cloudAmount = 5; // (2*cloudAmount)^2 clouds will be created

// Plane
const startPosX = -1500;
const startPosY = 0;
const startPosZ = -300;
const startRotX = Math.PI;
const startRotY = - Math.PI / 2;
const startRotZ = Math.PI;

const gravity = 0.5;
const minSpeed = -10;
const maxSpeed = 100;
const liftSpeed = 30;
const drag = 0.1; // How much the plane is slowed down if the throttle is at 0

// Keyboard controls
const acceleration = 0.3; // How much throttle holding down W does (dynamic for controller with sticks)
const maxAileronPosition = 0.8; // Aileron position limit for the keyboard (1.0 for controller)
const aileronSpeed = 0.05; // How fast the aileron moves to the limit per tick if the key is held down
const maxElevatorPosition = 0.8;
const elevatorSpeed = 0.05;
const maxRudderPosition = 0.8;
const rudderSpeed = 0.05;