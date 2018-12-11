function addEnvironment(noisefn) {
    let environment = new THREE.Object3D();


    // water
    var geometry = new THREE.PlaneGeometry(worldSize, worldSize, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x3490DC, shininess: 80});
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.set(-toRad(90), 0, 0);
    floor.position.set(0, -2.0, 0);
    environment.add(floor);


    // lights
    dirLight = new THREE.DirectionalLight(0xfffeee, 0.95);
    dirLight.position.set(200, 400, 0);
    scene.add(dirLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);


    // terrain TODO: color by altidude; generate new terrain when out of worldsize; maybe different biomes
    var material = new THREE.MeshPhongMaterial({
        color: 0x4eba4e,
        specular: 0x773300,
        flatShading: true,
        shininess: 3
    });

    // matrix where the heights will be saved for the cannonjs heightfield
    var matrix = [];
    var matrixRow = [];

    var geometry = new THREE.PlaneGeometry(worldSize, worldSize, worldSize / 4, worldSize / 4);
    for (let i = 0; i < geometry.vertices.length; i++) {
        let v = geometry.vertices[i];
        v.z += noisefn(v.x * 0.01, v.y * 0.01) * 20;
        v.z += noisefn(v.x * 0.03, v.y * 0.03) * 2;
        v.z += noisefn(v.x * 0.006, v.y * 0.006) * 30;
        v.z += noisefn(v.x * 0.1, v.y * 0.1) * 0.7;

        if (v.z < -7) {
            v.z = -7;
        }

        // temporary hole for runway
        if (v.x > -80 && v.y > -185 && v.x < 80 && v.y < 185) {
            // console.log("X: " + v.x + " ABS: " + Math.abs(v.x / 72) + " COS: " + (Math.cos((v.x / 72) * Math.PI) + 1) / 2);
            v.z *= Math.abs(v.x / 72);
            v.z -= 5.8 * (Math.cos((v.x / 72) * Math.PI) + 1) / 2;
            
        }

        // saving the height
        let height = 200 + v.z;

        matrixRow.push(height);
        if (matrixRow.length === worldSize / 4 + 1) {
            matrix.push(matrixRow);
            matrixRow = [];
        } 
    }

    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.set(-toRad(90), 0, 0);
    scene.add(terrain);

    // physical representation of the terrain using a cannonjs heightfield
    // TODO: collision seems to be inaccurate at some angles
    // rotating the matrix is necessary to line it up with the terrain
    matrix = rotateMatrix(matrix);
    var hfShape = new CANNON.Heightfield(matrix, {
        elementSize: 4
    });
    var hfBody = new CANNON.Body({
        mass: 0
    });
    hfBody.addShape(hfShape);
    hfBody.position.set(-(worldSize / 2), -200, worldSize / 2);
    hfBody.quaternion.setFromEuler(-(Math.PI / 2), 0, 0);
    world.addBody(hfBody);


    // runway
    var runway = new THREE.Object3D();
    var geometry = new THREE.BoxGeometry(22, 2, 290);
    var material = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
    var road = new THREE.Mesh(geometry, material);
    road.position.set(0, -2, 40);
    runway.add(road);
    scene.add(runway);
    
    // physical representation of the runway
    var runwayBody = new CANNON.Body({
        position: new CANNON.Vec3(0, -1, 0),
        shape: new CANNON.Box(new CANNON.Vec3(11, 1, 145)),
        material: new CANNON.Material({friction: 0.0})
    });
    world.addBody(runwayBody);





    // trees
    for (let i = -treeAmount; i < treeAmount; i++) {
        for (let j = -treeAmount; j < treeAmount; j++) {
            var tree = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry(1, 2, 1);
            var material = new THREE.MeshBasicMaterial({color: 0x553311});
            var trunk = new THREE.Mesh(geometry, material);
            // collidableMeshList.push(trunk);
            trunk.position.set(0, 1, 0);
            tree.add(trunk);

            var geometry = new THREE.BoxGeometry(2.6, 2.6, 2.6);
            var material = new THREE.MeshBasicMaterial({color: 0x227722});
            var branches = new THREE.Mesh(geometry, material);
            // collidableMeshList.push(branches);
            branches.position.set(0, 3.3, 0);
            tree.add(branches);

            tree.scale.set(5, 5, 5);
            tree.position.set(i * 60 + (Math.random() * 40 - 20), 0, j * 60 + (Math.random() * 40 - 20));
            // environment.add(tree);
        }
    }

    // clouds
    for (let i = -cloudAmount; i < cloudAmount; i++) {
        for (let j = -cloudAmount; j < cloudAmount; j++) {
            var cloud = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry(2, 1, 1);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            var base = new THREE.Mesh(geometry, material);
            base.position.set(0, 0, 0);
            cloud.add(base);

            var geometry = new THREE.BoxGeometry(1, 0.8, 1);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            var fluff = new THREE.Mesh(geometry, material);
            fluff.position.set(0, 0.8, 0);
            cloud.add(fluff);

            cloud.rotation.y = Math.random() * 6.3;
            cloud.scale.set(Math.random() * 20 + 10, Math.random() * 10 + 10, Math.random() * 20 + 10);
            cloud.position.set(i * 120, Math.random() * 100 + 150, j * 120);
            environment.add(cloud);
        }
    }

    return environment;
}
