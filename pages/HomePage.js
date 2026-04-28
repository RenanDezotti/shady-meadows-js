const { BasePage } = require("./BasePage");

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.mainHeading = page.getByRole("heading", {
      name: "Welcome to Shady Meadows B&B",
    });
    this.contactSection = page.getByText("Contact Information");
    this.bookNowLinks = page.getByRole("link", { name: "Book now" });
  }

  async navigate() {
    await this.goto("/");
    await this.waitForElement(this.mainHeading);
  }

  async scrollToContact() {
    await this.contactSection.scrollIntoViewIfNeeded();
  }

  async getBookNowCount() {
    return this.bookNowLinks.count();
  }

  getMainHeadingLocator() {
    return this.mainHeading;
  }
  getContactSectionLocator() {
    return this.contactSection;
  }
  getBookNowLinksLocator() {
    return this.bookNowLinks;
  }
}

module.exports = { HomePage };
