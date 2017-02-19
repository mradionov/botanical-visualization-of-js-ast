(function () {

  class CurveFigure {

    constructor(...curves) {
      this.curves = curves;
    }

    getPoints() {
      return [].concat(...this.curves.map(c => c.getPoints()));
    }

    getCurves() {
      return this.curves;
    }

    getCurve(index) {
      return this.curves[index];
    }

    translate(x = 0, y = 0) {
      this.curves = this.curves.map(c => c.translate(x, y));

      return this;
    }

    rotate(angle, center) {
      this.curves = this.curves.map(c => c.rotate(angle, center));

      return this;
    }

    scale(value = 1) {
      this.curves = this.curves.map(c => c.scale(value));

      return this;
    }

  }

  Object.assign(window.ns, {
    CurveFigure,
  });

}());
