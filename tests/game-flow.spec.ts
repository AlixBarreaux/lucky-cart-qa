import { test, expect } from "@playwright/test";
import {
  EligibleBody,
  generateCartId,
  buildValidPayload,
  sendCart,
} from "../helpers/cart";

test.describe("Game Flow", () => {
  test.beforeAll(() => {
  // No global setup required for these tests.
  // Each test generates a unique cartId via crypto.randomUUID()
  // to avoid API response caching from cartId collisions.
  // No teardown needed: the API provides no deletion endpoint.
  });

  test("Eligible cart leads to a playable game that can be won", async ({ request, page }) => {
    // Send eligible cart and get game URL
    const cartId = generateCartId("game_flow");
    const payload = buildValidPayload(60.00, cartId);
    const { status, body } = await sendCart(request, payload);

    expect(status).toBe(200);
    expect(body).toHaveProperty("baseDesktopUrl");

    const eligibleBody = body as EligibleBody;
    const gameUrl = eligibleBody.baseDesktopUrl;

    // Navigate to game home page
    await page.goto(gameUrl);

    // Click "Play now"
    await page.locator('[data-screen-transition="game"]').click();

    // Click "Spin the wheel!"
    await page.locator('[data-template-config="screens.plugin.ctaButton"]').click();

    // Assert win
    await expect(page.getByText("Congrats")).toBeVisible();
  });

  test.afterAll(() => {
  // No teardown required.
  // Carts submitted during tests persist in the API but do not
  // affect future runs since each test uses a unique cartId.
  });
});
