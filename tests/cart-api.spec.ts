import { test, expect } from "@playwright/test";
import {
  generateCartId,
  buildValidPayload,
  buildInvalidAuthPayload,
  sendCart,
} from "../helpers/cart";

test.describe("Cart API", () => {
  test("Returns 401 with wrong authentication parameters", async ({ request }) => {
    const cartId = generateCartId("wrong_auth");
    const payload = buildInvalidAuthPayload(cartId);
    const { status, body } = await sendCart(request, payload);

    expect(status).toBe(401);
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("status", 401);
  });

  test("Returns 200 with empty body when totalAti is below 50", async ({ request }) => {
    const cartId = generateCartId("not_eligible");
    const payload = buildValidPayload(30.00, cartId);
    const { status, body } = await sendCart(request, payload);

    expect(status).toBe(200);
    expect(body).toEqual({});
  });

  test("Returns 200 with game data when totalAti is 50 or above", async ({ request }) => {
    const cartId = generateCartId("eligible");
    const payload = buildValidPayload(60.00, cartId);
    const { status, body } = await sendCart(request, payload);

    expect(status).toBe(200);
    expect(body).toHaveProperty("ticket");
    expect(body).toHaveProperty("baseDesktopUrl");
  });
});
