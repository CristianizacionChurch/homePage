const { describe, it } = require('node:test');
const assert = require('node:assert');

function makeRes() {
    const res = {
        _status: 200, _json: null, _headers: {}, _body: null,
        setHeader(k, v) { this._headers[k] = v; },
        status(s) { this._status = s; return this; },
        json(o) { this._json = o; return this; },
        end(b) { this._body = b; return this; }
    };
    return res;
}

const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

function okFetch() {
    return async () => ({
        ok: true, status: 200,
        arrayBuffer: async () => fakeJpeg,
        headers: { get: () => 'image/jpeg' }
    });
}

describe('api/yt-thumb handler', () => {
    it('returns 405 for non-GET', async () => {
        const mod = require('../api/yt-thumb');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'POST', headers: {}, query: {} }, res);
        assert.strictEqual(res._status, 405);
    });

    it('returns 400 for invalid id without calling upstream', async () => {
        const mod = require('../api/yt-thumb');
        const handler = mod.default || mod;
        const res = makeRes();
        let called = false;
        const spyFetch = async () => { called = true; return okFetch()(); };
        await handler({ method: 'GET', headers: {}, query: { id: 'no!valido' } }, res, { fetchFn: spyFetch });
        assert.strictEqual(res._status, 400);
        assert.strictEqual(called, false);
    });

    it('proxies the thumbnail on success', async () => {
        const mod = require('../api/yt-thumb');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'GET', headers: {}, query: { id: 'Fpjdc32GMf4' } }, res, { fetchFn: okFetch() });
        assert.strictEqual(res._headers['Content-Type'], 'image/jpeg');
        assert.deepStrictEqual(res._body, fakeJpeg);
    });

    it('returns 404 when upstream fails', async () => {
        const mod = require('../api/yt-thumb');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(
            { method: 'GET', headers: {}, query: { id: 'Fpjdc32GMf4' } },
            res,
            { fetchFn: async () => ({ ok: false, status: 404 }) }
        );
        assert.strictEqual(res._status, 404);
    });
});
