export const ERROR_CATEGORY = {
    VALIDATION: 'VALIDATION',
    AUTH: 'AUTH',
    NOT_FOUND: 'NOT_FOUND',
    DATABASE: 'DATABASE',
    EXTERNAL: 'EXTERNAL',
    UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCategory = (typeof ERROR_CATEGORY)[keyof typeof ERROR_CATEGORY];

export interface ActionError {
    category: ErrorCategory;
    message: string;
    field?: string;
    context?: Record<string, unknown>;
}

export interface ActionSuccess<T> {
    success: true;
    data: T;
    error: null;
}

export interface ActionFailure {
    success: false;
    data: null;
    error: ActionError;
}

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export function actionSuccess<T>(data: T): ActionSuccess<T> {
    return { success: true, data, error: null };
}

export function actionFailure(
    category: ErrorCategory,
    message: string,
    opts?: { field?: string; context?: Record<string, unknown> },
): ActionFailure {
    return {
        success: false,
        data: null,
        error: { category, message, ...opts },
    };
}
