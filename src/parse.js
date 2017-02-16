/* global esprima */
(function () {

  function parse(source) {
    return new Promise((resolve, reject) => {
      try {
        resolve(esprima.parse(source));
      } catch (err) {
        reject(err);
      }
    });
  }

  Object.assign(window.ns, {
    parse,
  });

}());
