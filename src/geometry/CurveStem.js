(function () {

  const { Point, Curve, CurveFigure } = window.ns;


  class CurveStem extends CurveFigure {

    constructor(topWidth, bottomWidth, height, node) {
      const bottomLeft = new Point(- bottomWidth / 2, 0);
      const topLeft = new Point(- topWidth / 2, height);
      const topRight = new Point(topWidth / 2, height);
      const bottomRight = new Point(bottomWidth / 2, 0);

      super(
        new Curve(bottomLeft, topLeft),
        new Curve(topLeft, topRight),
        new Curve(topRight, bottomRight),
        new Curve(bottomRight, bottomLeft)
      );

      this.node = node;

      this.topWidth = topWidth;
      this.bottomWidth = bottomWidth;
    }

    getLeft() {
      return this.getCurve(0);
    }

    getTop() {
      return this.getCurve(1);
    }

    getRight() {
      return this.getCurve(2);
    }

    getBottom() {
      return this.getCurve(3);
    }

    // Connect side of the branch, which looks "outside" the tree, to a parent.
    // It is done by moving bottom point of current stem to
    // some side point of the parent.
    connectToParent(node, parentStem) {

      // if (node.isLeft) {
      //   const left = this.getLeft();
      //   const bottom = this.getBottom();

      //   // Connect current step to some point on a parent stem
      //   const connectionPoint = parentStem.getLeft().at(pos);
      //   left.setStart(connectionPoint);
      //   bottom.setEnd(connectionPoint);

      //   const controlVector = left.start
      //     .subtract(left.end)
      //     .normalize()
      //     .rotate(90)
      //     .multiplyScalar();

      //   const controlPoint = left.at(pos).add(controlVector);

      //   left.setControl(controlPoint);
      // }

      // if (node.isRight) {
      //   const right = this.getRight();
      //   const bottom = this.getBottom();

      //   // Connect current step to some point on a parent stem
      //   const connectionPoint = parentStem.getRight().at(1 - pos);
      //   right.setEnd(connectionPoint);
      //   bottom.setStart(connectionPoint);

      //   const controlVector = right.start
      //     .subtract(right.end)
      //     .normalize()
      //     .rotate(90)
      //     .multiplyScalar(10);

      //   const controlPoint = right.at(0.5).add(controlVector);

      //   right.setControl(controlPoint);
      // }

      return this;
    }

    getTopCenter() {
      return this.getTop().at(0.5);
    }

    getMount() {
      return this.getTopCenter();
    }

  }


  Object.assign(window.ns, {
    CurveStem,
  });

}());