import { z } from "zod";
export declare const createPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    mobile_number: z.ZodString;
    order_id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    mobile_number: string;
    order_id: string;
    email?: string | undefined;
}, {
    amount: number;
    mobile_number: string;
    order_id: string;
    email?: string | undefined;
}>;
export declare function handleCreatePayment(params: z.infer<typeof createPaymentSchema>): Promise<string>;
