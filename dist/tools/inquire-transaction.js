import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client = null;
function getClient() { if (!_client)
    _client = new EasypaisaClient(); return _client; }
export const inquireTransactionSchema = z.object({
    order_id: z.string().describe("Order ID to inquire"),
    payment_token: z.string().optional().describe("Payment token from initiation"),
});
export async function handleInquireTransaction(params) {
    const hashData = `orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
    const body = {
        orderId: params.order_id,
        storeId: getClient().getStoreId(),
        hashRequest: getClient().generateHash(hashData),
    };
    if (params.payment_token)
        body.paymentToken = params.payment_token;
    const result = await getClient().post("/inquire-transaction", body);
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=inquire-transaction.js.map