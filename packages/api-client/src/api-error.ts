import * as E from 'fp-ts/Either';

/**
 * Tagged error union for all API client failures.
 * Use the _tag field for exhaustive pattern matching with fp-ts.
 */

export type NetworkError = {
    readonly _tag: 'NetworkError';
    /** Underlying network / fetch failure message */
    readonly message: string;
};

export type HttpError = {
    readonly _tag: 'HttpError';
    /** HTTP status code returned by the server */
    readonly status: number;
    /** Human-readable message from the server response body */
    readonly message: string;
    /** Machine-readable error code from the server, if present */
    readonly code?: string;
};

export type ParseError = {
    readonly _tag: 'ParseError';
    /** Description of what failed to parse */
    readonly message: string;
};

export type ApiError = NetworkError | HttpError | ParseError;

// ── Constructors ────────────────────────────────────────────────────────────

export const networkError = (message: string): NetworkError => ({
    _tag: 'NetworkError',
    message,
});

export const httpError = (status: number, message: string, code?: string): HttpError => ({
    _tag: 'HttpError',
    status,
    message,
    code,
});

export const parseError = (message: string): ParseError => ({
    _tag: 'ParseError',
    message,
});

// ── Guards ───────────────────────────────────────────────────────────────────

export const isNetworkError = (e: ApiError): e is NetworkError => e._tag === 'NetworkError';
export const isHttpError = (e: ApiError): e is HttpError => e._tag === 'HttpError';
export const isParseError = (e: ApiError): e is ParseError => e._tag === 'ParseError';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps any unknown thrown value into an ApiError Either.left */
export const toApiError = (err: unknown): ApiError => {
    if (typeof err === 'object' && err !== null && '_tag' in err) return err as ApiError;
    return networkError(err instanceof Error ? err.message : 'Network error');
};

/** Convert ApiError to a user-facing message string */
export const formatApiError = (e: ApiError): string => {
    switch (e._tag) {
        case 'NetworkError': return `Network error: ${e.message}`;
        case 'HttpError':    return e.message;
        case 'ParseError':   return `Failed to parse response: ${e.message}`;
    }
};

/** Returns Either.right if status matches, left with HttpError otherwise */
export const expectStatus =
    (expected: number) =>
    (status: number, body: unknown): E.Either<ApiError, unknown> =>
        status === expected
            ? E.right(body)
            : E.left(httpError(status, `Expected status ${expected}, got ${status}`));
