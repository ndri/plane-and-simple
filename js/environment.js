function drawEnvironment() {
    let environment = new THREE.Object3D();

    var geometry = new THREE.PlaneGeometry(50, 50, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x336633});
    var floor = new THREE.Mesh(geometry, material);
    floor.scale.set(15, 15, 15);
    floor.rotation.set(-toRad(90), 0, 0);
    environment.add(floor);

    for (let i=-5; i<5; i++) {
        for (let j=-5; j<5; j++) {
            var tree = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry( 1, 2, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x553311} );
            var trunk = new THREE.Mesh( geometry, material );
            trunk.position.set(0, 1, 0);
            tree.add(trunk);

            var geometry = new THREE.BoxGeometry( 2.6, 2.6, 2.6 );
            var material = new THREE.MeshBasicMaterial( {color: 0x227722} );
            var branches = new THREE.Mesh( geometry, material );
            branches.position.set(0, 3.3, 0);
            tree.add(branches);

            tree.scale.set(5, 5, 5);
            tree.position.set(i * 60, 0, j * 60);
            environment.add(tree);
        }
    }

    return environment;
}
