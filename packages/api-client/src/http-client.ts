import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { type ApiError, httpError, parseError, toApiError } from './api-error';
import { decodeWith } from './codec';

export type HttpClientOptions = {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
};

export type HttpClient = {
    get:          <T>(path: string)                                                  => TE.TaskEither<ApiError, T>;
    post:         <T>(path: string, body: unknown)                                   => TE.TaskEither<ApiError, T>;
    patch:        <T>(path: string, body: unknown)                                   => TE.TaskEither<ApiError, T>;
    del:          <T>(path: string)                                                  => TE.TaskEither<ApiError, T>;
    getDecoded:   <A>(path: string, codec: t.Decoder<unknown, A>)                    => TE.TaskEither<ApiError, A>;
    postDecoded:  <A>(path: string, body: unknown, codec: t.Decoder<unknown, A>)     => TE.TaskEither<ApiError, A>;
    patchDecoded: <A>(path: string, body: unknown, codec: t.Decoder<unknown, A>)     => TE.TaskEither<ApiError, A>;
};

const parseErrorResponse = async (res: Response): Promise<ApiError> => {
    try {
        const data = await res.json() as { message?: string | string[]; error?: string };
        const message = Array.isArray(data.message)
            ? data.message.join(', ')
            : (data.message ?? res.statusText);
        return httpError(res.status, message, data.error);
    } catch {
        return httpError(res.status, res.statusText);
    }
};

export const createHttpClient = (options: HttpClientOptions): HttpClient => {
    const request = <T>(method: string, path: string, body?: unknown): TE.TaskEither<ApiError, T> =>
        pipe(
            TE.tryCatch(
                async () => {
                    const res = await fetch(`${options.baseUrl}${path}`, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.defaultHeaders,
                        },
                        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
                    });

                    if (!res.ok) {
                        return E.left<ApiError, T>(await parseErrorResponse(res));
                    }

                    try {
                        const data = await res.json() as T;
                        return E.right<ApiError, T>(data);
                    } catch {
                        return E.left<ApiError, T>(parseError(`Failed to parse JSON response from ${method} ${path}`));
                    }
                },
                (err): ApiError => toApiError(err)
            ),
            TE.flatMap(TE.fromEither)
        );

    const requestDecoded = <A>(method: string, path: string, codec: t.Decoder<unknown, A>, body?: unknown): TE.TaskEither<ApiError, A> =>
        pipe(
            request<unknown>(method, path, body),
            TE.flatMap((raw) => TE.fromEither(decodeWith(codec)(raw)))
        );

    return {
        get:          <T>(path: string)                => request<T>('GET',    path),
        post:         <T>(path: string, body: unknown) => request<T>('POST',   path, body),
        patch:        <T>(path: string, body: unknown) => request<T>('PATCH',  path, body),
        del:          <T>(path: string)                => request<T>('DELETE', path),
        getDecoded:   <A>(path: string, codec: t.Decoder<unknown, A>)                    => requestDecoded<A>('GET',   path, codec),
        postDecoded:  <A>(path: string, body: unknown, codec: t.Decoder<unknown, A>)     => requestDecoded<A>('POST',  path, codec, body),
        patchDecoded: <A>(path: string, body: unknown, codec: t.Decoder<unknown, A>)     => requestDecoded<A>('PATCH', path, codec, body),
    };
};
