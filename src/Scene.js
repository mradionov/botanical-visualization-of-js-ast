(function () {

  const {
    utils,
    Figure, Stem, QuadraticCurveFigure
  } = window.ns;

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

    drawFigure(figure, options = { fill: '#000', stroke: null }) {
      if (figure instanceof Stem || figure instanceof QuadraticCurveFigure) {
        return this.drawQuadraticCurveFigure(figure, options);
      }

      const points = figure.getPoints().slice();

      // Close the figure, if it is not the line
      if (points.length > 2) {
        const firstPoint = points[0];
        points.push(firstPoint);
      }

      this.context.beginPath();

      points.forEach((point) => {
        // Invert Y axis to start drawing from bottom left corner
        this.context.lineTo(point.x, this.getHeight() - point.y);
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

    drawQuadraticCurveFigure(figure, options = { fill: '#000', stroke: null }) {
      const curves = figure.getCurves();

      this.context.beginPath();

      curves.forEach((curve) => {
        // Invert Y axis to start drawing from bottom left corner
        this.context.quadraticCurveTo(
          curve.getControlPoint().x,
          this.getHeight() - curve.getControlPoint().y,
          curve.getEndingPoint().x,
          this.getHeight() - curve.getEndingPoint().y
        );
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
      this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
    }

  }

  Object.assign(window.ns, {
    Scene,
  });

}());
