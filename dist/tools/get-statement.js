import { z } from "zod";
import { EasypaisaClient } from "../client.js";
let _client = null;
function getClient() { if (!_client)
    _client = new EasypaisaClient(); return _client; }
export const getStatementSchema = z.object({
    date_from: z.string().describe("Start date (yyyyMMdd)"),
    date_to: z.string().describe("End date (yyyyMMdd)"),
    page: z.number().min(0).default(0).describe("Page number"),
    page_size: z.number().min(1).max(100).default(25).describe("Items per page"),
});
export async function handleGetStatement(params) {
    const hashData = `dateFrom=${params.date_from}&dateTo=${params.date_to}&storeId=${getClient().getStoreId()}`;
    const result = await getClient().post("/get-statement", {
        storeId: getClient().getStoreId(),
        dateFrom: params.date_from,
        dateTo: params.date_to,
        page: params.page.toString(),
        pageSize: params.page_size.toString(),
        hashRequest: getClient().generateHash(hashData),
    });
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=get-statement.js.map