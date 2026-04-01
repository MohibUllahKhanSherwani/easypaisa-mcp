#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPaymentSchema, handleCreatePayment } from "./tools/create-payment.js";
import { checkStatusSchema, handleCheckStatus } from "./tools/check-status.js";
import { createMaPaymentSchema, handleCreateMaPayment } from "./tools/create-ma-payment.js";
import { inquireTransactionSchema, handleInquireTransaction } from "./tools/inquire-transaction.js";
import { createOtcPaymentSchema, handleCreateOtcPayment } from "./tools/create-otc-payment.js";
import { generateTokenSchema, handleGenerateToken } from "./tools/generate-token.js";
import { refundPaymentSchema, handleRefundPayment } from "./tools/refund-payment.js";
import { getStatementSchema, handleGetStatement } from "./tools/get-statement.js";
const server = new McpServer({ name: "easypaisa-mcp", version: "1.0.0" });
server.tool("create_payment", "Create an Easypaisa payment.", createPaymentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleCreatePayment(params) }] }));
server.tool("check_status", "Check Easypaisa payment status.", checkStatusSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleCheckStatus(params) }] }));
server.tool("create_ma_payment", "Create a mobile account payment.", createMaPaymentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleCreateMaPayment(params) }] }));
server.tool("inquire_transaction", "Inquire about a transaction.", inquireTransactionSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleInquireTransaction(params) }] }));
server.tool("create_otc_payment", "Create an over-the-counter payment.", createOtcPaymentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleCreateOtcPayment(params) }] }));
server.tool("generate_token", "Generate a payment token.", generateTokenSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleGenerateToken(params) }] }));
server.tool("refund_payment", "Refund an Easypaisa payment.", refundPaymentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleRefundPayment(params) }] }));
server.tool("get_statement", "Get transaction statement.", getStatementSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleGetStatement(params) }] }));
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[easypaisa-mcp] Server started. 8 tools registered.");
}
main().catch((error) => { console.error("[easypaisa-mcp] Error:", error); process.exit(1); });
//# sourceMappingURL=index.js.map