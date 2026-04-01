import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client = null;
function getClient() { if (!_client)
    _client = new EasypaisaClient(); return _client; }
export const createPaymentSchema = z.object({
    amount: z.number().positive().describe("Payment amount in PKR"),
    mobile_number: z.string().describe("Customer mobile number (03XXXXXXXXX)"),
    order_id: z.string().describe("Unique order ID"),
    email: z.string().email().optional().describe("Customer email address"),
});
export async function handleCreatePayment(params) {
    const hashData = `amount=${params.amount}&orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
    const result = await getClient().post("/initiate-ma-transaction", {
        orderId: params.order_id,
        storeId: getClient().getStoreId(),
        transactionAmount: params.amount.toString(),
        transactionType: "MA",
        mobileAccountNo: params.mobile_number,
        emailAddress: params.email ?? "",
        hashRequest: getClient().generateHash(hashData),
    });
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=create-payment.js.map