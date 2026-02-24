// ============================================
// Serverless Function - Versiculo del Dia
// Compatible con Vercel Serverless Functions
// ============================================

// ── Biblia Reina Valera 1909 en español ────────────────────
const BIBLE_ID = '592420522e16049f-01';

// 120 versículos populares (formato API.Bible: LIBRO.CAPITULO.VERSICULO)
const VERSE_IDS = [
    // ── Evangelios ──
    'JHN.3.16', 'JHN.14.6', 'JHN.1.1', 'JHN.8.32', 'JHN.10.10',
    'JHN.11.25', 'JHN.13.34', 'JHN.14.27', 'JHN.15.5', 'JHN.16.33',
    'MAT.5.14', 'MAT.6.33', 'MAT.7.7', 'MAT.11.28', 'MAT.28.20',
    'MAT.5.16', 'MAT.6.34', 'MAT.7.12', 'MAT.22.37', 'MAT.28.19',
    'MRK.10.27', 'MRK.11.24', 'MRK.12.30',
    'LUK.6.31', 'LUK.6.38', 'LUK.11.9', 'LUK.12.34',
    // ── Romanos ──
    'ROM.1.16', 'ROM.3.23', 'ROM.5.8', 'ROM.6.23', 'ROM.8.1',
    'ROM.8.28', 'ROM.8.31', 'ROM.8.37', 'ROM.8.38', 'ROM.10.9',
    'ROM.10.17', 'ROM.12.2', 'ROM.12.12', 'ROM.15.13',
    // ── Salmos ──
    'PSA.23.1', 'PSA.23.4', 'PSA.27.1', 'PSA.34.8', 'PSA.37.4',
    'PSA.46.1', 'PSA.46.10', 'PSA.51.10', 'PSA.56.3', 'PSA.91.1',
    'PSA.91.11', 'PSA.100.5', 'PSA.103.1', 'PSA.118.24', 'PSA.119.105',
    'PSA.121.1', 'PSA.139.14', 'PSA.145.18', 'PSA.147.3', 'PSA.150.6',
    // ── Proverbios ──
    'PRO.3.5', 'PRO.3.6', 'PRO.4.23', 'PRO.16.3', 'PRO.22.6',
    'PRO.27.17', 'PRO.31.25', 'PRO.18.10', 'PRO.11.25', 'PRO.15.1',
    // ── Isaías ──
    'ISA.40.31', 'ISA.41.10', 'ISA.43.2', 'ISA.53.5', 'ISA.55.8',
    'ISA.26.3', 'ISA.40.29', 'ISA.54.17', 'ISA.58.11', 'ISA.61.1',
    // ── Jeremías ──
    'JER.29.11', 'JER.33.3', 'JER.17.7', 'JER.1.5',
    // ── Génesis y Deuteronomio ──
    'GEN.1.1', 'GEN.1.27', 'DEU.31.6', 'DEU.31.8',
    // ── Filipenses ──
    'PHP.4.6', 'PHP.4.8', 'PHP.4.13', 'PHP.4.19', 'PHP.1.6', 'PHP.2.3',
    // ── Gálatas y Efesios ──
    'GAL.2.20', 'GAL.5.22', 'GAL.6.9',
    'EPH.2.8', 'EPH.2.10', 'EPH.3.20', 'EPH.6.10', 'EPH.4.32',
    // ── Corintios ──
    '1CO.10.13', '1CO.13.4', '1CO.13.13', '1CO.16.13',
    '2CO.5.7', '2CO.5.17', '2CO.12.9', '2CO.9.7',
    // ── Hebreos ──
    'HEB.11.1', 'HEB.11.6', 'HEB.12.1', 'HEB.12.2', 'HEB.13.5', 'HEB.4.16',
    // ── Santiago ──
    'JAS.1.2', 'JAS.1.5', 'JAS.4.7', 'JAS.4.8',
    // ── Pedro ──
    '1PE.5.7', '1PE.2.9', '2PE.3.9',
    // ── Juan (Epístolas) ──
    '1JN.1.9', '1JN.4.4', '1JN.4.8', '1JN.4.19',
    // ── Colosenses y Tesalonicenses ──
    'COL.3.2', 'COL.3.23', '1TH.5.16', '1TH.5.18',
    // ── Timoteo y Tito ──
    '2TI.1.7', '2TI.3.16', 'TIT.3.5',
    // ── Josué, Miqueas, Lamentaciones ──
    'JOS.1.9', 'MIC.6.8', 'LAM.3.22', 'LAM.3.23',
    // ── Apocalipsis ──
    'REV.21.4', 'REV.3.20'
];

// Versículos de respaldo si la API falla
const FALLBACK_VERSES = [
    { reference: 'Juan 3:16', content: 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
    { reference: 'Salmos 23:1', content: 'Jehová es mi pastor; nada me faltará.' },
    { reference: 'Filipenses 4:13', content: 'Todo lo puedo en Cristo que me fortalece.' },
    { reference: 'Romanos 8:28', content: 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.' },
    { reference: 'Isaías 41:10', content: 'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo.' },
    { reference: 'Jeremías 29:11', content: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.' },
    { reference: 'Proverbios 3:5', content: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.' }
];

// ── Obtener clave de fecha con reset a las 6 AM ───────────
function getDateKey() {
    const now = new Date();
    if (now.getHours() < 6) {
        now.setDate(now.getDate() - 1);
    }
    return now.toISOString().split('T')[0];
}

// ── Índice determinista basado en la fecha ─────────────────
function getVerseIndex(dateKey) {
    const date = new Date(dateKey);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const dayOfYear = Math.floor(diff / 86400000);
    return dayOfYear % VERSE_IDS.length;
}

// ── Serverless Handler ─────────────────────────────────────
export default async function handler(req, res) {
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Cache: el versículo es el mismo todo el día, cachear por 1 hora
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');

    try {
        const dateKey = getDateKey();
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

        // Limpiar contenido HTML de la respuesta
        let content = data.data.content || '';
        content = content.replace(/<[^>]*>/g, '').trim();

        return res.status(200).json({
            reference: data.data.reference,
            content: content,
            date: dateKey
        });

    } catch (error) {
        console.error('[DailyVerse] Error:', error.message);

        // Versículo de respaldo si la API falla
        const dateKey = getDateKey();
        const idx = getVerseIndex(dateKey) % FALLBACK_VERSES.length;

        return res.status(200).json({
            reference: FALLBACK_VERSES[idx].reference,
            content: FALLBACK_VERSES[idx].content,
            date: dateKey,
            fallback: true
        });
    }
}
