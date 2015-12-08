'use strict';

ipt.vis.parts = (function () {

  return {

    createStem: function (opts) {
      var geometry = new THREE.CylinderGeometry(
        ipt.config.stem.radius,
        ipt.config.stem.radius,
        ipt.config.stem.height,
        32
      );

      geometry.translate(
        0,
        ipt.config.stem.height / 2,
        0
      );

      var material = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true
      });

      var mesh = new THREE.Mesh(geometry, material);

      return mesh;
    },

    createLeaf: function () {
      var cylinderGeometry = new THREE.CylinderGeometry(ipt.config.stem.radius, ipt.config.stem.radius, ipt.config.stem.height, 32);
      var cylinderMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: true
      });
      var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

      var boxGeometry = new THREE.BoxGeometry(ipt.config.stem.radius * 2, ipt.config.stem.height, ipt.config.stem.radius * 2);
      var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: false,
        visible: false
      });
      var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      boxMesh.add(cylinderMesh);

      cylinderMesh.position.set(0, ipt.config.stem.height / 2, 0);

      return {
        cylinder: cylinderMesh,
        box: boxMesh
      };
    },

    createDummy: function () {
      var boxGeometry = new THREE.BoxGeometry(ipt.config.stem.radius * 2, 0, ipt.config.stem.radius * 2);
      var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        wireframe: false,
        visible: false
      });
      var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      return boxMesh;
    }

  };

})();
