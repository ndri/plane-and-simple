function getRing(isActive) {
    var geometry = new THREE.TorusGeometry(20, 3, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffdf00 });
    var torus = new THREE.Mesh(geometry, material);

    if (isActive) {
        collidableMeshList.push(torus);
        // invisbile circle, used in draw() to detect when the plane flies through the ring
        var geometry = new THREE.CircleGeometry(20, 20);
        var material = new THREE.MeshBasicMaterial();
        material.transparent = true;
        material.opacity = 0;
        var circle = new THREE.Mesh(geometry, material);
        torus.add(circle);
    } else {
        material.transparent = true;
        material.opacity = 0.3;
    }
    
    return torus; 
}

/**
 * called when plane flies through ring
 * TODO: create point counter and increment when this is called
 */
function handlePlaneThroughRing() {
    x = Math.random() * worldSize - worldSize / 2;
    y = Math.random() * 60 + 40;
    z = Math.random() * worldSize - worldSize / 2;
    // r = Math.random() * 9 + 1
    ring.position.set(x, y, z);
    /*
    ring.rotation.y = nextRing.rotation.y
    nextRing.position.set(x, y, z);
    nextRing.rotation.y = Math.PI / r;
    */
}
