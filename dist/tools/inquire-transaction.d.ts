import { z } from "zod";
export declare const inquireTransactionSchema: z.ZodObject<{
    order_id: z.ZodString;
    payment_token: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    order_id: string;
    payment_token?: string | undefined;
}, {
    order_id: string;
    payment_token?: string | undefined;
}>;
export declare function handleInquireTransaction(params: z.infer<typeof inquireTransactionSchema>): Promise<string>;
