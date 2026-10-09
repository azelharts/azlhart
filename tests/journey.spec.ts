import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/about",
  "/services",
  "/works",
  "/works/feetstudio",
  "/works/aetheria",
  "/works/c-and-a",
  "/archive",
  "/contact",
  "/privacy",
];
test("all pages render without runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
test("navigation and project inquiry work across client transitions", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu +" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation", exact: true })
      .getByRole("link", { name: "Work", exact: false })
      .click();
    await expect(page.getByRole("button", { name: "Menu +" })).toBeVisible();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: "Work", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/works$/);
  await page.getByRole("link", { name: /FeetStudio Framer/ }).click();
  await page.getByRole("link", { name: "Discuss your project" }).click();
  await expect(page.getByLabel("Tell me about the project")).toHaveValue(
    /FeetStudio/,
  );
  await page.getByLabel("Your name").fill("Test Buyer");
  await page.getByLabel("Company", { exact: true }).fill("Test Brand");
  await page.getByLabel("Work email").fill("buyer@example.com");
  await page.getByRole("button", { name: "Prepare email brief" }).click();
  await expect(
    page.getByRole("heading", { name: "Your brief is ready" }),
  ).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("buyer@example.com");
  expect(decodeURIComponent(href!)).toContain("FeetStudio");
});
test("FAQ and missing-page recovery work", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("summary")
    .filter({ hasText: "How do we start working together?" })
    .click();
  await expect(
    page.getByText(/Simply reach out through my contact/),
  ).toBeVisible();
  const response = await page.goto("/works/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Explore work" })).toBeVisible();
});
test("reduced motion keeps content and all process steps accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  for (const name of [
    "Discover",
    "Design",
    "Build & review",
    "Launch & handover",
  ])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  expect(await page.locator("video").getAttribute("src")).toBeNull();
});
