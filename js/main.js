var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, ring, nextRing;
var collidableMeshList = []; // all meshes that should be collidable

var speed = 0;
var fallSpeed = 0;
var throttle = 0;

function onLoad() {
    var canvasContainer = document.getElementById("myCanvasContainer");
    var width = gameWidth;
    var height = gameHeight;

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
    plane.position.set(startX, startY, startZ);

    // ring.js
    ring = getRing(true);
    scene.add(ring);
    nextRing = getRing(false);
    scene.add(nextRing);

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
    detectCollisions(plane, collidableMeshList, handleCollision);
    // detecting when plane flies through ring
    detectCollisions(plane.children[0], [ring.children[0]], handlePlaneThroughRing); 

    // change the DOM elements
    document.getElementById("fps").innerHTML = round(1 / dt);
    document.getElementById("speed").innerHTML = round(speed);
    document.getElementById("fallSpeed").innerHTML = round(fallSpeed);
    //var pdir = plane.getWorldDirection(new THREE.Vector3(0, 1, 0));
    //document.getElementById("planeDirection").innerHTML = round(pdir.x) + ", " + round(pdir.y) + ", " + round(pdir.z);
    document.getElementById("planeRotation").innerHTML = round(plane.rotation.x) + ", " + round(plane.rotation.y) + ", " + round(plane.rotation.z);



    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

// Converts degrees to radians
function toRad(degree) {
    return Math.PI * 2 * degree / 360;
}

// Rounds float to 2 decimal places
function round(n) {
    return Math.round(n * 100) / 100;
}