'use strict';

exports.removeChildren = function removeChildren(object) {
  for (var i = object.children.length - 1; i >= 0 ; i--) {
    object.remove(object.children[i]);
  }
};
