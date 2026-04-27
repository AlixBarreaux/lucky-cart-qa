import { APIRequestContext } from "@playwright/test";
import { randomUUID } from "crypto";

const CART_API_URL = "https://api.luckycart.com/cart/ticket";
const SHOPPER_EMAIL_DOMAIN = "@luckycart.com";

interface AuthParams {
  auth_v: string;
  auth_key: string;
  auth_ts: string;
  auth_sign: string;
}

interface CartPayload extends AuthParams {
  cartId: string;
  totalAti: number;
  shopperId: string;
  shopperEmail: string;
}

interface ErrorBody {
  error: string;
  status: number;
}

interface NonEligibleBody {}

export interface EligibleBody {
  ticket: string;
  mobileUrl: string;
  tabletUrl: string;
  desktopUrl: string;
  baseMobileUrl: string;
  baseTabletUrl: string;
  baseDesktopUrl: string;
}

type CartResponseBody = ErrorBody | NonEligibleBody | EligibleBody;

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

  const body = await response.json();

  return { status: response.status(), body };
}
