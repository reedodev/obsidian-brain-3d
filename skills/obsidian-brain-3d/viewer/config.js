/* 화면 모양 설정. 이 파일만 고치면 index.html을 건드리지 않고 모양이 바뀝니다.
   build-data.mjs --site 로 다시 만들어도 이미 있는 config.js는 덮어쓰지 않습니다.
   쓰지 않는 줄은 지우거나 // 로 막아 두면 기본값을 씁니다. */
window.BRAIN_CONFIG = {
  // 처음 열릴 화면: 'brain'(엑스레이 뇌) 또는 'tree'(세계수)
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
  ui: { /* bg: '#02060b', ink: '#dcefff', dim: '#6f8da6', cy: '#7fd0ff' */ }
};
