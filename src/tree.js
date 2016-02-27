/* global THREE */
var MOD_TREE = (function () {
  'use strict';

  //----------------------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------------------

  var GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

  var STEM_HEIGHT = 300;
  var STEM_RADIUS = 100;

  // angle for y-axis rotation
  var TURN = 360 / GOLDEN_RATIO; // ~ 222 degrees
  var TURN_RAD = toRad(TURN);
  var TURN_REV_RAD = toRad(360 - TURN);

  // angle for z-axis rotation
  var TILT = 90;

  var ENABLE_CUT = false;

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  function toRad(deg) {
    return deg * Math.PI / 180;
  }

  function getBoundingBox(obj) {
    return (new THREE.Box3()).setFromObject(obj);
  }

  /*

  var ungle = -90;

  var material = new THREE.MeshBasicMaterial({
    color: 0xFF0000,
    wireframe: true
  });
  var geometry = new THREE.CylinderGeometry(150, 150, 300, 32);

  geometry.translate(
    0,
    150,
    0
  );

  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    150 - Math.cos(toRad(ungle)) * 150,
    -150,
    0
  );

  mesh.rotateZ(toRad(ungle));



  var cmaterial = new THREE.MeshBasicMaterial({
    color: 0x0000FF,
    wireframe: true
  });

  var cgeometry = new THREE.CylinderGeometry(100, 100, 300, 32);

  cgeometry.translate(
    0,
    150,
    0
  );


  var cmesh = new THREE.Mesh(cgeometry, cmaterial);

  cmesh.position.set(
    0,
    300,
    0
  );

  // mesh.add(cmesh);




  var bmaterial = new THREE.MeshBasicMaterial({
    color: 0x00FF00,
    wireframe: true
  });
  var bgeometry = new THREE.CubeGeometry(300, 300, 300);
  var bmesh = new THREE.Mesh(bgeometry, bmaterial);

  scene.add(mesh);
  scene.add(bmesh);
  //*/

  //----------------------------------------------------------------------------
  // Private
  //----------------------------------------------------------------------------

  var cache = {};

  function draw(node, e, color) {
    var material = createMaterial(color);
    var geometry = createGeometry();
    var stem = new THREE.Mesh(geometry, material);

    stem.custom = node;

    if (node.children.length === 0) {
      return stem;
    }

    var weight = node.weight;      // s

    var branch1 = node.children.shift(); // d1
    node.weight -= branch1.weight;

    // get what is left from parent without largest child
    var branch2 = node;                  // d2

    var weight1 = branch1.weight; // s1
    var weight2 = branch2.weight; // s2

    var weightRatio1 = weight1 / weight;
    var weightRatio2 = weight2 / weight;

    var scale1 = Math.sqrt(weightRatio1); // r1
    var scale2 = Math.sqrt(weightRatio2); // r2

    var tilt1 = toRad(TILT * weightRatio2); // alpha1
    var tilt2 = toRad(TILT * weightRatio1); // alpha2


    var translateDist1 = STEM_RADIUS * tilt1 / toRad(90);
    var translateDist2 = STEM_RADIUS * - tilt2 / toRad(90);

    var translateX1 = -(translateDist1 * Math.sin(TURN_RAD));
    var translateY1 = - (Math.sin(tilt1) * STEM_RADIUS);
    var translateZ1 = -(translateDist1 * Math.sin(TURN_REV_RAD));

    var translateX2 = -(translateDist2 * Math.sin(TURN_RAD));
    var translateY2 = - (Math.sin(tilt2) * STEM_RADIUS * scale2);
    var translateZ2 = -(translateDist2 * Math.sin(TURN_REV_RAD));


    var f;


    if (e <= 0) {
      f = 0.1 * weight;
    } else {
      f = e;
    }

    var dummy = createDummy();

    var childStem1 = draw(branch1, 0, 0x0000FF);
    if (childStem1) {

      childStem1.rotateY(TURN_RAD);
      childStem1.rotateZ(tilt1);
      childStem1.scale.set(scale1, scale1, scale1);

      if (ENABLE_CUT && e > 0) {
        childStem1.position.set(0, 0, 0);
        dummy.add(childStem1);
      } else {
        childStem1.position.set(translateX1, STEM_HEIGHT + translateY1, translateZ1);
        stem.add(childStem1);
      }
    }

    var childStem2 = draw(branch2, f - weight1, 0xFF0000);
    if (childStem2) {

      childStem2.rotateY(TURN_RAD);
      childStem2.rotateZ(-tilt2);
      childStem2.scale.set(scale2, scale2, scale2);

      if (ENABLE_CUT && e > 0) {
        childStem2.position.set(0, 0, 0);
        dummy.add(childStem2);
      } else {
        childStem2.position.set(translateX2, STEM_HEIGHT + translateY2, translateZ2);
        stem.add(childStem2);
      }
    }

    if (ENABLE_CUT && e > 0) {
      return dummy;
    }

    return stem;
  }

  function createGeometry() {
    var geometry = new THREE.CylinderGeometry(
      STEM_RADIUS,
      STEM_RADIUS,
      STEM_HEIGHT,
      32
    );

    geometry.translate(
      0,
      STEM_HEIGHT / 2,
      0
    );

    return geometry;
  }


  function createMaterial(color) {
    // if (cache.material) {
    //   return cache.material;
    // }

    var material = new THREE.MeshBasicMaterial({
      color: color || 0xFF0000,
      wireframe: true
    });

    // cache.material = material;

    return material;
  }

  function createDummy() {
    var geometry = new THREE.BoxGeometry(STEM_RADIUS * 2, 0, STEM_RADIUS * 2);
    var material = new THREE.MeshBasicMaterial({
      color: 0x0000FF,
      wireframe: false,
      visible: false
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  //----------------------------------------------------------------------------
  // Public API
  //----------------------------------------------------------------------------

  return {
    draw: draw
  };

}());
