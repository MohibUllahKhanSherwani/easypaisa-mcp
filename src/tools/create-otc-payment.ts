import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client: EasypaisaClient | null = null;function getClient(): EasypaisaClient { if (!_client) _client = new EasypaisaClient(); return _client; }
export const createOtcPaymentSchema = z.object({
  amount: z.number().positive().describe("Amount in PKR"),
  order_id: z.string().describe("Unique order ID"),
  email: z.string().email().optional().describe("Customer email"),
});

export async function handleCreateOtcPayment(params: z.infer<typeof createOtcPaymentSchema>): Promise<string> {
  const hashData = `amount=${params.amount}&orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
  const result = await getClient().post("/initiate-otc-transaction", {
    orderId: params.order_id,
    storeId: getClient().getStoreId(),
    transactionAmount: params.amount.toString(),
    transactionType: "OTC",
    emailAddress: params.email ?? "",
    hashRequest: getClient().generateHash(hashData),
  });
  return JSON.stringify(result, null, 2);
}
