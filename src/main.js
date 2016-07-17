'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var esprima = require('esprima');

var getSource = require('./source');
var transform = require('./transform');
var createScene = require('./scene');
var drawTree = require('./tree');

//------------------------------------------------------------------------------
// Module
//------------------------------------------------------------------------------

var source = getSource();

console.time('parse');
var ast = esprima.parse(source);
console.timeEnd('parse');

console.time('transform');
var astTransformed = transform(ast);
console.timeEnd('transform');

console.dir(astTransformed);

var scene = createScene();

console.time('draw');
var tree = drawTree(astTransformed, 0x00FF00);
console.timeEnd('draw');

console.dir(tree);

scene.add(tree);
