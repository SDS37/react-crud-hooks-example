import { test, expect } from "@playwright/test";

const menuHeading = (page) =>
  page.getByRole("main").getByRole("heading", {
    level: 2,
    name: "Rock your taste buds with one of these!",
  });

test.describe("form", () => {
  test("quantity 0 and out of stock stay coupled", async ({ page }) => {
    await page.goto("/menu-items/add?iceCreamId=0");
    const inStock = page.getByLabel("In Stock");
    const quantity = page.getByLabel("Quantity");

    await quantity.selectOption("10");
    await expect(inStock).toBeChecked();

    await inStock.uncheck();
    await expect(quantity).toHaveValue("0");

    await quantity.selectOption("20");
    await expect(inStock).toBeChecked();

    await quantity.selectOption("0");
    await expect(inStock).not.toBeChecked();
  });

  test("validation errors appear only after the first submit", async ({
    page,
  }) => {
    await page.goto("/menu-items/add?iceCreamId=0");
    const description = page.getByLabel("Description");
    await expect(description).toBeVisible();

    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
    await expect(page.getByText("You must enter a description")).toHaveCount(0);

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("You must enter a description")).toBeVisible();
    await expect(
      page.getByText("An in stock item should have a quantity"),
    ).toBeVisible();
    await expect(page.getByText("You must enter a price")).toBeVisible();
    await expect(description).toHaveAttribute("aria-invalid", "true");
  });

  test("a failed submit focuses the first invalid control", async ({
    page,
  }) => {
    await page.goto("/menu-items/add?iceCreamId=0");
    const save = page.getByRole("button", { name: "Save" });

    await save.click();
    await expect(page.getByLabel("Description")).toBeFocused();

    await page.getByLabel("Description").fill("A test scoop");
    await save.click();
    await expect(page.getByLabel("Quantity")).toBeFocused();
    await expect(
      page.locator('form [aria-invalid="true"]').first(),
    ).toBeFocused();
  });

  test("a valid add saves and returns to the menu", async ({ page }) => {
    await page.goto("/menu-items/add?iceCreamId=28");
    await page.getByLabel("Description").fill("A test scoop");
    await page.getByLabel("Quantity").selectOption("10");
    await page.getByLabel("Price").fill("1.50");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/");
    await expect(menuHeading(page)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Toxic Sludge" }),
    ).toBeVisible();
  });

  test("the heading receives focus after a save that returns home", async ({
    page,
  }) => {
    await page.goto("/menu-items/1");
    await expect(page.getByLabel("Description")).not.toHaveValue("");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page).toHaveURL("/");
    await expect(menuHeading(page)).toBeFocused();
  });
});
