(function () {

  const {
    utils, config,
    Rectangle, Point
  } = window.ns;

  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

  function createStem({
    scale = 1,
    mount = new Point(0, 0),
    angle = 0,
  } = {}) {
    const stem = new Rectangle(0, 0, config.STEM_WIDTH, config.STEM_HEIGHT);
    stem.scale(scale);
    stem.translate(mount.x - stem.getWidth() / 2, mount.y);
    stem.rotate(angle, mount);
    return stem;
  }

  function createStems(
    node,
    options = { random: false },
    stems = [],
    stemParams = { scale: 1, angle: 0 }
  ) {
    const stem = createStem(stemParams);

    if (node.children.length === 0) {
      stems.push(stem);
      return stems;
    }

    const weight = node.weight; // s

    const branch1 = node.children.shift(); // d1
    node.weight -= branch1.weight;

    if (options.random) {
      node.side = utils.random(0, 1);
    } else {
      if (node.side === undefined) {
        node.side = 1;
      }
      node.side = node.side == 1 ? 0 : 1;
    }

    const branch2 = node;

    const weight1 = branch1.weight; // s1
    const weight2 = branch2.weight; // s2

    const weightRatio1 = weight1 / weight;
    const weightRatio2 = weight2 / weight;

    const scale1 = Math.sqrt(weightRatio1); // r1
    const scale2 = Math.sqrt(weightRatio2); // r2

    stems.push(stem);

    const m1 = node.side === 0 ? 1 : -1;
    const m2 = node.side === 0 ? -1 : 1;

    createStems(branch1, options, stems, {
      scale: stemParams.scale * scale1,
      mount: stem.getTopCenter(),
      angle: m1 * config.TILT * weightRatio2 + stemParams.angle,
    });
    createStems(branch2, options, stems, {
      scale: stemParams.scale * scale2,
      mount: stem.getTopCenter(),
      angle: m2 * config.TILT * weightRatio1 + stemParams.angle,
    });

    return stems;
  }

  function draw(tree, options = { random: false }) {
    return createStems(tree, options);
  }

  Object.assign(window.ns, {
    draw,
  });

}());
