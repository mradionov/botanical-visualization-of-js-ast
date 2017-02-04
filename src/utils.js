(function () {

  function random(min, max) {
    return Math.round((max - min) * Math.random() + min);
  }

  function debounce(fn, delay = 1000) {
    let timeoutId = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(fn, delay);
    };
  }


  const utils = {
    debounce,
    random,
  };

  Object.assign(window.ns, {
    utils,
  });

}());
