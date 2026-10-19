import { test, expect, type Page } from "@playwright/test";

const menuHeading = (page: Page) =>
  page.getByRole("main").getByRole("heading", {
    level: 2,
    name: "Rock your taste buds with one of these!",
  });

test.describe("heading focus", () => {
  test("saving an add and deleting an item return home with the heading focused", async ({
    page,
  }) => {
    await page.goto("/menu-items/add?iceCreamId=26");
    await page.getByLabel("Description").fill("A focus test scoop");
    await page.getByLabel("Quantity").selectOption("10");
    await page.getByLabel("Price").fill("1.50");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/");
    await expect(menuHeading(page)).toBeFocused();

    await page.getByRole("link", { name: "Shaken and Whipped" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page).toHaveURL("/");
    await expect(menuHeading(page)).toBeFocused();
  });

  test("a plain link back to the menu does not focus the heading", async ({
    page,
  }) => {
    await page.goto("/ice-creams");
    await page.getByRole("link", { name: "Menu" }).first().click();

    await expect(page).toHaveURL("/");
    await expect(menuHeading(page)).toBeVisible();
    await expect(menuHeading(page)).not.toBeFocused();
  });

  test("reloading the menu after a save does not focus the heading again", async ({
    page,
  }) => {
    await page.goto("/menu-items/1");
    await expect(page.getByLabel("Description")).not.toHaveValue("");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(menuHeading(page)).toBeFocused();

    await page.reload();

    await expect(menuHeading(page)).toBeVisible();
    await expect(menuHeading(page)).not.toBeFocused();
  });
});
