(function () {

  const scale = 40;
  const ratio = 2.5;

  const config = {

    STEM_WIDTH: scale,
    STEM_HEIGHT: scale * ratio,

    TILT: 90,

  };

  Object.assign(window.ns, {
    config,
  });

}());
