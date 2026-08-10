// Serverless Function - Aceptacion de Reglas (POST)
import { validateAcceptance, sanitizeName, buildFormsubmitPayload } from '../lib/reglas.js';
import { appendRecord } from '../lib/google-sheets.js';

const ALLOWED_ORIGINS = [
    'https://cristianizacionalcarrizos.vercel.app',
    'https://cristianizacionalcarrizos.lat',
    'http://localhost:3000'
];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
            return res.status(415).json({ error: 'Content-Type debe ser application/json' });
        }

        const body = req.body;
        if (!validateAcceptance(body)) {
            return res.status(400).json({ error: 'Escribe tu nombre completo y acepta las reglas' });
        }

        const record = {
            nombre: sanitizeName(body.nombre),
            contactoEmergencia: sanitizeName(body.contactoEmergencia),
            condicionMedica: sanitizeName(body.condicionMedica),
            alergias: sanitizeName(body.alergias),
            acepto: true,
            fecha: new Date().toISOString()
        };

        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (sheetId) {
            try {
                await appendRecord(sheetId, record);
            } catch (err) {
                console.error('[ReglasAccept] Google Sheets error:', err.message);
                return res.status(500).json({ error: 'Error guardando la aceptación. Intenta de nuevo.' });
            }
        }

        const endpoint = process.env.FORMSUBMIT_REGLAS_ENDPOINT;
        if (endpoint) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(buildFormsubmitPayload(record)),
                    signal: controller.signal
                });
                if (!response.ok) {
                    console.error('[ReglasAccept] Formsubmit error:', response.status);
                }
            } finally {
                clearTimeout(timeout);
            }
        }

        return res.status(200).json({ success: true, message: 'Aceptación registrada' });

    } catch (error) {
        console.error('[ReglasAccept] Error:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
