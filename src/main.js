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


  if (!astTransformed.children.length) {
    console.error('No source code provided');
    return;
  }

  console.dir(astTransformed);

  var scene = MOD_SCENE.init();

  console.time('draw');
  var tree = MOD_TREE.draw(astTransformed, 0, 0x00FF00);
  console.timeEnd('draw');

  console.dir(tree);

  scene.add(tree);

}());
