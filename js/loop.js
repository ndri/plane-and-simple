function drawLoop(isActive) {
    var geometry = new THREE.TorusGeometry(20, 3, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffdf00 });
    var loop = new THREE.Mesh(geometry, material);

    if (isActive) {
        collidableMeshList.push(loop);
        // invisbile circle, used in draw() to detect when the plane flies through the loop
        var geometry = new THREE.CircleGeometry(20, 20);
        var material = new THREE.MeshBasicMaterial();
        material.transparent = true;
        material.opacity = 0;
        var circle = new THREE.Mesh(geometry, material);
        loop.add(circle);
    } else {
        material.transparent = true;
        material.opacity = 0.3;
    }
    
    return loop; 
}

/**
 * called when plane flies through loop
 * TODO: create point counter and increment when this is called
 * TODO: set loop to new random position
 */
function handlePlaneThroughLoop() {
    loop.position.set(30, 30, 100);
}
