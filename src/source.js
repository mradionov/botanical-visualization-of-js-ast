(function () {

  const textarea = document.querySelector('.source textarea');

  class Source {

    get() {
      return textarea.value;
    }

    load() {
      const text = window.localStorage.getItem('source') || 'var foo = 42;';
      textarea.value = text;
    }

    save() {
      const text = textarea.value.trim();
      window.localStorage.setItem('source', text);
    }

  }

  const source = new Source();

  Object.assign(window.ns, {
    source,
  });

}());
