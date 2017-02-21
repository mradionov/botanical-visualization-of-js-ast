(function () {

  const { constants, utils } = window.ns;

  let currentSource = constants.SOURCE_INPUT;
  let currentPopularLink = null;

  const input = document.querySelector('.source textarea');

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

  const popularCache = {};

  class Source {

    get() {
      if (currentSource === constants.SOURCE_INPUT) {
        return Promise.resolve(input.value);
      }

      if (popularCache[currentPopularLink]) {
        return Promise.resolve(popularCache[currentPopularLink]);
      }

      if (!currentPopularLink) {
        return Promise.reject('Popular source not selected');
      }

      return utils.request(currentPopularLink).then((text) => {
        popularCache[currentPopularLink] = text;
        return text;
      });
    }

    load() {
      const defaultSource = `function why() {\n  return 42;\n}`;
      const text = window.localStorage.getItem('source') || defaultSource;
      input.value = text;
    }

    save() {
      const text = input.value.trim();
      window.localStorage.setItem('source', text);
    }

  }

  const source = new Source();

  Object.assign(window.ns, {
    source,
  });

}());
