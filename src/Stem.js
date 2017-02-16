(function () {

  const {
    Figure, Point,
    QuadraticCurve
  } = window.ns;


  class Stem extends Figure {

    constructor(topWidth, bottomWidth, height) {
      super(
        new Point(- bottomWidth / 2, 0), // bottom left
        new Point(- topWidth / 2, height), // top left
        new Point(topWidth / 2, height), // top right
        new Point(bottomWidth / 2, 0) // bottom right
      );

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
      return [
        new QuadraticCurve(bl.x, bl.y, bl.x, bl.y),
        new QuadraticCurve(tl.x, tl.y, tl.x, tl.y),
        new QuadraticCurve(tr.x, tr.y, tr.x, tr.y),
        new QuadraticCurve(br.x, br.y, br.x, br.y),
        new QuadraticCurve(bl.x, bl.y, bl.x, bl.y)
      ];
    }

  }


  Object.assign(window.ns, {
    Stem,
  });

}());