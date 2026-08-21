const { describe, it } = require('node:test');
const assert = require('node:assert');
const { resizeThumb, listAll, listSections } = require('../lib/google-drive');

describe('resizeThumb', () => {
    it('resizes =s220 suffix to requested size', () => {
        assert.strictEqual(
            resizeThumb('https://lh3.googleusercontent.com/d/abc=s220', 's1600'),
            'https://lh3.googleusercontent.com/d/abc=s1600'
        );
    });
    it('resizes -w220-h220-c suffix format', () => {
        assert.strictEqual(
            resizeThumb('https://lh3.googleusercontent.com/d/abc-w220-h220-c', 's1600'),
            'https://lh3.googleusercontent.com/d/abc=s1600'
        );
    });
    it('returns empty string for null input', () => {
        assert.strictEqual(resizeThumb(null, 's1600'), '');
    });
});

describe('listAll', () => {
    it('paginates until nextPageToken is gone', async () => {
        let calls = 0;
        const fakeDrive = {
            files: {
                list: async ({ pageToken }) => {
                    calls++;
                    if (!pageToken) return { data: { files: [{ id: 'a' }], nextPageToken: 'tok2' } };
                    return { data: { files: [{ id: 'b' }] } };
                }
            }
        };
        const items = await listAll(fakeDrive, "query", 'id', 200);
        assert.strictEqual(calls, 2);
        assert.deepStrictEqual(items, [{ id: 'a' }, { id: 'b' }]);
    });
});

describe('listSections', () => {
    const SECTIONS = [
        { seccion: 'Dia 1', folderId: 'f1' },
        { seccion: 'Dia 2', folderId: '' },
        { seccion: 'Juegos Extremos', folderId: 'f3' }
    ];
    const fakeDrive = {
        files: {
            list: async ({ q }) => {
                if (q.includes("'f1'")) return { data: { files: [
                    { id: 'b1', name: 'b.jpg', thumbnailLink: 'https://lh3.googleusercontent.com/d/x=s220' },
                    { id: 'a1', name: 'a.jpg', thumbnailLink: 'https://lh3.googleusercontent.com/d/y=s220' }
                ] } };
                if (q.includes("'f3'")) return { data: { files: [] } };
                return { data: { files: [] } };
            }
        }
    };

    it('builds sections from config, skips empty folderIds', async () => {
        const sections = await listSections(SECTIONS, fakeDrive);
        assert.strictEqual(sections.length, 1);
        assert.strictEqual(sections[0].seccion, 'Dia 1');
        assert.strictEqual(sections[0].fotos.length, 2);
        assert.strictEqual(sections[0].fotos[0].name, 'a.jpg');
        assert.ok(sections[0].fotos[0].url.endsWith('=s1600'));
    });

    it('skips folders with no images', async () => {
        const sections = await listSections(SECTIONS, fakeDrive);
        assert.ok(!sections.some(s => s.seccion === 'Juegos Extremos'));
    });
});
