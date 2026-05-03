import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { parseError, type ApiError } from './api-error';

/**
 * Decodes an unknown value against an io-ts codec.
 * Returns Either<ApiError (ParseError), A>.
 */
export const decodeWith =
    <A>(codec: t.Decoder<unknown, A>) =>
    (raw: unknown): E.Either<ApiError, A> =>
        pipe(
            codec.decode(raw),
            E.mapLeft((errors) => {
                const messages = errors
                    .map((e) => {
                        const path = e.context.map((c) => c.key).filter(Boolean).join('.');
                        const expected = e.context[e.context.length - 1]?.type.name ?? 'unknown';
                        return path ? `${path}: expected ${expected}` : `expected ${expected}`;
                    })
                    .join(', ');
                return parseError(`Response validation failed: ${messages}`);
            })
        );
