const { observable, makeObservable, action } = require("mobx");

/**
 * @typedef {import("discord.js").User} User
 */

class SessionStore {
  authenticatedUsers = [];
  userAuthenticating = {};
  authenticationPIN = {};

  constructor() {
    makeObservable(this, {
      authenticatedUsers: observable,
      userAuthenticating: observable,
      authenticationPIN: observable,
      authenticateUser: action,
      setUserAuthenticating: action,
      clearUserAuthenticating: action,
      setAuthenticationPIN: action,
      clearAuthenticationPIN: action,
    });
  }

  /**
   * Sets the status of if the session is currently authenticating a user
   * @action
   * @param {User} user The user with an authentication status
   * @param {bool} setting the state
   */
  setUserAuthenticating(user, setting) {
    this.userAuthenticating[user.id] = setting;
  }

  /**
   * Once the user has been authenticated, clear their in-progress status
   * @action
   * @param {User} user The user that has been authenticated
   */
  clearUserAuthenticating(user) {
    delete this.userAuthenticating[user.id];
  }

  /**
   * When a text is sent, set the PIN so that we know if the PIN is correct
   * @action
   * @param {User} user The user that the PIN corresponds to
   * @param {string?} pin the PIN to authenticate with
   */
  setAuthenticationPIN(user, pin) {
    this.authenticationPIN[user.id] = {
      pin,
      created: Date.now(),
    };
  }

  /**
   * When a user has been authenticated, clear their PIN
   * @action
   * @param {*} user The user that is authenticated now
   */
  clearAuthenticationPIN(user) {
    delete this.authenticationPIN[user.id];
  }

  /**
   * Adds user to the permanent (for this process) session and removes them from any in-progress state
   * @action
   * @param {User} user The user to add
   */
  authenticateUser(user) {
    this.authenticatedUsers.push(user.id);
    this.clearUserAuthenticating(user, false);
    this.clearAuthenticationPIN(user, null);
  }

  /**
   * Assumes the user is in the authentication process
   * @param {User} user The user with a PIN
   * @returns {string} The PIN corresponding to that user
   */
  getPIN(user) {
    return this.authenticationPIN[user.id];
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
    const allowedUsersIDs = ["Thorn#9752"];

    return allowedUsersIDs.includes(user.id);
  }

  /**
   * Checks whether or not the user is currently authenticated
   * @param {User} user The user that might be authenticated
   * @returns {bool} Whether the user is authenticated
   */
  isAuthenticated(user) {
    return this.authenticatedUsers.includes(user);
  }
}

module.exports = new SessionStore();
