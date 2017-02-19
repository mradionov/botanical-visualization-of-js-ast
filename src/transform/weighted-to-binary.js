(function () {

  const { constants, utils } = window.ns;

  function transformNode(
    weightedNode,
    options = {
      direction: constants.DIRECTION_RANDOM,
      tilt: 90,
    },
    params = {
      scale: 1,
      angle: 0,
      direction: 0,
    }
  ) {
    const binaryNode = {
      angle: params.angle,
      scale: params.scale,
      direction: params.direction,
      weight: weightedNode.weight,
      branch1: null,
      branch2: null,
      isLeaf: false,
    };

    if (!weightedNode.children.length) {
      binaryNode.isLeaf = true;
      return binaryNode;
    }

    const weight = weightedNode.weight; // s

    const branch1 = weightedNode.children.shift(); // d1
    weightedNode.weight -= branch1.weight;

    // Direciton right by default
    let direction = 1;
    if (options.direction === constants.DIRECTION_LEFT) {
      direction = -1;
    } else if (options.direction === constants.DIRECTION_RANDOM) {
      direction = utils.random(0, 1) === 0 ? 1 : -1;
    } else if (options.direction === constants.DIRECTION_ALTERNATE) {
      // Leading branch is used in a lot of pairs so this value will be available
      // for all children which have that same branch. Value of the "side" will
      // be switched by reference any time this branch is used.
      weightedNode.side = weightedNode.side == 0 ? 1 : 0;
      direction = weightedNode.side === 0 ? 1 : -1;
    }

    const direction1 = direction;
    const direction2 = -direction;

    const branch2 = weightedNode; // d2

    const weight1 = branch1.weight; // s1
    const weight2 = branch2.weight; // s2

    const weightRatio1 = weight1 / weight;
    const weightRatio2 = weight2 / weight;

    const scale1 = Math.sqrt(weightRatio1); // r1
    const scale2 = Math.sqrt(weightRatio2); // r2

    binaryNode.branch1 = transformNode(branch1, options, {
      angle: direction1 * options.tilt * weightRatio2 + params.angle,
      scale: params.scale * scale1,
      direction: direction1,
    });

    binaryNode.branch2 = transformNode(branch2, options, {
      angle: direction2 * options.tilt * weightRatio1 + params.angle,
      scale: params.scale * scale2,
      direction: direction2,
    });

    return binaryNode;
  }


  function weightedToBinary(weightedTree, options) {
    return transformNode(weightedTree, options);
  }

  window.ns.transform.weightedToBinary = weightedToBinary;

}());
