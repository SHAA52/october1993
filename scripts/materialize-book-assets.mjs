import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

// A normal Git checkout already contains every image. File-based deployments
// can retrieve the identical bytes from the immutable book-assets commit.
const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(new URL('./book-assets.json', import.meta.url), 'utf8'));
const digest = (data) => createHash('sha256').update(data).digest('hex');
let cursor = 0;
let downloaded = 0;
async function worker() {
  while (cursor < manifest.files.length) {
    const entry = manifest.files[cursor++];
    const destination = resolve(root, entry.path);
    let existing;
    try { existing = await readFile(destination); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing) {
      if (digest(existing) !== entry.sha256) throw new Error(`Image checksum mismatch: ${entry.path}`);
      continue;
    }
    const url = `https://raw.githubusercontent.com/SHAA52/october1993/${manifest.sourceCommit}/${entry.path}`;
    let data;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${entry.path}`);
        data = Buffer.from(await response.arrayBuffer());
        if (digest(data) !== entry.sha256) throw new Error(`Image checksum mismatch: ${entry.path}`);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, data);
    downloaded++;
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Verified ${manifest.files.length} original book images (${downloaded} downloaded).`);
