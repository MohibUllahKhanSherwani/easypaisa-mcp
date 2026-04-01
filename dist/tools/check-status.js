import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client = null;
function getClient() { if (!_client)
    _client = new EasypaisaClient(); return _client; }
export const checkStatusSchema = z.object({
    order_id: z.string().describe("Order ID to check status"),
});
export async function handleCheckStatus(params) {
    const hashData = `orderRefNum=${params.order_id}&storeId=${getClient().getStoreId()}`;
    const result = await getClient().post("/inquire-transaction", {
        orderId: params.order_id,
        storeId: getClient().getStoreId(),
        hashRequest: getClient().generateHash(hashData),
    });
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=check-status.js.map