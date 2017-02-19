(function () {

  const {
    Figure, Point, Curve
  } = window.ns;


  class Stem extends Figure {

    constructor(topWidth, bottomWidth, height, node) {
      super(
        new Point(- bottomWidth / 2, 0), // bottom left
        new Point(- topWidth / 2, height), // top left
        new Point(topWidth / 2, height), // top right
        new Point(bottomWidth / 2, 0) // bottom right
      );

      this.node = node;

      this.topWidth = topWidth;
      this.bottomWidth = bottomWidth;
    }

    getBottomLeft() {
      return this.getPoint(0);
    }

    getTopLeft() {
      return this.getPoint(1);
    }

    getTopRight() {
      return this.getPoint(2);
    }

    getBottomRight() {
      return this.getPoint(3);
    }

    setBottomLeft(point) {
      return this.setPoint(0, point);
    }

    setTopLeft(point) {
      return this.setPoint(1, point);
    }

    setTopRight(point) {
      return this.setPoint(2, point);
    }

    setBottomRight(point) {
      return this.setPoint(3, point);
    }

    // Connect side of the branch, which looks "outside" the tree, to a parent.
    // It is done by moving bottom point of current stem to
    // some side point of the parent.
    connectToParent(node, parentStem) {
      let start = parentStem.getTopLeft();
      let end = parentStem.getBottomLeft();
      if (node.direction === -1) {
        start = parentStem.getTopRight();
        end = parentStem.getBottomRight();
      }

      const connectionPoint = start.pointOnLineWith(end, 0.2);

      if (node.direction === -1) {
        this.setBottomRight(connectionPoint);
      } else {
        this.setBottomLeft(connectionPoint);
      }

      return this;
    }

    getTopCenter() {
      return this.getTopLeft().average(this.getTopRight());
    }

    getMount() {
      return this.getTopCenter();
    }

    getCurves() {
      const bl = this.getBottomLeft();
      const tl = this.getTopLeft();
      const tr = this.getTopRight();
      const br = this.getBottomRight();

      const left = new Curve(bl, tl, bl);
      const right = new Curve(tr, br, tr);

      // if (this.node.direction === 1) {
      //   const mid = left.at(0.5);
      //   const cp = mid.addScalar(15).rotate(-90 + left.getAngle(), mid);
      //   left.setControl(cp);
      // }

      // if (this.node.direction === -1) {
      //   const mid = right.at(0.5);
      //   const cp = mid.addScalar(15).rotate(-90 + right.getAngle(), mid);
      //   right.setControl(cp);
      // }

      return [
        left,
        new Curve(tl, tr, tl),
        right,
        new Curve(br, bl, br)
      ];
    }

  }


  Object.assign(window.ns, {
    Stem,
  });

}());