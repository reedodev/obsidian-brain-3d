/* 화면 모양 설정. 이 파일만 고치면 index.html을 건드리지 않고 모양이 바뀝니다.
   build-data.mjs --site 로 다시 만들어도 이미 있는 config.js는 덮어쓰지 않습니다.
   쓰지 않는 줄은 지우거나 // 로 막아 두면 기본값을 씁니다. */
window.BRAIN_CONFIG = {
  // 처음 열릴 화면: 'brain'(엑스레이 뇌) | 'tree'(세계수) | 'ai'(AI 엔진)
  startMode: 'brain',

  // 배경: 'net'(연결망) | 'hex'(육각) | 'space'(우주) | 'rain'(빛줄기) | 'contour'(등고선) | 'none'
  background: 'net',

  // 저절로 도는 속도. 0이면 멈춤, 0.09가 기본, 0.3이면 빠름
  rotateSpeed: 0.09,

  // 두개골: hideSkull true면 뇌만 보입니다. jaw true면 아래턱도 보입니다
  hideSkull: false,
  jaw: false,

  // 빛 번짐: strength 0(없음)~1.5(강함), radius 0.5~2
  bloom: { strength: 0.6, radius: 1.0 },

  // 여섯 영역 색(전두엽, 두정엽, 측두엽, 후두엽, 소뇌=뿌리, 뇌줄기=줄기). 바꾸지 않을 칸은 null
  colors: [null, null, null, null, null, null],

  // 화면 바탕과 글자색(CSS 색). bg 바탕, ink 글자, dim 흐린 글자, cy 강조색
  ui: { /* bg: '#02060b', ink: '#dcefff', dim: '#6f8da6', cy: '#7fd0ff' */ },

  // ---- AI 엔진 탭 (단축키 A, 주소 ?mode=ai) ----
  // 탭 이름과 큰 제목. 지우면 기본값('AI 엔진', 'N개의 도구, 하나의 뇌')
  // 탭 버튼에는 다른 탭(브레인 BRAIN, 세계수 TREE)처럼 영문이 붙어 'AI 엔진 ENGINE'으로 보입니다.
  // 이름을 바꾸면 영문은 붙지 않습니다. 붙이고 싶으면 aiTabEn: 'TOOLS' 처럼 적습니다.
  aiTabName: 'AI 엔진',
  // aiTitle: '내 도구들이 한 뇌로',

  // 화면에 나오는 도구(최대 12개). 개수는 노트 제목에서 match(정규식, 대소문자 무시)로 실제로 센 값입니다.
  // 빈 배열 aiTools: [] 이면 AI 탭이 사라집니다. 이 줄을 통째로 지우면 아래와 같은 기본 목록을 씁니다.
  // icon(선택): crystal | square | burst | orbit | star | branch | dots | hex | lens | eye
  // 정규식 안의 \b 는 문자열이라 \\b 로 씁니다.
  // --hide-titles 로 만든 화면은 개수를 만들 때 센 값으로 보여 주므로, 여기를 고친 뒤 build-data.mjs 를 다시 돌리세요.
  aiTools: [
    { id: 'obsidian', name: 'Obsidian', sub: '노트 보관함',          color: '#a87bff', match: 'obsidian|옵시디언', icon: 'crystal' },
    { id: 'notion',   name: 'Notion',   sub: '문서 · 데이터베이스', color: '#e8eef5', match: 'notion|노션', icon: 'square' },
    { id: 'claude',   name: 'Claude',   sub: '글쓰기 · 코딩',        color: '#ff8a5c', match: 'claude|클로드', icon: 'burst' },
    { id: 'chatgpt',  name: 'ChatGPT',  sub: '질문 · 정리',          color: '#1fe0a8', match: 'chatgpt|챗gpt|\\bgpt', icon: 'orbit' },
    { id: 'gemini',   name: 'Gemini',   sub: '검색 · 요약',          color: '#4fc3ff', match: 'gemini|제미나이', icon: 'star' },
    { id: 'git',      name: 'Git',      sub: '버전 기록 · 백업',     color: '#ff4d61', match: '\\bgit\\b|github|깃허브', icon: 'branch' }
  ]
};
