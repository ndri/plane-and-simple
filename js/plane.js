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

function drawPlane(dt) {
    // Move the plane a little along the Z-axis

    const gravity = 0.3;

    plane.translateZ(-0.5); // local space
    plane.position.y -= gravity; // world space
    plane.translateY(0.3); // local space
}
