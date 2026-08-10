const { describe, it } = require('node:test');
const assert = require('node:assert');
const { validateAcceptance, sanitizeName, REGLAS, formatReglasContent } = require('../lib/reglas');

describe('validateAcceptance', () => {
    it('returns true for a valid payload', () => {
        assert.strictEqual(validateAcceptance({ nombre: 'Juan Pérez', acepto: true }), true);
    });

    it('returns false for missing body', () => {
        assert.strictEqual(validateAcceptance(null), false);
        assert.strictEqual(validateAcceptance(undefined), false);
    });

    it('returns false for missing or empty nombre', () => {
        assert.strictEqual(validateAcceptance({ acepto: true }), false);
        assert.strictEqual(validateAcceptance({ nombre: '   ', acepto: true }), false);
        assert.strictEqual(validateAcceptance({ nombre: 123, acepto: true }), false);
    });

    it('returns false for nombre longer than 150 chars', () => {
        assert.strictEqual(validateAcceptance({ nombre: 'a'.repeat(151), acepto: true }), false);
    });

    it('returns false when acepto is not literally true', () => {
        assert.strictEqual(validateAcceptance({ nombre: 'Juan', acepto: 'yes' }), false);
        assert.strictEqual(validateAcceptance({ nombre: 'Juan', acepto: false }), false);
    });
});

describe('sanitizeName', () => {
    it('removes HTML and quote characters', () => {
        assert.strictEqual(sanitizeName('<b>Juan</b>'), 'bJuan/b');
        assert.strictEqual(sanitizeName('Juan "El" & María'), 'Juan El & María');
    });

    it('trims surrounding whitespace', () => {
        assert.strictEqual(sanitizeName('   Juan Pérez   '), 'Juan Pérez');
    });
});

describe('REGLAS', () => {
    it('contains exactly 14 rules', () => {
        assert.strictEqual(REGLAS.length, 14);
    });

    it('first rule is about weapons', () => {
        assert.strictEqual(REGLAS[0], 'No armas blancas, ni de fuego');
    });

    it('last rule is about collaborating', () => {
        assert.strictEqual(REGLAS[13], 'Colaborar con el equipo asignado');
    });
});

describe('formatReglasContent', () => {
    it('lists every rule numbered starting at 1', () => {
        const out = formatReglasContent('Juan Pérez');
        assert.match(out, /^1\. No armas blancas, ni de fuego/);
        assert.match(out, /14\. Colaborar con el equipo asignado/);
    });

    it('ends with the acceptance declaration including the name', () => {
        const out = formatReglasContent('Juan Pérez');
        assert.ok(out.endsWith('Yo, Juan Pérez, acepto acatarme a las reglas del campamento.'));
    });

    it('puts each rule on its own line', () => {
        const out = formatReglasContent('Ana');
        const lines = out.split('\n');
        assert.strictEqual(lines.length, 15);
        assert.strictEqual(lines[14], 'Yo, Ana, acepto acatarme a las reglas del campamento.');
    });
});
