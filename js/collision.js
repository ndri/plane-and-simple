/**
 * detects collisions between the given object and meshes
 * on detection, the onCollision function is called
 * source: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
 * TODO: fix bug - false-positive collisions detected at the start of game
 */
function detectCollisions(object, collidableMeshList, onCollision) {
    // get all the vertices of the object's meshes
    // (since we want all parts of the object to be collidable with the collidableMeshList meshes)
    var vertices = getAllVertices(object);

    // set a ray between the origin of the object and each of the vertices
    for (let i = 0; i < vertices.length; i++) {
        var origin = plane.position.clone();
        var localVertex = vertices[i].clone();
        var globalVertex = localVertex.applyMatrix4(plane.matrix);
        var direction = globalVertex.sub(plane.position);

        var ray = new THREE.Raycaster(origin, direction.clone().normalize());
        
        var collisions = ray.intersectObjects(collidableMeshList);
        
        // if a collidable mesh intersects with the ray then the collision will be detected
        if (collisions.length > 0 && collisions[0].distance < direction.length()) {
            onCollision();
        }
    }
}

/**
 * returns a list of all the vertices of all the meshes in the given object
 */
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

/**
 * called on collision.
 */
function handleCollision() {
    speed = 0;
}