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
}
