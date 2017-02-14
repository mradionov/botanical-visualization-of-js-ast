(function () {

  const {
    Figure, Rectangle, Point,
    QuadraticCurve, QuadraticCurveFigure, Stem
  } = window.ns;

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

      if (node.isLeaf) {
        const leafStem = this.createLeafStem(node, options, mount);
        this.updateBox(leafStem);
        this.stems.push(leafStem);

        if (options.leaves) {
          const leaf = this.createLeaf(leafStem.angle, leafStem.getMount());
          this.updateBox(leaf);
          this.leaves.push(leaf);
        }

        return this;
      }

      const stem = this.createStem(node, options, mount);
      this.updateBox(stem);
      this.stems.push(stem);

      this.parseNode(node.branch1, options, stem.getMount());
      this.parseNode(node.branch2, options, stem.getMount());
    }

    createStem(node, options, mount = new Point(0, 0)) {
      const bottomWidth = options.width * node.scale;
      const topWidth = options.width * Math.max(
        node.branch1 && node.branch1.scale,
        node.branch2 && node.branch2.scale
      );
      const height = options.height * node.scale;

      const stem = new Stem(topWidth, bottomWidth, height);

      stem.translate(mount.x, mount.y);
      stem.rotate(node.angle, mount);

      return stem;
    }

    createLeafStem(node, options, mount = new Point(0, 0)) {
      const bottomWidth = options.width * node.scale;
      const height = options.height * node.scale;

      const leafStem = new Stem(0, bottomWidth, height);

      leafStem.translate(mount.x, mount.y);
      leafStem.rotate(node.angle, mount);

      return leafStem;
    }

    createLeaf(angle, mount = new Point(0, 0)) {
      const m = 7; // Size multiplier
      const leaf = new QuadraticCurveFigure(
        new QuadraticCurve(0, 0, 0, 0),
        new QuadraticCurve(-2 * m, 1 * m, 0, 4 * m),
        new QuadraticCurve(2 * m, 1 * m, 0, 0)
      );
      leaf.translate(mount.x, mount.y);
      leaf.rotate(angle, mount);
      return leaf;
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
