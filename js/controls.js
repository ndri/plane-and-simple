function parseControls() {

    if (config.controls.type == controllerType.keyboard) {
        // Left and right change the aileron position
        if (keyboard.pressed(config.controls.keyboard.aileronLeft)) {
            aileronPosition = Math.min(
                aileronPosition + config.plane.aileronSpeed,
                config.plane.maxAileronPosition
            );
        } else if (keyboard.pressed(config.controls.keyboard.aileronRight)) {
            aileronPosition = Math.max(
                aileronPosition - config.plane.aileronSpeed,
                -config.plane.maxAileronPosition
            );
        } else {
            if (aileronPosition > config.plane.aileronSpeed) {
                aileronPosition -= config.plane.aileronSpeed;
            } else if (aileronPosition < -config.plane.aileronSpeed) {
                aileronPosition += config.plane.aileronSpeed;
            } else {
                aileronPosition = 0;
            }
        }

        // Up and down change the elevator position
        if (keyboard.pressed(config.controls.keyboard.elevatorUp)) {
            elevatorPosition = Math.max(
                elevatorPosition - config.plane.elevatorSpeed,
                -config.plane.maxElevatorPosition
            )
        } else if (keyboard.pressed(config.controls.keyboard.elevatorDown)) {
            elevatorPosition = Math.min(
                elevatorPosition + config.plane.elevatorSpeed,
                config.plane.maxElevatorPosition
            )
        } else {
            if (elevatorPosition > config.plane.elevatorSpeed) {
                elevatorPosition -= config.plane.elevatorSpeed;
            } else if (elevatorPosition < -config.plane.elevatorSpeed) {
                elevatorPosition += config.plane.elevatorSpeed;
            } else {
                elevatorPosition = 0;
            }
        }

        // Q and E change the rudder position
        if (keyboard.pressed(config.controls.keyboard.rudderLeft)) {
            //plane.rotateY(toRad(speed * dt));
            rudderPosition = Math.min(
                rudderPosition + config.plane.rudderSpeed,
                config.plane.maxRudderPosition
            )
        } else if (keyboard.pressed(config.controls.keyboard.rudderRight)) {
            //plane.rotateY(-toRad(speed * dt));
            rudderPosition = Math.max(
                rudderPosition - config.plane.rudderSpeed,
                -config.plane.maxRudderPosition
            )
        } else {
            if (rudderPosition > config.plane.rudderSpeed) {
                rudderPosition -= config.plane.rudderSpeed;
            } else if (rudderPosition < -config.plane.rudderSpeed) {
                rudderPosition += config.plane.rudderSpeed;
            } else {
                rudderPosition = 0;
            }
        }

        // W and S accelerate and decelerate
        if (keyboard.pressed(config.controls.keyboard.accelerate)) {
            throttle = config.plane.acceleration;
        } else if (keyboard.pressed(config.controls.keyboard.decelerate)) {
            throttle = -config.plane.acceleration;
        } else {
            throttle = 0;
        }

    } else if (config.controls.type == controllerType.gamepad) {



        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        //console.log(gamepads);

        if (!gamepads || !gamepads[0]) {
            alert("No gamepad found! Switching to keyboard mode.");
            config.controls.type = controllerType.keyboard;
        } else {
            let gp = gamepads[0];

            throttle = gp.axes[config.controls.gamepad.throttleAxis];
            aileronPosition = -gp.axes[config.controls.gamepad.aileronAxis];
            elevatorPosition = -gp.axes[config.controls.gamepad.elevatorAxis];
            rudderPosition = -gp.axes[config.controls.gamepad.rudderAxis];
        }
    }

    // Space resets the plane position
    if (keyboard.pressed(config.controls.keyboard.reset)) {
        physicsPlane.position.set(config.plane.startPosX, config.plane.startPosY, config.plane.startPosZ);
        physicsPlane.velocity.copy(new CANNON.Vec3(0, 0, 0));
        physicsPlane.quaternion.setFromEuler(0, 0, 0);
        plane.position.set(config.plane.startPosX, config.plane.startPosY, config.plane.startPosZ);
        //plane.rotation.set(startRotX, startRotY, startRotZ);
    }
}