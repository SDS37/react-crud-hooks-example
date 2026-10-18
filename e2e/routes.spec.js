import { test, expect } from "@playwright/test";

const mainHeading = (page, name) =>
  page.getByRole("main").getByRole("heading", { level: 2, name });

test.describe("routes", () => {
  test("/ shows the menu", async ({ page }) => {
    await page.goto("/");
    await expect(
      mainHeading(page, "Rock your taste buds with one of these!"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Cherry Blast" }),
    ).toHaveAttribute("href", "/menu-items/1");
  });

  test("/ice-creams lists catalogue flavours that are not on the menu", async ({
    page,
  }) => {
    await page.goto("/ice-creams");
    await expect(
      mainHeading(page, "Choose your poison and enjoy!"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Stripey Madness" }),
    ).toHaveAttribute("href", "/menu-items/add?iceCreamId=0");
    await expect(page.getByRole("link", { name: "Cherry Blast" })).toHaveCount(
      0,
    );
  });

  test("/menu-items/add?iceCreamId=N shows the add form", async ({ page }) => {
    await page.goto("/menu-items/add?iceCreamId=0");
    await expect(
      mainHeading(page, "Add some goodness to the menu"),
    ).toBeVisible();
    await expect(page.getByRole("definition")).toHaveText("Stripey Madness");
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  });

  test("/menu-items/:menuItemId shows the edit form", async ({ page }) => {
    await page.goto("/menu-items/1");
    await expect(mainHeading(page, "Update this beauty")).toBeVisible();
    await expect(page.getByRole("definition")).toHaveText("Cherry Blast");
    await expect(page.getByLabel("Description")).not.toHaveValue("");
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  test("an unknown path ends on /", async ({ page }) => {
    await page.goto("/no-such-page");
    await expect(page).toHaveURL("/");
    await expect(
      mainHeading(page, "Rock your taste buds with one of these!"),
    ).toBeVisible();
  });

  test("adding a flavour that is already on the menu ends on /", async ({
    page,
  }) => {
    await page.goto("/menu-items/add?iceCreamId=1");
    await expect(page).toHaveURL("/");
  });

  test("navigation uses links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Add Ice Cream" }).click();
    await expect(page).toHaveURL("/ice-creams");
    await page.getByRole("link", { name: "Stripey Madness" }).click();
    await expect(page).toHaveURL("/menu-items/add?iceCreamId=0");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Menu" })
      .click();
    await expect(page).toHaveURL("/");
  });
});
