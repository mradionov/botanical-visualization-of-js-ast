(function () {

  const element = document.querySelector('.status');

  function progress(message) {
    element.textContent = `${message} ...`;
  }

  function clear() {
    element.textContent = '';
  }

  const status = {
    progress,
    clear,
  };

  Object.assign(window.ns, {
    status,
  });

}());
