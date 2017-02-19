(function () {

  const { Point, Line } = window.ns;

  class Curve extends Line {

    // "control" is a control point which curves the line towards that point
    constructor(start, end, control) {
      super(start, end);

      this.control = control;
    }

    setControl(control) {
      this.control = control;

      return this;
    }

    getControl() {
      return this.control;
    }

    translate(x = 0, y = 0) {
      super.translate(x, y);
      this.control = this.control.translate(x, y);

      return this;
    }

    rotate(angle, center) {
      super.rotate(angle, center);
      this.control = this.control.rotate(angle, center);

      return this;
    }

    scale(value = 1) {
      super.scale(value);
      this.control = this.control.scale(value);

      return this;
    }

  }

  Object.assign(window.ns, {
    Curve,
  });

}());
