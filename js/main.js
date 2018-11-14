var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, loop;
var collidableMeshList = []; // all meshes that should be collidable

var speed = 0;
var fallSpeed = 0;

const gravity = 5;
const minSpeed = -10.0; // TODO: reversing (have to change physics)
const maxSpeed = 150.0;
const liftSpeed = 30.0;
const acceleration = 0.3;
const drag = 0.1;

function onLoad() {
    var canvasContainer = document.getElementById("myCanvasContainer");
    var width = 800;
    var height = 500;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x35bbff); // background colour

    canvasContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
    camera.up = new THREE.Vector3(0, 1, 0);

    // environment.js
    environment = drawEnvironment();
    scene.add(environment);

    // plane.js
    plane = addPlane(camera);
    scene.add(plane);
    plane.position.set(30, 1, 350);

    // loop.js
    // this is for testing; can be removed from here if necessary
    loop = drawLoop(true);
    scene.add(loop);
    loop.position.set(30, 30, 290);

    draw();
}

function draw() {
    let dt = clock.getDelta();
    //let time = clock.getElapsedTime();

    // controls.js
    parseControls(dt, camera);

    // plane.js
    movePlane(dt, speed);

    // collision.js
    detectCollisions(plane, collidableMeshList, () => console.log("collision"));
    // detecting when plane flies through loop
    detectCollisions(plane.children[1], [loop.children[0]], () => console.log("plane through loop")); 

    // change the DOM elements
    document.getElementById("fps").innerHTML = Math.round(1 / dt * 100) / 100 ;
    document.getElementById("speed").innerHTML = Math.round(speed * 100) / 100;
    document.getElementById("fallSpeed").innerHTML = Math.round(fallSpeed * 100) / 100;

    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

/**
 * Converts degrees to radians
 */
function toRad(degree) {
    return Math.PI * 2 * degree / 360;
}