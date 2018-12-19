function addEnvironment(noisefn) {
    let environment = new THREE.Object3D();

    // lights TODO: calculate terrain lighting only once
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

    light = new THREE.DirectionalLight(0xffffff, 0.98);
    light.position.set(0, 550, 0);
    light.position.multiplyScalar(1.3);

    // let target = new THREE.Object3D();
    // scene.add(target);
    // target.position.set(100, 0, -300);
    // light.target = target;
    light.target = plane;

    light.castShadow = shadows;

    // shadow resolution
    light.shadow.mapSize.width = 8192;
    light.shadow.mapSize.height = 8192;

    // shadow camera size (how far away form the plane shadows are rendered)
    const d = worldSize / 10;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = viewDistance + 1000;

    // shadow visualization
    scene.add(new THREE.CameraHelper(light.shadow.camera));
    scene.add(light);

    // water
    var geometry = new THREE.PlaneGeometry(worldSize, worldSize, 1);
    var material = new THREE.MeshStandardMaterial({color: 0x3490DC, roughness: 0.5});
    var water = new THREE.Mesh(geometry, material);
    water.rotation.set(-toRad(90), 0, 0);

    water.receiveShadow = true;
    geometry.verticesNeedUpdate = true;
    geometry.computeVertexNormals();
    environment.add(water);

    // fog
    scene.fog = new THREE.Fog(0x6bc0ff, 10, viewDistance);
    renderer.setClearColor(scene.fog.color, 1);

    // terrain TODO: noise texture; maybe different biomes, maybe more islands, tree layer
    var material = new THREE.MeshStandardMaterial({
        roughness: 0.83,
        vertexColors: THREE.VertexColors,
    });

    // heightfieldMatrix where the heights will be saved for the cannonjs heightfield
    var heightfieldMatrix = [];
    var matrixRow = [];

    // var meshSlices = 4; (in config)
    // var slices = 4;
    var geometry = new THREE.PlaneGeometry(worldSize, worldSize, worldSize / meshSlices, worldSize / meshSlices);

    let maxHeight = 0;

    // terrain height with 5 layers of perlin noise
    for (let i = 0; i < geometry.vertices.length; i++) {
        let v = geometry.vertices[i];
        let x = v.x * 0.42;
        let y = v.y * 0.42;

        v.z += noisefn(x * 0.003, y * 0.002) * 30 + 6;
        v.z += noisefn(x * 0.005, y * 0.005) * 20;
        v.z += noisefn(x * 0.03, y * 0.03) * 2;
        v.z += noisefn(x * 0.01, y * 0.01) * 10;
        v.z += noisefn(x * 0.1, y * 0.1) * 0.7;
        v.z *= 3;

        let xpow = Math.pow(v.x, 2);
        let ypow = Math.pow(v.y, 2);
        let rpow = Math.pow(worldSize / 2, 2);
        let rline = xpow + ypow;

        // v.z = 100;

        // lower area outside of island circle
        if (rline / rpow > 1) {
            v.z = 0;
        } else {
            v.z *= Math.pow(Math.cos((rline / (rpow * 2)) * Math.PI), 1.8);
        }

        // make center of island higher
        if (rline / rpow < 0.5) {
            v.z += Math.pow(Math.cos((rline / rpow) * Math.PI), 5) * 120;
        }
        if (rline / rpow < 0.05) {
            v.z += Math.pow(Math.cos((rline / (rpow / 10)) * Math.PI), 2) * 60;
        }

        // water level
        if (v.z < 0) {
            v.z = 0;
        }

        v.z -= 10;

        // v.z = 100;

        // find highest point of terrain (for coloring)
        if (v.z > maxHeight) {
            maxHeight = v.z;
        }

        // saving the height
        let height = 200 + v.z;

        if (i % slices === 0) {
            matrixRow.push(height);
        }

        if ((i + 1) % (worldSize / meshSlices + 1) === 0) {
            if (i % slices === 0) {
                heightfieldMatrix.push(matrixRow);
            }
            // console.log(i);
            matrixRow = []
        }
    }

    console.log(heightfieldMatrix);


    // coloring vertices by height
    for (let i = 0; i < geometry.faces.length; i++) {
        let f = geometry.faces[i];

        for (let j = 0; j < 3; j++) {
            let vertexId;
            if (j < 1) {
                vertexId = f.a;
            } else if (j < 2) {
                vertexId = f.b;
            } else {
                vertexId = f.c;
            }

            // faceHeight in range 0...1
            let faceHeight = geometry.vertices[vertexId].z / maxHeight;
            let h = 0;
            let s = 0;
            let l = 100;

            // gradient from yellow -> green -> grey -> white
            if (faceHeight < 0.1) {
                h = 55 + 25 * ((faceHeight - 0.01) * 11.111);
                s = 55 - 10 * ((faceHeight - 0.01) * 11.111);
                l = 75 - 15 * ((faceHeight - 0.01) * 11.111);
            } else if (faceHeight < 0.3) {
                h = 80 - 25 * ((faceHeight - 0.1) * 5);
                s = 45 - 25 * ((faceHeight - 0.1) * 5);
                l = 60 - 20 * ((faceHeight - 0.1) * 5);
            } else if (faceHeight < 0.8) {
                h = 55;
                s = 20 - 20 * ((faceHeight - 0.3) * 2);
                l = 40 + 60 * ((faceHeight - 0.3) * 2);
            }

            s = Math.round(s);
            l = Math.round(l);
            f.vertexColors[j] = new THREE.Color("hsl(" + h + "," + s + "%," + l + "%)");
        }
    }

    geometry.verticesNeedUpdate = true;
    geometry.computeVertexNormals();


    var terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.set(-toRad(90), 0, 0);
    terrain.name = "Terrain";
    // terrain.castShadow = true;
    terrain.receiveShadow = true;

    scene.add(terrain);

    // physical representation of the terrain using a cannonjs heightfield
    // TODO: collision seems to be inaccurate at some angles
    // rotating the heightfieldMatrix is necessary to line it up with the terrain
    heightfieldMatrix = rotateMatrix(heightfieldMatrix);
    // TODO: try using Heightfield minValue, maxValue
    var hfShape = new CANNON.Heightfield(heightfieldMatrix, {
        elementSize: slices * meshSlices
    });

    var hfBody = new CANNON.Body({
        mass: 0
    });
    hfBody.addShape(hfShape);
    hfBody.position.set(-(worldSize / 2), -200, worldSize / 2);
    hfBody.quaternion.setFromEuler(-(Math.PI / 2), 0, 0);
    world.addBody(hfBody);


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

    // clouds TODO: improve, maybe two combined perlin planes
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

    return [environment, water, heightfieldMatrix];
}

function moveWaterAndLight() {
    water.position.x = plane.position.x;
    water.position.z = plane.position.z;

    light.position.x = plane.position.x + 0;
    light.position.z = plane.position.z - 300;
    light.position.y = plane.position.y + 300;
}