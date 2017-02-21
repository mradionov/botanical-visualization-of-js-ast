(function () {

  const { Point } = window.ns;

  class Line {

    constructor(start = new Point(0, 0), end = new Point(0, 0)) {
      this.start = start;
      this.end = end;
    }

    getPoints() {
      return [this.start, this.end];
    }

    setStart(start) {
      this.start = start;

      return this;
    }

    getStart() {
      return this.start;
    }

    setEnd(end) {
      this.end = end;

      return this;
    }

    getEnd() {
      return this.end;
    }

    translate(x = 0, y = 0) {
      this.start = this.start.translate(x, y);
      this.end = this.end.translate(x, y);

      return this;
    }

    rotate(angle, center) {
      this.start = this.start.rotate(angle, center);
      this.end = this.end.rotate(angle, center);

      return this;
    }

    scale(value = 1) {
      this.start = this.start.scale(value);
      this.end = this.end.scale(value);

      return this;
    }

    // Get point on the line
    // 0 < t < 1
    at(t) {
      return this.end
        .subtract(this.start)
        .multiplyScalar(t)
        .add(this.start);
    }

  }

  Object.assign(window.ns, {
    Line,
  });

}());
