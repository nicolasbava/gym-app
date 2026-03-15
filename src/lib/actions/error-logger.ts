import type { ErrorCategory } from './action-result';

export interface ErrorLogEntry {
    timestamp: string;
    action: string;
    category: ErrorCategory;
    message: string;
    input?: Record<string, unknown>;
    userId?: string;
    stack?: string;
}

function sanitiseInput(input: unknown): Record<string, unknown> | undefined {
    if (input === null || input === undefined) {
        return undefined;
    }

    if (typeof input !== 'object') {
        return { _value: input };
    }

    try {
        const raw = { ...(input as Record<string, unknown>) };
        const sensitiveKeys = ['password', 'token', 'secret', 'authorization'];

        for (const key of Object.keys(raw)) {
            if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
                raw[key] = '[REDACTED]';
            }
        }

        return raw;
    } catch {
        return { _raw: String(input) };
    }
}

export function buildLogEntry(
    action: string,
    category: ErrorCategory,
    message: string,
    opts?: { input?: unknown; userId?: string; error?: unknown },
): ErrorLogEntry {
    const stack = opts?.error instanceof Error ? opts.error.stack : undefined;

    return {
        timestamp: new Date().toISOString(),
        action,
        category,
        message,
        input: sanitiseInput(opts?.input),
        userId: opts?.userId,
        stack,
    };
}

export function logActionError(entry: ErrorLogEntry): void {
    console.error(
        JSON.stringify(
            {
                level: 'error',
                ...entry,
            },
            null,
            process.env.NODE_ENV === 'development' ? 2 : 0,
        ),
    );
}
