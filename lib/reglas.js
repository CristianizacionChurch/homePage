function validateAcceptance(body) {
    if (!body || typeof body !== 'object') return false;

    const nombre = body.nombre;
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) return false;
    if (nombre.trim().length > 150) return false;

    if (body.acepto !== true) return false;

    return true;
}

function sanitizeName(str) {
    return str.replace(/[<>"']/g, '').trim();
}

module.exports = { validateAcceptance, sanitizeName };
