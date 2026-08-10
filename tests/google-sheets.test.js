const { describe, it } = require('node:test');
const assert = require('node:assert');
const { toSheetRow, fromSheetRow } = require('../lib/google-sheets');

describe('toSheetRow', () => {
    it('builds a 6-column row', () => {
        const row = toSheetRow({
            nombre: 'Juan Pérez',
            contactoEmergencia: 'María 555-1234',
            condicionMedica: 'Asma',
            alergias: 'Penicilina',
            fecha: '2026-08-10T04:00:00.000Z'
        });
        assert.strictEqual(row.length, 6);
        assert.strictEqual(row[0], '10/8/2026');
        assert.strictEqual(row[1], 'Juan Pérez');
        assert.strictEqual(row[2], 'María 555-1234');
        assert.strictEqual(row[3], 'Asma');
        assert.strictEqual(row[4], 'Penicilina');
        assert.strictEqual(row[5], 'Si');
    });
});

describe('fromSheetRow', () => {
    it('maps a row to a record with acepto true for Si', () => {
        const r = fromSheetRow(['10/8/2026', 'Juan', 'María', 'Asma', 'Penicilina', 'Si']);
        assert.strictEqual(r.nombre, 'Juan');
        assert.strictEqual(r.contactoEmergencia, 'María');
        assert.strictEqual(r.acepto, true);
    });

    it('handles empty rows with acepto false', () => {
        const r = fromSheetRow([]);
        assert.strictEqual(r.nombre, '');
        assert.strictEqual(r.acepto, false);
    });
});
