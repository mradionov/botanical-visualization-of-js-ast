(function () {

  const { Point, Line } = window.ns;

  class Curve extends Line {

    // "control" is a control point which curves the line towards that point
    constructor(start, end, control) {
      super(start, end);

      // By default control point is in the middle of the line
      this.control = control || super.at(0.5);
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

    // http://stackoverflow.com/questions/5634460/quadratic-bezier-curve-calculate-point
    at(t) {
      const s = this.start;
      const e = this.end;
      const c = this.control;

      const dt = 1 - t;

      const x = dt * dt * s.x + 2 * dt * t * c.x + t * t * e.x;
      const y = dt * dt * s.y + 2 * dt * t * c.y + t * t * e.y;

      return new Point(x, y);
    }

  }

  Object.assign(window.ns, {
    Curve,
  });

}());
