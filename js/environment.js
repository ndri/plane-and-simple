function drawEnvironment() {
    var geometry = new THREE.PlaneGeometry(50, 50, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00aa00});
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.set(-toRad(90), 0, 0);

    return floor;
}
