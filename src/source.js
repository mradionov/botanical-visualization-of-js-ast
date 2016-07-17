'use strict';

//------------------------------------------------------------------------------
// Module
//------------------------------------------------------------------------------

var $element = document.getElementById('source');
var source = $element.innerHTML;

module.exports = function getSource() {
  return source;
}
