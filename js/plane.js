var speed = 0;
var fallSpeed = 0;
var throttle = 0;
var score = 0;

var aileronPosition = 0;
var elevatorPosition = 0;
var rudderPosition = 0;

function addPlane(camera) {

    // TODO: 1 unit should be 1 metre, currently it's a 10x20m plane
    var geometry = new THREE.BoxGeometry(2, 2, 10);
    var material = new THREE.MeshBasicMaterial({color: 0xccdddd});
    var body = new THREE.Mesh(geometry, material);

    var geometry = new THREE.BoxGeometry(20, 0.5, 3);
    var material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    var wings = new THREE.Mesh(geometry, material);
    body.add(wings);
    wings.position.set(0, 1.25, -2);

    var geometry = new THREE.BoxGeometry(6, 0.5, 2);
    var material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    var tail = new THREE.Mesh(geometry, material);
    body.add(tail);
    tail.position.set(0, 1.25, 4);

    camera.position.set(0, 6, 15);
    camera.lookAt(body.position);
    body.add(camera);

    // physical representation of the plane for cannonjs
    var cannonBody = new CANNON.Body({
        mass: 1000, // kg
        //position: new CANNON.Vec3(100, 110, 40),
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 5)),
        material: new CANNON.Material({friction: 0.0})
    });
    cannonBody.addShape(new CANNON.Box(new CANNON.Vec3(10, 0.25, 1.5)), new CANNON.Vec3(0, 1.25, -2));
    cannonBody.addShape(new CANNON.Box(new CANNON.Vec3(3, 0.25, 1)), new CANNON.Vec3(0, 1.25, 4));
    physicsPlane = cannonBody;
    world.addBody(physicsPlane);

    return body;
}

function movePlane(dt) {

    var accelerationImpulse = new CANNON.Vec3(0, 0, -throttle * 1000000 * dt);
    accelerationImpulse = physicsPlane.quaternion.vmult(accelerationImpulse);

    var planeCenter = new CANNON.Vec3(
        physicsPlane.position.x,
        physicsPlane.position.y,
        physicsPlane.position.z
    );
    physicsPlane.applyImpulse(accelerationImpulse, planeCenter);


    var directionVector = new CANNON.Vec3(
        elevatorPosition, rudderPosition, aileronPosition
    );
    directionVector = physicsPlane.quaternion.vmult(directionVector);

    physicsPlane.angularVelocity.set(
        directionVector.x, directionVector.y, directionVector.z
    );

    // TODO: linearDamping should be lower, so the plane keeps going when throttle is release, but then it glides a lot so idk
    physicsPlane.linearDamping = 0.99;
    physicsPlane.angularDamping = 0.0;

}
