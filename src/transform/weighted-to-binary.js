(function () {

  const { constants, utils } = window.ns;
  const { extend } = utils;

  function transformNode(
    weightedNode,
    options = {
      direction: constants.DIRECTION_RANDOM,
      tilt: 90,
    },
    params = {}
  ) {
    const binaryNode = Object.assign({
      angle: 0,
      relativeAngle: 0,
      scale: 1,
      relativeScale: 1,
      weight: weightedNode.weight,
      weightRatio: 1,
      branch1: null,
      branch2: null,
      isLeft: false,
      isRight: false,
      isLeaf: false,
      isRoot: false,
    }, params);

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
      angle: direction1 * options.tilt * weightRatio2 + binaryNode.angle,
      relativeAngle: direction1 * options.tilt * weightRatio2,
      scale: binaryNode.scale * scale1,
      relativeScale: scale1,
      weightRatio: weightRatio2,
      isLeft: direction1 === 1,
      isRight: direction1 === -1,
    });

    binaryNode.branch2 = transformNode(branch2, options, {
      angle: direction2 * options.tilt * weightRatio1 + binaryNode.angle,
      relativeAngle: direction2 * options.tilt * weightRatio1,
      scale: binaryNode.scale * scale2,
      relativeScale: scale2,
      weightRatio: weightRatio1,
      isLeft: direction2 === 1,
      isRight: direction2 === -1,
    });

    return binaryNode;
  }

  function weightedToBinary(weightedTree, options) {
    return transformNode(weightedTree, options, { isRoot: true });
  }

  window.ns.transform.weightedToBinary = weightedToBinary;

}());
