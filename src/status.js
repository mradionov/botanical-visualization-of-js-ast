(function () {

  const element = document.querySelector('.status');

  function progress(message) {
    element.innerHTML = `${message} ...`;
  }

  function error(message) {
    element.classList.add('error');
    element.innerHTML = message;
  }

  function clear() {
    element.classList.remove('error');
    element.innerHTML = '&nbsp;';
  }

  const status = {
    clear,
    error,
    progress,
  };

  Object.assign(window.ns, {
    status,
  });

}());
