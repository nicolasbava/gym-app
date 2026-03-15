import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { createClient } from '@/src/utils/supabase/server';

import {
    type ActionResult,
    ERROR_CATEGORY,
    type ErrorCategory,
    actionFailure,
    actionSuccess,
} from './action-result';
import { buildLogEntry, logActionError } from './error-logger';

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface SafeParseSuccess<T> {
    success: true;
    data: T;
}

interface SafeParseFailure {
    success: false;
    error: {
        message: string;
        issues?: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>;
    };
}

type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure;

export interface ParseableSchema<T> {
    safeParse(data: unknown): SafeParseResult<T>;
}

export interface SafeActionOptions<TInput, TOutput> {
    name: string;
    schema?: ParseableSchema<TInput>;
    requiresAuth?: boolean;
    handler: (params: {
        input: TInput;
        supabase: SupabaseClient;
        user: User | null;
    }) => Promise<TOutput>;
}

function classifyError(error: unknown): ErrorCategory {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = String((error as Record<string, unknown>).code);

        if (code === 'PGRST116') {
            return ERROR_CATEGORY.NOT_FOUND;
        }
        if (code === '23505' || code === '23503') {
            return ERROR_CATEGORY.DATABASE;
        }
        if (code === '42501' || code.startsWith('PGRST3')) {
            return ERROR_CATEGORY.AUTH;
        }
    }

    return ERROR_CATEGORY.UNKNOWN;
}

export function createSafeAction<TInput, TOutput>(
    options: SafeActionOptions<TInput, TOutput>,
) {
    return async (input: TInput): Promise<ActionResult<TOutput>> => {
        let validatedInput = input;

        if (options.schema) {
            const parsed = options.schema.safeParse(input);

            if (!parsed.success) {
                logActionError(
                    buildLogEntry(options.name, ERROR_CATEGORY.VALIDATION, parsed.error.message, {
                        input,
                    }),
                );

                const firstIssue = parsed.error.issues?.[0];

                return actionFailure(ERROR_CATEGORY.VALIDATION, parsed.error.message, {
                    field: firstIssue ? String(firstIssue.path[0]) : undefined,
                    context: parsed.error.issues
                        ? { issues: [...parsed.error.issues] }
                        : undefined,
                });
            }

            validatedInput = parsed.data;
        }

        let userId: string | undefined;

        try {
            const cookieStore = await cookies();
            const supabase = await createClient(cookieStore);

            let user: User | null = null;

            if (options.requiresAuth) {
                const { data, error } = await supabase.auth.getUser();

                if (error || !data.user) {
                    logActionError(
                        buildLogEntry(
                            options.name,
                            ERROR_CATEGORY.AUTH,
                            'User is not authenticated',
                            { input },
                        ),
                    );

                    return actionFailure(ERROR_CATEGORY.AUTH, 'User is not authenticated');
                }

                user = data.user;
                userId = user.id;
            }

            const data = await options.handler({ input: validatedInput, supabase, user });

            return actionSuccess(data);
        } catch (error) {
            const category = classifyError(error);
            const message =
                error instanceof Error ? error.message : 'An unexpected error occurred';

            logActionError(
                buildLogEntry(options.name, category, message, { input, userId, error }),
            );

            return actionFailure(category, message);
        }
    };
}
