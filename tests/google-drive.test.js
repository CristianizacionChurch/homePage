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
    const folderList = () => ({ data: { files: [
        { id: 'f2', name: 'Noche Especial' },
        { id: 'f1', name: 'Dia 1' }
    ] } });
    const filesFor = (id) => ({ data: { files: [
        { id: 'f1-img2', name: 'b.jpg', thumbnailLink: 'https://lh3.googleusercontent.com/d/x=s220' },
        { id: 'f1-img1', name: 'a.jpg', thumbnailLink: 'https://lh3.googleusercontent.com/d/y=s220' }
    ] } });

    it('builds sections sorted by folder name, then files by name', async () => {
        const fakeDrive = {
            files: {
                list: async ({ q }) => {
                    if (q.includes('folder')) return folderList();
                    if (q.includes("'f1'")) return filesFor('f1');
                    if (q.includes("'f2'")) return { data: { files: [] } };
                    return { data: { files: [] } };
                }
            }
        };
        const sections = await listSections('root', fakeDrive);
        assert.strictEqual(sections.length, 1);
        assert.strictEqual(sections[0].seccion, 'Dia 1');
        assert.strictEqual(sections[0].fotos.length, 2);
        assert.strictEqual(sections[0].fotos[0].name, 'a.jpg');
        assert.ok(sections[0].fotos[0].url.endsWith('=s1600'));
    });

    it('skips folders with no images', async () => {
        const fakeDrive = {
            files: { list: async ({ q }) => {
                if (q.includes('folder')) return folderList();
                return { data: { files: [] } };
            } }
        };
        const sections = await listSections('root', fakeDrive);
        assert.strictEqual(sections.length, 0);
    });
});
