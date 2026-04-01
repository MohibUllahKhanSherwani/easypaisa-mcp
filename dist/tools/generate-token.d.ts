import { z } from "zod";
export declare const generateTokenSchema: z.ZodObject<{
    amount: z.ZodNumber;
    order_id: z.ZodString;
    expiry_date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    order_id: string;
    expiry_date?: string | undefined;
}, {
    amount: number;
    order_id: string;
    expiry_date?: string | undefined;
}>;
export declare function handleGenerateToken(params: z.infer<typeof generateTokenSchema>): Promise<string>;
