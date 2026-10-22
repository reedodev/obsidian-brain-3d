// Lints SKILL.md and runs the skill's own test. Exit 77 from the test = skipped (missing optional tool).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = 'obsidian-brain-3d';
const md = fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
const get = (k) => (fm && (fm[1].match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [])[1] || '').replace(/^"|"$/g, '');
const problems = [];
if (get('name') !== name) problems.push('front matter name must be ' + name);
if (!/^[a-z0-9-]{1,64}$/.test(get('name'))) problems.push('bad name');
const desc = get('description');
if (!desc || desc.length > 1024 || /<[a-z][^>]*>/i.test(desc)) problems.push('description missing, too long or has XML tags');
if (md.split('\n').length > 500) problems.push('SKILL.md longer than 500 lines');

// README checks: English README.md + Korean README.ko.md, language switch, local links, anchors, images.
const slug = (h) => h.trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}\p{M} -]/gu, '').replace(/ /g, '-');
const anchors = (file) => {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/```[\s\S]*?```/g, '');
  const seen = new Map(); const out = new Set();
  for (const m of text.matchAll(/^#{1,6}\s+(.+)$/gm)) { const s = slug(m[1]); const n = seen.get(s) || 0; seen.set(s, n + 1); out.add(n ? s + '-' + n : s); }
  return out;
};
const mdFiles = ['README.md', 'README.ko.md', path.join('skills', name, 'SKILL.md'), path.join('skills', name, 'viewer', 'CREDITS.md')];
for (const rel of mdFiles) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { problems.push('missing ' + rel); continue; }
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  const targets = [...text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]).concat([...text.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]));
  for (const t of targets) {
    if (/^(https?:|mailto:)/.test(t)) continue;
    const [p, hash] = t.split('#');
    const target = p ? path.resolve(path.dirname(file), decodeURI(p)) : file;
    if (!fs.existsSync(target)) { problems.push(rel + ': broken path ' + t); continue; }
    if (hash && target.endsWith('.md') && !anchors(target).has(decodeURI(hash))) problems.push(rel + ': broken anchor ' + t);
  }
}
const readmeEn = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const readmeKo = fs.existsSync(path.join(root, 'README.ko.md')) ? fs.readFileSync(path.join(root, 'README.ko.md'), 'utf8') : '';
if (!/href="README\.ko\.md">한국어</.test(readmeEn.split('\n')[0])) problems.push('README.md first line must link to README.ko.md');
if (!/href="README\.md">English</.test(readmeKo.split('\n')[0])) problems.push('README.ko.md first line must link to README.md');
if (/[가-힣]{2,}/.test(readmeEn.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '').replace(/「[^」]*」/g, '').replace(/"[^"\n]*"/g, '').replace(/>한국어</, '').replace(/\([^()\n]*#[^()\n]*\)/g, ''))) problems.push('README.md (English) has untranslated Korean text');
const h2 = (t) => (t.match(/^## /gm) || []).length;
if (h2(readmeEn) !== h2(readmeKo)) problems.push('README.md and README.ko.md have different numbers of sections (' + h2(readmeEn) + ' vs ' + h2(readmeKo) + ')');

if (problems.length) { console.log('LINT FAIL\n' + problems.join('\n')); process.exit(1); }
console.log('lint ok: ' + name + ' (SKILL.md, README.md, README.ko.md links/anchors/images)');
const r = spawnSync('node', [path.join(root, 'skills', name, 'tests', 'test.mjs')], { encoding: 'utf8', stdio: 'inherit' });
if (r.status === 77) { console.log('test skipped (optional tool missing)'); process.exit(process.env.CI ? 1 : 0); }
process.exit(r.status);
