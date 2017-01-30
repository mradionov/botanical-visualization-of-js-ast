(function () {

  const { Point, Figure } = window.ns;

  class Rectangle extends Figure {

    constructor(x, y, width, height) {
      super(
        new Point(x, y), // bottom left
        new Point(x, y + height), // top left
        new Point(x + width, y + height), // top right
        new Point(x + width, y) // bottom right
      );

      this.width = width;
      this.height = height;
    }

    scale(value) {
      this.width *= value;
      this.height *= value;

      super.scale(value);

      return this;
    }

    getBottomLeft() {
      return this.getPoint(0);
    }

    getTopLeft() {
      return this.getPoint(1);
    }

    getTopRight() {
      return this.getPoint(2);
    }

    getBottomRight() {
      return this.getPoint(3);
    }

    setBottomLeft(point) {
      return this.setPoint(0, point);
    }

    setBottomRight(point) {
      return this.setPoint(3, point);
    }

    getWidth() {
      return this.width;
    }

    getHeight() {
      return this.height;
    }

    getTopCenter() {
      return this.getTopLeft().average(this.getTopRight());
    }

  }

  Object.assign(window.ns, {
    Rectangle,
  });

}());
