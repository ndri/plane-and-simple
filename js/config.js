const gravity = 0.5;
const minSpeed = -10;
const maxSpeed = 100;
const liftSpeed = 30;
const acceleration = 0.3; // How much throttle holding down W does (dynamic for controller with sticks)
const drag = 0.1; // How much the plane is slowed down if the throttle is at 0

const gameWidth = 800;
const gameHeight = 500;

const startX = 0;
const startY = 1;
const startZ = 0;

// (2*treeAmount)^2 trees will be created
const treeAmount = 10;
// (2*cloudAmount)^2 clouds will be created
const cloudAmount = 5;

