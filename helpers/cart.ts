import type { APIRequestContext } from "@playwright/test";
import { randomUUID } from "crypto";

const CART_API_URL = "https://api.luckycart.com/cart/ticket";
const SHOPPER_EMAIL_DOMAIN = "@luckycart.com";

interface AuthParams {
  readonly auth_v: string;
  readonly auth_key: string;
  readonly auth_ts: string;
  readonly auth_sign: string;
}

interface CartPayload extends AuthParams {
  cartId: string;
  totalAti: number;
  shopperId: string;
  shopperEmail: string;
}

interface ErrorBody {
  readonly error: string;
  readonly status: number;
}

interface NonEligibleBody {}

export interface EligibleBody {
  readonly ticket: string;
  readonly mobileUrl: string;
  readonly tabletUrl: string;
  readonly desktopUrl: string;
  readonly baseMobileUrl: string;
  readonly baseTabletUrl: string;
  readonly baseDesktopUrl: string;
}

type CartResponseBody = ErrorBody | NonEligibleBody | EligibleBody;

export function isEligibleBody(body: CartResponseBody): body is EligibleBody {
  return "baseDesktopUrl" in body;
}

interface CartResponse {
  status: number;
  body: CartResponseBody;
}

const VALID_AUTH: AuthParams = {
  auth_v: "2.0",
  auth_key: "tVIoa1S6",
  auth_ts: "1640991600",
  auth_sign: "c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30",
};

const INVALID_AUTH: AuthParams = {
  auth_v: "2.0",
  auth_key: "tVIoa1S6",
  auth_ts: "1640991600",
  auth_sign: "wrongsign",
};

export function generateCartId(prefix: string): string {
  // Uses crypto.randomUUID() to guarantee collision-free cart IDs across all test runs.
  return `${prefix}_${randomUUID()}`;
}

export function buildValidPayload(totalAti: number, cartId: string): CartPayload {
  return {
    cartId,
    totalAti,
    shopperId: cartId,
    shopperEmail: `${cartId}${SHOPPER_EMAIL_DOMAIN}`,
    ...VALID_AUTH,
  };
}

export function buildInvalidAuthPayload(cartId: string): CartPayload {
  return {
    cartId,
    totalAti: 60.00,
    shopperId: cartId,
    shopperEmail: `${cartId}${SHOPPER_EMAIL_DOMAIN}`,
    ...INVALID_AUTH,
  };
}

export async function sendCart(request: APIRequestContext, payload: CartPayload): Promise<CartResponse> {
  const response = await request.post(CART_API_URL, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  const body: CartResponseBody = await response.json();

  return { status: response.status(), body };
}
