(function () {

  const { Figure, Point, Line } = window.ns;


  class Stem extends Figure {

    constructor(topWidth, bottomWidth, height, node) {
      super(
        new Point(- bottomWidth / 2, 0),
        new Point(- topWidth / 2, height),
        new Point(topWidth / 2, height),
        new Point(bottomWidth / 2, 0)
      );

      this.node = node;

      this.topWidth = topWidth;
      this.bottomWidth = bottomWidth;
    }

    getTopLeft() {
      return this.getPoint(1);
    }

    getTopRight() {
      return this.getPoint(2);
    }

    getTopCenter() {
      const mid = (new Line(this.getTopLeft(), this.getTopRight())).at(0.5);
      // Move one unit down to hide the gap
      const normal = mid
        .normalize()
        .rotate(this.node.angle + 180);
      return mid.add(normal);
    }

    getMount() {
      return this.getTopCenter();
    }

    connectToParent() {
      return this;
    }

  }


  Object.assign(window.ns, {
    Stem,
  });

}());