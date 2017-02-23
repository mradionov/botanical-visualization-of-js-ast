(function () {

  const constants = {

    DIRECTION_RANDOM: 'random',
    DIRECTION_ALTERNATE: 'alternate',
    DIRECTION_LEFT: 'left',
    DIRECTION_RIGHT: 'right',

    SOURCE_POPULAR: 'popular',
    SOURCE_INPUT: 'input',
    SOURCE_URL: 'url',

  };

  Object.assign(window.ns, {
    constants,
  });

}());
