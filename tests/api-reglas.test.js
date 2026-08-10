const { describe, it } = require('node:test');
const assert = require('node:assert');

function makeReq(method, body, headers) {
    return { method, body, headers: headers || {} };
}

function makeRes() {
    const res = {
        _status: 200,
        _json: null,
        _headers: {},
        setHeader(k, v) { this._headers[k] = v; },
        status(s) { this._status = s; return this; },
        json(o) { this._json = o; return this; }
    };
    return res;
}

describe('api/reglas-accept handler', () => {
    it('returns 405 for non-POST', async () => {
        const mod = require('../api/reglas-accept');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(makeReq('GET', null, {}), res);
        assert.strictEqual(res._status, 405);
        assert.deepStrictEqual(res._json, { error: 'Método no permitido' });
    });

    it('returns 415 for non-JSON content type', async () => {
        const mod = require('../api/reglas-accept');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(makeReq('POST', {}, { 'content-type': 'text/plain' }), res);
        assert.strictEqual(res._status, 415);
    });

    it('returns 400 for invalid payload (missing fields)', async () => {
        const mod = require('../api/reglas-accept');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(makeReq('POST', { nombre: 'Solo nombre', acepto: true }, { 'content-type': 'application/json' }), res);
        assert.strictEqual(res._status, 400);
    });
});
