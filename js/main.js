var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, ring, nextRing;
var world, physicsPlane, physicsGround; // cannonjs stuff

var noisefn = noise.simplex2;

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

    camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
    //camera.up = new THREE.Vector3(0, 1, 0);

    // creating the cannonjs world
    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.gravity.set(0, -15, 0);

    // environment.js
    environment = addEnvironment(noisefn);
    scene.add(environment);

    // plane.js
    plane = addPlane(camera);
    scene.add(plane);
    // setting the cannonjs plane position
    // the threejs plane's position will be set equal to this in the draw() function
    physicsPlane.position.set(-30, 90, 0);

    // ring.js
    ring = getRing(true);
    scene.add(ring);
    // nextRing = getRing(false);
    // scene.add(nextRing);

    draw();
}

function draw() {
    console.log(physicsPlane.velocity);
    //stats.begin();

    let dt = clock.getDelta();
    
    world.step(1 / 60); // TODO: is this correct?
    //let time = clock.getElapsedTime();

    // linking the threejs and cannonjs planes
    plane.position.copy(physicsPlane.position);
    physicsPlane.quaternion.toEuler(plane.rotation);

    // controls.js
    parseControlsTest(dt);

    // plane.js
    // movePlane(dt, speed);

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

// Rotates a matrix (anti-clock)
function rotateMatrix(matrix) {    
    const n = matrix.length;
    let res = []
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
         if (!res[j])
           res[j] = []
         res[j][i] = matrix[n-1-i][j];
      }
    }
    return res;
}