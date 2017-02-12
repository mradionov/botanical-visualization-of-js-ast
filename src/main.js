(function () {

  const {
    config, settings,
    source, parse, transform, draw,
    Scene, Figure, Point
  } = window.ns;

  const scene = new Scene('.scene');

  function main() {

    source.save();

    scene.clear();
    console.log('-----------------------------------');
    console.log('-----------------------------------');
    const options = {
      height: config.STEM_HEIGHT,
      width: config.STEM_WIDTH,
      tilt: config.TILT,

      direction: settings.get('direction'),
      orphan: settings.get('orphan'),
    };
    console.log(options);
    console.log('-----------------------------------');

    console.time('source');
    const text = source.get();
    console.timeEnd('source');

    console.time('parse');
    const ast = parse(text);
    console.timeEnd('parse');

    console.time('transform');
    const tree = transform(ast, options);
    console.timeEnd('transform');

    console.time('draw');
    const stems = draw(tree, options);
    console.timeEnd('draw');

    console.time('render');

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
    console.timeEnd('render');

  }

  source.load();
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
