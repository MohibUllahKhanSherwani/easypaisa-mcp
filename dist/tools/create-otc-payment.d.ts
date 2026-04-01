import { z } from "zod";
export declare const createOtcPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    order_id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    order_id: string;
    email?: string | undefined;
}, {
    amount: number;
    order_id: string;
    email?: string | undefined;
}>;
export declare function handleCreateOtcPayment(params: z.infer<typeof createOtcPaymentSchema>): Promise<string>;
