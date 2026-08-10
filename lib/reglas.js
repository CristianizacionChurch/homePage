const REGLAS = [
    "No armas blancas, ni de fuego",
    "No objetos punzantes",
    "No drogas",
    "No cigarrillos, no cigarrillos electrónicos, vapers, No hookah",
    "No bebidas alcohólicas",
    "Respetar la propiedad y las instalaciones",
    "Evitar la entrada a las cabañas del sexo opuesto",
    "Tirar la basura al zafacón y en las zonas indicadas",
    "Utilizar ropa adecuada para cada actividad",
    "Mantener baños y cabañas limpias y organizadas",
    "Cuidar sus pertenencias personales",
    "Participar en las actividades del campamento",
    "Respetar los tiempos programados para cada actividad",
    "Colaborar con el equipo asignado"
];

function formatReglasContent(nombre) {
    const lineas = REGLAS.map((r, i) => `${i + 1}. ${r}`);
    lineas.push(`Yo, ${nombre}, acepto acatarme a las reglas del campamento.`);
    return lineas.join('\n');
}

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

module.exports = { validateAcceptance, sanitizeName, REGLAS, formatReglasContent };