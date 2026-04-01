import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client: EasypaisaClient | null = null;function getClient(): EasypaisaClient { if (!_client) _client = new EasypaisaClient(); return _client; }
export const generateTokenSchema = z.object({
  amount: z.number().positive().describe("Transaction amount in PKR"),
  order_id: z.string().describe("Unique order ID"),
  expiry_date: z.string().optional().describe("Token expiry date (yyyyMMdd HHmmss)"),
});

export async function handleGenerateToken(params: z.infer<typeof generateTokenSchema>): Promise<string> {
  const hashData = `amount=${params.amount}&orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
  const result = await getClient().post("/generate-token", {
    orderId: params.order_id,
    storeId: getClient().getStoreId(),
    transactionAmount: params.amount.toString(),
    expiryDate: params.expiry_date ?? "",
    hashRequest: getClient().generateHash(hashData),
  });
  return JSON.stringify(result, null, 2);
}
