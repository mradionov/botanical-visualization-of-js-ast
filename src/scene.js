/* global THREE */
var MOD_SCENE = (function (tree) {
  'use strict';

  //----------------------------------------------------------------------------
  // Private
  //----------------------------------------------------------------------------

  var stats, $node;

  var scene, camera, renderer;

  var controls, raycaster, mouse;

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
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    $node = document.createElement('pre');
    document.body.appendChild($node);

    window.addEventListener('click', onClick, false);

    animate();

    return scene;
  }

  function animate() {

    window.requestAnimationFrame(animate);

    renderer.render(scene, camera);

    stats.update();
  }

  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObject(scene, true);
    if (!intersects.length) {
      return;
    }

    var node = intersects[0].object.custom.node;
    var string = JSON.stringify(node, function (key, value) {
      if (Array.isArray(value)) {
        return '[...]';
      }
      return value;
    }, 2);

    $node.innerHTML = string;
  }

  //----------------------------------------------------------------------------
  // Public
  //----------------------------------------------------------------------------

  return {
    init: init
  };

}());
