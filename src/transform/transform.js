(function () {

  function transform(ast, options) {
    console.time('ast to general');
    const general = transform.astToGeneral(ast, options);
    console.timeEnd('ast to general');

    console.time('general to weighted');
    const weighted = transform.generalToWeighted(general, options);
    console.timeEnd('general to weighted');

    console.time('weighted to binary');
    const binary = transform.weightedToBinary(weighted, options);
    console.timeEnd('weighted to binary');

    return binary;
  }

  Object.assign(window.ns, {
    transform,
  });

}());
