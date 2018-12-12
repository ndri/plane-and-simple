function addEnvironment(noisefn) {
    let environment = new THREE.Object3D();

    // water
    var geometry = new THREE.PlaneGeometry(viewDistance * 3, viewDistance * 3, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x3490DC, shininess: 80});
    var water = new THREE.Mesh(geometry, material);
    water.rotation.set(-toRad(90), 0, 0);
    environment.add(water);

    scene.fog = new THREE.Fog( 0x6bc0ff, 10, viewDistance );
    renderer.setClearColor( scene.fog.color, 1 );


    // lights
    let dirLight = new THREE.DirectionalLight(0xfffeee, 0.95);
    dirLight.position.set(200, 400, 0);
    scene.add(dirLight);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);


    // terrain TODO: color by altidude; generate new terrain when out of worldsize; maybe different biomes
    var material = new THREE.MeshPhongMaterial({
        color: 0x4eba4e,
        specular: 0x773300,
        flatShading: true,
        shininess: 3
    });
    var geometry = new THREE.PlaneGeometry(worldSize / 1.2, worldSize / 1.2, 450, 450);
    for (let i = 0; i < geometry.vertices.length; i++) {
        let v = geometry.vertices[i];
        // let x = v.x + 1000;
        // let y = v.y + 1000;
        let x = v.x * 0.46;
        let y = v.y * 0.46;

        v.z += noisefn(x * 0.003, y * 0.002) * 30 + 6;
        v.z += noisefn(x * 0.005, y * 0.005) * 20;
        v.z += noisefn(x * 0.03, y * 0.03) * 2;
        v.z += noisefn(x * 0.01, y * 0.01) * 10;
        v.z += noisefn(x * 0.1, y * 0.1) * 0.7;
        v.z *= 3;

        let xpow = Math.pow(v.x, 2);
        let ypow = Math.pow(v.y, 2);
        let rpow = Math.pow(worldSize/2, 2);
        let rline = xpow + ypow;

        // v.z = 400;

        // lower area outside of island circle
        if (rline / rpow > 1) {
            v.z = 0;
        } else {
            v.z *= Math.pow(Math.cos((rline / (rpow * 2)) * Math.PI), 1.8);
        }

        // make center of island higher
        if (rline / rpow > 0.5) {
            v.z += 0;
        } else {
            v.z += Math.pow(Math.cos((rline / rpow) * Math.PI), 2) * 100;
        }

        if (v.z < 0) {
            v.z = 0;
        }

        v.z -= 10;
    }

    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.set(-toRad(90), 0, 0);
    terrain.scale.set(1.2, 1.2, 1);
    scene.add(terrain);


    // runway
    var runway = new THREE.Object3D();
    var geometry = new THREE.BoxGeometry(22, 2, 290);
    var material = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
    var road = new THREE.Mesh(geometry, material);
    road.position.set(0, -2, 40);
    runway.add(road);
    scene.add(runway);


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

    return [environment, water];
}

function moveWater() {
    water.position.x = plane.position.x;
    water.position.z = plane.position.z;
}