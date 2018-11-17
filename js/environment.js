function drawEnvironment() {
    let environment = new THREE.Object3D();

    // land
    var geometry = new THREE.PlaneGeometry(2000, 2000, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x336633});
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.set(-toRad(90), 0, 0);
    environment.add(floor);

    // trees
    for (let i=-15; i<15; i++) {
        for (let j=-15; j<15; j++) {
            var tree = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry( 1, 2, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x553311} );
            var trunk = new THREE.Mesh( geometry, material );
            collidableMeshList.push(trunk);
            trunk.position.set(0, 1, 0);
            tree.add(trunk);

            var geometry = new THREE.BoxGeometry( 2.6, 2.6, 2.6 );
            var material = new THREE.MeshBasicMaterial( {color: 0x227722} );
            var branches = new THREE.Mesh( geometry, material );
            collidableMeshList.push(branches);
            branches.position.set(0, 3.3, 0);
            tree.add(branches);

            tree.scale.set(5, 5, 5);
            tree.position.set(i * 60 +(Math.random() * 40 - 20), 0, j * 60 + (Math.random() * 40 - 20));
            environment.add(tree);
        }
    }

    // clouds
    for (let i=-8; i<8; i++) {
        for (let j=-8; j<8; j++) {
            var cloud = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry(2, 1, 1);
            var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            var base = new THREE.Mesh( geometry, material );
            base.position.set(0, 0, 0);
            cloud.add(base);

            var geometry = new THREE.BoxGeometry(1, 0.8, 1);
            var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            var fluff = new THREE.Mesh( geometry, material );
            fluff.position.set(0, 0.8, 0);
            cloud.add(fluff);

            cloud.rotation.y = Math.random() * 6.3;
            cloud.scale.set(Math.random() * 20 + 10, Math.random() * 10 + 10, Math.random() * 20 + 10);
            cloud.position.set(i * 120, Math.random() * 100 + 100, j * 120);
            environment.add(cloud);
        }
    }

    return environment;
}
