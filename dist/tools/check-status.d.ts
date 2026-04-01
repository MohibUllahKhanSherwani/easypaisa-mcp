import { z } from "zod";
export declare const checkStatusSchema: z.ZodObject<{
    order_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    order_id: string;
}, {
    order_id: string;
}>;
export declare function handleCheckStatus(params: z.infer<typeof checkStatusSchema>): Promise<string>;
