// TODO: proper controls

function parseControls(dt) {
    // Left and right should roll the plane
    if (keyboard.pressed("left")) {
        plane.rotation.z = plane.rotation.z + toRad(90 * dt % 360);
    }
    if (keyboard.pressed("right")) {
        plane.rotation.z = plane.rotation.z - toRad(90 * dt % 360);
    }

    // Up and down should pitch the plane
    if (keyboard.pressed("up")) {
        plane.rotation.x = plane.rotation.x - toRad(90 * dt % 360);
    }
    if (keyboard.pressed("down")) {
        plane.rotation.x = plane.rotation.x + toRad(90 * dt % 360);
    }
}
