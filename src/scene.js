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

var stats;

var scene, camera, renderer;

var controls;

var container = document.querySelector('[data-scene]');

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

  stats = new Stats();
  stats.domElement.className = 'stats'
  document.body.appendChild(stats.domElement);

  animate();

  return scene;
}

function animate() {

  window.requestAnimationFrame(animate);

  renderer.render(scene, camera);

  stats.update();
}

//----------------------------------------------------------------------------
// Public
//----------------------------------------------------------------------------

module.exports = init;
