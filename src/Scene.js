(function () {

  const { utils } = window.ns;

  class Scene {

    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);

      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);

      this.resize();

      this.scaleValue = 1;

      this.context = this.canvas.getContext('2d');

      window.addEventListener('resize', utils.debounce(() => {
        this.resize();
      }, 300));
    }

    resize() {
      this.canvas.width = 0;
      this.canvas.height = 0;

      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    getWidth() {
      return this.width;
    }

    getHeight() {
      return this.height;
    }

    x(x) {
      return x;
    }

    // Invert Y axis to start drawing from bottom left corner
    y(y) {
      return this.height - y;
    }

    drawPoint(point, options = {}) {

      this.context.beginPath();

      this.context.arc(
        this.x(point.x),
        this.y(point.y),
        options.size || 4,
        0,
        2 * Math.PI
      );

      this.stroke(options.stroke);
      this.fill(options.fill);

      return this;
    }

    drawFigure(figure, options = {}) {

      const points = figure.getPoints().slice();

      // Close the figure, if it is not the line
      if (points.length > 2) {
        const firstPoint = points[0];
        points.push(firstPoint);
      }

      this.context.beginPath();

      points.forEach((point) => {
        this.context.lineTo(this.x(point.x), this.y(point.y));
      });

      this.stroke(options.stroke);
      this.fill(options.fill);

      return this;
    }

    drawCurveFigure(figure, options = {}) {
      const curves = figure.getCurves();
      const startPoint = curves[0].getStart();

      this.context.beginPath();
      this.context.moveTo(this.x(startPoint.x), this.y(startPoint.y));

      curves.forEach((curve) => {
        // Invert Y axis to start drawing from bottom left corner
        this.context.quadraticCurveTo(
          curve.getControl().x,
          this.y(curve.getControl().y),
          curve.getEnd().x,
          this.y(curve.getEnd().y)
        );
      });

      this.stroke(options.stroke);
      this.fill(options.fill);

      return this;
    }

    stroke(color = null) {
      if (!color) return;

      this.context.strokeStyle = color;
      this.context.stroke();

      return this;
    }

    fill(color = '#000') {
      if (!color) return;

      this.context.fillStyle = color;
      this.context.fill();

      return this;
    }

    clear() {
      this.context.clearRect(0, 0, this.width, this.height);

      return this;
    }

  }

  const scene = new Scene('.scene');

  Object.assign(window.ns, {
    scene,
  });

}());
