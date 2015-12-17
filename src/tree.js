(function () {
  'use strict';

  function toRad(deg) {
    return deg * Math.PI / 180;
  }


  var HEIGHT = 300;
  var RADIUS = 100;

  var TURN = toRad(ipt.config.turn);
  // var TURN = 0;
  var TURN_QUATER = toRad(90 - ipt.config.turn);
  // var TURN_QUATER = 0;
  var TILT = ipt.config.tilt;

  var enableCut = false;


  var sourceEl = document.getElementById('source');

  var source = sourceEl.innerHTML;

  var cache = {};

  var ast = esprima.parse(source);

  console.dir(ast);

  console.time('transform');

  var graph = ipt.ast.transform(ast);

  console.timeEnd('transform');

  console.time('scene');

  var scene = ipt.vis.scene.init();

  console.timeEnd('scene');


  console.time('draw');


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

  var tree = draw(graph, 0, 0, 0, 0x00FF00);

  console.timeEnd('draw');

  scene.add(tree);



  // ---------------------------------------------

  function draw(node, e, translateX, translateZ, color) {

    var material = createMaterial(color);
    var geometry = createGeometry(translateX, translateZ);
    var stem = new THREE.Mesh(geometry, material);

    // var stem = ipt.vis.parts.createStem();

    if (node.children.length === 0) {
      var leaf = ipt.vis.parts.createLeaf();
      return ;
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
    var tilt2 = toRad(-TILT * weightRatio1); // alpha2


    // var translateXZ1 = Math.sin(tilt1) * RADIUS;
    // var translateX1 = Math.cos(TURN) * translateXZ1;
    // var translateZ1 = Math.cos(TURN_QUATER) * translateXZ1;

    // var translateXZ2 = Math.sin(tilt2) * RADIUS;
    // var translateX2 = Math.cos(TURN) * translateXZ2;
    // var translateZ2 = Math.cos(TURN_QUATER) * translateXZ2;


    var translateX1 = - RADIUS + Math.cos(tilt1) * RADIUS;
    var translateX2 = RADIUS - Math.cos(tilt2) * RADIUS;

    // var translateX1 = 0;
    var translateZ1 = 0;

    // var translateX2 = 0;
    var translateZ2 = 0;

    console.log(tilt1, TURN);
    console.log(translateX1, translateZ1);
    console.log(translateX2, translateZ2);
    console.log('------------');


    var f;


    if (e <= 0) {
      f = 0.1 * weight;
    } else {
      f = e;
    }

    var dummy = ipt.vis.parts.createDummy();

    var childStem1 = draw(branch1, 0, 0, 0, 0x0000FF);
    if (childStem1) {

      // childStem1.rotateY(TURN);
      childStem1.rotateZ(tilt1);
      childStem1.scale.set(scale1, scale1, scale1);

      if (enableCut && e > 0) {
        childStem1.position.set(0, 0, 0);
        dummy.add(childStem1);
      } else {
        childStem1.position.set(translateX1, HEIGHT, translateZ1);
        stem.add(childStem1);
      }
    }

    var childStem2 = draw(branch2, f - weight1, 0, 0, 0xFF0000);
    if (childStem2) {

      // childStem2.rotateY(TURN);
      childStem2.rotateZ(tilt2);
      childStem2.scale.set(scale2, scale2, scale2);

      if (enableCut && e > 0) {
        childStem2.position.set(0, 0, 0);
        dummy.add(childStem2);
      } else {
        childStem2.position.set(translateX2, HEIGHT, translateZ2);
        stem.add(childStem2);
      }
    }

    if (enableCut && e > 0) {
      return dummy;
    }

    return stem;
  }

  function createGeometry(translateX, translateZ) {
    var geometry = new THREE.CylinderGeometry(
      RADIUS,
      RADIUS,
      HEIGHT,
      32
    );

    geometry.translate(
      0,
      HEIGHT / 2,
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

    cache.material = material;

    return material;
  }

}());
