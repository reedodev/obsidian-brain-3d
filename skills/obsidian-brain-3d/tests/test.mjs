// Builds data from the bundled sample vault and checks the output shape and privacy options.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, '..', 'scripts', 'build-data.mjs');
const vault = path.join(here, '..', 'examples', 'sample-vault');
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'brain3d-'));
const fail = (m) => { console.log('FAIL ' + m); process.exit(1); };
const r1 = spawnSync('node', [script, vault, '--out', path.join(d, 'data.js')], { encoding: 'utf8' });
if (r1.status !== 0) fail('build failed: ' + r1.stderr.slice(-300));
const js = fs.readFileSync(path.join(d, 'data.js'), 'utf8');
if (!/Sample|sample|notes|nodes/i.test(js) || js.length < 1000) fail('data.js looks empty');
const r2 = spawnSync('node', [script, vault, '--out', path.join(d, 'hidden.js'), '--hide-titles', '--hide-groups'], { encoding: 'utf8' });
if (r2.status !== 0) fail('hidden build failed');
const hidden = fs.readFileSync(path.join(d, 'hidden.js'), 'utf8');
const firstTitle = fs.readdirSync(vault, { recursive: true }).find((f) => f.endsWith('.md') && !/README/i.test(f));
const word = path.basename(firstTitle, '.md');
if (hidden.includes(word)) fail('--hide-titles leaked a real title: ' + word);
const r3 = spawnSync('node', [script, vault, '--out', path.join(vault, 'x.js')], { encoding: 'utf8' });
if (r3.status === 0 || fs.existsSync(path.join(vault, 'x.js'))) fail('must refuse to write inside the vault');
const site = path.join(d, 'site');
if (spawnSync('node', [script, vault, '--site', site], { encoding: 'utf8' }).status !== 0) fail('site build failed');
for (const f of ['index.html', 'data.js', 'models.js', 'three.min.js', 'config.js']) if (!fs.existsSync(path.join(site, f))) fail('site is missing ' + f);
fs.writeFileSync(path.join(site, 'config.js'), 'window.BRAIN_CONFIG={startMode:\'tree\'};');
spawnSync('node', [script, vault, '--site', site], { encoding: 'utf8' });
if (!fs.readFileSync(path.join(site, 'config.js'), 'utf8').includes('tree')) fail('rebuild overwrote the user config.js');
if (!fs.readFileSync(path.join(site, 'index.html'), 'utf8').includes('src=\"config.js\"')) fail('index.html does not load config.js');

// ---------- AI engine tab ----------
const viewer = path.join(here, '..', 'viewer');
const engine = fs.readFileSync(path.join(viewer, 'ai-engine.js'), 'utf8');
if (!fs.existsSync(path.join(site, 'ai-engine.js'))) fail('site is missing ai-engine.js');
if (!fs.readFileSync(path.join(site, 'index.html'), 'utf8').includes('src="ai-engine.js"')) fail('index.html does not load ai-engine.js');
const dm = engine.match(/\/\*AI_DEFAULTS\*\/([\s\S]*?)\/\*END_AI_DEFAULTS\*\//);
if (!dm) fail('AI_DEFAULTS block missing in ai-engine.js');
const defaults = JSON.parse(dm[1]);
const loadCfg = (src) => { const box = { window: {} }; vm.runInNewContext(src, box); return box.window.BRAIN_CONFIG || {}; };
const cfg = loadCfg(fs.readFileSync(path.join(viewer, 'config.js'), 'utf8'));
if (!Array.isArray(cfg.aiTools) || !cfg.aiTools.length) fail('config.js has no aiTools example');
if (JSON.stringify(cfg.aiTools.map((t) => [t.id, t.match])) !== JSON.stringify(defaults.map((t) => [t.id, t.match]))) fail('config.js aiTools and ai-engine.js defaults differ');
if (!cfg.aiTabName) fail('config.js has no aiTabName');
// public build must not carry personal tools, music or sound
for (const w of ['Hermes', 'OpenClaw', 'JEV', 'Hermes Agent', '닷츠', 'Reedo', '리도', 'Suno', 'music.js', 'bell(', 'AudioContext']) {
  if (engine.includes(w) || fs.readFileSync(path.join(viewer, 'config.js'), 'utf8').includes(w)) fail('AI tab contains a private/music word: ' + w);
}
// counts: hidden build stores real-title counts; they must equal a direct count on the sample titles
const realTitles = fs.readdirSync(vault, { recursive: true }).filter((f) => f.endsWith('.md')).map((f) => path.basename(f, '.md'));
const hd = (() => { const box = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(d, 'hidden.js'), 'utf8'), box); return box.window.BRAIN; })();
if (!hd.aiHits) fail('hidden build has no aiHits');
for (const t of cfg.aiTools) {
  const want = realTitles.filter((x) => new RegExp(t.match, 'i').test(x)).length;
  const got = (hd.aiHits[t.id] || []).length;
  if (got !== want) fail(`aiHits ${t.id}: ${got} != ${want}`);
  for (const k of hd.aiHits[t.id] || []) if (!/#\d+$/.test(hd.nodes[k][0])) fail('aiHits points at a non-hidden title');
}
if (!Object.values(hd.aiHits).some((a) => a.length)) fail('sample vault should match at least one example tool');
if (/"aiHits"/.test(js)) fail('normal build should not need aiHits');
// aiTools: [] -> no hits in the build, and the viewer script stops before touching the page
const empty = path.join(d, 'empty');
fs.mkdirSync(empty);
fs.writeFileSync(path.join(empty, 'config.js'), 'window.BRAIN_CONFIG={aiTools:[]};');
if (spawnSync('node', [script, vault, '--out', path.join(empty, 'data.js'), '--hide-titles'], { encoding: 'utf8' }).status !== 0) fail('empty-tools build failed');
if (!fs.readFileSync(path.join(empty, 'data.js'), 'utf8').includes('"aiHits":{}')) fail('aiTools: [] should give empty aiHits');
const noPage = { get() { throw new Error('touched the page'); } };
const run = (conf) => { const win = { BRAIN: hd, THREE: {}, BRAIN_CONFIG: conf }; vm.runInNewContext(engine, { window: win, document: new Proxy({}, noPage), console }); return win; };
try { run({ aiTools: [] }); } catch (e) { fail('aiTools: [] must hide the AI tab without touching the page (' + e.message + ')'); }
let touched = false;
try { run({}); } catch { touched = true; }
if (!touched) fail('default aiTools should build the AI tab');

fs.rmSync(d, { recursive: true, force: true });
console.log('obsidian-brain-3d ok: build, privacy options, refuses writing into vault, config.js kept on rebuild, AI tab (defaults, real counts, hidden titles, empty list hides tab, no private tools/music)');
