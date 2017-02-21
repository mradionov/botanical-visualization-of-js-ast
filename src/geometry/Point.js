(function () {

  class Vector {

    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;

      Object.freeze(this);
    }

    add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
      return new Vector(this.x - v.x, this.y - v.y);
    }

    addScalar(value) {
      return new Vector(this.x + value, this.y + value);
    }

    multiplyScalar(value = 1) {
      return new Vector(this.x * value, this.y * value);
    }

    divideScalar(value) {
      if (value === 0) {
        throw new Error('Division by zero');
      }
      return new Vector(this.x / value, this.y / value);
    }

    translate(x = 0, y = 0) {
      return new Vector(this.x + x, this.y + y);
    }

    scale(value = 1) {
      return this.multiplyScalar(value);
    }

    // ?
    average(v) {
      return new Vector((this.x + v.x) / 2, (this.y + v.y) / 2);
    }

    getLength() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
      return this.divideScalar(this.getLength());
    }

    // https://en.wikipedia.org/wiki/Rotation_matrix#In_two_dimensions
    rotate(angleDeg, center = new Vector(0, 0)) {
      const angle = angleDeg * Math.PI / 180;

      const c = Math.cos(angle);
      const s = Math.sin(angle);

      // Temporarily align vector coords to center coords
      var x = this.x - center.x;
      var y = this.y - center.y;

      return new Vector(
        x * c - y * s + center.x,
        x * s + y * c + center.y
      );
    }

  }

  const Point = Vector;

  Object.assign(window.ns, {
    Point,
    Vector,
  });

}());
