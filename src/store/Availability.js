const { observable, makeObservable, action } = require("mobx");
const { client } = require("../store");

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
  setReady(setting) {
    this.ready = setting;

    client.user.setPresence({
      status: "online",
      activity: {
        name: setting ? "hardly working" : "working hard",
      },
    });
  }
}

module.exports = new AvailabilityStore();
