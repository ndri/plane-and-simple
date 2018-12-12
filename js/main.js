var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, ring, nextRing;
var noisefn = noise.simplex2;
var collidableMeshList = []; // all meshes that should be collidable

//var stats = new Stats();
//stats.showPanel(1);
//document.body.appendChild(stats.dom);

function onLoad() {
    var canvasContainer = document.getElementById("myCanvasContainer");
    var width = gameWidth;
    var height = gameHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x35bbff); // background colour

    canvasContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, width / height, 1, viewDistance);
    //camera.up = new THREE.Vector3(0, 1, 0);

    // environment.js
    [environment, water] = addEnvironment(noisefn);
    scene.add(environment);

    // plane.js
    plane = addPlane(camera);
    scene.add(plane);
    plane.position.set(startPosX, startPosY, startPosZ);
    plane.rotation.set(startRotX, startRotY, startRotZ);

    // ring.js
    ring = getRing(true);
    scene.add(ring);
    // nextRing = getRing(false);
    // scene.add(nextRing);

    draw();
}

function draw() {
    //stats.begin();

    let dt = clock.getDelta();
    //let time = clock.getElapsedTime();

    // controls.js
    parseControls(dt, camera);

    // plane.js
    movePlane(dt, speed);

    // e
    moveWater();

    // collision.js
    //detectCollisions(plane, collidableMeshList, handleCollision);
    // detecting when plane flies through ring
    //detectCollisions(plane.children[0], [ring.children[0]], handlePlaneThroughRing);

    // change the DOM elements
    document.getElementById("fps").innerHTML = round(1 / dt);
    document.getElementById("speed").innerHTML = round(speed);
    document.getElementById("score").innerHTML = score;
    document.getElementById("fallSpeed").innerHTML = round(fallSpeed);
    var pdir = plane.getWorldDirection(new THREE.Vector3(0, 1, 0));
    document.getElementById("planeDirection").innerHTML = round(pdir.x) + ", " + round(pdir.y) + ", " + round(pdir.z);
    document.getElementById("planeRotation").innerHTML = round(plane.rotation.x) + ", " + round(plane.rotation.y) + ", " + round(plane.rotation.z);
    document.getElementById("aileronPosition").innerHTML = round(aileronPosition);
    document.getElementById("elevatorPosition").innerHTML = round(elevatorPosition);
    document.getElementById("rudderPosition").innerHTML = round(rudderPosition);


    requestAnimationFrame(draw);
    renderer.render(scene, camera);

    //stats.end();
}

// Converts degrees to radians
function toRad(degree) {
    return Math.PI * 2 * degree / 360;
}

// Rounds float to 2 decimal places
function round(n) {
    return Math.round(n * 100) / 100;
}