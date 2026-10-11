import { test, expect } from "@playwright/test";

test("work view changes, project inspection and browser back remain usable", async ({
  page,
}) => {
  await page.goto("/works");
  await page.getByRole("button", { name: "Index", exact: false }).click();
  await expect(page.locator(".project-grid")).toHaveClass(/project-index/);
  await page.getByRole("button", { name: "Gallery", exact: false }).click();
  await expect(page.locator(".project-grid")).not.toHaveClass(/project-index/);
  await page.getByRole("button", { name: "Index", exact: false }).click();
  await page.getByRole("link", { name: /Hirestack Next.js/ }).click();
  await expect(page).toHaveURL(/\/works\/hirestack$/);
  await page.getByRole("button", { name: "Inspect +", exact: true }).click();
  await expect(page.locator(".case-viewer-frame")).toHaveClass(/is-inspecting/);
  await page.getByRole("slider", { name: "Explore screenshot" }).fill("70");
  await expect(page.getByRole("slider")).toHaveValue("70");
  await page.getByText("Project notes", { exact: false }).click();
  await expect(page.locator(".drawer-content")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/works$/);
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Index", exact: false }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("service selection connects to a prefilled brief", async ({ page }) => {
  await page.goto("/services");
  await page.getByRole("button", { name: /Framer websites/ }).click();
  await expect(page.locator(".service-explorer-copy h2")).toHaveText(
    "Framer websites",
  );
  await page.getByRole("link", { name: "Discuss this service" }).click();
  await expect(page.getByLabel("What do you need?")).toHaveValue(
    "Framer websites",
  );
  await expect(page.locator(".brief-preview")).toContainText("Framer websites");
  await page.getByLabel("Company", { exact: true }).fill("Moving Brand");
  await expect(page.locator(".brief-preview-title")).toHaveText("Moving Brand");
});

test("archive studies respond to replay, choices and direct manipulation", async ({
  page,
}) => {
  await page.goto("/archive");
  await page.getByRole("slider", { name: "Trace amount" }).fill("35");
  await expect(page.getByRole("slider")).toHaveValue("35");
  await page.getByRole("button", { name: "Replay motion" }).click();
  await page.getByRole("button", { name: /Experiment \/ 02/ }).click();
  await page.getByLabel("Choose a phrase").selectOption("1");
  await page.getByRole("button", { name: "Replay motion" }).click();
  await expect(page.locator(".lab-type > span").first()).toHaveText(
    "MAKE IT MOVE",
  );
  await page.getByRole("button", { name: /Experiment \/ 03/ }).click();
  await page.getByRole("slider", { name: "Reveal position" }).fill("25");
  await expect(page.locator(".lab-reveal-top")).toHaveCSS(
    "clip-path",
    "inset(0px 75% 0px 0px)",
  );
});

test("process and studio controls work after rapid changes", async ({
  page,
}) => {
  await page.goto("/services");
  const steps = page.getByRole("group", { name: "Process steps" });
  await steps.getByRole("button", { name: /Launch & handover/ }).click();
  await steps.getByRole("button", { name: /Design/ }).click();
  await expect(page.locator(".process-copy h2")).toHaveText("Design");
  await expect(page.locator(".process-copy")).toBeVisible();
  await page.goto("/about");
  await page.getByRole("button", { name: "Next studio study" }).click();
  await expect(page.locator(".studio-study-caption h2")).toHaveText(
    "Composition",
  );
  await page.getByRole("button", { name: "Interaction", exact: true }).click();
  await expect(page.locator(".studio-study-caption h2")).toHaveText(
    "Interaction",
  );
});

test("menu is keyboard accessible and returns focus on Escape", async ({
  page,
}) => {
  await page.goto("/works");
  await page.getByRole("button", { name: "Menu +" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Menu +" })).toBeFocused();
});

test("home process releases to the footer and survives navigation and resize", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const steps = page.getByRole("group", { name: "Process steps" });
  await steps.getByRole("button", { name: /Launch & handover/ }).click();
  await expect(page.locator(".process-copy h2")).toHaveText(
    "Launch & handover",
  );
  await steps.getByRole("button", { name: /Discover/ }).click();
  await expect(page.locator(".process-copy h2")).toHaveText("Discover");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/works$/);
  await expect(page.locator(".project-card")).toHaveCount(4);
  if (!isMobile) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Menu +" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
  expect(errors).toEqual([]);
});
