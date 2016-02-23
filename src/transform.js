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


  function transform(node) {

    var stem = {
      node: node,
      children: [],
      weight: 2
    };

    var props = NODE_PROPERTIES[node.type];
    if (!props) {
      throw new Error('Unknown node type: %s', node.type);
    }

    var i = props.length;
    while ((i -= 1) >= 0) {

      var children = node[props[i]];
      if (isArray(children)) {

        var j = children.length;
        while ((j -= 1) >= 0) {

          if (isNode(children[j])) {
            stem.children.push(transform(children[j]));
          }

        }

      } else if (isNode(children)) {
        stem.children.push(transform(children));
      }

    }

    var k = stem.children.length;
    while ((k -= 1) >= 0) {
      stem.weight += stem.children[k].weight;
    }

    stem.children.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return stem;
  }

  //----------------------------------------------------------------------------
  // Public API
  //----------------------------------------------------------------------------

  return {
    transform: transform
  };

})();
