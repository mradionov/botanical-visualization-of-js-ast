(function () {

  const { Figure, Point } = window.ns;

  class QuadraticCurve extends Figure {

    constructor(controlX, controlY, endingX, endingY) {
      super(
        new Point(controlX, controlY),
        new Point(endingX, endingY)
      );
    }

    getControlPoint() {
      return this.getPoint(0);
    }

    getEndingPoint() {
      return this.getPoint(1);
    }

  }

  Object.assign(window.ns, {
    QuadraticCurve,
  });

}());
