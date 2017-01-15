(function () {

  class Vector {

    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;

      Object.freeze(this);
    }

    add(v) {
      return new Point(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
      return new Point(this.x - v.x, this.y - v.y);
    }

    average(v) {
      return new Point((this.x + v.x) / 2, (this.y + v.y) / 2);
    }

    multiplyScalar(value) {
      return new Point(this.x * value, this.y * value);
    }

    // https://en.wikipedia.org/wiki/Rotation_matrix#In_two_dimensions
    rotate(angleDeg) {
      const a = angleDeg * Math.PI / 180;
      return new Point(
        this.x * Math.cos(a) - this.y * Math.sin(a),
        this.x * Math.sin(a) + this.y * Math.cos(a)
      );
    }

  }

  const Point = Vector;

  Object.assign(window.ns, {
    Point,
  });

}());
