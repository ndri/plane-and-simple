function getLoop(isActive) {
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
 */
function handlePlaneThroughLoop() {
    console.log("hit")
    x = Math.random() * 300;
    y = Math.random() * 60 + 40;
    z = Math.random() * 300;
    r = Math.random() * 9 + 1
    loop.position.copy(nextLoop.position);
    loop.rotation.y = nextLoop.rotation.y
    nextLoop.position.set(x, y, z);
    nextLoop.rotation.y = Math.PI / r;
}
