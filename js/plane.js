var throttle = 0;
var score = 0;

var aileronPosition = 0;
var elevatorPosition = 0;
var rudderPosition = 0;

function addPlane(camera) {
    let geometry, material;

    // Body
    geometry = new THREE.BoxGeometry(1.8, 2, 4);
    material = new THREE.MeshStandardMaterial({color: 0xccdddd, roughness: 0.8});
    let body = new THREE.Mesh(geometry, material);
    body.castShadow = true;

    // Tail
    geometry = new THREE.BoxGeometry(1, 1, 5);
    material = new THREE.MeshStandardMaterial({color: 0xccdddd, roughness: 0.8});
    let tail = new THREE.Mesh(geometry, material);
    body.add(tail);
    tail.position.set(0, 0.5, 4);

    // Wings
    geometry = new THREE.BoxGeometry(11, 0.3, 2);
    material = new THREE.MeshStandardMaterial({color: 0xcc4444, roughness: 0.8});
    let wings = new THREE.Mesh(geometry, material);
    body.add(wings);
    wings.position.set(0, 1.2, 0);

    // Moving ailerons
    geometry = new THREE.BoxGeometry(4, 0.3, 0.5);
    material = new THREE.MeshStandardMaterial({color: 0xcc4444, roughness: 0.8});
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
    material = new THREE.MeshStandardMaterial({color: 0xcc4444, roughness: 0.8});
    let elevator = new THREE.Mesh(geometry, material);
    elevator.castShadow = true;
    body.add(elevator);
    elevator.position.set(0, 1.2, 5.5);

    // Moving elevators
    geometry = new THREE.BoxGeometry(2, 0.3, 0.5);
    material = new THREE.MeshStandardMaterial({color: 0xcc4444, roughness: 0.8});
    let elevator1 = new THREE.Mesh(geometry, material);
    let elevator2 = new THREE.Mesh(geometry, material);
    elevator1.castShadow = true;
    elevator2.castShadow = true;
    elevator1.position.set(1.5, 0, 0.75);
    elevator2.position.set(-1.5, 0, 0.75);
    let pivot = new THREE.Object3D();
    pivot.castShadow = true;
    pivot.add(elevator1, elevator2);
    elevator.add(pivot);

    // Moving rudder
    geometry = new THREE.BoxGeometry(0.3, 1.5, 1.5);
    material = new THREE.MeshStandardMaterial({color: 0xcc4444, roughness: 0.8});
    let rudder = new THREE.Mesh(geometry, material);
    rudder.castShadow = true;
    pivot = new THREE.Object3D();
    rudder.position.set(0, 0, 0.75);
    pivot.add(rudder);
    pivot.position.set(0, 1, -0.75);
    elevator.add(pivot);

    // Propeller
    geometry = new THREE.BoxGeometry(5, 0.3, 0.1);
    material = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.8});
    let propeller = new THREE.Mesh(geometry, material);
    body.add(propeller);
    propeller.position.set(0, 0, -2.1);
    propeller.castShadow = true;

    // body.scale.set(1, 1, 0.1);
    // body.visible = false;

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

    world.addBody(physicsPlane);

    activateShading(body);

    return body;
}

function activateShading(mesh) {
    for (let i = 0; i < mesh.children.length; i++) {
        let child = mesh.children[i];
        if (child.type === "Mesh") {
            child.geometry.verticesNeedUpdate = true;
            child.geometry.computeVertexNormals();
            child.castShadow = true;
            // child.recieveShadow = true;
            // console.log(child);

            if (child.children.length > 0) {
                activateShading(child);
            }
        }
    }
}


function movePlane(dt) {
    var accelerationImpulse = new CANNON.Vec3(0, 0, -throttle * config.plane.throttlePower * dt);
    accelerationImpulse = physicsPlane.quaternion.vmult(accelerationImpulse);

    if (physicsPlane.position.y < 0) {
        physicsPlane.position.y = 0
    }

    var planeCenter = new CANNON.Vec3(
        physicsPlane.position.x,
        physicsPlane.position.y,
        physicsPlane.position.z
    );
    physicsPlane.applyImpulse(accelerationImpulse, planeCenter);


    var directionVector = new CANNON.Vec3(
        elevatorPosition * config.plane.elevatorPower * dt,
        rudderPosition * config.plane.rudderPower * dt,
        aileronPosition * config.plane.aileronPower * dt
    );
    directionVector = physicsPlane.quaternion.vmult(directionVector);

    physicsPlane.angularVelocity.set(
        directionVector.x, directionVector.y, directionVector.z
    );

    // TODO: linearDamping should be lower, so the plane keeps going when throttle is release, but then it glides a lot so idk
    physicsPlane.linearDamping = config.plane.linearDamping;
    physicsPlane.angularDamping = config.plane.angularDamping;

    // Rotate the propeller
    if (throttle !== 0) {
        propellerspeed += throttle * 0.004;
    } else if (propellerspeed > 0.02) {
        propellerspeed -= 0.0005;
    } else if (propellerspeed < -0.02) {
        propellerspeed += 0.0005;
    } else {
        propellerspeed = 0;
    }
    if (propellerspeed > 0.3) {
        propellerspeed = 0.3;
    }
    if (propellerspeed < -0.3) {
        propellerspeed = -0.3;
    }
    plane.children[3].rotation.z += propellerspeed;

    // Rotate the ailerons
    plane.children[1].children[0].rotation.set(aileronPosition, 0, 0);
    plane.children[1].children[1].rotation.set(-aileronPosition, 0, 0);

    // Rotate the rudder
    plane.children[2].children[1].rotation.set(0, -rudderPosition / 3, 0);

    // Rotate the elevator
    plane.children[2].children[0].rotation.set(-elevatorPosition / 3, 0, 0);
}
