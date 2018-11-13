function addPlane(camera) {
    var geometry = new THREE.BoxGeometry(2, 2, 10);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
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

    return body;
}

function movePlane(dt) {

    // If speed isn't high enough, increase the speed that moves the plane down in the world space
    if (speed < liftSpeed) {
        fallSpeed += gravity * (1 - speed / liftSpeed);
    } else {
        if (fallSpeed < 0) {
            fallSpeed = 0;
        } else {
            fallSpeed -= gravity * 0.1;
        }
    }

    // Decrease speed every tick (or increase if reversing)
    if (speed > 0.0) {
        speed -= drag;
    } else if (speed < 0.0) {
        speed += drag;
    }

    // Move the plane forward in the local space
    plane.translateZ(-speed * dt);

    // If plane is above the ground, move the plane down in the world space based on fallSpeed
    if (plane.position.y > 1.0) {
        plane.position.y -= fallSpeed * dt;
    } else {
        plane.position.y = 1.0;
        fallSpeed = 0;
        //plane.rotation.set(0, plane.rotation.y, 0); // Reset the roll and pitch when on the ground
    }
}
