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

  function request(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            resolve(req.responseText);
          } else {
            reject(req);
          }
        }
      };
      req.send(null);
    });
  }

  function defaults(dest, source) {
    Object.keys(source).forEach((key) => {
      if (typeof dest[key] === 'undefined') {
        dest[key] = source[key];
      }
    });
    return dest;
  }


  const utils = {
    debounce,
    defaults,
    random,
    randomElement,
    request,
  };

  Object.assign(window.ns, {
    utils,
  });

}());
