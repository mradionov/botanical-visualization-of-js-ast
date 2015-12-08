'use strict';

ipt.vis.scene = (function () {

  var scene, camera, renderer, controls;

  function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      30000
    );
    camera.position.z = 1000;
    camera.position.y = 700;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    document.body.appendChild(renderer.domElement);

    animate();

    return scene;
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  return {
    init: init
  };

})();
