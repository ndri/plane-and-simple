// detects collision between the given object and meshes 
// source: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
function detectCollisions(object, collidableMeshList) { // TODO: fix bug - two false-positive collisions at the start of game
    // let's get all all the vertices of the object's meshes
    // (since we want all parts of the object to be collidable with the collidableMeshList meshes)
    var vertices = getAllVertices(object);

    // sets a ray between the origin of the object and each of the vertices
    for (let i = 0; i < vertices.length; i++) {
        var origin = plane.position.clone();
        var localVertex = vertices[i].clone();
        var globalVertex = localVertex.applyMatrix4(plane.matrix);
        var direction = globalVertex.sub(plane.position);

        var ray = new THREE.Raycaster(origin, direction.clone().normalize());
        
        var collisions = ray.intersectObjects(collidableMeshList);
        
        // if a collidable mesh intersects with the ray then the collision will be detected
        if (collisions.length > 0 && collisions[0].distance < direction.length()) {
            console.log("collision detected!");
        }
    }
}

// returns a list of all the vertices of all the meshes in the object
function getAllVertices(object) {
    vertices = [];
    if (object === undefined) {
        return vertices;
    }
    if (object.type === ("Mesh")) {
        vertices = vertices.concat(object.geometry.vertices);
    }
    for (let i = 0; i < object.children.length; i++) {
        vertices = vertices.concat(getAllVertices(object.children[i]));
    }
    return vertices;
}
