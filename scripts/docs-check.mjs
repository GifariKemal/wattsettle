// Validator dokumentasi WattSettle.
// Usage: node scripts/docs-check.mjs
// Cek 1: prosa bebas em-dash (U+2014) dan en-dash (U+2013). Abaikan isi blok kode ```...```.
// Cek 2: link markdown relatif [teks](file) dan <a href="file"> menunjuk file yang ada.
// Cek 3: blok ```mermaid tidak kosong.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = 'WattSettle';
const EM = '—';
const EN = '–';

if (!existsSync(ROOT)) {
  console.error(`Folder ${ROOT} belum ada.`);
  process.exit(1);
}

const files = readdirSync(ROOT).filter((f) => f.endsWith('.md'));
let errors = 0;
const stripCode = (s) => s.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');

for (const f of files) {
  const p = join(ROOT, f);
  const raw = readFileSync(p, 'utf8');
  const prose = stripCode(raw);

  // Cek 1: dash di prosa
  if (prose.includes(EM)) { console.error(`[dash] ${f}: em-dash di prosa`); errors++; }
  if (prose.includes(EN)) { console.error(`[dash] ${f}: en-dash di prosa`); errors++; }

  // Cek 2: link relatif (lewati http(s) dan anchor #). Pakai `prose` supaya link contoh di dalam code block diabaikan.
  const links = [
    ...prose.matchAll(/\]\(<?([^)>#][^)>]*?)>?\)/g),
    ...prose.matchAll(/href="([^"#][^"]*)"/g),
    ...prose.matchAll(/src="([^"#][^"]*)"/g),
  ]
    .map((m) => m[1].split('#')[0].trim())
    .filter((u) => u && !/^https?:/.test(u) && !/^mailto:/.test(u));
  for (const u of links) {
    const target = resolve(dirname(p), decodeURIComponent(u));
    if (!existsSync(target)) { console.error(`[link] ${f} -> ${u} tidak ditemukan`); errors++; }
  }

  // Cek 3: blok mermaid tidak kosong
  const mer = raw.match(/```mermaid\n([\s\S]*?)```/g) || [];
  for (const b of mer) {
    if (b.replace(/```mermaid|```/g, '').trim().length < 5) { console.error(`[mermaid] ${f}: blok mermaid kosong`); errors++; }
  }
}

console.log(errors === 0 ? `OK semua cek lulus (${files.length} file)` : `GAGAL ${errors} masalah`);
process.exit(errors === 0 ? 0 : 1);
