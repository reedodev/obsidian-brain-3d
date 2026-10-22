<p align="center"><img src="docs/banner.png" alt="옵시디언 3D 지식그래프: 내 노트가 엑스레이 뇌와 세계수로 보입니다" width="100%"></p>

<p align="center">
<a href="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml"><img src="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml/badge.svg" alt="test"></a>
<img src="https://img.shields.io/badge/Claude_Code-skill-2547F4" alt="Claude Code skill">
<img src="https://img.shields.io/badge/license-MIT-black" alt="MIT">
</p>

# 옵시디언 3D 지식그래프 (obsidian-brain-3d)

옵시디언 노트 보관함을 엑스레이 뇌·두개골 속 점으로 보여 주고, T 키 하나로 세계수 모양으로 바꿉니다. 아래 여섯 칸에는 실제 노트 제목·날짜·연결 수가 나오고, 공개할 때는 제목과 분류 이름을 가릴 수 있습니다.

<p align="center"><img src="skills/obsidian-brain-3d/docs/preview.png" alt="옵시디언 3D 지식그래프 화면" width="100%"></p>

## 무엇이 필요한가요?

**`.md` 파일이 든 폴더 하나**면 됩니다. 옵시디언 앱이나 AI가 관리하는 LLM 위키가 꼭 있어야 하는 것은 아닙니다. 다만 노트끼리 `[[링크]]`가 걸려 있고, 폴더나 머리말 `type`으로 나뉘어 있고, `created` 날짜가 있으면 화면이 훨씬 풍성해집니다. 노트가 적다면 에이전트에게 노트를 정리하고 링크를 이어 달라고 먼저 요청하는 방법을 [SKILL.md](skills/obsidian-brain-3d/SKILL.md#노트가-아직-적다면-llm-위키처럼-키우기)에 적어 두었습니다.

작성자처럼 AI가 정리하는 지식 저장고부터 만들려면 [obsidian-llm-wiki](https://github.com/reedodev/obsidian-llm-wiki)로 보관함을 먼저 만든 뒤 이 스킬로 그리면 됩니다.

## 모양 바꾸기

출력 폴더의 `config.js` 한 파일에서 바꿉니다. 에이전트에게 "세계수 화면으로 먼저 열리게 해 줘", "배경을 우주로", "해골 빼고 뇌만", "영역 색을 따뜻한 색으로"처럼 말하면 됩니다. 파일을 고치지 않고 시험해 보려면 주소 뒤에 `?mode=tree&bg=space&skull=0`처럼 붙입니다. 말과 설정값의 대응표는 [SKILL.md](skills/obsidian-brain-3d/SKILL.md#모양-바꾸기-이렇게-말하세요)에 있습니다.
## 설치

**Claude Code 플러그인으로 설치**

```
/plugin marketplace add reedodev/obsidian-brain-3d
/plugin install obsidian-brain-3d@obsidian-brain-3d
```

**폴더만 복사**

```bash
git clone https://github.com/reedodev/obsidian-brain-3d.git
cp -r obsidian-brain-3d/skills/obsidian-brain-3d ~/.claude/skills/
```

필요한 것: Node 18+, 웹 브라우저

## 바로 해 보기

```bash
node skills/obsidian-brain-3d/scripts/build-data.mjs skills/obsidian-brain-3d/examples/sample-vault --site ./brain-site
node skills/obsidian-brain-3d/scripts/serve.mjs ./brain-site      # http://127.0.0.1:8770/
```

자세한 절차, 옵션, 한계는 [SKILL.md](skills/obsidian-brain-3d/SKILL.md)에 있습니다. 에이전트가 이 파일을 읽고 그대로 따릅니다.

## 시험

`node tests/run.mjs`가 SKILL.md 형식을 검사하고 예시 파일로 스크립트를 실제로 실행합니다. 푸시할 때마다 GitHub Actions가 같은 시험을 돌립니다(위 test 배지).

<!-- credits -->
## 출처와 영감

- **계기와 화면 영감**: 폴더를 지식 그래프로 바꾸는 [graphify](https://github.com/Graphify-Labs/graphify)를 소개한 [X 게시물](https://x.com/karlarboledas/status/2111838109029552334)과 그 안의 뇌 모양 대시보드 영상을 보고 "내 노트도 뇌처럼 보이게 할 수 있을까"에서 시작했습니다. graphify의 코드나 그 영상의 디자인 파일은 쓰지 않았고, 화면은 three.js로 새로 만들었습니다. 겉모양이 비슷해 보이지 않도록 엑스레이·두개골·세계수 방향으로 바꿨습니다.
- **노트 저장고 방식**: 작성자의 보관함은 Andrej Karpathy의 [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 방식으로 운영하며, 그 구조는 [obsidian-llm-wiki](https://github.com/reedodev/obsidian-llm-wiki)에 정리했습니다.
- **연결선과 그래프라는 생각**: 옵시디언의 그래프 보기처럼 `[[링크]]`를 선으로 잇는 방식을 따랐습니다.
- **3D 모델과 라이브러리**: 뇌·두개골 모델은 NIH 3D(CC BY 4.0), 3D 그리기는 three.js(MIT)입니다. 자세한 출처는 [CREDITS.md](skills/obsidian-brain-3d/viewer/CREDITS.md)에 있습니다.

## 만든 사람

**리도**, AI 좌충우돌 실습 중인 20년차 엔지니어입니다. 매일 AI에게 일을 맡기다가 막힌 부분을 고쳐 가며 이 스킬을 만들었습니다.
[YouTube @Reedodev](https://www.youtube.com/@Reedodev) · [Threads @reedo.dev](https://www.threads.com/@reedo.dev) · [GitHub @reedodev](https://github.com/reedodev)

같이 만든 다른 스킬: [노트 먼저 찾아보기](https://github.com/reedodev/vault-recall) · [작업 기록 강의자료](https://github.com/reedodev/work-to-lecture-deck) · [한국어 말투 점검](https://github.com/reedodev/korean-tone-check) · [네이버 황금키워드](https://github.com/reedodev/naver-golden-keywords) · [한글 양식 채우기](https://github.com/reedodev/hwpx-form-fill) · [TTS 끝소리 고치기](https://github.com/reedodev/tts-tail-fix) · [카드뉴스 렌더](https://github.com/reedodev/html-card-render) · [영상 비율 검사](https://github.com/reedodev/social-video-gate) · [유튜브 게시 점검](https://github.com/reedodev/youtube-publish-checklist)

---

## English

Render an Obsidian vault as points inside an x-ray brain and skull, switch to a world-tree layout with T, and see real note titles, dates and link counts. Optional title/group hiding for public sharing.

**Credits.**
- Started after seeing an [X post](https://x.com/karlarboledas/status/2111838109029552334) about [graphify](https://github.com/Graphify-Labs/graphify) and a brain-shaped dashboard video in it. No graphify code or design files were used; the viewer was written from scratch with three.js and pushed in a different direction (x-ray skull, world tree). Vault structure follows Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Models: NIH 3D (CC BY 4.0); library: three.js (MIT). See [CREDITS.md](skills/obsidian-brain-3d/viewer/CREDITS.md).

### Quick start (English)

`ash
git clone https://github.com/reedodev/obsidian-brain-3d.git && cd obsidian-brain-3d
# 1. Build a site from any folder of .md notes (read-only, never writes into your vault)
node skills/obsidian-brain-3d/scripts/build-data.mjs <your-vault> --site ./brain-site
# 2. Serve it and open http://127.0.0.1:8770/  (keep this terminal open)
node skills/obsidian-brain-3d/scripts/serve.mjs ./brain-site
`

No vault yet? Use the bundled sample: skills/obsidian-brain-3d/examples/sample-vault. Press **T** to morph between the brain and the world tree. Everything runs locally; nothing is uploaded. Add ?hide=titles style options (see SKILL.md) before screenshotting a private vault.

Install: `/plugin marketplace add reedodev/obsidian-brain-3d` then `/plugin install obsidian-brain-3d@obsidian-brain-3d`, or copy `skills/obsidian-brain-3d` into `~/.claude/skills/`. See [SKILL.md](skills/obsidian-brain-3d/SKILL.md) for the full procedure. MIT License; third-party models, fonts and libraries keep their own licenses.
