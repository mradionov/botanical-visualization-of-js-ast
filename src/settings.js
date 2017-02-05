(function () {

  class Settings {

    constructor() {
      this.settings = {};
    }

    get(name) {
      const element = this.settings[name];
      return element.checked;
    }

    set(name, value) {
      const element = this.settings[name];
      if (!element) return;

      element.checked = value;
    }

    registerToggle(selector, name) {
      const element = document.querySelector(selector);
      this.settings[name] = element;
    }

    save() {
      const settings = {};
      Object.keys(this.settings).forEach((name) => {
        const value = this.get(name);
        settings[name] = value;
      });
      const json = JSON.stringify(settings);
      window.localStorage.setItem('settings', json);
    }

    load() {
      const json = window.localStorage.getItem('settings') || '{}';
      const settings = JSON.parse(json);
      Object.keys(settings).forEach((name) => {
        const value = settings[name];
        this.set(name, value);
      });
    }

  }


  const settings = new Settings();

  settings.registerToggle('#settings-randomize-branch', 'random');
  settings.registerToggle('#settings-remove-same-children', 'orphan');

  Object.assign(window.ns, {
    settings,
  });

}());
