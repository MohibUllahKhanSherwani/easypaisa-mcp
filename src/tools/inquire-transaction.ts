import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client: EasypaisaClient | null = null;function getClient(): EasypaisaClient { if (!_client) _client = new EasypaisaClient(); return _client; }
export const inquireTransactionSchema = z.object({
  order_id: z.string().describe("Order ID to inquire"),
  payment_token: z.string().optional().describe("Payment token from initiation"),
});

export async function handleInquireTransaction(params: z.infer<typeof inquireTransactionSchema>): Promise<string> {
  const hashData = `orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
  const body: Record<string, string> = {
    orderId: params.order_id,
    storeId: getClient().getStoreId(),
    hashRequest: getClient().generateHash(hashData),
  };
  if (params.payment_token) body.paymentToken = params.payment_token;
  const result = await getClient().post("/inquire-transaction", body);
  return JSON.stringify(result, null, 2);
}
