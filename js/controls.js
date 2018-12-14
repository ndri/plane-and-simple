function parseControls() {

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

        physicsPlane.position.set(startPosX, startPosY, startPosZ);
        physicsPlane.velocity.copy(new CANNON.Vec3(0, 0, 0));
        physicsPlane.quaternion.setFromEuler(0, 0, 0);
        plane.position.set(startPosX, startPosY, startPosZ);
        //plane.rotation.set(startRotX, startRotY, startRotZ);
    }
}


/*function parseControlsTest(dt) {
    let inputVelocity = new CANNON.Vec3();
    let inputQuat = new CANNON.Quaternion();
    // velocity factor
    let vF = 1;
    // quaternion factor
    let qF = 0.05;

    // W and S accelerate and decelerate
    if (keyboard.pressed("w")) {
        inputVelocity.z = -vF;
    } else if (keyboard.pressed("s")) {
        inputVelocity.z = vF;
    }

    // Up and down change the elevator position
    if (keyboard.pressed("up")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -qF);
    } else if (keyboard.pressed("down")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), qF);
    }

    // Left and right change the aileron position
    if (keyboard.pressed("left")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), qF);
    } else if (keyboard.pressed("right")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -qF);
    }

    // Q and E change the rudder position
    if (keyboard.pressed("q")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), qF);
    } else if (keyboard.pressed("e")) {
        inputQuat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -qF);
    }

    // Space resets the plane to runway
    if (keyboard.pressed("space")) {
        physicsPlane.position.set(startX, startY, startZ);
        speed = fallSpeed = throttle = 0;
        physicsPlane.velocity.copy(new CANNON.Vec3(0, 0, 0));
        physicsPlane.quaternion.setFromEuler(0, 0, 0);
    }
    let worldQuaternion = physicsPlane.quaternion.vmult(inputQuat);
    physicsPlane.quaternion.x += worldQuaternion.x;
    physicsPlane.quaternion.y += worldQuaternion.y;
    physicsPlane.quaternion.z += worldQuaternion.z;

    let worldVelocity = physicsPlane.quaternion.vmult(inputVelocity);
    physicsPlane.velocity.x += worldVelocity.x;
    physicsPlane.velocity.y += worldVelocity.y;
    physicsPlane.velocity.z += worldVelocity.z;
}*/
