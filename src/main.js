'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var getSource = require('./source');
var parse = require('./parse');
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
var $errorContainer = document.querySelector('[data-error]');

function render() {
  if (tree) {
    threeUtils.removeChildren(scene);
    tree = null;
  }

  clearError();

  getSource()
    .then(time('parse'))
    .then(parse)
    .then(timeEnd('parse'))
    .then(function(ast) {

      console.time('transform');
      var astTransformed = transform(ast);
      console.timeEnd('transform');

      console.dir(astTransformed);

      console.time('draw');
      tree = drawTree(astTransformed, 0x00FF00);
      console.timeEnd('draw');

      console.dir(tree);

      scene.add(tree);

    })
    .catch(function (err) {
      console.error(err);
      showError(err);
    });

}

function showError(text) {
  $errorContainer.textContent = text;
  $errorContainer.style.display = 'block';
}

function clearError() {
  $errorContainer.textContent = '';
  $errorContainer.style.display = 'none';
}

function time(identifier) {
  console.time(identifier);
  return function (passthroughArgs) {
    return passthroughArgs;
  };
}

function timeEnd(identifier) {
  console.timeEnd(identifier);
  return function (passthroughArgs) {
    return passthroughArgs;
  };
}

render();

$sourceSubmitButton.addEventListener('click', render, false);
