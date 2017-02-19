(function () {

  const { Point } = window.ns;

  class BoundingBox {

    constructor() {
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.left = 0;
      this.width = 0;
      this.height = 0;
    }

    reset(points = []) {
      // Use a first point to set a starting point for bounding box
      // and then process the rest of points to grow the box
      const fp = points[0] || new Point(0, 0);

      this.top = fp.y;
      this.right = fp.x;
      this.bottom = fp.y;
      this.left = fp.x;

      this.addPoints(points);

      return this;
    }

    addPoints(points) {
      points.forEach(p => this.addPoint(p));

      return this;
    }

    // Only extends existing bounds, if they are exceeded by a new point
    addPoint(point) {
      if (point.y > this.top) this.top = point.y;
      if (point.x > this.right) this.right = point.x;
      if (point.y < this.bottom) this.bottom = point.y;
      if (point.x < this.left) this.left = point.x;

      this.width = this.right - this.left;
      this.height = this.top - this.bottom;

      return this;
    }

    // Simple translate of the box to avoid iterations
    // Size of the box does not change when translated
    translate(x = 0, y = 0) {
      this.top += y;
      this.right += x;
      this.bottom += y;
      this.left += x;

      return this;
    }

    // Simple scale of the box to avoid iterations
    scale(value = 1) {
      this.top *= value;
      this.right *= value;
      this.bottom *= value;
      this.left *= value;
      this.width *= value;
      this.height *= value;

      return this;
    }

  }

  Object.assign(window.ns, {
    BoundingBox,
  });

}());
