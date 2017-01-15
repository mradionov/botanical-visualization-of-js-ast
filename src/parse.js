/* global esprima */
(function () {

  const NODE_PROPERTIES = {
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

  const isArray = Array.isArray;

  function isNode(node) {
    if (node == null) {
      return false;
    }
    return typeof node === 'object' && typeof node.type === 'string';
  }

  function isProperty(nodeType, key) {
    return (nodeType === 'ObjectExpression' || nodeType === 'ObjectPattern') && key === 'properties';
  }

  function extend(dest, source) {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }

  function createWeightTree(astNode) {
    const weightNode = {
      astNode,
      children: [],
      weight: 2,
    };

    const props = NODE_PROPERTIES[astNode.type];
    if (!props) {
      throw new Error('Unknown AST node type: %s', astNode.type);
    }

    let i = props.length;
    while ((i -= 1) >= 0) {
      const children = astNode[props[i]];
      if (isArray(children)) {
        let j = children.length;
        while ((j -= 1) >= 0) {
          if (isNode(children[j])) {
            weightNode.children.push(createWeightTree(children[j]));
          }
        }
      } else if (isNode(children)) {
        weightNode.children.push(createWeightTree(children));
      }
    }

    let k = weightNode.children.length;
    while ((k -= 1) >= 0) {
      weightNode.weight += weightNode.children[k].weight;
    }

    weightNode.children.sort((a, b) => {
      return b.weight - a.weight;
    });

    return weightNode;
  }

  function transform(astTree) {
    return createWeightTree(astTree);
  }

  function parse(source) {
    const ast = esprima.parse(source);
    const tree = transform(ast);
    return tree;
  }

  Object.assign(window.ns, {
    parse,
  });

}());
