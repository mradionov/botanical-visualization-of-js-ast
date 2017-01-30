(function () {

  const { config, parse, Scene, Figure, Rectangle, Point } = window.ns;

  const scene = new Scene();
  const textarea = document.querySelector('textarea');

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

  function createStems(node, stems = [], stemParams = { scale: 1, angle: 0 }) {
    const stem = createStem(stemParams);

    if (node.children.length === 0) {
      stems.push(stem);
      return stems;
    }

    const weight = node.weight; // s

    const branch1 = node.children.shift(); // d1
    node.weight -= branch1.weight;

    const branch2 = node;

    const weight1 = branch1.weight; // s1
    const weight2 = branch2.weight; // s2

    const weightRatio1 = weight1 / weight;
    const weightRatio2 = weight2 / weight;

    const scale1 = Math.sqrt(weightRatio1); // r1
    const scale2 = Math.sqrt(weightRatio2); // r2

    stems.push(stem);

    createStems(branch1, stems, {
      scale: stemParams.scale * scale1,
      mount: stem.getTopCenter(),
      angle: config.TILT * weightRatio2 + stemParams.angle,
    });
    createStems(branch2, stems, {
      scale: stemParams.scale * scale2,
      mount: stem.getTopCenter(),
      angle: - config.TILT * weightRatio1 + stemParams.angle,
    });

    return stems;
  }

  function save(source) {
    window.localStorage.setItem('source', source);
  }

  function load() {
    return window.localStorage.getItem('source') || 'var foo = 42;';
  }

  function main() {
    const source = textarea.value.trim();
    save(source);

    scene.clear();
    console.log('-----------------------------------');
    console.log('-----------------------------------');

    console.time('parse');
    const tree = parse(source);
    console.log({ tree });
    console.timeEnd('parse');

    console.time('stem');
    const stems = createStems(tree);
    console.log({ stems });
    console.timeEnd('stem');

    console.time('draw');

    // Branches might go under the root because they are too deep
    // So move the whole tree up and prolong the root
    const minY = Math.min(...stems.map(s => s.getMinY()));
    if (minY < 0) {
      stems.forEach((stem) => {
        stem.translate(0, Math.abs(minY));
      });
    }

    const root = stems[0];

    root.setBottomLeft(new Point(root.getBottomLeft().x, 0));
    root.setBottomRight(new Point(root.getBottomRight().x, 0));

    // Check if the tree is to big for the scene and make it fit
    // by scaling the scene
    const maxX = Math.max(...stems.map(s => s.getMaxX()));
    const maxY = Math.max(...stems.map(s => s.getMaxY()));

    const sceneWidth = scene.getWidth() / 2;
    const sceneHeight = scene.getHeight();

    const scaleX = maxX > sceneWidth ? (sceneWidth / maxX) : 1;
    const scaleY = maxY > sceneHeight ? (sceneHeight / maxY) : 1;

    const scale = Math.min(scaleX, scaleY);

    scene.scale(scale);

    stems.forEach((stem) => {
      // Center the tree
      stem.translate(scene.getScaledWidth() / 2);

      scene.drawFigure(stem);
    });
    console.timeEnd('draw');

  }

  textarea.value = load();
  main();

  Object.assign(window.ns, {
    main,
  });

  // const rect = new Figure(
  //   new Point(0, 0),
  //   new Point(0, 100),
  //   new Point(200, 100),
  //   new Point(200, 0)
  // );

  // rect.rotate(45);
  // rect.translate(100, 200);
  // scene.drawFigure(rect);

}());
