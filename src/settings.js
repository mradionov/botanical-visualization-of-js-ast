(function () {
  // TODO: save settings in local storage or URL

  const form = document.querySelector('#settings');

  // Map internal setting name to HTML form name
  const map = {
    direction: 'settings-branch-direction',
    removeSameChildren: 'settings-remove-same-children',
    removeTinyChildren: 'settings-remove-tiny-children',
    showLeaves: 'settings-show-leaves',
  };

  function get(name) {
    const data = new FormData(form);
    const formName = map[name];
    const value = data.get(formName);
    return value;
  }

  const settings = {
    get,
  };

  Object.assign(window.ns, {
    settings,
  });

}());
