'use strict';

//------------------------------------------------------------------------------
// Module
//------------------------------------------------------------------------------

var $element = document.querySelector('[data-source-input]');

module.exports = function getSource() {
  return $element.value;
}
