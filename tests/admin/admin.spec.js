const { test, expect } = require("@playwright/test");
const { AdminPage } = require("../../pages/AdminPage");
const { HomePage } = require("../../pages/HomePage");
const { ADMIN } = require("../../test-data/credentials");

test.describe("Admin Authentication", () => {
  test("should display the login form at /admin", async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();

    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);

    await expect(page.getByRole("button", { name: "Login" })).not.toBeVisible();
  });

  test("should display Logout button after login", async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);

    await expect(adminPage.logoutButton).toBeVisible();
  });

  test("should display admin navigation after login", async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);

    await expect(page.getByRole("link", { name: "Rooms" })).toBeVisible();
    await expect(adminPage.logoutButton).toBeVisible();
  });

  test("should return to login page after logout", async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);
    await expect(adminPage.logoutButton).toBeVisible();

    await adminPage.logout();

    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});

test.describe("Admin Rooms Tab", () => {
  test("should navigate to Rooms tab and see room listings", async ({
    page,
  }) => {
    const adminPage = new AdminPage(page);

    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);
    await adminPage.navigateToRooms();

    const roomCount = await adminPage.getRoomCount();
    expect(roomCount).toBeGreaterThan(0);
    //console.log(`Rooms found in admin panel: ${roomCount}`);
  });

  test(" should verify admin room count matches homepage Book now links", async ({
    page,
  }) => {
    test.skip(
      true,
      "BUG: Admin room count inconsistent with homepage - ticket 001",
    );
    const adminPage = new AdminPage(page);

    // Step 1 — get room count from admin panel
    await adminPage.navigateToAdmin();
    await adminPage.login(ADMIN.username, ADMIN.password);
    await adminPage.navigateToRooms();

    const adminRoomCount = await adminPage.getRoomCount();
    //console.log(`Admin panel rooms: ${adminRoomCount}`);

    // Step 2 — get Book now count from public homepage
    const homePage = new HomePage(page);
    await homePage.navigate();

    const bookNowCount = await homePage.getBookNowCount();
    //console.log(`Homepage Book now links: ${bookNowCount}`);

    //BUG: Admin panel and homepage room counts are inconsistent.
    expect(adminRoomCount).toBe(bookNowCount);
  });
});
