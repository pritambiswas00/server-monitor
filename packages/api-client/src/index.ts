// HTTP client builder
export { createHttpClient } from './http-client';
export type { HttpClient, HttpClientOptions } from './http-client';

// io-ts codec validation helper
export { decodeWith } from './codec';

// Tagged error types, constructors, guards, and helpers
export type { ApiError, NetworkError, HttpError, ParseError } from './api-error';
export {
    networkError,
    httpError,
    parseError,
    isNetworkError,
    isHttpError,
    isParseError,
    toApiError,
    formatApiError,
    expectStatus,
} from './api-error';
