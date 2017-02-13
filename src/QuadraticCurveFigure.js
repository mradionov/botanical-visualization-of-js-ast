(function () {

  const { QuadraticCurve } = window.ns;

  class QuadraticCurveFigure {

    constructor(...curves) {
      this.curves = curves;
    }

    getCurves() {
      return this.curves;
    }

    translate(x = 0, y = 0) {
      this.curves.forEach(c => c.translate(x, y));
    }

    rotate(angle, mount) {
      this.curves.forEach(c => c.rotate(angle, mount));
    }

    scale(value) {
      this.curves.forEach(c => c.scale(value));
    }

    getMinX() {
      const ys = this.curves.map(c => c.getMinX());
      return Math.min(...ys);
    }

    getMaxX() {
      const xs = this.curves.map(c => c.getMaxX());
      return Math.max(...xs);
    }

    getMinY() {
      const ys = this.curves.map(c => c.getMinY());
      return Math.min(...ys);
    }

    getMaxY() {
      const ys = this.curves.map(c => c.getMaxY());
      return Math.max(...ys);
    }

  }

  Object.assign(window.ns, {
    QuadraticCurveFigure,
  });

}());
