import { z } from "zod";
export declare const refundPaymentSchema: z.ZodObject<{
    order_id: z.ZodString;
    amount: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    order_id: string;
    reason?: string | undefined;
}, {
    amount: number;
    order_id: string;
    reason?: string | undefined;
}>;
export declare function handleRefundPayment(params: z.infer<typeof refundPaymentSchema>): Promise<string>;
