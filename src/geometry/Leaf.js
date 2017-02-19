(function () {

  const { Curve, CurveFigure, Point } = window.ns;

  class Leaf extends CurveFigure {

    constructor() {
      const m = 7; // Size multiplier

      const root = new Point(0, 0);
      const top = new Point(0, 4 * m);

      super(
        new Curve(root, top, new Point(-2 * m, 1 * m)),
        new Curve(top, root, new Point(2 * m, 1 * m))
      );
    }

  }

  Object.assign(window.ns, {
    Leaf,
  });

}());
