# Bug Report

## ID

BR_1

## Title

[API] [Production] Cart API returns incorrect status codes and missing game data for all request scenarios

## Project

Lucky Cart - QA Engineer Technical Assessment

## Environment

OS: Linux Mint 21.3 x86_64
Kernel: 5.15.0-176-generic
HTTP Clients: Bruno 3.3.0, terminal + curl
API Endpoint: [Ticket](https://api.luckycart.com/cart/ticket)
Method: POST

## Severity

Critical

## Priority

Critical

## Preconditions

- API endpoint is reachable
- Valid authentication parameters are used as provided in the assessment: `auth_v`, `auth_key`, `auth_ts`, `auth_sign`
- Each request uses a unique `cartId` to avoid collision (confirmed by the assessment documentation)

## Steps to Reproduce

### Scenario 1 - Wrong authentication parameters

1. Send a POST request to `https://api.luckycart.com/cart/ticket` with a valid payload but with the `auth_sign` key set to the value `"wrongsign"`
2. Observe the HTTP status code and response body

### Scenario 2 - Non-eligible cart (totalAti < 50)

1. Send a POST request with valid auth parameters and `totalAti: 30.00`
2. Use a unique `cartId` not previously submitted
3. Observe the HTTP status code and response body

### Scenario 3 - Eligible cart (totalAti >= 50)

1. Send a POST request with valid auth parameters and `totalAti: 60.00`
2. Use a unique `cartId` not previously submitted
3. Observe the HTTP status code and response body

## Actual Results

| Scenario | Expected Status | Expected Body | Actual Status | Actual Body |
| --- | --- | --- | --- | --- |
| Wrong auth | 401 | `{"error": "Request signature is not valid.", "status": 401}` | 201 | `{}` |
| Non-eligible cart | 200 | `{}` | 201 | `{}` |
| Eligible cart | 200 | `{"ticket": "...", "baseDesktopUrl": "...", ...}` | 201 | `{}` |

## Expected Results

- Wrong authentication parameters should return HTTP 401 with an error body
- A non-eligible cart (totalAti < 50) should return HTTP 200 with an empty body `{}`
- An eligible cart (totalAti >= 50) should return HTTP 200 with full game data including `ticket` and `baseDesktopUrl`

## Impact

All three test scenarios specified in the assessment are affected:

- Authentication validation is non-functional (401 not returned)
- Eligibility logic is non-functional (eligible carts return no game data)
- The game flow E2E test is entirely blocked (no `baseDesktopUrl` to navigate to)

## Notes

- The `cartId` collision behavior described in the assessment was accounted for: unique IDs were used in every request
- Lucky Cart's Lead QA was contacted by email on the date of discovery.
Response from the Lead QA confirmed the API is intentionally unavailable as part of the assessment exercise.
Evaluation will focus on code quality and approach rather than live test execution

## Reproducibility

5/5 times across Bruno and curl via terminal

## References

[Lucky Cart QA Engineer Technical Assessment](https://www.notion.so/luckycart/QA-Engineer-Technical-Assessment-34c9d2b4f984804faafcc97a7ece0b39)

## Reported by

Alix Barreaux

## Date

2026/04/27
