import { test, expect } from "@playwright/test";

const suffix = " | My Ice Cream";

test.describe("document title", () => {
  test("/ is titled with the menu heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      "Rock your taste buds with one of these!" + suffix,
    );
  });

  test("/ice-creams is titled with the catalogue heading", async ({ page }) => {
    await page.goto("/ice-creams");
    await expect(page).toHaveTitle("Choose your poison and enjoy!" + suffix);
  });

  test("the add form is titled with its heading", async ({ page }) => {
    await page.goto("/menu-items/add?iceCreamId=0");
    await expect(page).toHaveTitle("Add some goodness to the menu" + suffix);
  });

  test("the edit form is titled with its heading", async ({ page }) => {
    await page.goto("/menu-items/1");
    await expect(page).toHaveTitle("Update this beauty" + suffix);
  });

  test("navigating between routes replaces the title", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Add Ice Cream" }).click();
    await expect(page).toHaveTitle("Choose your poison and enjoy!" + suffix);
    await page.getByRole("link", { name: "Stripey Madness" }).click();
    await expect(page).toHaveTitle("Add some goodness to the menu" + suffix);
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Menu" })
      .click();
    await expect(page).toHaveTitle(
      "Rock your taste buds with one of these!" + suffix,
    );
    expect(await page.title()).not.toContain("undefined");
  });

  test("the page has one title element once it has loaded", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      "Rock your taste buds with one of these!" + suffix,
    );
    await expect(page.locator("title")).toHaveCount(1);
  });
});
