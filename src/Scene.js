(function () {

  class Scene {

    constructor(selector = 'canvas', options = { width: 800, height: 640 }) {
      this.width = options.width;
      this.height = options.height;

      this.canvas = document.querySelector(selector);

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.scaleValue = 1;

      this.context = this.canvas.getContext('2d');
    }

    getWidth() {
      return this.width;
    }

    getScaledWidth() {
      return this.width / this.scaleValue;
    }

    getHeight() {
      return this.height;
    }

    getScaledHeight() {
      return this.height / this.scaleValue;
    }

    scale(value) {
      this.scaleValue = value;
      // Reset all transformations
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.scale(value, value);

      return this;
    }

    drawFigure(figure, options = { fill: '#000', stroke: null }) {
      const points = figure.getPoints().slice();

      // CLose the figure, if it is not the line
      if (points.length > 2) {
        const firstPoint = points[0];
        points.push(firstPoint);
      }

      this.context.beginPath();

      points.forEach((point) => {
        // Invert Y axis to start drawing from bottom left corner
        this.context.lineTo(point.x, this.getScaledHeight() - point.y);
      });

      if (options.stroke) {
        this.context.strokeStyle = options.stroke;
        this.context.stroke();
      }

      if (options.fill) {
        this.context.fillStyle = options.fill;
        this.context.fill();
      }
    }

    clear() {
      this.context.clearRect(0, 0, this.getScaledWidth(), this.getScaledHeight());
    }

  }

  Object.assign(window.ns, {
    Scene,
  });

}());
