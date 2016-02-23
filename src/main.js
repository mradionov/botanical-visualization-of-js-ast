/* global esprima, MOD_SOURCE, MOD_TRANSFORM, MOD_SCENE, MOD_TREE */
(function () {
  'use strict';

  var source = MOD_SOURCE.getSource();

  console.time('parse');
  var ast = esprima.parse(source);
  console.timeEnd('parse');

  console.time('transform');
  var astTransformed = MOD_TRANSFORM.transform(ast);
  console.timeEnd('transform');

  var scene = MOD_SCENE.init();

  console.time('draw');
  var tree = MOD_TREE.draw(astTransformed);
  console.timeEnd('draw');

  scene.add(tree);

}());
