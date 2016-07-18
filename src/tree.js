'use strict';

//----------------------------------------------------------------------------
// Requirements
//----------------------------------------------------------------------------

var THREE = require('three');

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

var geometry = new THREE.CylinderGeometry(
  STEM_RADIUS,
  STEM_RADIUS,
  STEM_HEIGHT,
  32
);

// Translate geometry itself within a mesh to create a virtual pivot
// point for rotation - it allows to rotate a stem starting from the bottom.
// You have to compensate this translation when adding stem on the scene.
geometry.translate(0, STEM_HEIGHT / 2, 0);

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------

function toRad(deg) {
  return deg * Math.PI / 180;
}

//----------------------------------------------------------------------------
// Private
//----------------------------------------------------------------------------

// var loader = new THREE.TextureLoader();
// var texture = loader.load('images/texture.png');


function draw(branchedNode, color) {

  var stem = createStem(branchedNode, color);

  if (!branchedNode) {
    return stem;
  }

  if (!branchedNode.isRoot) {

    var tilt = toRad(TILT * branchedNode.weightRatio);

    var translateDist = STEM_RADIUS * tilt / toRad(90);
    if (branchedNode.isParentContinuation) {
      translateDist = -translateDist;
    }

    var translateX = -(translateDist * Math.sin(TURN_RAD));
    var translateY = - (Math.sin(tilt) * STEM_RADIUS);
    var translateZ = - (translateDist * Math.sin(TURN_REV_RAD));

    stem.rotateY(TURN_RAD);
    stem.rotateZ(branchedNode.isParentContinuation ? -tilt : tilt);

    stem.scale.set(
      branchedNode.relativeScale,
      branchedNode.relativeScale,
      branchedNode.relativeScale
    );

    stem.position.set(
      translateX,
      STEM_HEIGHT + translateY,
      translateZ
    );
  }

  // lol wut
  stem.add(draw(branchedNode.branch1, 0x0000FF));
  stem.add(draw(branchedNode.branch2, 0xFF0000));

  return stem;
}

function createStem(branchedNode, color) {
  branchedNode = branchedNode || {};

  var color = color || 0x00FF00;

  var material = new THREE.MeshBasicMaterial({
    // map: texture,
    color: color,
    wireframe: true
  });

  var mesh = new THREE.Mesh(geometry, material);

  mesh.custom = branchedNode;

  return mesh;
}

module.exports = draw;
