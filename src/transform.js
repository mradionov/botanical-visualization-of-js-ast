var MOD_TRANSFORM = (function () {
  'use strict';

  //----------------------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------------------

  var NODE_PROPERTIES = {
    AssignmentExpression: ['left', 'right'],
    AssignmentPattern: ['left', 'right'],
    ArrayExpression: ['elements'],
    ArrayPattern: ['elements'],
    ArrowFunctionExpression: ['params', 'body'],
    AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
    BlockStatement: ['body'],
    BinaryExpression: ['left', 'right'],
    BreakStatement: ['label'],
    CallExpression: ['callee', 'arguments'],
    CatchClause: ['param', 'body'],
    ClassBody: ['body'],
    ClassDeclaration: ['id', 'superClass', 'body'],
    ClassExpression: ['id', 'superClass', 'body'],
    ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
    ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    ConditionalExpression: ['test', 'consequent', 'alternate'],
    ContinueStatement: ['label'],
    DebuggerStatement: [],
    DirectiveStatement: [],
    DoWhileStatement: ['body', 'test'],
    EmptyStatement: [],
    ExportAllDeclaration: ['source'],
    ExportDefaultDeclaration: ['declaration'],
    ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
    ExportSpecifier: ['exported', 'local'],
    ExpressionStatement: ['expression'],
    ForStatement: ['init', 'test', 'update', 'body'],
    ForInStatement: ['left', 'right', 'body'],
    ForOfStatement: ['left', 'right', 'body'],
    FunctionDeclaration: ['id', 'params', 'body'],
    FunctionExpression: ['id', 'params', 'body'],
    GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    Identifier: [],
    IfStatement: ['test', 'consequent', 'alternate'],
    ImportDeclaration: ['specifiers', 'source'],
    ImportDefaultSpecifier: ['local'],
    ImportNamespaceSpecifier: ['local'],
    ImportSpecifier: ['imported', 'local'],
    Literal: [],
    LabeledStatement: ['label', 'body'],
    LogicalExpression: ['left', 'right'],
    MemberExpression: ['object', 'property'],
    MetaProperty: ['meta', 'property'],
    MethodDefinition: ['key', 'value'],
    ModuleSpecifier: [],
    NewExpression: ['callee', 'arguments'],
    ObjectExpression: ['properties'],
    ObjectPattern: ['properties'],
    Program: ['body'],
    Property: ['key', 'value'],
    RestElement: [ 'argument' ],
    ReturnStatement: ['argument'],
    SequenceExpression: ['expressions'],
    SpreadElement: ['argument'],
    Super: [],
    SwitchStatement: ['discriminant', 'cases'],
    SwitchCase: ['test', 'consequent'],
    TaggedTemplateExpression: ['tag', 'quasi'],
    TemplateElement: [],
    TemplateLiteral: ['quasis', 'expressions'],
    ThisExpression: [],
    ThrowStatement: ['argument'],
    TryStatement: ['block', 'handler', 'finalizer'],
    UnaryExpression: ['argument'],
    UpdateExpression: ['argument'],
    VariableDeclaration: ['declarations'],
    VariableDeclarator: ['id', 'init'],
    WhileStatement: ['test', 'body'],
    WithStatement: ['object', 'body'],
    YieldExpression: ['argument'],
    Fake: ['children']
  };

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  var isArray = Array.isArray;

  function isNode(node) {
    if (node == null) {
      return false;
    }
    return typeof node === 'object' && typeof node.type === 'string';
  }

  function isProperty(nodeType, key) {
    return (nodeType === 'ObjectExpression' || nodeType === 'ObjectPattern') && key === 'properties';
  }

  //----------------------------------------------------------------------------
  // Private
  //----------------------------------------------------------------------------


  // var BORDER = 3;
  // var CUT = 0.6;

  // if (node.type === 'ObjectExpression' && prop === 'properties' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));

  // } else if (node.type === 'ArrayExpression' && prop === 'properties' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));

  // } else if (node.type === 'Fake' && children.length > BORDER) {

  //   while (children.length > BORDER) {
  //     stem.children.push(transform(new Fake(children.splice(0, Math.round(children.length * CUT)))));
  //   }

  //   stem.children.push(transform(new Fake(children)));


  function createWeightedTree(astNode) {

    var weightedNode = {
      astNode: astNode,
      children: [],
      weight: 2
    };

    var props = NODE_PROPERTIES[astNode.type];
    if (!props) {
      throw new Error('Unknown AST node type: %s', astNode.type);
    }

    var i = props.length;
    while ((i -= 1) >= 0) {

      var children = astNode[props[i]];
      if (isArray(children)) {

        var j = children.length;
        while ((j -= 1) >= 0) {

          if (isNode(children[j])) {
            weightedNode.children.push(createWeightedTree(children[j]));
          }

        }

      } else if (isNode(children)) {
        weightedNode.children.push(createWeightedTree(children));
      }

    }

    var k = weightedNode.children.length;
    while ((k -= 1) >= 0) {
      weightedNode.weight += weightedNode.children[k].weight;
    }

    weightedNode.children.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return weightedNode;
  }

  function createBranchedTree(
    weightedNode, isRoot, isParentContinuation, weight, weightRatio, scale
  ) {

    var branchedNode = {
      astNode: weightedNode.astNode,
      branch1: undefined,
      branch2: undefined,
      isRoot: isRoot,
      isParentContinuation: typeof isParentContinuation === undefined ? false : isParentContinuation,
      weight: typeof weight === undefined ? weightedNode.weight : weight,
      weightRatio: typeof weightRatio === undefined ? 1 : weightRatio,
      scale: typeof scale === undefined ? 1 : scale
    };

    if (weightedNode.children.length === 0) {
      return branchedNode;
    }

    var weight = weightedNode.weight; // s

    branchedNode.weight = weight;

    var branch1 = weightedNode.children.shift(); // d1
    weightedNode.weight -= branch1.weight;

    // get what is left from parent without largest child
    var branch2 = weightedNode; // d2

    var weight1 = branch1.weight; // s1
    var weight2 = branch2.weight; // s2

    var weightRatio1 = weight1 / weight;
    var weightRatio2 = weight2 / weight;

    var scale1 = Math.sqrt(weightRatio1); // r1
    var scale2 = Math.sqrt(weightRatio2); // r2

    branchedNode.branch1 = createBranchedTree(
      branch1, false, false, weight1, weightRatio2, scale1
    );

    branchedNode.branch2 = createBranchedTree(
      branch2, false, true, weight2, weightRatio1, scale2
    );

    return branchedNode;
  }

  function transform(astTree) {
    var weightedTree = createWeightedTree(astTree);
    var branchedTree = createBranchedTree(weightedTree, true);

    return branchedTree;
  }

  //----------------------------------------------------------------------------
  // Public
  //----------------------------------------------------------------------------

  return {
    transform: transform
  };

})();
