// Serverless Function - Petición de Oración a Google Sheets (POST)
import sheetsLib from '../lib/google-sheets.js';

const PRAYER_SHEET_ID = process.env.PRAYER_SHEET_ID || '17USYH5qKocYAzYUlAGGWrZ_BbmNWSGDrPIWUBc-IYto';

// ponytail: deps param for test injection, Vercel ignores it
export default async function handler(req, res, deps = {}) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).json({ error: 'Content-Type debe ser application/json' });
    }

    const { nombre, peticion } = req.body || {};

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }

    if (nombre.length > 100) {
        return res.status(400).json({ error: 'El nombre es demasiado largo' });
    }

    if (!peticion || typeof peticion !== 'string' || peticion.trim().length === 0) {
        return res.status(400).json({ error: 'La petición es requerida' });
    }

    if (peticion.length > 1000) {
        return res.status(400).json({ error: 'La petición es demasiado larga' });
    }

    const sanitize = (str) => str.replace(/[<>"'&]/g, '').trim();

    try {
        const appendPrayer = deps.appendPrayer || sheetsLib.appendPrayerRecord;
        await appendPrayer(PRAYER_SHEET_ID, {
            fecha: new Date().toISOString(),
            nombre: sanitize(nombre),
            peticion: sanitize(peticion)
        });
    } catch (error) {
        console.error('[PrayerRequest] Sheets error:', error.message);
        return res.status(502).json({ error: 'Error al guardar la petición' });
    }

    return res.status(200).json({
        success: true,
        message: 'Petición de oración recibida'
    });
}
