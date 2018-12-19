var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment, ring, nextRing, heightfieldMatrix, light;
var world, physicsPlane, physicsGround; // cannonjs stuff

var prevRingTime;

var noisefn = noise.simplex2;

//var stats = new Stats();
//stats.showPanel(1);
//document.body.appendChild(stats.dom);
var spheres = [];

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

    // creating the cannonjs world
    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.gravity.set(0, -9.82, 0);


    // plane.js
    plane = addPlane(camera);
    scene.add(plane);
    // setting the cannonjs plane position
    // the threejs plane's position will be set equal to this in the draw() function
    physicsPlane.position.set(startPosX, startPosY, startPosZ);
    plane.position.set(startPosX, startPosY, startPosZ);
    //plane.rotation.set(startRotX, startRotY, startRotZ);

    // environment.js
    let seed = Math.random();
    console.log("Seed: " + seed);
    noise.seed(seed);
    [environment, water, heightfieldMatrix] = addEnvironment(noisefn);
    scene.add(environment);

    // ring.js
    ring = getRing(true);
    scene.add(ring);
    prevRingTime = Date.now();
    ring.position.copy(ringDetector.position);
    nextRing = getRing(false);
    nextRing.position.set(-10, 410, -110);
    scene.add(nextRing);


    // for (var i = -10; i < 10; i += 10) {
    //     for (var j = -10; j < 10; j += 10) {
    //
    //         var sphereShape = new CANNON.Sphere(4.0);
    //         var sphereBody = new CANNON.Body({mass: 1});
    //         sphereBody.addShape(sphereShape);
    //         sphereBody.position.set(i, 200, j);
    //         //sphereBody.position.vadd(hfBody.position, sphereBody.position);
    //         world.add(sphereBody);
    //
    //
    //         var geom = new THREE.SphereGeometry(4);
    //         var mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: "red"}));
    //
    //         spheres.push({
    //             collider: sphereBody,
    //             mesh: mesh
    //         });
    //         scene.add(mesh);
    //         //demo.addVisual(sphereBody);
    //     }
    // }

    draw();
}

function draw() {
    // console.log(physicsPlane.position);
    // stats.begin();

    let dt = clock.getDelta();

    world.step(dt);
    //let time = clock.getElapsedTime();

    // linking the threejs and cannonjs planes
    plane.position.copy(physicsPlane.position);
    plane.quaternion.copy(physicsPlane.quaternion);

    // for (var sphere of spheres) {
    //     sphere.mesh.position.copy(sphere.collider.position);
    //     sphere.mesh.quaternion.copy(sphere.collider.quaternion);
    // }

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