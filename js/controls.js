// TODO: proper controls

function parseControls(dt) {

    // Left and right should roll the plane
    if (keyboard.pressed("left")) {
        plane.rotateZ(toRad(speed * dt));
    }
    if (keyboard.pressed("right")) {
        plane.rotateZ(-toRad(speed * dt));
    }

    // Up and down should pitch the plane
    if (keyboard.pressed("up")) {
        plane.rotateX(-toRad(speed * dt));
    }
    if (keyboard.pressed("down")) {
        plane.rotateX(toRad(speed * dt));
    }

    // Q and E should yaw the plane
    if (keyboard.pressed("q")) {
        plane.rotateY(toRad(speed * dt));
    }
    if (keyboard.pressed("e")) {
        plane.rotateY(-toRad(speed * dt));
    }

    // W and S accelerate and decelerate
    if (keyboard.pressed("w")) {
        throttle = acceleration;
    } else if (keyboard.pressed("s")) {
        throttle = -acceleration;
    } else {
        throttle = 0;
    }

    // Space resets the plane to a random position
    if (keyboard.pressed("space")) {
        var newX = Math.random() * worldSize - worldSize / 2;
        var newZ = Math.random() * worldSize - worldSize / 2;
        plane.position.set(newX, 1, newZ);
        plane.rotation.set(0, plane.rotation.y, 0);
    }
}
