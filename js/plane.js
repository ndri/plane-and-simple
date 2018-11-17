function addPlane(camera) {
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

    return body;
}

function movePlane(dt) {

    // Only apply throttle if in the allowed speed range
    if (speed < maxSpeed && speed > minSpeed) {
        speed += throttle;
    }


    // If speed isn't high enough, increase the speed that moves the plane down in the world space
    if (speed < liftSpeed) {
        fallSpeed += 10 * gravity * (1 - speed / liftSpeed);
    } else {
        if (fallSpeed < 0) {
            fallSpeed = 0;
        } else {
            fallSpeed -= gravity;
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

    // Detect whether the plane is airborne
    if (plane.position.y > 1.0) {
        // Move the plane down in the world space based on fallSpeed
        plane.position.y -= fallSpeed * dt;

        // Apply gravity based on how much the plane is facing up
        var howMuchUp = plane.getWorldDirection(new THREE.Vector3(0, 1, 0)).y;
        speed += gravity * howMuchUp;
    } else {
        plane.position.y = 1.0;
        fallSpeed = 0;

        // Limit plane rotations on the ground
        // TODO: fix this, proably can't use plane.rotation here
        // TODO: do this smoothly
        /*if (plane.rotation.z > 0.2) {
            plane.rotation.z = 0.2;
        } else if (plane.rotation.z < -0.2) {
            plane.rotation.z = -0.2;
        }
        if (plane.rotation.x > 0.2) {
            plane.rotation.x = 0.2;
        } else if (plane.rotation.x < -0.2) {
            plane.rotation.x = -0.2;
        }*/
    }
}
