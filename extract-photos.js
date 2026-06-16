#!/usr/bin/env node
/**
 * extract-photos.js
 *
 * Reads .image-slots.state.json (which stores user-dropped photos as base64
 * data URLs after editing) and extracts each one to images/<id>.<ext>, then
 * rewrites the JSON to reference those files. The result loads much faster
 * on the web (parallel HTTP/2 requests, separate cache entries) than the
 * original 1.9MB monolithic JSON.
 *
 * Usage:
 *   node extract-photos.js [input-state-json] [output-dir]
 *
 * Defaults to ./.image-slots.state.json -> ./images/
 *
 * Re-run after re-editing the design in the editor and copying a fresh
 * .image-slots.state.json over the deploy folder's copy.
 */

const fs = require('fs');
const path = require('path');

const input = process.argv[2] || '.image-slots.state.json';
const outDir = process.argv[3] || 'images';

if (!fs.existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const out = {};
let extracted = 0;
let bytesIn = 0;
let bytesOut = 0;

for (const id of Object.keys(data)) {
  const v = data[id];
  if (!v || typeof v !== 'object') continue;

  if (typeof v.u === 'string' && v.u.startsWith('data:')) {
    const m = v.u.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!m) { out[id] = v; continue; }

    const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
    const buf = Buffer.from(m[2], 'base64');
    const safeId = id.replace(/[^a-z0-9._-]/gi, '_');
    const filename = `${safeId}.${ext}`;

    fs.writeFileSync(path.join(outDir, filename), buf);

    bytesIn += v.u.length;
    bytesOut += buf.length;
    extracted++;

    out[id] = { ...v, u: `${outDir}/${filename}` };
  } else {
    out[id] = v;
  }
}

fs.writeFileSync(input, JSON.stringify(out));

console.log(`Extracted ${extracted} images to ${outDir}/`);
console.log(`Data URL size : ${(bytesIn / 1024 / 1024).toFixed(2)} MB`);
console.log(`File size     : ${(bytesOut / 1024 / 1024).toFixed(2)} MB`);
console.log(`State JSON    : ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
