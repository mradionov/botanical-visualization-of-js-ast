'use strict';

ipt.config = (function () {

  var GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

  return {

    stem: {
      height: 300,
      radius: 100
    },

    turn: 360 / GOLDEN_RATIO,

    tilt: 90

  };

})();
