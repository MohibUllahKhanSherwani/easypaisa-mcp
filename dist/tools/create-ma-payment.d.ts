import { z } from "zod";
export declare const createMaPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    mobile_account_no: z.ZodString;
    order_id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    order_id: string;
    mobile_account_no: string;
    email?: string | undefined;
}, {
    amount: number;
    order_id: string;
    mobile_account_no: string;
    email?: string | undefined;
}>;
export declare function handleCreateMaPayment(params: z.infer<typeof createMaPaymentSchema>): Promise<string>;
