import { z } from "zod";
export declare const getStatementSchema: z.ZodObject<{
    date_from: z.ZodString;
    date_to: z.ZodString;
    page: z.ZodDefault<z.ZodNumber>;
    page_size: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    date_from: string;
    date_to: string;
    page: number;
    page_size: number;
}, {
    date_from: string;
    date_to: string;
    page?: number | undefined;
    page_size?: number | undefined;
}>;
export declare function handleGetStatement(params: z.infer<typeof getStatementSchema>): Promise<string>;
