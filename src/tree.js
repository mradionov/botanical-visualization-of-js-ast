(function () {
  'use strict';




  var TURN = ipt.vis.utils.toRad(ipt.config.turn);
  // var TURN = 0;
  var TURN_QUATER = ipt.vis.utils.toRad(90 - ipt.config.turn);
  // var TURN_QUATER = 0;
  var TILT = ipt.config.tilt;

  var enableCut = true;


  var sourceEl = document.getElementById('source');

  var source = sourceEl.innerHTML;

  var ast = esprima.parse(source);

  console.dir(ast);

  console.time('transform');

  var graph = ipt.ast.transform(ast);

  console.timeEnd('transform');

  console.time('scene');

  var scene = ipt.vis.scene.init();

  console.timeEnd('scene');


  console.time('draw');

  var tree = draw(graph, 0);

  console.timeEnd('draw');

  scene.add(tree);



  // ---------------------------------------------



  function draw(node, e) {

    var stem = ipt.vis.parts.createStem();

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

    var tilt1 = ipt.vis.utils.toRad(TILT * weightRatio2); // alpha1
    var tilt2 = ipt.vis.utils.toRad(-TILT * weightRatio1); // alpha2

    var translateX1 = 0;
    var translateX2 = 0;
    var translateZ1 = 0;
    var translateZ2 = 0;

    var translateXZ1 = Math.sin(tilt1) * ipt.config.stem.radius;
    var translateXZ2 = Math.sin(tilt2) * ipt.config.stem.radius;

    var f;


    if (e <= 0) {
      f = 0.1 * weight;
    } else {
      f = e;
    }

    var dummy = ipt.vis.parts.createDummy();

    var childStem1 = draw(branch1, 0);
    if (childStem1) {

      childStem1.rotateY(TURN);
      childStem1.rotateZ(tilt1);
      childStem1.scale.set(scale1, scale1, scale1);

      translateX1 = Math.cos(TURN) * translateXZ1 * -1;
      translateZ1 = Math.cos(TURN_QUATER) * translateXZ1;

      if (enableCut && e > 0) {
        childStem1.position.set(0, 0, 0);
        dummy.add(childStem1);
      } else {
        childStem1.position.set(0, ipt.config.stem.height, 0);
        stem.add(childStem1);
      }
    }

    var childStem2 = draw(branch2, f - weight1);
    if (childStem2) {

      childStem2.rotateY(TURN);
      childStem2.rotateZ(tilt2);
      childStem2.scale.set(scale2, scale2, scale2);

    //   translateX2 = Math.cos(TURN) * translateXZ2 * -1;
    //   translateZ2 = Math.cos(TURN_QUATER) * translateXZ2;

      if (enableCut && e > 0) {
        childStem2.position.set(0, 0, 0);
        dummy.add(childStem2);
      } else {
        childStem2.position.set(0, ipt.config.stem.height, 0);
        stem.add(childStem2);
      }
    }

    if (enableCut && e > 0) {
      return dummy;
    }

    return stem;
  }

}());
