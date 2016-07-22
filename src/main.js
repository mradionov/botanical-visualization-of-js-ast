'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var esprima = require('esprima');

var getSource = require('./source');
var transform = require('./transform');
var createScene = require('./scene');
var drawTree = require('./tree');
var threeUtils = require('./utils/three');

//------------------------------------------------------------------------------
// Module
//------------------------------------------------------------------------------

var scene = createScene();

var tree = null;

var $sourceSubmitButton = document.querySelector('[data-source-submit]');

function render() {
  if (tree) {
    threeUtils.removeChildren(scene);
    tree = null;
  }

  var source = getSource();

  console.time('parse');
  var ast = esprima.parse(source);
  console.timeEnd('parse');

  console.time('transform');
  var astTransformed = transform(ast);
  console.timeEnd('transform');

  console.dir(astTransformed);

  console.time('draw');
  tree = drawTree(astTransformed, 0x00FF00);
  console.timeEnd('draw');

  console.dir(tree);

  scene.add(tree);
}

render();

$sourceSubmitButton.addEventListener('click', render, false);
