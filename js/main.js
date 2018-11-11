var renderer, scene, camera;
var lookAt = new THREE.Vector3(0.0, 0.0, 0.0);
var viewerPosition = new THREE.Vector3(0.0, 0.0, 30.0);

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var plane, environment;

function onLoad() {
    var canvasContainer = document.getElementById("myCanvasContainer");
    var width = 800;
    var height = 500;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x00dddd); // background colour

    canvasContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, width / height, 1, 1000);
    camera.up = new THREE.Vector3(0, 1, 0);
    scene.add(camera);

    // environment.js
    environment = drawEnvironment();
    scene.add(environment);

    // plane.js
    plane = drawPlane();
    scene.add(plane);
    plane.position.set(0, 20, 150);

    draw();
}

function draw() {
    var dt = clock.getDelta();
    var time = clock.getElapsedTime();

    // controls.js
    parseControls(dt);

    // Move the camera behind the plane and look at the plane
    // TODO: roll camera based on plane roll
    // TODO: figure out why the plane is flipped halfway through a loop de loop
    var behind = new THREE.Vector3(0, 5, 16);
    var axis = new THREE.Vector3(1, 0, 0);
    behind.applyAxisAngle(axis, plane.rotation.x);
    camera.position.copy(plane.position);
    camera.position.addVectors(camera.position, behind);
    camera.lookAt(plane.position);

    // Move the plane a little along the Z-axis
    // TODO: move it along the vector it's pointing to
    plane.position.z = plane.position.z - dt * 10;

    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

/**
 * Converts degrees to radians
 */
function toRad(degree) {
    return Math.PI * 2 * degree / 360;
}
