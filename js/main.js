var renderer, scene, camera, listener;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, ring, nextRing, heightfieldMatrix, light, water;
var world, physicsPlane, physicsGround; // cannonjs stuff

var prevRingTime;
var propellerspeed = 0;
var noisefn = noise.simplex2;

let gameState;

function loadGame() {
    updateLoading(5, "Setting up Three.js");

    renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});
    renderer.setClearColor(0x35bbff); // background colour
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, 1337, 1, config.world.viewDistance);

    updateLoading(10, "Setting up Cannon.js");

    // creating the cannonjs world
    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.gravity.set(0, config.world.gravityConstant, 0);

    updateLoading(15, "Making plane");

    // plane.js
    plane = addPlane(camera);
    scene.add(plane);
    // setting the cannonjs plane position
    // the threejs plane's position will be set equal to this in the draw() function
    physicsPlane.position.set(config.plane.startPosX, config.plane.startPosY, config.plane.startPosZ);
    plane.position.set(config.plane.startPosX, config.plane.startPosY, config.plane.startPosZ);
    //plane.rotation.set(startRotX, startRotY, startRotZ);

    updateLoading(25, "Making environment");

    // environment.js
    if (config.world.randomSeed) {
        config.world.seed = Math.random();
    }
    console.log("Seed: " + config.world.seed);
    noise.seed(config.world.seed);
    [environment, water, heightfieldMatrix] = addEnvironment(noisefn);
    scene.add(environment);

    updateLoading(95, "Making rings");

    // ring.js
    ring = getRing(true);
    scene.add(ring);
    prevRingTime = Date.now();
    ring.position.copy(ringDetector.position);
    nextRing = getRing(false);
    nextRing.position.set(-10, 410, -110);
    scene.add(nextRing);

    updateLoading(100, "Done");
    gameState = gameStates.playing;
    draw();
}

function draw() {

    let dt = clock.getDelta();
    world.step(dt);

    // linking the threejs and cannonjs planes
    plane.position.copy(physicsPlane.position);
    plane.quaternion.copy(physicsPlane.quaternion);

    // controls.js
    parseControls();

    // plane.js
    movePlane(dt);
    //movePlane(dt, speed);

    // detecting when plane flies through loop
    ringDetector.addEventListener('collide', function () {
        if (Date.now() - prevRingTime > 100) {
            handlePlaneThroughRing();
        }
    });

    moveWaterAndLight();

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
    document.getElementById("throttle").innerHTML = round(throttle);

    resizeCanvasToDisplaySize();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}

// https://stackoverflow.com/a/45046955
function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// Converts degrees to radians
function toRad(degree) {
    return Math.PI * 2 * degree / 360;
}

// Rounds float to 2 decimal places
function round(n) {
    return Math.round(n * 100) / 100;
}

// Rotates a matrix (anti-clock)
function rotateMatrix(matrix) {
    const n = matrix.length;
    let res = [];
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (!res[j])
                res[j] = [];
            res[j][i] = matrix[n - 1 - i][j];
        }
    }
    return res;
}