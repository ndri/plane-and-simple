// Game
const gameWidth = 800;
const gameHeight = 500;

// World
const worldSize = 1000; // Side length of the square world
const treeAmount = 10; // (2*treeAmount)^2 trees will be created
const cloudAmount = 5; // (2*cloudAmount)^2 clouds will be created

// Plane
const startX = 0;
const startY = 0;
const startZ = 93;
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