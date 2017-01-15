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

    getTopLeft() {
      return this.getPoint(1);
    }

    getTopRight() {
      return this.getPoint(2);
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
