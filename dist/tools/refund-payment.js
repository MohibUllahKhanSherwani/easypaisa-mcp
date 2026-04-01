import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client = null;
function getClient() { if (!_client)
    _client = new EasypaisaClient(); return _client; }
export const refundPaymentSchema = z.object({
    order_id: z.string().describe("Order ID of the original transaction"),
    amount: z.number().positive().describe("Refund amount in PKR"),
    reason: z.string().optional().describe("Reason for refund"),
});
export async function handleRefundPayment(params) {
    const hashData = `amount=${params.amount}&orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
    const result = await getClient().post("/refund-transaction", {
        orderId: params.order_id,
        storeId: getClient().getStoreId(),
        transactionAmount: params.amount.toString(),
        reason: params.reason ?? "",
        hashRequest: getClient().generateHash(hashData),
    });
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=refund-payment.js.map