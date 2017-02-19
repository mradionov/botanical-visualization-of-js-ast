(function () {

  const { Point } = window.ns;

  class Figure {

    constructor(...points) {
      if (Array.isArray(points[0])) {
        points = points[0];
      }

      this.points = points;
      this.angle = 0;
    }

    getPoints() {
      return this.points;
    }

    getPoint(index) {
      return this.points[index];
    }

    setPoint(index, point) {
      this.points[index] = point;

      return this;
    }

    // TODO: calculate mins and maxs when instantiating
    // or when using addPoint, setPoint, removePoints
    getMinX() {
      const xs = this.points.map(p => p.x);
      return Math.min(...xs);
    }

    getMaxX() {
      const xs = this.points.map(p => p.x);
      return Math.max(...xs);
    }

    getMinY() {
      const ys = this.points.map(p => p.y);
      return Math.min(...ys);
    }

    getMaxY() {
      const ys = this.points.map(p => p.y);
      return Math.max(...ys);
    }

    getCenterX() {
      const xs = this.points.map(p => p.x);
      const sum = xs.reduce((x, s) => s + x, 0);
      return sum / xs.length;
    }

    getCenterY() {
      const ys = this.points.map(p => p.y);
      const sum = ys.reduce((y, s) => s + y, 0);
      return sum / ys.length;
    }

    getCenter() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    translate(x = 0, y = 0) {
      this.points = this.points.map((point) => point.add(new Point(x, y)));
      return this;
    }

    scale(value) {
      this.points = this.points.map((point) => point.multiplyScalar(value));
      return this;
    }

    // TODO: fix translate which comes after rotate
    rotate(angle, center = this.getCenter()) {
      this.angle = angle;

      this.points = this.points.map((point) => {
        return point.rotate(angle, center);
      });

      return this;
    }

  }

  Object.assign(window.ns, {
    Figure,
  });

}());
