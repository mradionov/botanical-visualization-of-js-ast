/* global esprima */
(function () {

  function parse(source) {
    const ast = esprima.parse(source);
    return ast;
  }

  Object.assign(window.ns, {
    parse,
  });

}());
