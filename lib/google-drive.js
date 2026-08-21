const fs = require('fs');
const { google } = require('googleapis');

const FOLDER_MIME = 'application/vnd.google-apps.folder';

function getCreds() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) return JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, 'utf8'));
    return null;
}

function getDrive() {
    const creds = getCreds();
    if (!creds) return null;
    const auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    return google.drive({ version: 'v3', auth });
}

function resizeThumb(thumbnailLink, size) {
    if (!thumbnailLink) return '';
    return thumbnailLink.split('=')[0].split('-w')[0] + '=' + size;
}

async function listAll(drive, query, fields, pageSize = 200) {
    const items = [];
    let pageToken;
    do {
        const res = await drive.files.list({
            q: query,
            fields: `nextPageToken, files(${fields})`,
            pageSize,
            pageToken,
            supportsAllDrives: true
        });
        items.push(...(res.data.files || []));
        pageToken = res.data.nextPageToken;
    } while (pageToken);
    return items;
}

async function listSections(sections, drive = getDrive()) {
    if (!drive) throw new Error('Drive not configured');
    const result = [];
    for (const section of sections) {
        if (!section.folderId) continue;
        const files = await listAll(drive, `'${section.folderId}' in parents and mimeType contains 'image/'`, 'id,name,thumbnailLink');
        files.sort((a, b) => a.name.localeCompare(b.name));
        if (files.length === 0) continue;
        result.push({
            seccion: section.seccion,
            fotos: files.map(f => ({
                id: f.id,
                name: f.name,
                url: resizeThumb(f.thumbnailLink, 's1600') || `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`
            }))
        });
    }
    return result;
}

module.exports = { getDrive, resizeThumb, listAll, listSections };
