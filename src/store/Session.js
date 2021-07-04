const { observable, makeObservable, action } = require("mobx");
const {
  PIN_EXPIRATION_TIME,
  AUTHENTICATION_PIN_LENGTH,
} = require("../constants");

/**
 * @typedef {import("discord.js").User} User
 */

/**
 * Creates a random numeric PIN (as a string)
 * @returns {string}
 */
const createPIN = () => {
  const alphabet = "0123456789";

  let pin = "";
  for (let i = 0; i < AUTHENTICATION_PIN_LENGTH; i++) {
    pin += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return pin;
};

class SessionStore {
  authenticatedUsers = [];
  userAuthenticating = {};

  constructor() {
    makeObservable(this, {
      authenticatedUsers: observable,
      userAuthenticating: observable,
      authenticateUser: action,
      startAuthenticationProcess: action,
      endAuthenticationProcess: action,
    });
  }

  /**
   * Begins the authentication process for a user
   * @action
   * @param {User} user The user that wants to authenticate themselves
   * @returns {string} the pin that is generated for the user
   */
  startAuthenticationProcess(user) {
    const pin = createPIN();
    this.userAuthenticating[user.id] = {
      pin,
      created: Date.now(),
    };

    setTimeout(() => this.endAuthenticationProcess(user), PIN_EXPIRATION_TIME);
    return pin;
  }

  /**
   * Once the user has been authenticated, or on key expiry, clear their in-progress status
   * @action
   * @param {User} user The user to delete their in-progress status
   */
  endAuthenticationProcess(user) {
    delete this.userAuthenticating[user.id];
  }

  /**
   * Adds user to the permanent (for this process) session and removes them from any in-progress state
   * @action
   * @param {User} user The user to add
   */
  authenticateUser(user) {
    this.authenticatedUsers.push(user.id);
    this.endAuthenticationProcess(user);
  }

  /**
   * Assumes the user is in the authentication process
   * @param {User} user The user with a PIN
   * @returns {string} The PIN corresponding to that user
   */
  getPIN(user) {
    return this.userAuthenticating[user.id].pin;
  }

  /**
   * Precondition: user has started the authentication process
   * Whether now is within the time that the PIN is valid
   * @param {*} user
   * @returns
   */
  isPINExpired(user) {
    const elapsed = Date.now() - this.userAuthenticating[user.id].created;
    return elapsed >= PIN_EXPIRATION_TIME;
  }

  /**
   * Determines whether or not the user has already had a PIN sent
   * @param {User} user The user that might be authenticating
   * @returns {bool} Whether the user is currently authenticating
   */
  userIsInAuthenticationProcess(user) {
    return user.id in this.userAuthenticating;
  }

  /**
   * Determines whether the user is eligible for authentication
   * @param {User} user the user in question
   * @returns {bool} the decision
   */
  userCanAuthenticate(user) {
    const allowedUsersIDs = ["261335946123935745"];

    return allowedUsersIDs.includes(user.id);
  }

  /**
   * Checks whether or not the user is currently authenticated
   * @param {User} user The user that might be authenticated
   * @returns {bool} Whether the user is authenticated
   */
  isAuthenticated(user) {
    return this.authenticatedUsers.includes(user.id);
  }
}

module.exports = new SessionStore();
