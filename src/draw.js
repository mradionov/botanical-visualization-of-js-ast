(function () {

  const { Figure, Rectangle, Point } = window.ns;

  class Tree {

    constructor(tree, options) {
      this.stems = [];
      this.leaves = [];

      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.left = 0;
      this.width = 0;
      this.height = 0;

      this.parseNode(tree, options);
    }

    updateBox(figure) {
      this.top = Math.max(this.top, figure.getMaxY());
      this.right = Math.max(this.right, figure.getMaxX());
      this.bottom = Math.min(this.bottom, figure.getMinY());
      this.left = Math.min(this.left, figure.getMinX());
      this.width = this.right - this.left;
      this.height = this.top - this.bottom;
    }

    parseNode(node, options, mount) {
      const stem = this.createStem(node, options, mount);
      this.updateBox(stem);

      if (node.isLeaf) {
        this.stems.push(stem);

        if (options.leaves) {
          const leaf = this.createLeaf(stem.angle, stem.getTopCenter());
          this.updateBox(leaf);
          this.leaves.push(leaf);
        }

        return this;
      }

      this.stems.push(stem);

      this.parseNode(node.branch1, options, stem.getTopCenter());
      this.parseNode(node.branch2, options, stem.getTopCenter());
    }

    createStem(node, options, mount = new Point(0, 0)) {
      const figure = new Rectangle(0, 0, options.width, options.height);
      figure.scale(node.scale);
      figure.translate(mount.x - figure.getWidth() / 2, mount.y);
      figure.rotate(node.angle, mount);
      return figure;
    }

    createLeaf(angle, mount = new Point(0, 0)) {
      const mult = 3;
      const figure = new Figure(
        new Point(0, 0),
        new Point(-2 * mult, 1 * mult),
        new Point(0, 5 * mult),
        new Point(2 * mult, 1 * mult)
      );
      figure.translate(mount.x, mount.y);
      figure.rotate(angle, mount);
      return figure;
    }

    translate(x = 0, y = 0) {
      this.stems.forEach((stem) => {
        stem.translate(x, y);
      });
      this.leaves.forEach((leaf) => {
        leaf.translate(x, y);
      });
      this.top += y;
      this.bottom += y;
      this.left += x;
      this.right += x;
      return this;
    }

    scale(value) {
      this.stems.forEach((stem) => {
        stem.scale(value);
      });
      this.leaves.forEach((leaf) => {
        leaf.scale(value);
      });
      this.top *= value;
      this.bottom *= value;
      this.left *= value;
      this.right *= value;
      this.width *= value;
      this.height *= value;
      return this;
    }

    // Resize model to provided width and height (if exceeds) saving aspect ratio
    fit(width, height) {
      // Instead of using actual width of the tree, use a doubled width of
      // widest branch (left or right), it will allow to easily center
      // the tree on canvas
      const maxWidth = Math.max(Math.abs(this.left), Math.abs(this.right)) * 2;

      const scaleX = maxWidth > width ? (width / maxWidth) : 1;
      const scaleY = this.height > height ? (height / this.height) : 1;
      const scale = Math.min(scaleX, scaleY);

      this.scale(scale);

      return this;
    }

  }

  function draw(tree, options) {
    const model = new Tree(tree, options);
    return model;
  }

  Object.assign(window.ns, {
    draw,
  });

}());
