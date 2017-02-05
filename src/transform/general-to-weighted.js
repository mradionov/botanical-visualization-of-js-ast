(function () {

  function transformNode(generalNode, options = { orphan: false }) {
    const weightedNode = {
      weight: 2,
      children: [],
    };

    const weights = [];

    for (let i = 0; i < generalNode.children.length; i++) {
      const child = transformNode(generalNode.children[i], options);

      if (options.orphan) {
        if (weights.indexOf(child.weight) === -1) {
          weights.push(child.weight);
          weightedNode.children.push(child);
          weightedNode.weight += child.weight;
        }
      } else {
        weightedNode.children.push(child);
        weightedNode.weight += child.weight;
      }
    }

    weightedNode.children.sort((a, b) => {
      return b.weight - a.weight;
    });

    return weightedNode;
  }

  function generalToWeighted(generalTree, options) {
    return transformNode(generalTree, options);
  }

  window.ns.transform.generalToWeighted = generalToWeighted;

}());
