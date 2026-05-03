import * as t from 'io-ts';

/**
 * Decodes an fp-ts Option<string> as serialised by NestJS/TypeORM:
 *   { _tag: 'None' }            → null
 *   { _tag: 'Some', value: 's'} → 's'
 * Also accepts plain string | null for forward-compatibility.
 */
export const FptsOptionString = new t.Type<string | null, unknown, unknown>(
    'FptsOptionString',
    (u): u is string | null => u === null || typeof u === 'string',
    (u, c) => {
        if (u === null || u === undefined) return t.success(null);
        if (typeof u === 'string') return t.success(u);
        if (typeof u === 'object' && u !== null) {
            const obj = u as Record<string, unknown>;
            if (obj['_tag'] === 'None') return t.success(null);
            if (obj['_tag'] === 'Some' && typeof obj['value'] === 'string') return t.success(obj['value']);
        }
        return t.failure(u, c);
    },
    (a) => a,
);
