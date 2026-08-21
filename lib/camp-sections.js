// Nombres y orden de las secciones de la galería.
// El ID de cada carpeta se lee de .env; vacío = sección oculta.
module.exports = [
    { seccion: 'Dia 1', folderId: process.env.GOOGLE_DRIVE_DIA1_FOLDER_ID || '' },
    { seccion: 'Dia 2', folderId: process.env.GOOGLE_DRIVE_DIA2_FOLDER_ID || '' },
    { seccion: 'Dia 3', folderId: process.env.GOOGLE_DRIVE_DIA3_FOLDER_ID || '' },
    { seccion: 'Juegos Extremos', folderId: process.env.GOOGLE_DRIVE_JUEGOS_FOLDER_ID || '' },
    { seccion: 'Noche Especial', folderId: process.env.GOOGLE_DRIVE_NOCHE_FOLDER_ID || '' }
];
