var speed = 0;
var fallSpeed = 0;
var throttle = 0;
var score = 0;

var aileronPosition = 0;
var elevatorPosition = 0;
var rudderPosition = 0;

function addPlane(camera) {
    let geometry, material;

    // Body
    geometry = new THREE.BoxGeometry(1.8, 2, 4);
    material = new THREE.MeshBasicMaterial({color: 0xccdddd});
    let body = new THREE.Mesh(geometry, material);

    // Tail
    geometry = new THREE.BoxGeometry(1, 1, 5);
    material = new THREE.MeshBasicMaterial({color: 0xccdddd});
    let tail = new THREE.Mesh(geometry, material);
    body.add(tail);
    tail.position.set(0, 0.5, 4);

    // Wings
    geometry = new THREE.BoxGeometry(11, 0.3, 2);
    material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    let wings = new THREE.Mesh(geometry, material);
    body.add(wings);
    wings.position.set(0, 1.2, 0);

    // Moving ailerons
    geometry = new THREE.BoxGeometry(4, 0.3, 0.5);
    material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    let aileron1 = new THREE.Mesh(geometry, material);
    aileron1.position.set(2.9, 0, 0.25);
    let aileron2 = new THREE.Mesh(geometry, material);
    aileron2.position.set(-2.9, 0, 0.25);
    let pivot1 = new THREE.Object3D();
    let pivot2 = new THREE.Object3D();
    pivot1.add(aileron1);
    pivot2.add(aileron2);
    pivot1.position.set(0, 0, 1);
    pivot2.position.set(0, 0, 1);
    wings.add(pivot1, pivot2);

    // Elevator
    geometry = new THREE.BoxGeometry(5, 0.3, 1);
    material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    let elevator = new THREE.Mesh(geometry, material);
    body.add(elevator);
    elevator.position.set(0, 1.2, 5.5);

    // Moving elevators
    geometry = new THREE.BoxGeometry(2, 0.3, 0.5);
    material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    let elevator1 = new THREE.Mesh(geometry, material);
    let elevator2 = new THREE.Mesh(geometry, material);
    elevator1.position.set(1.5, 0, 0.75);
    elevator2.position.set(-1.5, 0, 0.75);
    let pivot = new THREE.Object3D();
    pivot.add(elevator1, elevator2);
    elevator.add(pivot);

    // Moving rudder
    geometry = new THREE.BoxGeometry(0.3, 1.5, 1.5);
    material = new THREE.MeshBasicMaterial({color: 0xcc4444});
    let rudder = new THREE.Mesh(geometry, material);
    pivot = new THREE.Object3D();
    rudder.position.set(0, 0, 0.75);
    pivot.add(rudder);
    pivot.position.set(0, 1, -0.75);
    elevator.add(pivot);

    // Propeller
    geometry = new THREE.BoxGeometry(5, 0.3, 0.1);
    material = new THREE.MeshBasicMaterial({color: 0x444444});
    let propeller = new THREE.Mesh(geometry, material);
    body.add(propeller);
    propeller.position.set(0, 0, -2.1);


    // Camera
    camera.position.set(0, 6, 15);
    //camera.position.set(5, 10, 0);
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
    physicsPlane.linearDamping = 0.81;
    physicsPlane.angularDamping = 0.0;

    world.addBody(physicsPlane);
    return body;
}



function movePlane(dt) {

    var accelerationImpulse = new CANNON.Vec3(0, 0, -throttle * 200000 * dt);
    accelerationImpulse = physicsPlane.quaternion.vmult(accelerationImpulse);

    var planeCenter = new CANNON.Vec3(
        physicsPlane.position.x,
        physicsPlane.position.y,
        physicsPlane.position.z
    );
    physicsPlane.applyImpulse(accelerationImpulse, planeCenter);


    var directionVector = new CANNON.Vec3(
        elevatorPosition * elevatorPower * dt,
        rudderPosition * rudderPower * dt,
        aileronPosition * aileronPower * dt
    );
    directionVector = physicsPlane.quaternion.vmult(directionVector);

    physicsPlane.angularVelocity.set(
        directionVector.x, directionVector.y, directionVector.z
    );

    // TODO: linearDamping should be lower, so the plane keeps going when throttle is release, but then it glides a lot so idk

    // Rotate the propeller
    plane.children[3].rotation.set(0, 0, plane.children[3].rotation.z + throttle);

    // Rotate the ailerons
    plane.children[1].children[0].rotation.set(aileronPosition, 0, 0);
    plane.children[1].children[1].rotation.set(-aileronPosition, 0, 0);

    // Rotate the rudder
    plane.children[2].children[1].rotation.set(0, -rudderPosition / 3, 0);

    // Rotate the elevator
    plane.children[2].children[0].rotation.set(-elevatorPosition / 3, 0, 0);
}
