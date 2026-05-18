require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "https://images.unsplash.com", "https://i.ytimg.com", "https://www.google.com", "https://maps.gstatic.com", "data:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
            connectSrc: [
                "'self'",
                "https://formspree.io",
                "https://www.google.com",
                "https://cdn.tailwindcss.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com"
            ],
            frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.google.com"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'", "https://formspree.io"],
            upgradeInsecureRequests: [],
            blockAllMixedContent: []
        }
    },
    crossOriginEmbedderPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    noSniff: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
});

const formLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Espera un momento.' }
});

app.use((req, res, next) => {
    const blocked = [
        '.env', '.env.example', '.env.local', '.env.production',
        '.gitignore', 'server.js', 'package.json', 'package-lock.json',
        'vercel.json', 'landing.pen', 'nul', '.git', '.agents'
    ];
    const reqFile = path.basename(req.path).toLowerCase();
    const reqPath = decodeURIComponent(req.path).toLowerCase();

    if (blocked.some(b => reqFile === b || reqFile.startsWith(b))) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    if (reqPath.includes('..') || reqPath.includes('%2e%2e') || reqPath.includes('\\')) {
        return res.status(400).json({ error: 'Solicitud inválida' });
    }

    if (reqPath.match(/\/\.[a-z]/i)) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'Iglesia Comunitaria De La Cristianizacion De Los alcarrizos.png'));
});

app.use(express.static(path.join(__dirname), {
    dotfiles: 'deny',
    index: 'index.html',
    maxAge: '1d',
    etag: true
}));

let verseCache = {
    dateKey: null,
    verse: null
};

const BIBLE_ID = '592420522e16049f-01';

const VERSE_IDS = [
    'JHN.3.16', 'JHN.14.6', 'JHN.1.1', 'JHN.8.32', 'JHN.10.10',
    'JHN.11.25', 'JHN.13.34', 'JHN.14.27', 'JHN.15.5', 'JHN.16.33',
    'MAT.5.14', 'MAT.6.33', 'MAT.7.7', 'MAT.11.28', 'MAT.28.20',
    'MAT.5.16', 'MAT.6.34', 'MAT.7.12', 'MAT.22.37', 'MAT.28.19',
    'MRK.10.27', 'MRK.11.24', 'MRK.12.30',
    'LUK.6.31', 'LUK.6.38', 'LUK.11.9', 'LUK.12.34',
    'ROM.1.16', 'ROM.3.23', 'ROM.5.8', 'ROM.6.23', 'ROM.8.1',
    'ROM.8.28', 'ROM.8.31', 'ROM.8.37', 'ROM.8.38', 'ROM.10.9',
    'ROM.10.17', 'ROM.12.2', 'ROM.12.12', 'ROM.15.13',
    'PSA.23.1', 'PSA.23.4', 'PSA.27.1', 'PSA.34.8', 'PSA.37.4',
    'PSA.46.1', 'PSA.46.10', 'PSA.51.10', 'PSA.56.3', 'PSA.91.1',
    'PSA.91.11', 'PSA.100.5', 'PSA.103.1', 'PSA.118.24', 'PSA.119.105',
    'PSA.121.1', 'PSA.139.14', 'PSA.145.18', 'PSA.147.3', 'PSA.150.6',
    'PRO.3.5', 'PRO.3.6', 'PRO.4.23', 'PRO.16.3', 'PRO.22.6',
    'PRO.27.17', 'PRO.31.25', 'PRO.18.10', 'PRO.11.25', 'PRO.15.1',
    'ISA.40.31', 'ISA.41.10', 'ISA.43.2', 'ISA.53.5', 'ISA.55.8',
    'ISA.26.3', 'ISA.40.29', 'ISA.54.17', 'ISA.58.11', 'ISA.61.1',
    'JER.29.11', 'JER.33.3', 'JER.17.7', 'JER.1.5',
    'GEN.1.1', 'GEN.1.27', 'DEU.31.6', 'DEU.31.8',
    'PHP.4.6', 'PHP.4.8', 'PHP.4.13', 'PHP.4.19', 'PHP.1.6', 'PHP.2.3',
    'GAL.2.20', 'GAL.5.22', 'GAL.6.9',
    'EPH.2.8', 'EPH.2.10', 'EPH.3.20', 'EPH.6.10', 'EPH.4.32',
    '1CO.10.13', '1CO.13.4', '1CO.13.13', '1CO.16.13',
    '2CO.5.7', '2CO.5.17', '2CO.12.9', '2CO.9.7',
    'HEB.11.1', 'HEB.11.6', 'HEB.12.1', 'HEB.12.2', 'HEB.13.5', 'HEB.4.16',
    'JAS.1.2', 'JAS.1.5', 'JAS.4.7', 'JAS.4.8',
    '1PE.5.7', '1PE.2.9', '2PE.3.9',
    '1JN.1.9', '1JN.4.4', '1JN.4.8', '1JN.4.19',
    'COL.3.2', 'COL.3.23', '1TH.5.16', '1TH.5.18',
    '2TI.1.7', '2TI.3.16', 'TIT.3.5',
    'JOS.1.9', 'MIC.6.8', 'LAM.3.22', 'LAM.3.23',
    'REV.21.4', 'REV.3.20'
];

