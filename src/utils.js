(function () {

  function random(min, max) {
    return Math.round((max - min) * Math.random() + min);
  }

  function randomElement(array) {
    return array[random(0, array.length - 1)];
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
    randomElement,
  };

  Object.assign(window.ns, {
    utils,
  });

}());
