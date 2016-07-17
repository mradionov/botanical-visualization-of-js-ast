'use strict';

//----------------------------------------------------------------------------
// Requirements
//----------------------------------------------------------------------------

var THREE = require('three');

// OrbitControls is not optimized for CommonJS, it adds itself to THREE global,
// and is available after that as "THREE.OrbitControls"
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls');

var Stats = require('stats.js');

//----------------------------------------------------------------------------
// Module
//----------------------------------------------------------------------------

var stats, $node;

var scene, camera, renderer;

var controls, raycaster, mouse;

var container = document.querySelector('[data-scene]');

console.log(container);

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    1,
    30000
  );
  camera.position.z = 1000;
  camera.position.y = 700;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  stats = new Stats();
  stats.domElement.className = 'stats'
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

  var node = intersects[0].object.custom.astNode;
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

module.exports = init;
