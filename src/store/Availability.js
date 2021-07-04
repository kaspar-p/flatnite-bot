const { observable, makeObservable, action } = require("mobx");
const { clientStore } = require("../store");

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
   * @param {import("discord.js").Client?} client If this parameter is passed in, then user this, not clientStore
   */
  setReady(setting, client) {
    this.ready = setting;

    if (client) {
      this.setPresence(client, setting);
    } else {
      if (clientStore) {
        this.setPresence(clientStore.client, setting);
      }
    }
  }

  setPresence(c, setting) {
    c.user.setPresence({
      status: "online",
      activity: {
        name: setting ? "with his dick" : "the stock market",
      },
    });
  }
}

module.exports = new AvailabilityStore();
