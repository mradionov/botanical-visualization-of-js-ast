(function () {

  const { constants, utils } = window.ns;

  let currentSource = constants.SOURCE_INPUT;
  let currentPopularLink = null;

  const sourceInput = document.querySelector('.source .source-input');
  const urlInput = document.querySelector('.source .source-url');

  const tabNav = document.querySelector('.tab-nav');
  const tabLinks = [].slice.call(tabNav.children);
  const tabs = [].slice.call(document.querySelectorAll('.tab'));

  tabNav.addEventListener('click', (event) => {
    const tabLink = event.target;
    if (tabLink.nodeName !== 'LI') return;
    if (tabLink.classList.contains('active')) return;

    const tabIndex = tabLinks.indexOf(tabLink);

    tabLinks.forEach((tab) => tab.classList.remove('active'));
    tabLink.classList.add('active');

    tabs.forEach((tab) => tab.classList.remove('active'));
    tabs[tabIndex].classList.add('active');

    currentSource = tabLink.dataset.source;

    popularLinks.forEach((link) => link.classList.remove('active'));
  });


  const popularNav = document.querySelector('.popular');
  const popularLinks = [].slice.call(popularNav.children);

  popularNav.addEventListener('click', (event) => {
    const popularLink = event.target;
    if (popularLink.nodeName !== 'LI') return;
    if (popularLink.classList.contains('active')) return;

    popularLinks.forEach((link) => link.classList.remove('active'));
    popularLink.classList.add('active');

    currentPopularLink = popularLink.dataset.url;
  });

  const cache = {};

  class Source {

    get() {
      if (currentSource === constants.SOURCE_INPUT) {
        return Promise.resolve(sourceInput.value);
      }

      let link = currentPopularLink;
      if (currentSource === constants.SOURCE_URL) {
        link = urlInput.value;
      }

      if (cache[link]) {
        return Promise.resolve(cache[link]);
      }

      if (currentSource === constants.SOURCE_POPULAR && !link) {
        return Promise.reject('Popular source not selected');
      }

      if (currentSource === constants.SOURCE_URL && !link.trim()) {
        return Promise.reject('URL source is required');
      }

      return utils.request(link).then((text) => {
        cache[link] = text;
        return text;
      });
    }

    load() {
      const defaultSource = `function why() { return 42; }`;
      const text = window.localStorage.getItem('source') || defaultSource;
      sourceInput.value = text;
    }

    save() {
      const text = sourceInput.value.trim();
      window.localStorage.setItem('source', text);
    }

  }

  const source = new Source();

  Object.assign(window.ns, {
    source,
  });

}());
