// Serverless Function - Listado de Aceptaciones (GET)
import { getRecords } from '../lib/google-sheets.js';

const ALLOWED_ORIGINS = [
    'https://cristianizacionalcarrizos.vercel.app',
    'https://cristianizacionalcarrizos.lat',
    'http://localhost:3000'
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Accept');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (!sheetId) return res.status(200).json([]);
        const records = await getRecords(sheetId);
        return res.status(200).json(records);
    } catch (error) {
        console.error('[ReglasAcceptances] Error:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
