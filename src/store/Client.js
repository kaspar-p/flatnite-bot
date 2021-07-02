const { observable, makeObservable, action } = require("mobx");

class ClientStore {
  client = null;

  constructor() {
    makeObservable(this, {
      client: observable,
      setClient: action,
    });
  }

  /**
   * Set the client for global use, so that it does not have to be
   * passed around
   *
   * @param {import("discord.js").Client} client The client, connected to the discord server
   */
  setClient(client) {
    this.client = client;
  }
}

module.exports = new ClientStore();
