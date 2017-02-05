(function () {

  const { Rectangle, Point } = window.ns;

  function createFigure(node, options, mount = new Point(0, 0)) {
    const figure = new Rectangle(0, 0, options.width, options.height);
    figure.scale(node.scale);
    figure.translate(mount.x - figure.getWidth() / 2, mount.y);
    figure.rotate(node.angle, mount);
    return figure;
  }

  function drawNode(node, options, figures = [], mount) {
    const figure = createFigure(node, options, mount);

    if (node.isLeaf) {
      figures.push(figure);
      return figures;
    }

    figures.push(figure);

    drawNode(node.branch1, options, figures, figure.getTopCenter());
    drawNode(node.branch2, options, figures, figure.getTopCenter());

    return figures;
  }

  function draw(tree, options) {
    return drawNode(tree, options);
  }

  Object.assign(window.ns, {
    draw,
  });

}());
