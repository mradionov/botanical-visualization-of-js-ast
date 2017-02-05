(function () {

  function transform(ast, options = { orphan: false }) {
    const general = transform.astToGeneral(ast, options);
    return general;
  }

  Object.assign(window.ns, {
    transform,
  });

}());
