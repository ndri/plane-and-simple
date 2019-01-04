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

    // terrain TODO: noise texture; maybe different biomes, maybe more islands, treeinstance layer
    let treePositions = [];
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

        // finding the highest point of terrain (for coloring)
        if (v.z > maxHeight) {
            maxHeight = v.z;
        }

        // adding elements to heightfield
        if (i % slices === 0) {
            matrixRow.push(200 + v.z);
        }
        if ((i + 1) % (worldSize / meshSlices + 1) === 0) {
            if (i % slices === 0) {
                heightfieldMatrix.push(matrixRow);
            }
            matrixRow = []
        }

        // adding positions for trees
        if (i % 7 === 0) {
            treePositions.push(v);
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

            // vertexHeight in range 0...1
            let vertexHeight = geometry.vertices[vertexId].z / maxHeight;
            let h = 0;
            let s = 0;
            let l = 100;

            // gradient from yellow -> green -> grey -> white
            if (vertexHeight < 0.1) {
                h = 55 + 25 * ((vertexHeight - 0.01) * 11.111);
                s = 55 - 10 * ((vertexHeight - 0.01) * 11.111);
                l = 75 - 15 * ((vertexHeight - 0.01) * 11.111);
            } else if (vertexHeight < 0.3) {
                h = 80 - 25 * ((vertexHeight - 0.1) * 5);
                s = 45 - 25 * ((vertexHeight - 0.1) * 5);
                l = 60 - 20 * ((vertexHeight - 0.1) * 5);
            } else if (vertexHeight < 0.8) {
                h = 55;
                s = 20 - 20 * ((vertexHeight - 0.3) * 2);
                l = 40 + 60 * ((vertexHeight - 0.3) * 2);
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
    environment.add(terrain);

    // physical representation of the terrain using a cannonjs heightfield
    // TODO: collision seems to be inaccurate at some angles
    // rotating the heightfieldMatrix is necessary to line it up with the terrain
    heightfieldMatrix = rotateMatrix(heightfieldMatrix);
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
    let trees = new THREE.Object3D;

    const treegeometry = new THREE.Geometry();
    treegeometry.vertices = [
        new THREE.Vector3( -0.5, -0.5, -0.5 ),
        new THREE.Vector3( -0.5, 0.5, -0.5 ),
        new THREE.Vector3( 0.5, 0.5, -0.5 ),
        new THREE.Vector3( 0.5, -0.5, -0.5 ),
        new THREE.Vector3( 0, 0, 0.5 )
    ];
    treegeometry.faces = [
        new THREE.Face3( 0, 1, 2 ),
        new THREE.Face3( 0, 2, 3 ),
        new THREE.Face3( 1, 0, 4 ),
        new THREE.Face3( 2, 1, 4 ),
        new THREE.Face3( 3, 2, 4 ),
        new THREE.Face3( 0, 3, 4 )
    ];
    treegeometry.applyMatrix( new THREE.Matrix4().makeScale( 0.3, 0.3, 1 ) );
    treegeometry.verticesNeedUpdate = true;
    treegeometry.computeVertexNormals();
    // const treematerial = new THREE.MeshStandardMaterial({color: 0x337a58, roughness: 0.8, wireframe: true});
    const treematerial = new THREE.MeshStandardMaterial({color: 0x337a58, roughness: 0.8});
    const treemesh = new THREE.Mesh(treegeometry, treematerial);
    treemesh.castShadow = true;
    treemesh.receiveShadow = true;

    const trunkgeometry = new THREE.BoxGeometry(0.06, 0.06, 0.6);
    const trunkmaterial = new THREE.MeshStandardMaterial({color: 0xff7a58, roughness: 0.8});
    const trunkmesh = new THREE.Mesh(trunkgeometry, trunkmaterial);
    trunkmesh.castShadow = true;
    trunkmesh.receiveShadow = true;
    trunkmesh.position.set(0, 0, -0.8);

    const tree = new THREE.Object3D;
    tree.add(treemesh);
    tree.add(trunkmesh);
    tree.scale.set(40, 40, 40);

    for (let i = 0; i < treePositions.length; i++) {

        const v = treePositions[i];
        const x = v.x + Math.round(Math.random() * 10);
        const y = v.y + Math.round(Math.random() * 10);
        const z = v.z + 25;
        const noise = noisefn(x, y);
        const height = v.z / maxHeight;

        if (0.1 < height && height < 0.5 && noise < 0.2) {
            const treeinstance = tree.clone();
            treeinstance.position.set(x, y, z);
            treeinstance.rotation.set(toRad(noise * 10), toRad(noise * 10), toRad(noise * 360));
            trees.add(treeinstance);
        }
    }
    trees.rotation.set(-toRad(90), 0, 0);
    console.log(trees);
    environment.add(trees);


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