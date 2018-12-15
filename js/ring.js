function getRing(isActive) {
    var geometry = new THREE.TorusGeometry(20, 3, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffdf00 });
    var torus = new THREE.Mesh(geometry, material);

    if (isActive) {
        // invisbile Cylinder, used to detect when the plane flies through the ring
        ringDetector = new CANNON.Body({
            shape: new CANNON.Cylinder(20, 20, 0.1, 5),
            material: new CANNON.Material(),
            mass: 0
        });
        ringDetector.collisionResponse = 0;
        ringDetector.position.set(-40, 400, -140);
        world.add(ringDetector);
    } else {
        material.transparent = true;
        material.opacity = 0.3;
    }
    return torus; 
}

/**
 * called when plane flies through ring
 */
function handlePlaneThroughRing() {
    score++;

    // the ring should appear where the semi-transparent ring was
    ring.position.copy(nextRing.position);
    ring.rotation.y = nextRing.rotation.y;
    ringDetector.position.copy(ring.position);
    ringDetector.quaternion.copy(ring.quaternion);

    // the semi-transparent ring should be relocated somewhere in the FOV of the plane
    var nextRingSpacing = new CANNON.Vec3();
    
    nextRingSpacing.x = Math.random() * 90 - 90;
    nextRingSpacing.y = Math.random() * 15 - 15;
    nextRingSpacing.z = -(Math.random() * 120 + 30);
    nextRingSpacing = physicsPlane.quaternion.vmult(nextRingSpacing);
    var nextRingPosition = nextRing.position.clone();
    nextRingPosition.add(nextRingSpacing);
    // to avoid the ring from clipping into the ground, the height data has to be found for the xz-position
    if (Math.abs(nextRingPosition.x) < worldSize / 2 && Math.abs(nextRingPosition.z) < worldSize / 2) {
        var heightAtNextRing = heightfieldMatrix[Math.round((worldSize / 2 + nextRingPosition.x) / 4)][Math.round((worldSize / 2 - nextRingPosition.z) / 4)] - 200;
        nextRingPosition.y = Math.max(heightAtNextRing + 35, nextRingPosition.y);
    }
    nextRing.position.copy(nextRingPosition);

    // rotating the ring randomly
    var r = Math.random() * 9 + 1
    nextRing.rotation.y = Math.PI / r;
    
    prevRingTime = Date.now();
}

