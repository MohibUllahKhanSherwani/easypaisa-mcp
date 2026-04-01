import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPaymentSchema } from "../tools/create-payment.js";
import { checkStatusSchema } from "../tools/check-status.js";
import { createMaPaymentSchema } from "../tools/create-ma-payment.js";
import { inquireTransactionSchema } from "../tools/inquire-transaction.js";
import { createOtcPaymentSchema } from "../tools/create-otc-payment.js";
import { generateTokenSchema } from "../tools/generate-token.js";
import { refundPaymentSchema } from "../tools/refund-payment.js";
import { getStatementSchema } from "../tools/get-statement.js";
describe("easypaisa-mcp schemas", () => {
    it("validates create_payment params", () => {
        const valid = createPaymentSchema.safeParse({
            amount: 5000,
            mobile_number: "03451234567",
            order_id: "ORD-001",
        });
        expect(valid.success).toBe(true);
    });
    it("rejects create_payment with negative amount", () => {
        const invalid = createPaymentSchema.safeParse({
            amount: -100,
            mobile_number: "03451234567",
            order_id: "ORD-001",
        });
        expect(invalid.success).toBe(false);
    });
    it("validates create_payment with optional email", () => {
        const valid = createPaymentSchema.safeParse({
            amount: 5000,
            mobile_number: "03451234567",
            order_id: "ORD-001",
            email: "user@example.com",
        });
        expect(valid.success).toBe(true);
    });
    it("validates check_status params", () => {
        const valid = checkStatusSchema.safeParse({ order_id: "ORD-001" });
        expect(valid.success).toBe(true);
    });
    it("validates create_ma_payment params", () => {
        const valid = createMaPaymentSchema.safeParse({
            amount: 10000,
            mobile_account_no: "03451234567",
            order_id: "ORD-002",
        });
        expect(valid.success).toBe(true);
    });
    it("validates inquire_transaction params", () => {
        const valid = inquireTransactionSchema.safeParse({
            order_id: "ORD-001",
        });
        expect(valid.success).toBe(true);
    });
    it("validates inquire_transaction with payment_token", () => {
        const valid = inquireTransactionSchema.safeParse({
            order_id: "ORD-001",
            payment_token: "tok_abc123",
        });
        expect(valid.success).toBe(true);
    });
    it("validates create_otc_payment params", () => {
        const valid = createOtcPaymentSchema.safeParse({
            amount: 3000,
            order_id: "ORD-003",
        });
        expect(valid.success).toBe(true);
    });
    it("validates generate_token params", () => {
        const valid = generateTokenSchema.safeParse({
            amount: 5000,
            order_id: "ORD-004",
        });
        expect(valid.success).toBe(true);
    });
    it("validates refund_payment params", () => {
        const valid = refundPaymentSchema.safeParse({
            order_id: "ORD-001",
            amount: 2500,
        });
        expect(valid.success).toBe(true);
    });
    it("validates get_statement params", () => {
        const valid = getStatementSchema.safeParse({
            date_from: "20260401",
            date_to: "20260430",
        });
        expect(valid.success).toBe(true);
    });
    it("rejects get_statement with page_size > 100", () => {
        const invalid = getStatementSchema.safeParse({
            date_from: "20260401",
            date_to: "20260430",
            page_size: 200,
        });
        expect(invalid.success).toBe(false);
    });
});
describe("EasypaisaClient", () => {
    beforeEach(() => {
        vi.stubEnv("EASYPAISA_STORE_ID", "");
        vi.stubEnv("EASYPAISA_HASH_KEY", "");
    });
    it("throws when credentials are missing", async () => {
        const { EasypaisaClient } = await import("../client.js");
        expect(() => new EasypaisaClient()).toThrow("EASYPAISA_STORE_ID");
    });
    it("generates HMAC hash correctly", async () => {
        vi.stubEnv("EASYPAISA_STORE_ID", "test_store");
        vi.stubEnv("EASYPAISA_HASH_KEY", "test_key");
        const { EasypaisaClient } = await import("../client.js");
        const client = new EasypaisaClient();
        const hash = client.generateHash("test_data");
        expect(hash).toBeTruthy();
        expect(typeof hash).toBe("string");
        expect(hash.length).toBe(64);
    });
});
//# sourceMappingURL=tools.test.js.map