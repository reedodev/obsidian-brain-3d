/* AI 엔진 탭 · 브레인/세계수 옆 세 번째 화면
   config.js 의 aiTools 에 적은 도구들이 빛줄기로 가운데 브레인에 연결됩니다.
   숫자는 모두 data.js 의 노트 제목에서 match(정규식)로 실제로 센 값입니다. 꾸민 숫자는 없습니다.
   아래 흐름 기록(log)은 실제 노트 제목을 차례로 보여 주는 연출입니다.
   --hide-titles 로 만든 data.js 는 가려진 제목만 들어 있으므로, 개수는 build-data.mjs 가 만들 때 센 값(BRAIN.aiHits)을 씁니다.
   aiTools 가 빈 배열([])이면 탭을 만들지 않습니다. 단축키 A, 주소 ?mode=ai */
(() => {
'use strict';
const B = window.BRAIN; if (!B || !window.THREE || !B.nodes) return;
const UC = window.BRAIN_CONFIG || {};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- 도구 ----------------
   기본 예시 도구. build-data.mjs 도 아래 두 표시 사이의 JSON 을 읽으니 형식(JSON)을 지켜 주세요. */
const DEFAULT_TOOLS = /*AI_DEFAULTS*/[
  {"id": "obsidian", "name": "Obsidian", "sub": "노트 보관함", "color": "#a87bff", "match": "obsidian|옵시디언", "icon": "crystal"},
  {"id": "notion", "name": "Notion", "sub": "문서 · 데이터베이스", "color": "#e8eef5", "match": "notion|노션", "icon": "square"},
  {"id": "claude", "name": "Claude", "sub": "글쓰기 · 코딩", "color": "#ff8a5c", "match": "claude|클로드", "icon": "burst"},
  {"id": "chatgpt", "name": "ChatGPT", "sub": "질문 · 정리", "color": "#1fe0a8", "match": "chatgpt|챗gpt|\\bgpt", "icon": "orbit"},
  {"id": "gemini", "name": "Gemini", "sub": "검색 · 요약", "color": "#4fc3ff", "match": "gemini|제미나이", "icon": "star"},
  {"id": "git", "name": "Git", "sub": "버전 기록 · 백업", "color": "#ff4d61", "match": "\\bgit\\b|github|깃허브", "icon": "branch"}
]/*END_AI_DEFAULTS*/;
const PALETTE = ['#a87bff', '#4fc3ff', '#ff8a5c', '#1fe0a8', '#ffcf5a', '#ff4d61', '#6d86ff', '#ff4fbf', '#7fd0ff', '#c6ff5a'];
const ICONS = ['crystal', 'square', 'burst', 'orbit', 'star', 'branch', 'dots', 'hex', 'lens', 'eye'];
const okColor = (c) => typeof c === 'string' && /^(#[0-9a-f]{3,8}|[a-z]{3,20}|rgba?\([0-9.,\s%]+\)|hsla?\([0-9.,\s%deg]+\))$/i.test(c.trim());
const toRe = (m, name) => {
  if (m instanceof RegExp) return m;
  try { if (typeof m === 'string' && m) return new RegExp(m, 'i'); } catch (e) { console.warn('[ai-engine] match 정규식 오류:', name, e.message); }
  return new RegExp(String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
};
const RAW = Array.isArray(UC.aiTools) ? UC.aiTools : DEFAULT_TOOLS;
const used = new Set();
const TOOLS = RAW.filter((t) => t && t.name).slice(0, 12).map((t, i) => {
  let id = String(t.id || t.name).toLowerCase().replace(/[^a-z0-9가-힣_-]+/g, '-') || 'tool' + i; while (used.has(id)) id += '_'; used.add(id);
  return { id, name: String(t.name), sub: String(t.sub || ''), col: okColor(t.color) ? t.color.trim() : PALETTE[i % PALETTE.length], re: toRe(t.match, t.name), icon: ICONS.includes(t.icon) ? t.icon : ICONS[i % ICONS.length] };
});
if (!TOOLS.length) return; /* aiTools: [] 이면 탭을 숨깁니다 */
const N = B.nodes;
const HIDDEN = !!(B.stat && B.stat.hiddenTitles);
const dateOf = (n) => n[5] || n[3] || '';
TOOLS.forEach((T) => {
  if (HIDDEN) { const hits = (B.aiHits && B.aiHits[T.id]) || []; T.docs = hits.map((k) => N[k]).filter(Boolean); }
  else T.docs = N.filter((n) => T.re.test(n[0]));
  T.docs.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  T.count = T.docs.length;
});
const anyTool = new Set(); TOOLS.forEach((T) => T.docs.forEach((d) => anyTool.add(d)));
const iso = (d) => d.toISOString().slice(0, 10);
const recentFrom = (B.stat && B.stat.recentFrom) || '';
const recentN = recentFrom ? N.filter((n) => dateOf(n) >= recentFrom).length : 0;
const EDGES = (B.stat && B.stat.edges) || (B.edges ? B.edges.length : 0);
const BRAIN_NAME = String((B.stat && B.stat.title) || 'Knowledge Brain');
const TAB_NAME = String(UC.aiTabName && UC.aiTabName !== 'AI 엔진 AI' ? UC.aiTabName : 'AI 엔진'); // 'AI 엔진 AI' = 예전 기본값
// 다른 탭(브레인 BRAIN, 세계수 TREE)처럼 한글 이름 뒤에 영문을 붙입니다. 기본 이름일 때만 ENGINE, 이름을 바꾸면 aiTabEn 으로 직접 정합니다(빈 값이면 붙이지 않음).
const TAB_EN = UC.aiTabEn != null ? String(UC.aiTabEn) : (TAB_NAME === 'AI 엔진' ? 'ENGINE' : '');
const TAB_LABEL = TAB_EN && !TAB_NAME.toUpperCase().includes(TAB_EN.toUpperCase()) ? TAB_NAME + ' ' + TAB_EN : TAB_NAME;
const HEAD = String(UC.aiTitle || `${TOOLS.length}개의 도구, 하나의 뇌`);

/* ---------------- 화면 틀 ---------------- */
const css = `
#ai{position:absolute;left:12px;right:12px;top:64px;bottom:12px;z-index:20;display:none;border:1px solid var(--line);background:#02030a;overflow:hidden}
#ai.on{display:block}
#aiGl{position:absolute;inset:0;width:100%;height:100%;cursor:grab}
#aiGl:active{cursor:grabbing}
#aiLabs{position:absolute;inset:0;pointer-events:none}
.ail{position:absolute;transform:translate(-50%,0);text-align:center;white-space:nowrap;text-shadow:0 0 10px #000,0 0 3px #000;transition:opacity .25s}
.ail b{display:block;font-size:13.5px;letter-spacing:.05em;color:#fff;font-weight:700}
.ail span{display:block;font-size:10.5px;letter-spacing:.02em;margin-top:1px;font-weight:600}
.ail em{display:block;font-style:normal;font-size:9.5px;color:#9db3c6;margin-top:1px}
.ail.hot b{font-size:15px}
#aiCore{position:absolute;transform:translate(-50%,-100%);text-align:center;pointer-events:none;font-family:Consolas,monospace;font-size:10px;letter-spacing:.2em;color:#e9f6ff;text-shadow:0 0 12px #7fd0ff}
#aiCore b{display:block;font-family:'Segoe UI','Malgun Gothic',sans-serif;font-size:12px;letter-spacing:.12em}
#aiTop{position:absolute;left:20px;top:16px;pointer-events:none}
#aiTop .k{font-family:Consolas,monospace;font-size:10.5px;letter-spacing:.22em;color:#ff7aa8;font-weight:700}
#aiTop .k i{font-style:normal;color:#6f8da6;font-weight:400;margin-left:10px;letter-spacing:.12em}
#aiTop h2{font-size:34px;font-weight:800;letter-spacing:-.01em;line-height:1.15;margin-top:4px;background:linear-gradient(90deg,#ffffff 0%,#d9c8ff 35%,#8fe9ff 65%,#ffc09a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(160,140,255,.35))}
#aiTop p{font-size:12px;color:#9fb6c9;margin-top:4px;letter-spacing:.04em}
#aiTop p b{color:#ff7aa8;font-weight:600}#aiTop p u{text-decoration:none;color:#5ff0c8}
#aiLive{position:absolute;right:20px;top:18px;text-align:right;font-family:Consolas,monospace;pointer-events:none}
#aiLive .d{font-size:10px;letter-spacing:.2em;color:#ff5d73}
#aiLive .d:before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff5d73;margin-right:6px;box-shadow:0 0 10px #ff5d73;animation:aiBlink 1.2s infinite}
@keyframes aiBlink{50%{opacity:.25}}
#aiLive .c{font-size:15px;color:#e8f4ff;margin-top:6px;letter-spacing:.06em}
#aiLive .s{font-size:9.5px;color:#6f8da6;letter-spacing:.16em;margin-top:2px}
#aiCard{position:absolute;right:20px;top:86px;width:300px;background:linear-gradient(180deg,rgba(8,12,26,.88),rgba(4,6,14,.82));border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px 14px;backdrop-filter:blur(8px);pointer-events:none;box-shadow:0 0 40px rgba(0,0,0,.6)}
#aiCard .h{display:flex;align-items:center;gap:9px}
#aiCard .h i{width:10px;height:10px;border-radius:3px;box-shadow:0 0 12px currentColor}
#aiCard .h b{font-size:15px;color:#fff;letter-spacing:.04em}
#aiCard .s{font-size:10.5px;margin-top:3px;letter-spacing:.04em}
#aiCard .n{font-family:Consolas,monospace;font-size:24px;color:#fff;margin-top:8px}
#aiCard .n small{font-size:10px;color:#8aa3b8;margin-left:6px;letter-spacing:.1em}
#aiCard ol{list-style:none;margin-top:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:6px}
#aiCard li{font-size:10.5px;color:#c4d6e4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.75}
#aiCard li u{text-decoration:none;font-family:Consolas,monospace;color:#6f8da6;margin-right:6px;font-size:9.5px}
#aiBot{position:absolute;left:14px;right:14px;bottom:12px;height:228px;display:grid;grid-template-columns:minmax(0,1.65fr) minmax(0,1fr);grid-template-rows:58px minmax(0,1fr);gap:8px;pointer-events:none}
#aiStats{grid-column:1/3;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.ais{background:rgba(6,10,22,.72);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:7px 12px;backdrop-filter:blur(6px);position:relative;overflow:hidden}
.ais .k{font-family:Consolas,monospace;font-size:9px;letter-spacing:.2em;color:#6f8da6}
.ais .v{font-family:Consolas,monospace;font-size:21px;color:#fff;margin-top:2px}
.ais .v small{font-size:10px;color:#8aa3b8;margin-left:5px}
.ais .bar{position:absolute;left:12px;right:12px;bottom:6px;height:2px;background:rgba(255,255,255,.08)}
.ais .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--a),var(--b));box-shadow:0 0 8px var(--b)}
.aip{background:rgba(4,7,16,.78);border:1px solid rgba(255,255,255,.08);border-radius:8px;backdrop-filter:blur(6px);overflow:hidden;position:relative}
.aip .hd{display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.06);font-family:Consolas,monospace;font-size:9.5px;color:#6f8da6;letter-spacing:.1em}
.aip .hd i{width:8px;height:8px;border-radius:50%;display:inline-block}
.aip .hd .r{margin-left:auto;color:#ff5d73}
#aiLog{padding:5px 10px;font-family:Consolas,monospace;font-size:10.5px;line-height:1.62}
#aiLog div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#b9cad8;animation:aiLogIn .5s ease-out}
#aiLog div:first-child{color:#fff}
#aiLog u{text-decoration:none;color:#58708a;margin-right:8px}
#aiLog b{font-weight:600;margin-right:6px}
#aiLog s{text-decoration:none;color:#58708a;margin-right:6px}
@keyframes aiLogIn{from{transform:translateX(-8px)}to{transform:none}}
#aiAg{padding:3px 10px 0}
.aia{display:grid;grid-template-columns:92px 1fr 34px;align-items:center;gap:8px;height:11.6px;font-family:Consolas,monospace;font-size:9.5px;color:#c8d8e6}
.aia .t{height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.aia .t i{display:block;height:100%;border-radius:3px}
.aia em{font-style:normal;color:#8aa3b8;text-align:right}
#aiTh{display:block;margin:2px 10px 0}
#aiHelp{position:absolute;left:20px;bottom:246px;font-size:10px;color:#58708a;letter-spacing:.06em;pointer-events:none}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const root = document.createElement('div'); root.id = 'ai';
root.innerHTML = `<canvas id="aiGl"></canvas><div id="aiLabs"></div><div id="aiCore"></div>
<div id="aiTop"><div class="k">AI ENGINE<i>${esc(TOOLS.map((t) => t.name.toUpperCase()).join(' + '))}</i></div>
<h2>${esc(HEAD)}</h2><p>${TOOLS.length} tools. <b>1 brain.</b> <u>${N.length.toLocaleString()} notes.</u></p></div>
<div id="aiLive"><div class="d">LIVE</div><div class="c" id="aiClk"></div><div class="s">${esc(BRAIN_NAME.toUpperCase())}</div></div>
<div id="aiCard"></div>
<div id="aiHelp">드래그: 회전 · 휠: 확대 · 도구 클릭: 집중 · 빈 곳 클릭: 전체 보기</div>
<div id="aiBot">
 <div id="aiStats"></div>
 <div class="aip"><div class="hd"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>&nbsp; knowledge-flow.log · 노트 제목 재생${HIDDEN ? ' (가린 제목)' : ''} · ${TOOLS.length} tools → 1 brain<span class="r">● REC</span></div><div id="aiLog"></div></div>
 <div class="aip"><div class="hd">TOOLS · 제목에 도구 이름이 들어간 노트 수<span class="r" style="color:#6f8da6">NOTES</span></div><div id="aiAg"></div><canvas id="aiTh"></canvas></div>
</div>`;
document.body.appendChild(root);

/* 통계 카드 */
{
  const maxC = Math.max(...TOOLS.map((t) => t.count), 1);
  const stats = [
    ['NOTES', N.length.toLocaleString(), '노트', 1, '#7fd0ff', '#a87bff'],
    ['LINKS', EDGES.toLocaleString(), '연결', Math.min(1, EDGES / Math.max(1, N.length * 4)), '#a87bff', '#ff4fbf'],
    ['TOOL-LINKED', anyTool.size.toLocaleString(), '도구 관련', anyTool.size / Math.max(1, N.length), '#ff8a5c', '#ffcf5a'],
    ['RECENT', recentN.toLocaleString(), recentFrom ? recentFrom.slice(5) + ' 이후' : '최근', recentN / Math.max(1, N.length), '#1fe0a8', '#4fc3ff'],
  ];
  $('aiStats').innerHTML = stats.map(([k, v, s, p, a, b]) => `<div class="ais" style="--a:${a};--b:${b}"><div class="k">${k}</div><div class="v">${v}<small>${s}</small></div><div class="bar"><i style="width:${Math.max(4, Math.min(100, p * 100)).toFixed(0)}%"></i></div></div>`).join('');
  $('aiAg').innerHTML = TOOLS.map((t) => `<div class="aia"><span style="color:${t.col}">● ${esc(t.name)}</span><span class="t"><i style="width:${Math.max(3, t.count / maxC * 100).toFixed(1)}%;background:linear-gradient(90deg,${t.col}55,${t.col});box-shadow:0 0 8px ${t.col}"></i></span><em>${t.count}</em></div>`).join('');
}

/* ---------------- 3D ---------------- */
const canvas = $('aiGl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.autoClear = false;
const PR0 = Math.min(window.devicePixelRatio || 1, 1.5); renderer.setPixelRatio(PR0);
const PR = Math.min(window.devicePixelRatio || 1, 1.5);
const HT = renderer.capabilities.isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(40, 2, 0.05, 400);
const U = { t: { value: 0 }, px: { value: 1 }, flash: { value: 0 }, intro: { value: 0 } };
const ADD = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
const C = (h) => new THREE.Color(h);

const NOISE = `float hh(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hh(i),hh(i+vec3(1,0,0)),f.x),mix(hh(i+vec3(0,1,0)),hh(i+vec3(1,1,0)),f.x),f.y),mix(mix(hh(i+vec3(0,0,1)),hh(i+vec3(1,0,1)),f.x),mix(hh(i+vec3(0,1,1)),hh(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n3(p);p*=2.03;a*=.5;}return v;}`;
const PT_FS = 'varying vec3 vc;varying float va;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.0,d);a*=a;gl_FragColor=vec4(vc,a*va);}';

/* 배경 성운 (화면 전체) */
const bgS = new THREE.Scene(), bgC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const BGU = { t: U.t, yaw: { value: 0 }, pit: { value: 0 }, asp: { value: 2 } };
bgS.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
  depthTest: false, depthWrite: false, uniforms: BGU,
  vertexShader: 'varying vec2 vu;void main(){vu=uv;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader: NOISE + `uniform float t,yaw,pit,asp;varying vec2 vu;void main(){vec2 p=(vu-.5)*vec2(asp,1.);p.x+=yaw*.35;p.y+=pit*.3;
  float n=fbm(vec3(p*1.6,t*.015));float m=fbm(vec3(p*3.2+n*1.4,t*.02+5.));
  vec3 c=vec3(.006,.008,.02);
  c+=vec3(.20,.07,.36)*smoothstep(.42,.95,n)*smoothstep(.9,-.3,p.x)*.75;
  c+=vec3(.02,.22,.26)*smoothstep(.45,1.,m)*smoothstep(-.9,.6,p.x)*.6;
  c+=vec3(.30,.11,.05)*smoothstep(.62,1.05,n*m*1.7)*.5;
  float r=length(p-vec2(yaw*.35,-.05));c+=vec3(.10,.08,.22)*exp(-r*r*2.2)*.9;
  gl_FragColor=vec4(c,1.);}`,
})));

/* 별 */
{
  const n = 4200, pos = new Float32Array(n * 3), ph = new Float32Array(n), sz = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = 70 + Math.random() * 90, s = Math.sqrt(1 - u * u);
    pos.set([Math.cos(a) * s * r, u * r * .7, Math.sin(a) * s * r], i * 3); ph[i] = Math.random(); sz[i] = Math.pow(Math.random(), 6) * 3 + .6;
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); g.setAttribute('sz', new THREE.BufferAttribute(sz, 1));
  scene.add(new THREE.Points(g, new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: 'uniform float t,px;attribute float ph,sz;varying vec3 vc;varying float va;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=sz*px*1.6;va=.35+.65*pow(.5+.5*sin(t*(.6+ph*2.)+ph*40.),3.);vc=mix(vec3(.75,.85,1.),vec3(1.,.8,.95),ph);}',
    fragmentShader: PT_FS })));
}

/* ---------------- 중심: 브레인 코어 ---------------- */
const core = new THREE.Group(); scene.add(core);
const CORE_R = .66;
const coreMat = new THREE.ShaderMaterial({ ...ADD, uniforms: U,
  vertexShader: 'varying vec3 vN,vV,vP;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}',
  fragmentShader: NOISE + `uniform float t,flash;varying vec3 vN,vV,vP;void main(){float c=max(dot(vN,vV),0.);float f=1.-c;
  float n=fbm(vP*3.2+vec3(0.,t*.25,t*.18));float fil=smoothstep(.52,.78,n)*smoothstep(.95,.55,n);
  vec3 col=mix(vec3(.55,.35,1.),vec3(.35,.95,1.),smoothstep(.3,.7,n));
  vec3 o=col*(pow(f,2.4)*1.9+fil*.55)+vec3(1.,.95,1.)*pow(c,8.)*.12*(1.+flash*3.);
  gl_FragColor=vec4(o*(.8+flash*.9),1.);}` });
core.add(new THREE.Mesh(new THREE.SphereGeometry(CORE_R, 64, 48), coreMat));

/* 실제 뇌 모델을 홀로그램 점으로 */
if (window.MODELS && MODELS.brain && MODELS.brain.parts) {
  const dec = (b64) => { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new Int16Array(u.buffer); };
  const raw = []; MODELS.brain.parts.forEach((p) => { if (p.pos) { const q = dec(p.pos); for (let i = 0; i + 2 < q.length; i += 3) raw.push(-q[i + 2] / 32767, q[i + 1] / 32767, q[i] / 32767); } });
  const cnt = raw.length / 3, step = Math.max(1, Math.floor(cnt / 7000));
  let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (let i = 0; i < cnt; i++) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], raw[i * 3 + k]); mx[k] = Math.max(mx[k], raw[i * 3 + k]); }
  const cen = [0, 1, 2].map((k) => (mn[k] + mx[k]) / 2), ext = Math.max(...[0, 1, 2].map((k) => mx[k] - mn[k]));
  const sc = (CORE_R * 1.42) / ext; const arr = [], ph = [];
  for (let i = 0; i < cnt; i += step) { arr.push((raw[i * 3] - cen[0]) * sc, (raw[i * 3 + 1] - cen[1]) * sc, (raw[i * 3 + 2] - cen[2]) * sc); ph.push(Math.random()); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.setAttribute('ph', new THREE.Float32BufferAttribute(ph, 1));
  const brain = new THREE.Points(g, new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: `uniform float t,px,flash;attribute float ph;varying vec3 vc;varying float va;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
    float w=.5+.5*sin(position.y*14.-t*2.2+ph*2.);gl_PointSize=px*(1.1+w*1.4)*(19./-mv.z);
    vc=mix(vec3(1.,.4,.8),vec3(.35,.85,1.),smoothstep(-.4,.4,position.y+.2*sin(t*.5)));va=(.22+.6*pow(w,4.))*(1.+flash);}`,
    fragmentShader: PT_FS }));
  core.add(brain); core.userData.brain = brain;
}

/* 철사 껍질 · 궤도 링 */
const wire = (geo, col, a) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false }));
const shellA = wire(new THREE.IcosahedronGeometry(CORE_R * 1.42, 1), 0x9fd8ff, .32); core.add(shellA);
const shellB = wire(new THREE.DodecahedronGeometry(CORE_R * 1.85, 0), 0xc9a6ff, .2); core.add(shellB);
const rings = [];
[[1.32, .22, 0, '#7fe7ff'], [1.52, -.5, .8, '#c69bff'], [1.75, 1.2, -.4, '#ff9ad0']].forEach(([r, rx, rz, col], i) => {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r * CORE_R * 1.8, .006, 6, 220), new THREE.ShaderMaterial({ ...ADD, uniforms: { ...U, col: { value: C(col) }, k: { value: i } },
    vertexShader: 'varying vec2 vu;void main(){vu=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t,k;uniform vec3 col;varying vec2 vu;void main(){float d=fract(vu.x*(6.+k*3.)-t*(.12+k*.05));float a=.18+1.4*smoothstep(.0,.04,d)*smoothstep(.22,.04,d);gl_FragColor=vec4(col*1.4,a);}' }));
  m.rotation.set(Math.PI / 2 + rx, 0, rz); core.add(m); rings.push(m);
});
/* 눈금 다이얼 (카메라를 바라봄) */
const dial = new THREE.Mesh(new THREE.RingGeometry(CORE_R * 2.55, CORE_R * 2.75, 256, 1), new THREE.ShaderMaterial({ ...ADD, side: THREE.DoubleSide, uniforms: U,
  vertexShader: 'varying vec2 vp;void main(){vp=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform float t;varying vec2 vp;void main(){float a=atan(vp.y,vp.x)/6.2831853+.5;float tk=step(.6,fract(a*120.));float big=step(.85,fract(a*12.));float sw=pow(fract(a-t*.07),10.);gl_FragColor=vec4(vec3(.6,.85,1.)*(.5+sw*2.),(tk*.18+big*.35)+sw*.5);}' }));
scene.add(dial);

/* 은하 소용돌이 */
{
  const n = 17000, pos = new Float32Array(n * 3), a0 = new Float32Array(n), rr = new Float32Array(n), cc = new Float32Array(n * 3), ph = new Float32Array(n);
  const pal = TOOLS.map((t) => C(t.col)).concat([C('#ffffff'), C('#bfe6ff')]);
  for (let i = 0; i < n; i++) {
    const arm = i % 4, r = 1.05 + Math.pow(Math.random(), 1.6) * 2.4, a = arm / 4 * Math.PI * 2 + Math.log(r) * 2.6 + (Math.random() - .5) * .55 / r;
    a0[i] = a; rr[i] = r; ph[i] = Math.random(); pos[i * 3 + 1] = (Math.random() - .5) * .16 * (1 + r * .3);
    const c = pal[Math.floor(Math.random() * pal.length)]; cc.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('a0', new THREE.BufferAttribute(a0, 1)); g.setAttribute('rr', new THREE.BufferAttribute(rr, 1)); g.setAttribute('color', new THREE.BufferAttribute(cc, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1));
  const gal = new THREE.Points(g, new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: `uniform float t,px,intro;attribute float a0,rr,ph;attribute vec3 color;varying vec3 vc;varying float va;void main(){float a=a0+t*(.55/rr);float r=rr*(.25+.75*intro);vec3 p=vec3(cos(a)*r,position.y,sin(a)*r);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=px*(.9+2.2*pow(ph,5.))*(24./-mv.z);vc=mix(color,vec3(1.),.25);va=(.3+.5*smoothstep(3.6,1.1,rr))*(.6+.4*sin(t*2.+ph*30.))*intro;}`,
    fragmentShader: PT_FS }));
  gal.rotation.set(.32, 0, .12); scene.add(gal);
}

/* ---------------- 세계수: 줄기 · 뿌리 · 바닥 ---------------- */
const FLOOR_Y = -3.7;
{
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: 'varying vec2 vp;void main(){vp=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `uniform float t,intro;varying vec2 vp;void main(){float r=length(vp),a=atan(vp.y,vp.x);
    float ring=smoothstep(.035,0.,abs(fract(r*1.1-t*.12)-.5)-.47);
    float rad=smoothstep(.012,0.,abs(fract(a/6.2831853*48.)-.5)-.488)*step(.9,r);
    float fade=smoothstep(10.,1.5,r)*intro;float glow=exp(-r*r*.9);
    vec3 c=vec3(.25,.6,1.)*(ring*.22+rad*.1)*fade+vec3(.65,.5,1.)*glow*.28*intro;
    gl_FragColor=vec4(c,1.);}` }));
  fl.rotation.x = -Math.PI / 2; fl.position.y = FLOOR_Y; scene.add(fl);

  /* 뿌리: 가지치기 선 (빛이 바깥으로 흐름) */
  const P = [], D = [], CL = []; let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const cols = [C('#7fe7ff'), C('#a87bff'), C('#ff8ad8')];
  const grow = (x, z, ang, len, depth, dist) => {
    let px = x, pz = z; const segs = 7;
    for (let s = 0; s < segs; s++) {
      ang += (rnd() - .5) * .5; const l = len / segs, nx = px + Math.cos(ang) * l, nz = pz + Math.sin(ang) * l;
      P.push(px, FLOOR_Y + .01, pz, nx, FLOOR_Y + .01, nz); D.push(dist, dist + l); const c = cols[depth % 3]; CL.push(c.r, c.g, c.b, c.r, c.g, c.b);
      dist += l; px = nx; pz = nz;
      if (depth < 4 && s > 2 && rnd() < .3) grow(px, pz, ang + (rnd() < .5 ? -1 : 1) * (.5 + rnd() * .5), len * .55, depth + 1, dist);
    }
  };
  for (let i = 0; i < 9; i++) grow(0, 0, i / 9 * Math.PI * 2 + rnd() * .3, 5.2 + rnd() * 1.6, 0, 0);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('dd', new THREE.Float32BufferAttribute(D, 1)); g.setAttribute('color', new THREE.Float32BufferAttribute(CL, 3));
  scene.add(new THREE.LineSegments(g, new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: 'attribute float dd;attribute vec3 color;varying float vd;varying vec3 vc;void main(){vd=dd;vc=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t,intro;varying float vd;varying vec3 vc;void main(){float p=pow(fract(vd*.35-t*.45),10.);float a=(.22+p*2.2)*smoothstep(8.,0.,vd)*step(vd,intro*9.);gl_FragColor=vec4(vc*1.3,a);}' })));

  /* 줄기: 빛 기둥 */
  const trunkMat = (r, k) => new THREE.ShaderMaterial({ ...ADD, side: THREE.DoubleSide, uniforms: { ...U, k: { value: k } },
    vertexShader: 'varying vec3 vN,vV;varying vec2 vu;void main(){vu=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform float t,k,intro,flash;varying vec3 vN,vV;varying vec2 vu;void main(){float c=abs(dot(vN,vV));float s=pow(fract(vu.y*3.-t*.9+vu.x*k),6.);float a=(pow(c,k>.5?6.:3.)*.22+s*.2)*intro*(1.+flash*.6)*smoothstep(0.,.15,vu.y);gl_FragColor=vec4(mix(vec3(.85,.6,1.),vec3(.5,.95,1.),vu.y)*1.5,a*(k>.5?.35:1.));}' });
  const h = -CORE_R * .8 - FLOOR_Y;
  const tr1 = new THREE.Mesh(new THREE.CylinderGeometry(.045, .09, h, 24, 1, true), trunkMat(.05, 0)); tr1.position.y = FLOOR_Y + h / 2; scene.add(tr1);
  const tr2 = new THREE.Mesh(new THREE.CylinderGeometry(.16, .55, h, 32, 1, true), trunkMat(.3, 1)); tr2.position.y = FLOOR_Y + h / 2; scene.add(tr2);

  /* 올라가는 빛 알갱이 */
  const n = 1600, sd = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) sd.set([Math.random() * 6.283, Math.random(), .05 + Math.random() * .18, Math.random()], i * 4);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); pg.setAttribute('sd', new THREE.BufferAttribute(sd, 4));
  const pts = new THREE.Points(pg, new THREE.ShaderMaterial({ ...ADD, uniforms: { ...U, y0: { value: FLOOR_Y }, y1: { value: -CORE_R * .7 } },
    vertexShader: 'uniform float t,px,y0,y1,intro;attribute vec4 sd;varying vec3 vc;varying float va;void main(){float u=fract(sd.y+t*sd.z);float y=mix(y0,y1,u);float r=(.04+.6*pow(1.-u,3.))*(.4+sd.w);float a=sd.x+t*(1.+sd.w)+u*6.;vec3 p=vec3(cos(a)*r,y,sin(a)*r);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=px*(1.+2.4*pow(sd.w,4.))*(24./-mv.z);vc=mix(vec3(.6,.9,1.),vec3(1.,.6,.95),sd.w);va=sin(u*3.14)*intro*.9;}',
    fragmentShader: PT_FS }));
  pts.frustumCulled = false; scene.add(pts);
}

/* ---------------- 도구 아이콘 (입체) ---------------- */
const rrShape = (w, h, r, Cls = THREE.Shape) => { const s = new Cls(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
const circ = (r, x = 0, y = 0, Cls = THREE.Shape, cw = false) => { const s = new Cls(); s.absarc(x, y, r, 0, Math.PI * 2, cw); return s; };
const poly = (n, r, rot = 0, Cls = THREE.Shape) => { const s = new Cls(); for (let i = 0; i <= n; i++) { const a = rot + i / n * Math.PI * 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return s; };
const tf = (shape, ang, dx = 0, dy = 0) => { const c = Math.cos(ang), s = Math.sin(ang); const m = (p) => new THREE.Vector2(p.x * c - p.y * s + dx, p.x * s + p.y * c + dy); const o = new THREE.Shape(shape.getPoints(12).map(m)); shape.holes.forEach((h) => o.holes.push(new THREE.Path(h.getPoints(12).map(m)))); return o; };
const extrude = (shapes, d = .07, b = .018) => { const g = new THREE.ExtrudeGeometry(shapes, { depth: d, bevelEnabled: true, bevelThickness: b, bevelSize: b * .8, bevelSegments: 3, curveSegments: 20 }); g.center(); return g; };
const star4 = (r, k = .28) => { const s = new THREE.Shape(); for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * k : r; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } return s; };

const EMBLEM = { /* 상표 로고가 아닌 추상 모양. aiTools 의 icon 으로 고릅니다 */
  burst() { const sh = []; for (let i = 0; i < 12; i++) { const L = i % 2 ? .25 : .32, s = new THREE.Shape(); s.moveTo(.03, -.05); s.lineTo(L, -.02); s.quadraticCurveTo(L + .025, 0, L, .02); s.lineTo(.03, .05); s.lineTo(.03, -.05); sh.push(tf(s, i / 12 * Math.PI * 2 + .13)); } sh.push(circ(.08)); return extrude(sh); },
  orbit() { const r = circ(.28); r.holes.push(circ(.2, 0, 0, THREE.Path, true)); return extrude([r, circ(.11), circ(.06, .24, .16)]); },
  star() { return extrude([star4(.34, .26)]); },
  hex() { const o = poly(6, .3, Math.PI / 6); o.holes.push(poly(6, .2, Math.PI / 6, THREE.Path)); return extrude([o, poly(6, .095, 0)]); },
  square() { const o = rrShape(.56, .56, .12); o.holes.push(rrShape(.4, .4, .07, THREE.Path)); const bar = rrShape(.1, .34, .035); return extrude([o, tf(bar, 0, .12, 0), circ(.05, -.1, 0)]); },
  lens() { const r = circ(.19, -.05, .05); r.holes.push(circ(.125, -.05, .05, THREE.Path, true)); return extrude([r, tf(rrShape(.08, .24, .04), Math.PI / 4, .16, -.16), tf(star4(.085), 0, -.05, .05)]); },
  eye() { const eye = new THREE.Shape(); eye.moveTo(-.34, 0); eye.quadraticCurveTo(0, .3, .34, 0); eye.quadraticCurveTo(0, -.3, -.34, 0); eye.holes.push(circ(.14, 0, 0, THREE.Path, true)); const iris = circ(.1); iris.holes.push(circ(.045, .02, .02, THREE.Path, true)); return extrude([eye, iris]); },
  branch() { return extrude([circ(.075, -.14, .24), circ(.075, -.14, -.24), circ(.075, .16, .1), rrShape(.06, .46, .03), tf(rrShape(.055, .3, .027), -.9, .02, .01)].map((s, k) => (k === 3 ? tf(s, 0, -.14, 0) : s))); },
  crystal() { const g = new THREE.OctahedronGeometry(.27, 0); g.scale(.85, 1.3, .7); const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > .3) p.setX(i, p.getX(i) + .05); const gg = g.index ? g.toNonIndexed() : g; gg.computeVertexNormals(); return gg; },
  dots: null,
};
const emblemMat = (col, ph) => new THREE.ShaderMaterial({ uniforms: { ...U, col: { value: C(col) }, hi: { value: 0 }, ph: { value: ph } },
  vertexShader: 'varying vec3 vN,vV,vP;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}',
  fragmentShader: 'uniform vec3 col;uniform float t,hi,ph,flash;varying vec3 vN,vV,vP;void main(){float f=1.-max(dot(vN,vV),0.);vec3 L=normalize(vec3(.45,.8,.6));float l=max(dot(vN,L),0.);float sp=pow(max(dot(reflect(-L,vN),vV),0.),24.);float sw=smoothstep(.05,0.,abs(fract((vP.x+vP.y)*1.3-t*.33+ph)-.5)-.0);vec3 c=col*(.45+.8*l)+vec3(1.)*(sp*1.1+sw*.7)+col*pow(f,1.5)*1.2;gl_FragColor=vec4(c*(.95+hi*.6),1.);}' });
const tileMat = (col, ph) => new THREE.ShaderMaterial({ uniforms: { ...U, col: { value: C(col) }, hi: { value: 0 }, ph: { value: ph } },
  vertexShader: 'varying vec3 vN,vV,vP,vO;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;vO=normal;gl_Position=projectionMatrix*mv;}',
  fragmentShader: 'uniform vec3 col;uniform float t,hi,ph;varying vec3 vN,vV,vP,vO;void main(){float f=pow(1.-max(dot(vN,vV),0.),2.4);float front=smoothstep(.85,.98,vO.z);float top=smoothstep(-.55,.55,vP.y);vec3 base=mix(vec3(.02,.025,.045),col*.34,.2+.6*top)*front+col*.1*(1.-front);float edge=1.-front;float sw=smoothstep(.06,0.,abs(fract((vP.x*.6+vP.y)*.55-t*.1+ph)-.5))*front*.22;vec3 c=base+col*(f*1.05+edge*.45)*(1.+hi*.9)+vec3(sw);gl_FragColor=vec4(c,1.);}' });
const glowMat = (col, k) => new THREE.ShaderMaterial({ ...ADD, uniforms: { ...U, col: { value: C(col) }, hi: { value: 0 }, k: { value: k } },
  vertexShader: 'varying vec2 vu;void main(){vu=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 col;uniform float t,hi,k,intro;varying vec2 vu;void main(){float r=length(vu-.5)*2.;float a=k>.5?exp(-r*r*6.)*.32:exp(-r*r*3.2)*.2*(.8+.2*sin(t*1.6+k*9.));gl_FragColor=vec4(col*(1.+hi*.8),a*(1.+hi)*intro);}' });

const RING_R = 4.7, RING_V = 2.55;
const nodes = TOOLS.map((T, i) => {
  const a = Math.PI / 2 - (i + .5) / TOOLS.length * Math.PI * 2;
  const pos = new THREE.Vector3(Math.cos(a) * RING_R, Math.sin(a) * RING_V + .1, Math.sin(a * 2 + .6) * .9 - .2);
  const g = new THREE.Group(); g.position.copy(pos); scene.add(g);
  const pivot = new THREE.Group(); g.add(pivot);
  const tile = new THREE.Mesh(extrude([rrShape(1, 1, .22)], .12, .035), tileMat(T.col, i * .37)); pivot.add(tile);
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(.95, .95), glowMat(T.col, 1)); inner.position.z = .1; pivot.add(inner);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), glowMat(T.col, i * .05)); halo.position.z = -.2; pivot.add(halo);
  let emb;
  if (T.icon === 'dots') {
    emb = new THREE.Group(); const sg = new THREE.SphereGeometry(.062, 24, 16);
    for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) { const m = new THREE.Mesh(sg, emblemMat(T.col, (x + y) * .2)); m.position.set(x * .17, y * .17, 0); m.userData.k = x + y * 3; emb.add(m); }
  } else {
    emb = new THREE.Mesh(EMBLEM[T.icon](), emblemMat(T.col, i * .29));
  }
  emb.position.z = .16; emb.scale.setScalar(1.18); pivot.add(emb);
  /* 타일 주위를 도는 알갱이 */
  const n = 110, ar = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) ar.set([Math.random() * 6.283, .72 + Math.random() * .25, Math.random()], k * 3);
  const og = new THREE.BufferGeometry(); og.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); og.setAttribute('ar', new THREE.BufferAttribute(ar, 3));
  const orb = new THREE.Points(og, new THREE.ShaderMaterial({ ...ADD, uniforms: { ...U, col: { value: C(T.col) }, hi: { value: 0 } },
    vertexShader: 'uniform float t,px,hi,intro;uniform vec3 col;attribute vec3 ar;varying vec3 vc;varying float va;void main(){float a=ar.x+t*(.35+ar.z*.5)*(1.+hi*2.);vec3 p=vec3(cos(a)*ar.y,sin(a)*ar.y*.92,sin(a*3.+ar.z*9.)*.05);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=px*(.9+2.*pow(ar.z,5.))*(20./-mv.z);vc=mix(col,vec3(1.),.35);va=(.35+.4*sin(t*2.+ar.z*20.))*(1.+hi)*intro;}',
    fragmentShader: PT_FS }));
  orb.frustumCulled = false; pivot.add(orb);
  return { T, i, g, pivot, tile, inner, halo, emb, orb, pos, hi: 0, pulse: 0, show: 0 };
});

/* ---------------- 빛의 물줄기 (도구 → 뇌) ---------------- */
const beams = nodes.map((nd, i) => {
  const P0 = nd.pos.clone(), dir = P0.clone().normalize();
  const P2 = dir.clone().multiplyScalar(CORE_R * 1.05);
  const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  const P1 = P0.clone().multiplyScalar(.45).add(side.multiplyScalar(i % 2 ? .9 : -.9)).add(new THREE.Vector3(0, i % 2 ? 1.1 : -.9, 0));
  const curve = new THREE.QuadraticBezierCurve3(P0, P1, P2);
  const col = C(nd.T.col);
  const BU = { ...U, col: { value: col }, P0: { value: P0 }, P1: { value: P1 }, P2: { value: P2 }, uB: { value: -99 }, uR: { value: -99 }, I: { value: 1 } };
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, .009, 6, false), new THREE.ShaderMaterial({ ...ADD, uniforms: BU,
    vertexShader: 'varying vec2 vu;void main(){vu=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 col;uniform float t,uB,uR,I,intro;varying vec2 vu;void main(){float d=fract(vu.x*5.-t*.9);float a=.12+.55*smoothstep(0.,.06,d)*smoothstep(.3,.06,d);float bd=t-uB;a+=bd>0.&&bd<1.3?exp(-pow((vu.x-bd*.95)*10.,2.))*2.5:0.;float rd=t-uR;a+=rd>0.&&rd<1.3?exp(-pow((vu.x-(1.-rd*.95))*10.,2.))*2.:0.;gl_FragColor=vec4(mix(col,vec3(1.),.2)*1.5,a*I*smoothstep(0.,1.,intro*1.4-.3));}' }));
  scene.add(tube);
  const n = 700, u0 = new Float32Array(n), sp = new Float32Array(n), ph = new Float32Array(n), jit = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) { u0[k] = Math.random(); sp[k] = .06 + Math.random() * .12; ph[k] = Math.random(); const r = Math.pow(Math.random(), 1.7) * .45; const a = Math.random() * 6.283, b = Math.acos(Math.random() * 2 - 1); jit.set([Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r, Math.sin(b) * Math.sin(a) * r], k * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  [['u0', u0, 1], ['sp', sp, 1], ['ph', ph, 1], ['jit', jit, 3]].forEach(([k, v, s]) => g.setAttribute(k, new THREE.BufferAttribute(v, s)));
  const pts = new THREE.Points(g, new THREE.ShaderMaterial({ ...ADD, uniforms: BU,
    vertexShader: `uniform vec3 P0,P1,P2,col;uniform float t,px,uB,uR,I,intro;attribute float u0,sp,ph;attribute vec3 jit;varying vec3 vc;varying float va;
    void main(){float u=fract(u0+t*sp);vec3 p=mix(mix(P0,P1,u),mix(P1,P2,u),u);float env=sin(u*3.14159);
    float ang=t*1.1+ph*6.28+u*10.;vec3 j=jit*env;j=vec3(j.x*cos(ang)-j.z*sin(ang),j.y,j.x*sin(ang)+j.z*cos(ang));p+=j;
    float bd=t-uB;float nb=bd>0.&&bd<1.3?exp(-pow((u-bd*.95)*9.,2.)):0.;float rd=t-uR;float nr=rd>0.&&rd<1.3?exp(-pow((u-(1.-rd*.95))*9.,2.)):0.;float nn=max(nb,nr);
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=px*(1.1+2.6*pow(fract(ph*13.7),4.))*(1.+nn*2.2)*(28./-mv.z);
    vc=mix(col,vec3(1.),nn*.55+(1.-env)*.25);va=(.25+.6*env)*(.7+nn*2.6)*I*smoothstep(0.,1.,intro*1.4-.3);}`,
    fragmentShader: PT_FS }));
  pts.frustumCulled = false; scene.add(pts);
  return { BU, curve };
});

/* 이웃 도구끼리 잇는 옅은 호 */
{
  const P = [], CL = [], UU = [];
  nodes.forEach((a, i) => {
    const b = nodes[(i + 1) % nodes.length], m = a.pos.clone().add(b.pos).multiplyScalar(.5).multiplyScalar(1.12); m.y += .45;
    const cv = new THREE.QuadraticBezierCurve3(a.pos, m, b.pos), pts = cv.getPoints(40), ca = C(a.T.col), cb = C(b.T.col);
    for (let k = 0; k < 40; k++) { P.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z); const c1 = ca.clone().lerp(cb, k / 40), c2 = ca.clone().lerp(cb, (k + 1) / 40); CL.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b); UU.push(k / 40 + i, (k + 1) / 40 + i); }
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(CL, 3)); g.setAttribute('uu', new THREE.Float32BufferAttribute(UU, 1));
  scene.add(new THREE.LineSegments(g, new THREE.ShaderMaterial({ ...ADD, uniforms: U,
    vertexShader: 'attribute vec3 color;attribute float uu;varying vec3 vc;varying float vu;void main(){vc=color;vu=uu;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t,intro;varying vec3 vc;varying float vu;void main(){float d=pow(fract(vu*2.-t*.25),8.);gl_FragColor=vec4(vc,(.07+d*.6)*intro);}' })));
}

/* ---------------- 빛 번짐 (bloom) ---------------- */
const qS = new THREE.Scene(), qC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), qM = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); qS.add(qM);
const QVS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const mBright = new THREE.ShaderMaterial({ uniforms: { tex: { value: null } }, vertexShader: QVS, fragmentShader: 'uniform sampler2D tex;varying vec2 vUv;void main(){vec3 c=texture2D(tex,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));gl_FragColor=vec4(c*smoothstep(.5,1.4,l),1.);}' });
const mBlur = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new THREE.Vector2() } }, vertexShader: QVS,
  fragmentShader: 'uniform sampler2D tex;uniform vec2 dir;varying vec2 vUv;void main(){vec3 c=texture2D(tex,vUv).rgb*.2270;c+=(texture2D(tex,vUv+dir*1.3846).rgb+texture2D(tex,vUv-dir*1.3846).rgb)*.3162;c+=(texture2D(tex,vUv+dir*3.2308).rgb+texture2D(tex,vUv-dir*3.2308).rgb)*.0703;gl_FragColor=vec4(c,1.);}' });
const mComp = new THREE.ShaderMaterial({ uniforms: { s: { value: null }, b1: { value: null }, b2: { value: null }, b3: { value: null }, t: U.t, flash: U.flash }, vertexShader: QVS,
  fragmentShader: 'uniform sampler2D s,b1,b2,b3;uniform float t,flash;varying vec2 vUv;void main(){vec2 d=vUv-.5;float ca=.004*dot(d,d)*4.;vec3 c=vec3(texture2D(s,vUv+d*ca).r,texture2D(s,vUv).g,texture2D(s,vUv-d*ca).b);c+=texture2D(b1,vUv).rgb*.5+texture2D(b2,vUv).rgb*.65+texture2D(b3,vUv).rgb*.85*(1.+flash*.6);c=1.-exp(-c*1.05);c=pow(c,vec3(.95));c*=1.-dot(d,d)*1.25;float g=fract(sin(dot(vUv*vec2(1271.,817.)+fract(t),vec2(12.9898,78.233)))*43758.5453);c+=(g-.5)*.022;gl_FragColor=vec4(c,1.);}' });
let RT = null;
const mk = (w, h, depth) => new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: HT, depthBuffer: !!depth, stencilBuffer: false });
function ensureRT(w, h) {
  if (RT && RT.w === w && RT.h === h) return;
  if (RT) Object.values(RT).forEach((r) => r && r.dispose && r.dispose());
  const h2 = [Math.max(2, w >> 1), Math.max(2, h >> 1)], h4 = [Math.max(2, w >> 2), Math.max(2, h >> 2)], h8 = [Math.max(2, w >> 3), Math.max(2, h >> 3)];
  RT = { w, h, s: mk(w, h, true), a1: mk(...h2), b1: mk(...h2), a2: mk(...h4), b2: mk(...h4), a3: mk(...h8), b3: mk(...h8), sz: [h2, h4, h8] };
}
const pass = (mat, target) => { qM.material = mat; renderer.setRenderTarget(target); renderer.render(qS, qC); };
function blur(a, b, w, h, rad) { mBlur.uniforms.tex.value = a.texture; mBlur.uniforms.dir.value.set(rad / w, 0); pass(mBlur, b); mBlur.uniforms.tex.value = b.texture; mBlur.uniforms.dir.value.set(0, rad / h); pass(mBlur, a); }

/* ---------------- 카메라 · 조작 ---------------- */
const HOME = 15.2;
const view = { yaw: 0, pitch: .16, dist: HOME, ty: -.1, tYaw: 0, tPitch: .16, tDist: HOME, focus: -1, fx: 0, fy: 0, fz: 0, sway: 0 };
let drag = null, moved = 0, mouse = { x: -1e4, y: -1e4, nx: 0, ny: 0 }, lastInput = 0, hover = -1;
canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: view.tYaw, pitch: view.tPitch }; moved = 0; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.nx = mouse.x / r.width - .5; mouse.ny = mouse.y / r.height - .5;
  if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); view.tYaw = drag.yaw - dx * .006; view.tPitch = Math.max(-.15, Math.min(1.1, drag.pitch + dy * .004)); lastInput = performance.now(); }
});
canvas.addEventListener('pointerup', () => {
  if (drag && moved < 5) { if (hover >= 0 && hover !== view.focus) { view.focus = hover; view.tDist = 7.8; } else { view.focus = -1; view.tDist = HOME; } setCard(view.focus); lastInput = performance.now(); }
  drag = null;
});
canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
canvas.addEventListener('wheel', (e) => { view.tDist = Math.max(4.5, Math.min(20, view.tDist * (1 + e.deltaY * .001))); lastInput = performance.now(); }, { passive: true });

/* 이름표 */
const labs = nodes.map((nd) => { const e = document.createElement('div'); e.className = 'ail'; e.innerHTML = `<b>${esc(nd.T.name)}</b><span style="color:${nd.T.col}">${esc(nd.T.sub)}</span><em>관련 노트 ${nd.T.count}</em>`; $('aiLabs').appendChild(e); return e; });
$('aiCore').innerHTML = `<b>${esc(BRAIN_NAME)}</b>BRAIN · ${N.length.toLocaleString()}`;

function setCard(k) {
  const card = $('aiCard');
  if (k < 0) {
    const top = TOOLS.slice().sort((a, b) => b.count - a.count).slice(0, 3).map((t) => t.name).join(' · ');
    card.innerHTML = `<div class="h"><i style="color:#bfe6ff;background:#bfe6ff"></i><b>${esc(BRAIN_NAME)}</b></div><div class="s" style="color:#9fd8ff">노트 보관함 · 제목에서 센 실제 개수${HIDDEN ? ' · 제목 가림' : ''}</div><div class="n">${N.length.toLocaleString()}<small>노트</small> ${EDGES.toLocaleString()}<small>연결</small></div><ol><li><u>가장 많이 나온 도구</u>${esc(top)}</li><li><u>도구 관련 노트</u>${anyTool.size.toLocaleString()}개</li><li><u>최근 새 노트</u>${recentN}개</li><li><u>데이터 기준</u>${esc(String((B.stat && B.stat.built) || '').slice(0, 16).replace('T', ' '))}</li></ol>`;
    return;
  }
  const T = TOOLS[k];
  card.innerHTML = `<div class="h"><i style="color:${T.col};background:${T.col}"></i><b>${esc(T.name)}</b></div><div class="s" style="color:${T.col}">${esc(T.sub)}</div><div class="n">${T.count}<small>관련 노트</small></div><ol>${T.docs.slice(0, 6).map((d) => `<li><u>${esc(dateOf(d).slice(5) || '--')}</u>${esc(d[0])}</li>`).join('') || '<li>제목에 이 도구 이름이 들어간 노트가 아직 없습니다</li>'}</ol>`;
}
setCard(-1);

/* 흐름 기록 · 이벤트 */
const LOG = []; const logEl = $('aiLog');
function pushLog(T, dirIn, title) {
  const tag = `<b style="color:${T.col}">[${esc(T.name.toLowerCase())}]</b>`;
  LOG.unshift(`<div><u>${esc(title.date)}</u>${dirIn ? `${tag}<s>→ brain</s>` : `<b style="color:#bfe6ff">[brain]</b><s>→ ${esc(T.name.toLowerCase())}</s>`}${esc(title.text)}</div>`);
  if (LOG.length > 6) LOG.length = 6; logEl.innerHTML = LOG.join('');
}
const W8 = TOOLS.map((t) => Math.sqrt(t.count) + 2), W8S = W8.reduce((a, b) => a + b, 0);
const pickTool = () => { let r = Math.random() * W8S; for (let i = 0; i < W8.length; i++) { r -= W8[i]; if (r <= 0) return i; } return 0; };
const docPtr = TOOLS.map(() => 0);
let nextEv = 2.2, evN = 0;
function fireEvent(t) {
  const i = (view.focus >= 0 && Math.random() < .55) ? view.focus : pickTool(); const T = TOOLS[i], nd = nodes[i];
  const inward = Math.random() < .72;
  if (inward) beams[i].BU.uB.value = t; else beams[i].BU.uR.value = t;
  nd.pulse = 1;
  setTimeout(() => { if (inward) { U.flash.value = Math.min(1.2, U.flash.value + .55); } }, 1050);
  const d = T.docs.length ? T.docs[docPtr[i]++ % T.docs.length] : null;
  pushLog(T, inward, { date: d ? (dateOf(d).slice(5) || '--') : '--', text: d ? d[0] : (T.sub || T.name) });
}

/* 처리량 막대 (일별 새 문서, 실제 값) */
const endDay = new Date(((B.stat && B.stat.maxDate) || iso(new Date())) + 'T00:00:00Z');
const days = []; for (let k = 20; k >= 0; k--) days.push(iso(new Date(endDay.getTime() - k * 864e5)));
const perDay = days.map((d) => N.filter((n) => (n[5] || '') === d).length);
function drawTh(t) {
  const c = $('aiTh'), p = c.parentElement, w = Math.max(60, p.clientWidth - 20), h = 30; const dpr = PR;
  if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.width = w + 'px'; c.style.height = h + 'px'; }
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  const mx = Math.max(...perDay, 1), bw = w / days.length; const scan = (t * .25) % 1;
  perDay.forEach((v, k) => { const bh = Math.max(1.5, Math.sqrt(v / mx) * (h - 12)); const x = k * bw, hot = Math.abs(k / days.length - scan) < .06; const gr = g.createLinearGradient(0, h - 10, 0, h - 10 - bh); gr.addColorStop(0, '#6d86ff'); gr.addColorStop(1, hot ? '#ffffff' : '#ff4fbf'); g.fillStyle = gr; g.globalAlpha = hot ? 1 : .8; g.fillRect(x + 1, h - 10 - bh, bw - 2, bh); });
  g.globalAlpha = 1; g.fillStyle = '#58708a'; g.font = '9px Consolas,monospace'; g.fillText('일별 새 노트 · 21일', 0, h - 1); g.textAlign = 'right'; g.fillText(days[days.length - 1].slice(5), w, h - 1); g.textAlign = 'left';
}

/* ---------------- 그리기 ---------------- */
const V = new THREE.Vector3(), Q = new THREE.Quaternion(), M4 = new THREE.Matrix4(), UPV = new THREE.Vector3(0, 1, 0);
let raf = 0, on = false, t0 = 0, prevT = 0, introStart = 0;
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const back = (x) => { x = Math.min(1, Math.max(0, x)); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

function frame(now) {
  if (!on) return; raf = requestAnimationFrame(frame);
  const t = (now - t0) / 1000, dt = Math.min(.05, t - prevT); prevT = t; U.t.value = t;
  const it = (now - introStart) / 1000; const intro = ease(it / 2.6); U.intro.value = intro;
  const box = root.getBoundingClientRect(); const w = Math.max(2, Math.floor(box.width * PR)), h = Math.max(2, Math.floor(box.height * PR));
  if (canvas.width !== w || canvas.height !== h) renderer.setSize(box.width, box.height, false);
  ensureRT(w, h); U.px.value = h / 900 * 1.0;

  /* 카메라 */
  if (!drag && now - lastInput > 4000) { view.sway += dt; view.tYaw += ((Math.sin(view.sway * .13) * .42) - view.tYaw) * Math.min(1, dt * .6); view.tPitch += ((.16 + Math.sin(view.sway * .09) * .1) - view.tPitch) * Math.min(1, dt * .6); }
  view.yaw += (view.tYaw - view.yaw) * Math.min(1, dt * 3);
  view.pitch += (view.tPitch - view.pitch) * Math.min(1, dt * 3);
  const introDist = 30 - (30 - HOME) * ease(it / 3.2), introPitch = .75 - .59 * ease(it / 3.2);
  view.dist += (view.tDist - view.dist) * Math.min(1, dt * 2.2);
  const D = it < 3.2 ? Math.max(view.dist, introDist) : view.dist, P = it < 3.2 ? Math.max(view.pitch, introPitch) : view.pitch;
  const f = view.focus >= 0 ? nodes[view.focus].pos : null;
  view.fx += ((f ? f.x * .62 : 0) - view.fx) * Math.min(1, dt * 2); view.fy += ((f ? f.y * .62 + .25 : view.ty) - view.fy) * Math.min(1, dt * 2); view.fz += ((f ? f.z * .62 : 0) - view.fz) * Math.min(1, dt * 2);
  const yaw = view.yaw + mouse.nx * .08 * (drag ? 0 : 1), pit = P + mouse.ny * .05 * (drag ? 0 : 1);
  cam.aspect = box.width / box.height; cam.setViewOffset(box.width, box.height, box.width * .05, box.height * .13, box.width, box.height); cam.updateProjectionMatrix();
  cam.position.set(view.fx + Math.sin(yaw) * Math.cos(pit) * D, view.fy + Math.sin(pit) * D, view.fz + Math.cos(yaw) * Math.cos(pit) * D);
  cam.lookAt(view.fx, view.fy, view.fz);
  BGU.yaw.value = yaw; BGU.pit.value = pit; BGU.asp.value = cam.aspect;

  /* 코어 */
  U.flash.value *= Math.pow(.12, dt);
  const cs = back(it / 1.6) * (1 + U.flash.value * .06 + Math.sin(t * 1.4) * .015); core.scale.setScalar(Math.max(.001, cs));
  if (core.userData.brain) core.userData.brain.rotation.y = t * .18;
  shellA.rotation.set(t * .07, t * .11, 0); shellB.rotation.set(-t * .05, -t * .08, t * .03);
  rings.forEach((r, i) => { r.rotation.z += dt * (.12 + i * .07) * (i % 2 ? -1 : 1); });
  dial.position.set(0, 0, 0); dial.quaternion.copy(cam.quaternion); dial.rotateZ(t * .05); dial.scale.setScalar(Math.max(.001, ease((it - .6) / 1.6)));

  /* 도구 */
  let best = -1, bd = 75 * 75; const W = box.width, H = box.height;
  nodes.forEach((nd, i) => {
    nd.show = ease((it - .9 - i * .12) / 1.1);
    const tgtHi = (i === hover || i === view.focus) ? 1 : 0; nd.hi += (tgtHi - nd.hi) * Math.min(1, dt * 6); nd.pulse *= Math.pow(.08, dt);
    const s = Math.max(.001, back((it - .9 - i * .12) / 1.1) * (.86 + nd.hi * .18 + nd.pulse * .12));
    nd.g.scale.setScalar(s); nd.g.position.set(nd.pos.x, nd.pos.y + Math.sin(t * .9 + i * 1.7) * .09, nd.pos.z);
    M4.lookAt(cam.position, nd.g.position, UPV); Q.setFromRotationMatrix(M4); nd.pivot.quaternion.copy(nd.g.quaternion.clone().invert().multiply(Q));
    nd.pivot.rotateY(Math.sin(t * .6 + i) * .32); nd.pivot.rotateX(Math.sin(t * .5 + i * 2.1) * .12);
    if (nd.emb.isGroup) nd.emb.children.forEach((m) => { m.scale.setScalar(.75 + .45 * Math.pow(.5 + .5 * Math.sin(t * 3 - m.userData.k * .7), 2)); m.material.uniforms.hi.value = nd.hi + nd.pulse; });
    else { nd.emb.rotation.y = Math.sin(t * .8 + i) * .45; nd.emb.material.uniforms.hi.value = nd.hi + nd.pulse; if (nd.T.icon === 'burst' || nd.T.icon === 'star') nd.emb.rotation.z = t * .25; if (nd.T.icon === 'crystal') nd.emb.rotation.y = t * .9; }
    const hv = nd.hi + nd.pulse * .8;
    nd.tile.material.uniforms.hi.value = hv; nd.inner.material.uniforms.hi.value = hv; nd.halo.material.uniforms.hi.value = hv; nd.orb.material.uniforms.hi.value = hv;
    beams[i].BU.I.value = (view.focus >= 0 && view.focus !== i) ? .35 : 1 + nd.hi * .6;
    /* 화면 위치 */
    V.copy(nd.g.position).project(cam); const sx = (V.x * .5 + .5) * W, sy = (-V.y * .5 + .5) * H;
    V.copy(nd.g.position); V.y -= .78 * s; V.project(cam); const lx = (V.x * .5 + .5) * W, ly = (-V.y * .5 + .5) * H;
    const e = labs[i]; e.style.left = lx + 'px'; e.style.top = (ly + 4) + 'px';
    const depth = nd.g.position.distanceTo(cam.position), dn = Math.max(.35, Math.min(1, 1.6 - (depth - view.dist) * .12));
    e.style.opacity = (nd.show * (view.focus >= 0 && view.focus !== i ? .45 : dn)).toFixed(2); e.classList.toggle('hot', nd.hi > .5);
    const dd = (sx - mouse.x) ** 2 + (sy - mouse.y) ** 2; if (dd < bd) { bd = dd; best = i; }
  });
  if (!drag) { if (best !== hover) { hover = best; setCard(hover >= 0 ? hover : view.focus); canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab'; } }
  { V.set(0, CORE_R * 3.25, 0).project(cam); const ce = $('aiCore'); ce.style.left = ((V.x * .5 + .5) * W) + 'px'; ce.style.top = ((-V.y * .5 + .5) * H) + 'px'; ce.style.opacity = ease((it - 1.2) / 1).toFixed(2); }

  /* 이벤트 */
  if (it > 3 && t > nextEv) { fireEvent(t); nextEv = t + .75 + Math.random() * 1.1; }

  /* 렌더: 배경 → 장면 → 빛 번짐 → 합성 */
  renderer.setRenderTarget(RT.s); renderer.setClearColor(0x000000, 1); renderer.clear(true, true, true);
  renderer.render(bgS, bgC); renderer.clearDepth(); renderer.render(scene, cam);
  mBright.uniforms.tex.value = RT.s.texture; pass(mBright, RT.a1);
  blur(RT.a1, RT.b1, RT.sz[0][0], RT.sz[0][1], 1.2);
  mBlur.uniforms.tex.value = RT.a1.texture; mBlur.uniforms.dir.value.set(0, 0); pass(mBlur, RT.a2);
  blur(RT.a2, RT.b2, RT.sz[1][0], RT.sz[1][1], 1.6); blur(RT.a2, RT.b2, RT.sz[1][0], RT.sz[1][1], 2.4);
  mBlur.uniforms.tex.value = RT.a2.texture; pass(mBlur, RT.a3);
  blur(RT.a3, RT.b3, RT.sz[2][0], RT.sz[2][1], 2); blur(RT.a3, RT.b3, RT.sz[2][0], RT.sz[2][1], 3.2);
  mComp.uniforms.s.value = RT.s.texture; mComp.uniforms.b1.value = RT.a1.texture; mComp.uniforms.b2.value = RT.a2.texture; mComp.uniforms.b3.value = RT.a3.texture;
  pass(mComp, null);

  /* 시계 · 막대 */
  if (!frame.lastClk || now - frame.lastClk > 500) { frame.lastClk = now; const d = new Date(); $('aiClk').textContent = d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + ' ' + d.toTimeString().slice(0, 8); drawTh(t); }
}

/* ---------------- 탭 연결 ----------------
   A: AI 탭 열기/닫기(닫으면 바로 전 화면으로) · AI 탭에서 B/T: 브레인/세계수로 · Esc: 집중 풀기 */
let prevTab = 'tB';
function layout() { const hd = $('hd'); if (hd) root.style.top = Math.round(hd.getBoundingClientRect().bottom + 8) + 'px'; }
function open() {
  if (on) return; layout(); prevTab = $('tT') && $('tT').classList.contains('on') ? 'tT' : 'tB';
  on = true; window.__AI_ON = true; root.classList.add('on');
  const cc = $('ccby'); if (cc) cc.style.zIndex = '30'; /* CC BY 출처 줄은 AI 탭에서도 보이게 */
  ['tB', 'tT'].forEach((id) => $(id) && $(id).classList.remove('on')); tA.classList.add('on');
  const tip = $('tip'); if (tip) tip.style.display = 'none';
  view.focus = -1; view.tDist = HOME; view.tYaw = view.yaw = 0; setCard(-1); LOG.length = 0; logEl.innerHTML = '';
  for (let k = 0; k < 3; k++) { const i = pickTool(), T = TOOLS[i], d = T.docs.length ? T.docs[docPtr[i]++ % T.docs.length] : null; pushLog(T, true, { date: d ? (dateOf(d).slice(5) || '--') : '--', text: d ? d[0] : (T.sub || T.name) }); }
  t0 = performance.now(); prevT = 0; introStart = t0; nextEv = 2.2;
  raf = requestAnimationFrame(frame);
}
function close() {
  if (!on) return; on = false; window.__AI_ON = false; root.classList.remove('on'); tA.classList.remove('on'); cancelAnimationFrame(raf);
  const cc = $('ccby'); if (cc) cc.style.zIndex = '';
}
const tA = document.createElement('button'); tA.id = 'tA'; tA.textContent = TAB_LABEL; tA.title = 'A';
const tT = $('tT'); if (tT) tT.after(tA); else ($('tabs') || document.body).appendChild(tA);
tA.addEventListener('click', open);
['tB', 'tT'].forEach((id) => $(id) && $(id).addEventListener('click', close));
addEventListener('resize', () => { if (on) layout(); });
/* 캡처 단계: AI 탭이 켜져 있을 때 B/T 를 먼저 받아 본 화면의 T(토글)와 겹치지 않게 합니다 */
addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'a') { if (on) { close(); const p = $(prevTab); if (p) p.click(); } else open(); e.stopImmediatePropagation(); return; }
  if (!on) return;
  if (k === 'b' || k === 't') { e.stopImmediatePropagation(); close(); const p = $(k === 'b' ? 'tB' : 'tT'); if (p) p.click(); return; }
  if (e.key === 'Escape' && view.focus >= 0) { view.focus = -1; view.tDist = HOME; setCard(-1); }
}, true);
const q = new URLSearchParams(location.search);
const startAI = q.has('mode') ? q.get('mode') === 'ai' : (UC.startMode === 'ai' || location.hash === '#ai');
if (startAI) setTimeout(open, 60);
window.__AI_ENGINE = { open, close, isOn: () => on, tools: TOOLS.map((t) => ({ id: t.id, name: t.name, count: t.count })) };
})();
