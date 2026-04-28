const { test, expect } = require("@playwright/test");
const { HomePage } = require("../../pages/HomePage");

test.describe("Homepage Sanity", () => {
  test("should load the homepage and show main heading", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    await expect(homePage.getMainHeadingLocator()).toBeVisible();
  });

  test("should display the Contact Information section", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await homePage.scrollToContact();

    await expect(homePage.getContactSectionLocator()).toBeVisible();
  });

  test("should show Book now links for listed rooms", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    const count = await homePage.getBookNowCount();
    expect(count).toBeGreaterThan(0);
    //console.log(`Found ${count} Book now link(s)`);
  });

  test("should have every Book now link visible", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    const count = await homePage.getBookNowCount();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      await expect(homePage.getBookNowLinksLocator().nth(i)).toBeVisible();
    }
  });
});
