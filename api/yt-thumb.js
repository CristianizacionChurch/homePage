// Serverless Function - Proxy de miniaturas YouTube (GET)
const ALLOWED_ORIGINS = [
    'https://cristianizacionalcarrizos.vercel.app',
    'https://cristianizacionalcarrizos.lat',
    'http://localhost:3000'
];

const QUALITIES = ['hqdefault', 'mqdefault', 'sddefault'];

// ponytail: deps param for test injection, Vercel ignores it
export default async function handler(req, res, deps = {}) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    const id = req.query.id;
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const q = QUALITIES.includes(req.query.q) ? req.query.q : 'hqdefault';

    try {
        const fetchFn = deps.fetchFn || fetch;
        const upstream = await fetchFn(`https://i.ytimg.com/vi/${id}/${q}.jpg`);
        if (!upstream.ok) {
            return res.status(404).json({ error: 'Miniatura no encontrada' });
        }
        // ponytail: buffer en vez de stream, las miniaturas pesan ~10-15KB
        const buf = Buffer.from(await upstream.arrayBuffer());
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Disposition', `inline; filename="${id}.jpg"`);
        return res.end(buf);
    } catch (error) {
        console.error('[YtThumb] Error:', error.message);
        return res.status(500).json({ error: 'Error descargando la miniatura' });
    }
}
