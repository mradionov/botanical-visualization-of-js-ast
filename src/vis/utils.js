'use strict';

ipt.vis.utils = (function () {

  return {

    toRad: function (deg) {
      return deg * Math.PI / 180;
    },

    getBoundingBox: function (obj) {
      return (new THREE.Box3()).setFromObject(obj);
    }

  };

})();
