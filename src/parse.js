'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var esprima = require('esprima');

//------------------------------------------------------------------------------
// Module
//------------------------------------------------------------------------------

module.exports = function parse(source) {
  return new Promise(function (resolve, reject) {
    try {
      var ast = esprima.parse(source);
      resolve(ast);
    } catch (err) {
      reject(err);
    }
  });
};
