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

const fakeSections = [{ seccion: 'Dia 1', fotos: [{ id: '1', name: 'a.jpg', url: 'http://x' }] }];
const mockDeps = { listSections: async () => fakeSections };

describe('api/camp-fotos handler', () => {
    it('returns 405 for non-GET', async () => {
        const mod = require('../api/camp-fotos');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'POST', headers: {} }, res);
        assert.strictEqual(res._status, 405);
    });

    it('returns empty array when no sections configured', async () => {
        const mod = require('../api/camp-fotos');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'GET', headers: {} }, res, { listSections: async () => [] });
        assert.strictEqual(res._status, 200);
        assert.deepStrictEqual(res._json, []);
    });

    it('returns sections on success', async () => {
        const mod = require('../api/camp-fotos');
        const handler = mod.default || mod;
        const res = makeRes();
        await handler({ method: 'GET', headers: {} }, res, mockDeps);
        assert.strictEqual(res._status, 200);
        assert.strictEqual(res._json[0].seccion, 'Dia 1');
    });
});
