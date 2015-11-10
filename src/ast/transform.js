'use strict';

ipt.ast.transform = (function () {

  var isArray = Array.isArray;

  function isNode(node) {
    if (node == null) {
      return false;
    }
    return typeof node === 'object' && typeof node.type === 'string';
  }

  function isProperty(nodeType, key) {
    return (nodeType === 'ObjectExpression' || nodeType === 'ObjectPattern') && key === 'properties';
  }

  // var BORDER = 3;
  // var CUT = 0.6;

  // if (node.type === 'ObjectExpression' && prop === 'properties' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));

  // } else if (node.type === 'ArrayExpression' && prop === 'properties' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));

  // } else if (node.type === 'Fake' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));


  function transform(node) {

    var stem = {
      node: node,
      children: [],
      weight: 2
    };

    var props = ipt.ast.NODE_PROPERTIES[node.type];
    if (!props) {
      throw new Error('Unknown node type: %s', node.type);
    }

    var i = props.length;
    while ((i -= 1) >= 0) {

      var children = node[props[i]];
      if (isArray(children)) {

        var j = children.length;
        while ((j -= 1) >= 0) {

          if (isNode(children[j])) {
            stem.children.push(transform(children[j]));
          }

        }

      } else if (isNode(children)) {
        stem.children.push(transform(children));
      }

    }

    var k = stem.children.length;
    while ((k -= 1) >= 0) {
      stem.weight += stem.children[k].weight;
    }

    stem.children.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return stem;
  }

  return transform;

})();
