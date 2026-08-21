import { getFileStream, getFileName, getDrive } from '../lib/google-drive.js';

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

    const id = req.query.id;
    if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const drive = getDrive();
        if (!drive) return res.status(500).json({ error: 'Drive no configurado' });
        const [stream, name] = await Promise.all([
            getFileStream(id, drive),
            getFileName(id, drive)
        ]);
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'foto'}"`);
        stream.pipe(res);
    } catch (error) {
        console.error('[CampFoto] Error:', error.message);
        res.status(500).json({ error: 'Error descargando la foto' });
    }
}
