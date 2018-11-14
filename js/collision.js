// detects collision between the plane and meshes in collidableMeshList
// source: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
function detectCollisions() { // TODO: fix bug - two false-positive collisions at the start of game
    // collects all the vertices of body and children of the plane
    var bodyVertices = plane.geometry.vertices;
    var wingsVertices = plane.children[0].geometry.vertices;
    var tailVertices = plane.children[1].geometry.vertices;
    var vertices = bodyVertices.concat(wingsVertices, tailVertices);

    // sets a ray between the origin of the plane and each of the vertices
    for (let i = 0; i < vertices.length; i++) {
        var origin = plane.position.clone();
        var localVertex = vertices[i].clone();
        var globalVertex = localVertex.applyMatrix4(plane.matrix);
        var direction = globalVertex.sub(plane.position);

        var ray = new THREE.Raycaster(origin, direction.clone().normalize());
        
        // collidableMeshList is a global varible
        var collisions = ray.intersectObjects(collidableMeshList);
        
        // if a collidable mesh intersects with the ray then the collision will be detected
        if (collisions.length > 0 && collisions[0].distance < direction.length()) {
            console.log("collision detected!");
        }
    }

}
