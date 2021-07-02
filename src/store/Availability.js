const { observable, makeObservable, action } = require("mobx");

class AvailabilityStore {
  ready = false;

  constructor() {
    makeObservable(this, {
      ready: observable,
      setReady: action,
    });
  }

  /**
   * Set the ready status
   * @param {Boolean} setting
   */
  setReady(client, setting) {
    this.ready = setting;
  }
}

module.exports = new AvailabilityStore();
