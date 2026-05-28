import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleCheckStatus } from "../tools/check-status.js";
import { handleCreateMaPayment } from "../tools/create-ma-payment.js";
import { handleCreateOtcPayment } from "../tools/create-otc-payment.js";
import { handleCreatePayment } from "../tools/create-payment.js";
import { handleGenerateToken } from "../tools/generate-token.js";
import { handleGetStatement } from "../tools/get-statement.js";
import { handleInquireTransaction } from "../tools/inquire-transaction.js";
import { handleRefundPayment } from "../tools/refund-payment.js";

const BASE_URL = "https://easypay.easypaisa.com.pk/easypay-service/rest/v4";
const STORE_ID = "test_store";
const HASH_KEY = "test_key";

function expectedHash(data: string): string {
  return createHmac("sha256", HASH_KEY).update(data).digest("hex");
}

function mockSuccessfulFetch(payload: unknown = { responseCode: "0000" }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: {
      get: vi.fn((name: string) =>
        name.toLowerCase() === "content-type" ? "application/json" : null
      ),
    },
    json: vi.fn().mockResolvedValue(payload),
    text: vi.fn().mockResolvedValue(JSON.stringify(payload)),
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function expectPost(
  fetchMock: ReturnType<typeof mockSuccessfulFetch>,
  path: string,
  body: Record<string, unknown>
): void {
  expect(fetchMock).toHaveBeenCalledTimes(1);

  const [url, init] = fetchMock.mock.calls[0] as [RequestInfo | URL, RequestInit];
  const headers = new Headers(init.headers);

  expect(String(url)).toBe(`${BASE_URL}${path}`);
  expect(init.method).toBe("POST");
  expect(headers.get("Content-Type")).toBe("application/json");
  expect(headers.get("Accept")).toBe("application/json");
  expect(headers.get("Credentials")).toBe(
    Buffer.from(`${STORE_ID}:${HASH_KEY}`).toString("base64")
  );
  expect(JSON.parse(String(init.body))).toEqual(body);
}

describe("tool handlers", () => {
  beforeEach(() => {
    vi.stubEnv("EASYPAISA_STORE_ID", STORE_ID);
    vi.stubEnv("EASYPAISA_HASH_KEY", HASH_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("sends create_payment requests to the MA transaction endpoint", async () => {
    const fetchMock = mockSuccessfulFetch({ responseCode: "0000" });

    await expect(
      handleCreatePayment({
        amount: 5000,
        mobile_number: "03451234567",
        order_id: "ORD-001",
        email: "customer@example.com",
      })
    ).resolves.toBe(JSON.stringify({ responseCode: "0000" }, null, 2));

    expectPost(fetchMock, "/initiate-ma-transaction", {
      orderId: "ORD-001",
      storeId: STORE_ID,
      transactionAmount: "5000",
      transactionType: "MA",
      mobileAccountNo: "03451234567",
      emailAddress: "customer@example.com",
      hashRequest: expectedHash(
        `amount=5000&orderRefNum=ORD-001&storeId=${STORE_ID}`
      ),
    });
  });

  it("sends create_ma_payment requests with mobile account details", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleCreateMaPayment({
      amount: 10000,
      mobile_account_no: "03451234567",
      order_id: "ORD-002",
    });

    expectPost(fetchMock, "/initiate-ma-transaction", {
      orderId: "ORD-002",
      storeId: STORE_ID,
      transactionAmount: "10000",
      transactionType: "MA",
      mobileAccountNo: "03451234567",
      emailAddress: "",
      hashRequest: expectedHash(
        `amount=10000&orderRefNum=ORD-002&storeId=${STORE_ID}`
      ),
    });
  });

  it("sends create_otc_payment requests to the OTC endpoint", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleCreateOtcPayment({
      amount: 3000,
      order_id: "ORD-003",
      email: "customer@example.com",
    });

    expectPost(fetchMock, "/initiate-otc-transaction", {
      orderId: "ORD-003",
      storeId: STORE_ID,
      transactionAmount: "3000",
      transactionType: "OTC",
      emailAddress: "customer@example.com",
      hashRequest: expectedHash(
        `amount=3000&orderRefNum=ORD-003&storeId=${STORE_ID}`
      ),
    });
  });

  it("sends generate_token requests with optional expiry date", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleGenerateToken({
      amount: 7500,
      order_id: "ORD-004",
      expiry_date: "20260528 235959",
    });

    expectPost(fetchMock, "/generate-token", {
      orderId: "ORD-004",
      storeId: STORE_ID,
      transactionAmount: "7500",
      expiryDate: "20260528 235959",
      hashRequest: expectedHash(
        `amount=7500&orderRefNum=ORD-004&storeId=${STORE_ID}`
      ),
    });
  });

  it("sends check_status requests to the transaction inquiry endpoint", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleCheckStatus({ order_id: "ORD-005" });

    expectPost(fetchMock, "/inquire-transaction", {
      orderId: "ORD-005",
      storeId: STORE_ID,
      hashRequest: expectedHash(`orderRefNum=ORD-005&storeId=${STORE_ID}`),
    });
  });

  it("sends inquire_transaction requests with an optional payment token", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleInquireTransaction({
      order_id: "ORD-006",
      payment_token: "tok_abc123",
    });

    expectPost(fetchMock, "/inquire-transaction", {
      orderId: "ORD-006",
      storeId: STORE_ID,
      hashRequest: expectedHash(`orderRefNum=ORD-006&storeId=${STORE_ID}`),
      paymentToken: "tok_abc123",
    });
  });

  it("sends refund_payment requests with refund reason", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleRefundPayment({
      order_id: "ORD-007",
      amount: 2500,
      reason: "Customer requested refund",
    });

    expectPost(fetchMock, "/refund-transaction", {
      orderId: "ORD-007",
      storeId: STORE_ID,
      transactionAmount: "2500",
      reason: "Customer requested refund",
      hashRequest: expectedHash(
        `amount=2500&orderRefNum=ORD-007&storeId=${STORE_ID}`
      ),
    });
  });

  it("sends get_statement requests with pagination values", async () => {
    const fetchMock = mockSuccessfulFetch();

    await handleGetStatement({
      date_from: "20260401",
      date_to: "20260430",
      page: 1,
      page_size: 50,
    });

    expectPost(fetchMock, "/get-statement", {
      storeId: STORE_ID,
      dateFrom: "20260401",
      dateTo: "20260430",
      page: "1",
      pageSize: "50",
      hashRequest: expectedHash(
        `dateFrom=20260401&dateTo=20260430&storeId=${STORE_ID}`
      ),
    });
  });
});
