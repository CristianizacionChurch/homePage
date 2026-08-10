const { describe, it } = require('node:test');
const assert = require('node:assert');
const { validateAcceptance, sanitizeName, sanitizeText, REGLAS, formatReglasContent, buildFormsubmitPayload } = require('../lib/reglas');

const VALID_PAYLOAD = {
    nombre: 'Juan Pérez',
    contactoEmergencia: 'María Pérez 555-1234',
    condicionMedica: 'Asma',
    alergias: 'Ninguna',
    acepto: true
};

describe('validateAcceptance', () => {
    it('returns true for a valid payload with all personal info', () => {
        assert.strictEqual(validateAcceptance(VALID_PAYLOAD), true);
    });

    it('returns false for missing body', () => {
        assert.strictEqual(validateAcceptance(null), false);
        assert.strictEqual(validateAcceptance(undefined), false);
    });

    it('returns false for missing or empty nombre', () => {
        const base = { ...VALID_PAYLOAD };
        delete base.nombre;
        assert.strictEqual(validateAcceptance(base), false);
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, nombre: '   ' }), false);
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, nombre: 123 }), false);
    });

    it('returns false for nombre longer than 150 chars', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, nombre: 'a'.repeat(151) }), false);
    });

    it('returns false when acepto is not literally true', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, acepto: 'yes' }), false);
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, acepto: false }), false);
    });

    it('returns false when contactoEmergencia is missing', () => {
        const body = { ...VALID_PAYLOAD };
        delete body.contactoEmergencia;
        assert.strictEqual(validateAcceptance(body), false);
    });

    it('returns false when contactoEmergencia is empty', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, contactoEmergencia: '   ' }), false);
    });

    it('returns false when contactoEmergencia exceeds 200 chars', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, contactoEmergencia: 'a'.repeat(201) }), false);
    });

    it('returns false when condicionMedica is missing', () => {
        const body = { ...VALID_PAYLOAD };
        delete body.condicionMedica;
        assert.strictEqual(validateAcceptance(body), false);
    });

    it('returns false when condicionMedica is empty', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, condicionMedica: '   ' }), false);
    });

    it('returns false when condicionMedica exceeds 300 chars', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, condicionMedica: 'a'.repeat(301) }), false);
    });

    it('returns false when alergias is missing', () => {
        const body = { ...VALID_PAYLOAD };
        delete body.alergias;
        assert.strictEqual(validateAcceptance(body), false);
    });

    it('returns false when alergias is empty', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, alergias: '   ' }), false);
    });

    it('returns false when alergias exceeds 300 chars', () => {
        assert.strictEqual(validateAcceptance({ ...VALID_PAYLOAD, alergias: 'a'.repeat(301) }), false);
    });

    it('trims whitespace in personal info fields before validation', () => {
        assert.strictEqual(validateAcceptance({
            ...VALID_PAYLOAD,
            contactoEmergencia: '  María 555-1234  ',
            condicionMedica: '  Asma  ',
            alergias: '  Penicilina  '
        }), true);
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

describe('sanitizeText', () => {
    it('removes HTML and quote characters', () => {
        assert.strictEqual(sanitizeText('<script>alert(1)</script>'), 'scriptalert(1)/script');
    });

    it('trims whitespace', () => {
        assert.strictEqual(sanitizeText('   Asma leve   '), 'Asma leve');
    });

    it('returns empty string for non-string input', () => {
        assert.strictEqual(sanitizeText(null), '');
        assert.strictEqual(sanitizeText(undefined), '');
        assert.strictEqual(sanitizeText(123), '');
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

describe('buildFormsubmitPayload', () => {
    const record = {
        nombre: 'Juan Pérez',
        contactoEmergencia: 'María 555-1234',
        condicionMedica: 'Asma',
        alergias: 'Penicilina',
        fecha: '2026-08-10T00:00:00.000Z'
    };

    it('returns _subject with the person name', () => {
        const payload = buildFormsubmitPayload(record);
        assert.strictEqual(payload._subject, 'Nueva Aceptación de Reglas - Juan Pérez');
    });

    it('sets _template to table', () => {
        const payload = buildFormsubmitPayload(record);
        assert.strictEqual(payload._template, 'table');
    });

    it('includes SECCION PERSONAL with all 4 fields in the reglas text', () => {
        const payload = buildFormsubmitPayload(record);
        const text = payload.reglas;
        assert.match(text, /^SECCION PERSONAL$/m);
        assert.ok(text.includes('Nombre: Juan Pérez'));
        assert.ok(text.includes('Contacto de emergencia: María 555-1234'));
        assert.ok(text.includes('Condicion medica: Asma'));
        assert.ok(text.includes('Alergias: Penicilina'));
    });

    it('includes SECCION REGLAS with all 14 rules', () => {
        const payload = buildFormsubmitPayload(record);
        const text = payload.reglas;
        assert.ok(text.includes('SECCION REGLAS'));
        assert.ok(text.includes('1. No armas blancas, ni de fuego'));
        assert.ok(text.includes('14. Colaborar con el equipo asignado'));
    });

    it('includes acceptance declaration and date', () => {
        const payload = buildFormsubmitPayload(record);
        const text = payload.reglas;
        assert.ok(text.includes('Yo, Juan Pérez, acepto acatarme a las reglas del campamento.'));
        assert.ok(text.includes('Fecha: 9/8/2026'));
    });

    it('SECCION PERSONAL comes before SECCION REGLAS', () => {
        const payload = buildFormsubmitPayload(record);
        const text = payload.reglas;
        assert.ok(text.indexOf('SECCION PERSONAL') < text.indexOf('SECCION REGLAS'));
    });
});
