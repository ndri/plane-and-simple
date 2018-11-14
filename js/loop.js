function drawLoop() {
    var geometry = new THREE.TorusGeometry(20, 3, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffdf00 });
    var torus = new THREE.Mesh(geometry, material);
    collidableMeshList.push(torus);
    return torus;
}
