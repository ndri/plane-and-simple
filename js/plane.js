function drawPlane() {
    var geometry = new THREE.BoxGeometry(2, 2, 10);
    var material = new THREE.MeshBasicMaterial({color: 0xff00ff});
    var body = new THREE.Mesh(geometry, material);

    var geometry = new THREE.BoxGeometry(20, 0.5, 3);
    var material = new THREE.MeshBasicMaterial({color: 0x00ffff});
    var wings = new THREE.Mesh(geometry, material);
    body.add(wings);
    wings.position.set(0, 1.25, -2);

    var geometry = new THREE.BoxGeometry(6, 0.5, 2);
    var material = new THREE.MeshBasicMaterial({color: 0x00ffff});
    var tail = new THREE.Mesh(geometry, material);
    body.add(tail);
    tail.position.set(0, 1.25, 4);

    return body;
}