function getDateKey() {
    const now = new Date();
    if (now.getHours() < 6) {
        now.setDate(now.getDate() - 1);
    }
    return now.toISOString().split('T')[0];
}

function getVerseIndex(dateKey) {
    const date = new Date(dateKey);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const dayOfYear = Math.floor(diff / 86400000);
    return dayOfYear % VERSE_IDS.length;
}

app.get('/api/daily-verse', apiLimiter, async (req, res) => {
    try {
        const dateKey = getDateKey();

        if (verseCache.dateKey === dateKey && verseCache.verse) {
            return res.json(verseCache.verse);
        }

        const verseId = VERSE_IDS[getVerseIndex(dateKey)];

        const apiUrl = `${process.env.API_BASE_URL}/v1/bibles/${BIBLE_ID}/verses/${verseId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'api-key': process.env.API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API respondió con estado ${response.status}`);
        }

        const data = await response.json();

        let content = data.data.content || '';
        content = content.replace(/<[^>]*>/g, '').trim();

        const verse = {
            reference: data.data.reference,
            content: content,
            date: dateKey
        };

        verseCache = { dateKey, verse };

        res.json(verse);

    } catch (error) {
        console.error('[DailyVerse] Error:', error.message);

        const fallbackVerses = [
            { reference: 'Juan 3:16', content: 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
            { reference: 'Salmos 23:1', content: 'Jehová es mi pastor; nada me faltará.' },
            { reference: 'Filipenses 4:13', content: 'Todo lo puedo en Cristo que me fortalece.' },
            { reference: 'Romanos 8:28', content: 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.' },
            { reference: 'Isaías 41:10', content: 'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo.' },
            { reference: 'Jeremías 29:11', content: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.' },
            { reference: 'Proverbios 3:5', content: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.' }
        ];

        const dateKey = getDateKey();
        const idx = getVerseIndex(dateKey) % fallbackVerses.length;

        res.json({
            reference: fallbackVerses[idx].reference,
            content: fallbackVerses[idx].content,
            date: dateKey,
            fallback: true
        });
    }
});

app.post('/api/prayer-request', formLimiter, async (req, res) => {
    try {
        const { nombre, peticion } = req.body;

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

        const sanitize = (str) => str.replace(/[<>]/g, '').trim();
        const safeName = sanitize(nombre);
        const safeMessage = sanitize(peticion);

        const formspreeEndpoint = process.env.FORMSPREE_PRAYER_ENDPOINT || 'https://formspree.io/f/xeelvgwb';

        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: safeName,
                peticion: safeMessage,
                _subject: `Nueva Petición de Oración - ${safeName}`,
                _template: 'table'
            })
        });

        if (!response.ok) {
            console.error('[PrayerRequest] Formspree error:', response.status);
            return res.status(502).json({ error: 'Error al procesar la petición' });
        }

        return res.status(200).json({
            success: true,
            message: 'Petición de oración recibida'
        });

    } catch (error) {
        console.error('[PrayerRequest] Error:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/newsletter', formLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Correo electrónico inválido' });
        }

        const safeEmail = email.trim().toLowerCase();

        if (safeEmail.length > 254) {
            return res.status(400).json({ error: 'Correo electrónico demasiado largo' });
        }

        const formspreeEndpoint = process.env.FORMSPREE_NEWSLETTER_ENDPOINT;

        if (!formspreeEndpoint) {
            console.log('[Newsletter] Email registrado (sin endpoint configurado):', safeEmail);
            return res.status(200).json({
                success: true,
                message: 'Suscripción registrada'
            });
        }

        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: safeEmail,
                _subject: 'Nueva Suscripción al Boletín',
                _template: 'table'
            })
        });

        if (!response.ok) {
            console.error('[Newsletter] Formspree error:', response.status);
            return res.status(502).json({ error: 'Error al procesar la suscripción' });
        }

        return res.status(200).json({
            success: true,
            message: 'Suscripción exitosa'
        });

    } catch (error) {
        console.error('[Newsletter] Error:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('[Server Error]:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`✔ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✔ Versículo diario: /api/daily-verse`);
    console.log(`✔ Peticiones de oración: /api/prayer-request`);
    console.log(`✔ Newsletter: /api/newsletter`);
    console.log(`✔ API Key protegida en servidor`);
});
