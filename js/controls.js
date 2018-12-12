// TODO: proper controls

function parseControls(dt) {

    // Left and right change the aileron position
    if (keyboard.pressed("left")) {
        aileronPosition = Math.min(
            aileronPosition + aileronSpeed,
            maxAileronPosition
        );
    } else if (keyboard.pressed("right")) {
        aileronPosition = Math.max(
            aileronPosition - aileronSpeed,
            -maxAileronPosition
        );
    } else {
        if (aileronPosition > aileronSpeed) {
            aileronPosition -= aileronSpeed;
        } else if (aileronPosition < -aileronSpeed) {
            aileronPosition += aileronSpeed;
        } else {
            aileronPosition = 0;
        }
    }

    // Up and down change the elevator position
    if (keyboard.pressed("up")) {
        elevatorPosition = Math.max(
            elevatorPosition - elevatorSpeed,
            -maxElevatorPosition
        )
    } else if (keyboard.pressed("down")) {
        elevatorPosition = Math.min(
            elevatorPosition + elevatorSpeed,
            maxElevatorPosition
        )
    } else {
        if (elevatorPosition > elevatorSpeed) {
            elevatorPosition -= elevatorSpeed;
        } else if (elevatorPosition < -elevatorSpeed) {
            elevatorPosition += elevatorSpeed;
        } else {
            elevatorPosition = 0;
        }
    }

    // Q and E change the rudder position
    if (keyboard.pressed("q")) {
        //plane.rotateY(toRad(speed * dt));
        rudderPosition = Math.min(
            rudderPosition + rudderSpeed,
            maxRudderPosition
        )
    } else if (keyboard.pressed("e")) {
        //plane.rotateY(-toRad(speed * dt));
        rudderPosition = Math.max(
            rudderPosition - rudderSpeed,
            -maxRudderPosition
        )
    } else {
        if (rudderPosition > rudderSpeed) {
            rudderPosition -= rudderSpeed;
        } else if (rudderPosition < -rudderSpeed) {
            rudderPosition += rudderSpeed;
        } else {
            rudderPosition = 0;
        }
    }

    // W and S accelerate and decelerate
    if (keyboard.pressed("w")) {
        throttle = acceleration;
    } else if (keyboard.pressed("s")) {
        throttle = -acceleration;
    } else {
        throttle = 0;
    }

    // Space resets the plane to runway
    if (keyboard.pressed("space")) {
        // var newX = Math.random() * worldSize - worldSize / 2;
        // var newZ = Math.random() * worldSize - worldSize / 2;
        // plane.position.set(newX, 1, newZ);
        // plane.rotation.set(0, plane.rotation.y, 1000);

        plane.position.set(startPosX, startPosY, startPosZ);
        plane.rotation.set(startRotX, startRotY, startRotZ);
        speed = fallSpeed = throttle = 0;
    }
}
