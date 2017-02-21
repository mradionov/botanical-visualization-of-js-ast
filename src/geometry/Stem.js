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
      return (new Line(this.getTopLeft(), this.getTopRight())).at(0.5);
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