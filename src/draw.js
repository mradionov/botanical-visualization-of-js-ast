(function () {

  const { BoundingBox, Stem, Leaf } = window.ns;

  class Tree {

    constructor(tree, options) {
      this.stems = [];
      this.leaves = [];

      this.box = new BoundingBox();

      this.parseNode(tree, options);
    }

    parseNode(node, options, parentStem = null) {

      if (options.removeTinyChildren && node.relativeScale < 0.1) {
        return this;
      }

      if (node.isLeaf) {

        const leafStem = this.createLeafStem(node, options, parentStem);
        this.box.addPoints(leafStem.getPoints());
        this.stems.push(leafStem);

        if (options.showLeaves) {
          const leaf = this.createLeaf(leafStem.angle, leafStem);
          this.box.addPoints(leaf.getPoints());
          this.leaves.push(leaf);
        }

        return this;
      }

      const stem = this.createStem(node, options, parentStem);
      this.box.addPoints(stem.getPoints());
      this.stems.push(stem);

      this.parseNode(node.branch1, options, stem);
      this.parseNode(node.branch2, options, stem);
    }

    createStem(node, options, parentStem = null) {
      const bottomWidth = options.width * node.scale;
      const topWidth = options.width * Math.max(
        node.branch1 && node.branch1.scale,
        node.branch2 && node.branch2.scale
      );
      const height = options.height * node.scale;

      const stem = new Stem(topWidth, bottomWidth, height, node);

      if (parentStem) {
        const mount = parentStem.getMount();
        stem.translate(mount.x, mount.y);
        stem.rotate(node.angle, mount);
        stem.connectToParent(node, parentStem);
      }

      return stem;
    }

    createLeafStem(node, options, parentStem = null) {
      const bottomWidth = options.width * node.scale;
      const height = options.height * node.scale;

      const leafStem = new Stem(0, bottomWidth, height, node);

      if (parentStem) {
        const mount = parentStem.getMount();
        leafStem.translate(mount.x, mount.y);
        leafStem.rotate(node.angle, mount);
        leafStem.connectToParent(node, parentStem);
      }

      return leafStem;
    }

    createLeaf(angle, parentStem = null) {
      const leaf = new Leaf();

      if (parentStem) {
        const mount = parentStem.getMount();
        leaf.translate(mount.x, mount.y);
        leaf.rotate(angle, mount);
      }

      return leaf;
    }

    translate(x = 0, y = 0) {
      this.stems.forEach((stem) => {
        stem.translate(x, y);
      });
      this.leaves.forEach((leaf) => {
        leaf.translate(x, y);
      });
      this.box.translate(x, y);
      return this;
    }

    scale(value) {
      this.stems.forEach((stem) => {
        stem.scale(value);
      });
      this.leaves.forEach((leaf) => {
        leaf.scale(value);
      });
      this.box.scale(value);
      return this;
    }

    // Resize model to provided width and height (if exceeds) saving aspect ratio
    fit(width, height) {
      // Instead of using actual width of the tree, use a doubled width of
      // widest branch (left or right), it will allow to easily center
      // the tree on canvas
      const maxWidth = 2 * Math.max(
        Math.abs(this.box.left), Math.abs(this.box.right)
      );

      const scaleX = maxWidth > width ? (width / maxWidth) : 1;
      const scaleY = this.box.height > height ? (height / this.box.height) : 1;
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
