import { test, expect } from "@playwright/test";

const slowResponse = 1500;

test.describe("accessibility", () => {
  test("the skip link targets #main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main");

    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  for (const path of ["/", "/ice-creams", "/menu-items/1"]) {
    test(`main is the landmark and holds the heading on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 2 }),
      ).toBeVisible();
    });
  }

  test("loading is announced in an aria-live region", async ({ page }) => {
    await page.route("**/api/menu", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, slowResponse));
      await route.continue();
    });
    await page.goto("/");

    const liveRegion = page
      .getByRole("main")
      .locator('[aria-live="assertive"]');
    await expect(liveRegion).toHaveText("Ice creams loading");
    await expect(
      page.getByRole("link", { name: "Cherry Blast" }),
    ).toBeVisible();
    await expect(liveRegion).not.toHaveText("Ice creams loading");
  });

  for (const path of ["/", "/ice-creams", "/menu-items/1"]) {
    test(`decorative images use alt="" on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main img").first()).toBeVisible();
      const images = page.locator("img");
      expect(await images.count()).toBeGreaterThan(0);
      await expect(page.locator('img:not([alt=""])')).toHaveCount(0);
    });
  }
});
