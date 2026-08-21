// Serverless Function - Fotos del Campamento (GET)
import { listSections } from '../lib/google-drive.js';

const ALLOWED_ORIGINS = [
    'https://cristianizacionalcarrizos.vercel.app',
    'https://cristianizacionalcarrizos.lat',
    'http://localhost:3000'
];

// ponytail: deps param for test injection, Vercel ignores it
export default async function handler(req, res, deps = {}) {
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
        const folderId = process.env.GOOGLE_DRIVE_CAMP_FOLDER_ID;
        if (!folderId) return res.status(200).json([]);
        const list = deps.listSections || listSections;
        return res.status(200).json(await list(folderId));
    } catch (error) {
        console.error('[CampFotos] Error:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
