const { BasePage } = require("./BasePage");
const { ADMIN } = require("../test-data/credentials");

class AdminPage extends BasePage {
  constructor(page) {
    super(page);

    // Login form
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });

    // Post-login elements
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.roomsNavLink = page.getByRole("link", { name: "Rooms" });

    // Rooms tab — data-testid is the most stable locator for React components
    this.roomRows = page.locator('[data-testid="roomlisting"]');
  }

  //Navigation

  async loginAsAdmin() {
    await this.navigateToAdmin();
    await this.login(ADMIN.username, ADMIN.password);
  }

  async navigateToAdmin() {
    await this.goto(ADMIN.url);
    await this.page.waitForURL("**/admin**");
    await this.waitForElement(this.loginButton);
  }

  async navigateToRooms() {
    await this.roomsNavLink.click();
    await this.page.waitForURL("**/admin**");
    await this.roomRows.first().waitFor({ state: "visible" });
  }

  //Actions

  /**
   * Login with provided credentials.
   * Credentials come from test-data/credentials.js — not hardcoded here.
   *
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForElement(this.logoutButton, 15000);
  }

  async logout() {
    await this.logoutButton.click();
    await this.waitForElement(this.loginButton);
  }

  //Queries

  async getRoomCount() {
    return this.roomRows.count();
  }

  async isLogoutVisible() {
    return this.logoutButton.isVisible();
  }
}

module.exports = { AdminPage };
