var MOD_SOURCE = (function () {
  'use strict';

  //----------------------------------------------------------------------------
  // Private
  //----------------------------------------------------------------------------

  var $element = document.getElementById('source');
  var source = $element.innerHTML;

  function getSource() {
    return source;
  }

  //----------------------------------------------------------------------------
  // Public API
  //----------------------------------------------------------------------------

  return {
    getSource: getSource
  };

}());
