class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = "/") {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  async waitForUrl(urlPattern, timeout = 15000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  async waitForElement(locator, timeout = 10000) {
    await locator.waitFor({ state: "visible", timeout });
  }

  getUrl() {
    return this.page.url();
  }
}

module.exports = { BasePage };
