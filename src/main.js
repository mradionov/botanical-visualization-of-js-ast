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
    const options = {
      height: config.STEM_HEIGHT,
      width: config.STEM_WIDTH,
      tilt: config.TILT,

      direction: settings.get('direction'),
      orphan: settings.get('orphan'),
    };
    console.log(options);

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
    const model = draw(tree, options);
    console.timeEnd('draw');

    console.time('render');

    // Branches might go under the root because they are too deep
    // So move the whole tree up and prolong the root
    if (model.bottom < 0) {
      model.translate(0, Math.abs(model.bottom));
      const root = model.nodes[0];
      root.setBottomLeft(new Point(root.getBottomLeft().x, 0));
      root.setBottomRight(new Point(root.getBottomRight().x, 0));
    }

    // Check if the tree is to big for the scene, make it fit
    const sceneWidth = scene.getWidth();
    const sceneHeight = scene.getHeight();
    model.fit(sceneWidth, sceneHeight);

    // Horizontally center the tree
    model.translate(scene.getWidth() / 2);

    model.nodes.forEach(node => scene.drawFigure(node));

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
