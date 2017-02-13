(function () {

  const {
    config, settings, status,
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
      leaves: settings.get('leaves'),
    };
    console.log(options);

    console.time('source');
    status.progress('Retrieving source');
    const text = source.get();
    console.timeEnd('source');

    console.time('parse');
    status.progress('Parsing');
    const ast = parse(text);
    console.timeEnd('parse');

    console.time('transform');
    status.progress('Transforming');
    const tree = transform(ast, options);
    console.timeEnd('transform');

    console.time('draw');
    status.progress('Drawing');
    const model = draw(tree, options);
    console.timeEnd('draw');

    status.progress('Drawing');
    console.time('render');

    // Branches might go under the root because they are too deep
    // So move the whole tree up and prolong the root
    if (model.bottom < 0) {
      model.translate(0, Math.abs(model.bottom));
      const root = model.stems[0];
      root.setBottomLeft(new Point(root.getBottomLeft().x, 0));
      root.setBottomRight(new Point(root.getBottomRight().x, 0));
    }

    // Check if the tree is to big for the scene, make it fit
    const sceneWidth = scene.getWidth();
    const sceneHeight = scene.getHeight();
    model.fit(sceneWidth, sceneHeight);

    // Horizontally center the tree
    model.translate(scene.getWidth() / 2);

    model.stems.forEach(stem => {
      scene.drawFigure(stem, { fill: '#9B9188' })
    });
    model.leaves.forEach(leaf => {
      scene.drawQuadraticCurveFigure(leaf, { fill: '#9EB63A' })
    });

    status.clear();
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
