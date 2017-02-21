(function () {

  const {
    config, utils, settings, status,
    source, parse, transform, draw,
    scene,
    Figure, Point
  } = window.ns;

  const leafColors = [
    '#9EB63A',
    '#B5CC41',
  ];

  function time(id) {
    return args => {
      console.time(id);
      return args;
    };
  }

  function timeEnd(id) {
    return args => {
      console.timeEnd(id);
      return args;
    };
  }

  function progress(message) {
    return args => {
      status.progress(message);
      return args;
    };
  }

  function main() {

    source.save();

    status.clear();

    console.log('-----------------------------------');
    const options = {
      height: config.STEM_HEIGHT,
      width: config.STEM_WIDTH,
      tilt: config.TILT,

      direction: settings.get('direction'),
      removeSameChildren: settings.get('removeSameChildren'),
      removeTinyChildren: settings.get('removeTinyChildren'),
      showLeaves: settings.get('showLeaves'),
    };
    console.log(options);

    Promise
    .resolve(true)

    .then(progress('Retrieving source'))
    .then(time('source'))
    .then(() => source.get())
    .then(timeEnd('source'))

    .then(progress('Rendering'))
    .then(time('parse'))
    .then(text => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(parse(text));
        });
      });
    })
    .then(timeEnd('parse'))

    .then(time('transform'))
    .then(ast => transform(ast, options))
    .then(timeEnd('transform'))

    .then(time('draw'))
    .then(tree => draw(tree, options))
    .then(timeEnd('draw'))

    .then(time('render'))
    .then((model) => {
      scene.clear();

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
        scene.drawFigure(stem, { fill: '#9B9188' });
      });
      model.leaves.forEach(leaf => {
        scene.drawCurveFigure(leaf, { fill: utils.randomElement(leafColors) })
      });

      status.clear();
    })
    .then(timeEnd('render'))
    .catch((err) => {
      console.error(err);
      status.error(err);
    });

  }

  source.load();
  main();

  Object.assign(window.ns, {
    main,
  });

}());
