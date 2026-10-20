<p align="center"><img src="docs/banner.png" alt="옵시디언 3D 지식그래프: 내 노트가 엑스레이 뇌와 세계수로 보입니다" width="100%"></p>

<p align="center">
<a href="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml"><img src="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml/badge.svg" alt="test"></a>
<img src="https://img.shields.io/badge/Claude_Code-skill-2547F4" alt="Claude Code skill">
<img src="https://img.shields.io/badge/license-MIT-black" alt="MIT">
</p>

# 옵시디언 3D 지식그래프 (obsidian-brain-3d)

옵시디언 노트 보관함을 엑스레이 뇌·두개골 속 점으로 보여 주고, T 키 하나로 세계수 모양으로 바꿉니다. 아래 여섯 칸에는 실제 노트 제목·날짜·연결 수가 나오고, 공개할 때는 제목과 분류 이름을 가릴 수 있습니다.

<p align="center"><img src="skills/obsidian-brain-3d/docs/preview.png" alt="옵시디언 3D 지식그래프 화면" width="100%"></p>

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

## 만든 사람

**리도**, AI 좌충우돌 실습 중인 20년차 엔지니어입니다. 매일 AI에게 일을 맡기다가 막힌 부분을 고쳐 가며 이 스킬을 만들었습니다.
[YouTube @Reedodev](https://www.youtube.com/@Reedodev) · [Threads @reedo.dev](https://www.threads.com/@reedo.dev) · [GitHub @reedodev](https://github.com/reedodev)

같이 만든 다른 스킬: [노트 먼저 찾아보기](https://github.com/reedodev/vault-recall) · [작업 기록 강의자료](https://github.com/reedodev/work-to-lecture-deck) · [한국어 말투 점검](https://github.com/reedodev/korean-tone-check) · [네이버 황금키워드](https://github.com/reedodev/naver-golden-keywords) · [한글 양식 채우기](https://github.com/reedodev/hwpx-form-fill) · [TTS 끝소리 고치기](https://github.com/reedodev/tts-tail-fix) · [카드뉴스 렌더](https://github.com/reedodev/html-card-render) · [영상 비율 검사](https://github.com/reedodev/social-video-gate) · [유튜브 게시 점검](https://github.com/reedodev/youtube-publish-checklist)

---

## English

Render an Obsidian vault as points inside an x-ray brain and skull, switch to a world-tree layout with T, and see real note titles, dates and link counts. Optional title/group hiding for public sharing.

Install: `/plugin marketplace add reedodev/obsidian-brain-3d` then `/plugin install obsidian-brain-3d@obsidian-brain-3d`, or copy `skills/obsidian-brain-3d` into `~/.claude/skills/`. See [SKILL.md](skills/obsidian-brain-3d/SKILL.md) for the full procedure. MIT License; third-party models, fonts and libraries keep their own licenses.
