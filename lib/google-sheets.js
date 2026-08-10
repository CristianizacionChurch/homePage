const fs = require('fs');
const { google } = require('googleapis');

function toSheetRow(record) {
    const fecha = new Date(record.fecha).toLocaleDateString('es-DO');
    return [fecha, record.nombre, record.contactoEmergencia, record.condicionMedica, record.alergias, 'Si'];
}

function fromSheetRow(row) {
    return {
        fecha: (row[0] || '').toString(),
        nombre: (row[1] || '').toString(),
        contactoEmergencia: (row[2] || '').toString(),
        condicionMedica: (row[3] || '').toString(),
        alergias: (row[4] || '').toString(),
        acepto: (row[5] || '').toString() === 'Si'
    };
}

function getCreds() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    }
    if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
        return JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, 'utf8'));
    }
    return null;
}

function getSheets() {
    const creds = getCreds();
    if (!creds) return null;
    const auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return google.sheets({ version: 'v4', auth });
}

async function appendRecord(spreadsheetId, record) {
    const sheets = getSheets();
    if (!sheets) throw new Error('Google Sheets not configured');
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [toSheetRow(record)] }
    });
}

async function getRecords(spreadsheetId) {
    const sheets = getSheets();
    if (!sheets) throw new Error('Google Sheets not configured');
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A2:F'
    });
    return (res.data.values || []).map(fromSheetRow);
}

module.exports = { appendRecord, getRecords, toSheetRow, fromSheetRow };
