const { describe, it } = require('node:test');
const assert = require('node:assert');

function makeRes() {
    const res = {
        _status: 200, _json: null, _headers: {},
        setHeader(k, v) { this._headers[k] = v; },
        status(s) { this._status = s; return this; },
        json(o) { this._json = o; return this; }
    };
    return res;
}

function getReq(body) {
    return {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body
    };
}

describe('api/prayer-request handler', () => {
    it('returns 405 for non-POST', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'GET', headers: {}, body: {} }, res);
        assert.strictEqual(res._status, 405);
    });

    it('returns 415 without JSON content-type', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        let called = false;
        await handler({ method: 'POST', headers: {}, body: { nombre: 'A', peticion: 'B' } }, res, { appendPrayer: async () => { called = true; } });
        assert.strictEqual(res._status, 415);
        assert.strictEqual(called, false);
    });

    it('returns 400 for missing nombre without calling Sheets', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        let called = false;
        await handler(getReq({ nombre: '', peticion: 'Salud' }), res, { appendPrayer: async () => { called = true; } });
        assert.strictEqual(res._status, 400);
        assert.strictEqual(called, false);
    });

    it('returns 400 for peticion over 1000 chars', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(getReq({ nombre: 'Ana', peticion: 'x'.repeat(1001) }), res, { appendPrayer: async () => {} });
        assert.strictEqual(res._status, 400);
    });

    it('returns 400 for missing peticion without calling Sheets', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        let called = false;
        await handler(getReq({ nombre: 'Ana' }), res, { appendPrayer: async () => { called = true; } });
        assert.strictEqual(res._status, 400);
        assert.strictEqual(called, false);
    });

    it('returns 400 for nombre over 100 chars', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(getReq({ nombre: 'x'.repeat(101), peticion: 'Salud' }), res, { appendPrayer: async () => {} });
        assert.strictEqual(res._status, 400);
    });

    it('saves sanitized prayer to Sheets on success', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        let captured = null;
        await handler(
            getReq({ nombre: 'Ana <b>', peticion: 'Salud & paz' }),
            res,
            { appendPrayer: async (sheetId, prayer) => { captured = { sheetId, prayer }; } }
        );
        assert.strictEqual(res._status, 200);
        assert.strictEqual(res._json.success, true);
        assert.strictEqual(captured.sheetId, '17USYH5qKocYAzYUlAGGWrZ_BbmNWSGDrPIWUBc-IYto');
        assert.strictEqual(captured.prayer.nombre, 'Ana b');
        assert.strictEqual(captured.prayer.peticion, 'Salud  paz');
        assert.ok(!Number.isNaN(Date.parse(captured.prayer.fecha)));
    });

    it('returns 502 when Sheets fails', async () => {
        const mod = require('../api/prayer-request');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler(
            getReq({ nombre: 'Ana', peticion: 'Salud' }),
            res,
            { appendPrayer: async () => { throw new Error('down'); } }
        );
        assert.strictEqual(res._status, 502);
    });
});
