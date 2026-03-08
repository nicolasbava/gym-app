import { expect } from 'vitest';
import { z } from 'zod';

export const expectValid = (schema: z.ZodSchema, data: unknown) => {
    const result = schema.safeParse(data);
    expect(result.success).toBe(true);
};

export const expectInvalid = (schema: z.ZodSchema, data: unknown) => {
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
};

export const expectFieldError = (schema: z.ZodSchema, data: unknown, field: string) => {
    const result = schema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
        console.log('result.error', result.error);
        const errorFields = result.error.issues.map((e) => e.path[0]);
        console.log('errorFields', errorFields);
    }
};
