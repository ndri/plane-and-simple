// Enum class for controller types
const controllerType = {
    keyboard: 1,
    gamepad: 2
};

// Controls settings object
let controls = {
    // which controller type is currently being used (keyboard or gamepad)
    //type: controllerType.gamepad,
    type: controllerType.keyboard,

    // Keyboard control keys
    keyboard: {
        aileronLeft: "left",
        aileronRight: "right",
        elevatorUp: "up",
        elevatorDown: "down",
        rudderLeft: "q",
        rudderRight: "e",
        accelerate: "w",
        decellerate: "s",
        reset: "space"
    },

    gamepad: {
        aileronAxis: 0,
        elevatorAxis: 1,
        rudderAxis: 4,
        throttleAxis: 2
    }
};

function parseControls() {

    if (controls.type === controllerType.keyboard) {
        // Left and right change the aileron position
        if (keyboard.pressed(controls.keyboard.aileronLeft)) {
            aileronPosition = Math.min(
                aileronPosition + aileronSpeed,
                maxAileronPosition
            );
        } else if (keyboard.pressed(controls.keyboard.aileronRight)) {
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
        if (keyboard.pressed(controls.keyboard.elevatorUp)) {
            elevatorPosition = Math.max(
                elevatorPosition - elevatorSpeed,
                -maxElevatorPosition
            )
        } else if (keyboard.pressed(controls.keyboard.elevatorDown)) {
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
        if (keyboard.pressed(controls.keyboard.rudderLeft)) {
            //plane.rotateY(toRad(speed * dt));
            rudderPosition = Math.min(
                rudderPosition + rudderSpeed,
                maxRudderPosition
            )
        } else if (keyboard.pressed(controls.keyboard.rudderRight)) {
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
        if (keyboard.pressed(controls.keyboard.accelerate)) {
            throttle = acceleration;
        } else if (keyboard.pressed(controls.keyboard.decellerate)) {
            throttle = -acceleration;
        } else {
            throttle = 0;
        }

        // Space resets the plane to runway
        if (keyboard.pressed(controls.keyboard.reset)) {
            physicsPlane.position.set(startPosX, startPosY, startPosZ);
            physicsPlane.velocity.copy(new CANNON.Vec3(0, 0, 0));
            physicsPlane.quaternion.setFromEuler(0, 0, 0);
            plane.position.set(startPosX, startPosY, startPosZ);
            //plane.rotation.set(startRotX, startRotY, startRotZ);
        }
    } else if (controls.type === controllerType.gamepad) {

        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (!gamepads || !gamepads[0]) {
            alert("No gamepad found! Switching to keyboard mode.");
            controls.type = controllerType.keyboard;
        } else {
            let gp = gamepads[0];

            throttle = gp.axes[controls.gamepad.throttleAxis];
            aileronPosition = -gp.axes[controls.gamepad.aileronAxis];
            elevatorPosition = -gp.axes[controls.gamepad.elevatorAxis];
            rudderPosition = -gp.axes[controls.gamepad.rudderAxis];
        }
    }
}