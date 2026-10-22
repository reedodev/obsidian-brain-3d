<p align="center"><b>English</b> | <a href="README.ko.md">한국어</a></p>

<p align="center"><img src="docs/banner.png" alt="Obsidian 3D knowledge graph: your notes shown as an x-ray brain and a world tree" width="100%"></p>

<p align="center">
<a href="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml"><img src="https://github.com/reedodev/obsidian-brain-3d/actions/workflows/test.yml/badge.svg" alt="test"></a>
<img src="https://img.shields.io/badge/Claude_Code-skill-2547F4" alt="Claude Code skill">
<img src="https://img.shields.io/badge/license-MIT-black" alt="MIT">
</p>

# Obsidian 3D Knowledge Graph (obsidian-brain-3d)

**See your Obsidian notes as glowing points inside a 3D x-ray brain, then turn it into a world tree with one key.**

<p align="center"><img src="skills/obsidian-brain-3d/docs/preview.png" alt="Obsidian 3D knowledge graph viewer showing notes as points inside a brain" width="100%"></p>

## At a glance

Your notes appear as points inside an x-ray brain and skull. Press `T` to morph them into a world tree, and press `A` to open the third tab, 「AI 엔진」 ("AI Engine"), where the tools you use are linked to the brain by streams of light.

Six panels along the bottom show your real note titles, dates and link counts. Before sharing anything publicly, you can hide titles and group names.

**Who is this for?**

- People who keep notes in Obsidian and want to see the whole picture at a glance
- People who want an eye-catching screen for a blog, video or presentation about their notes
- Beginners who have never typed a command (the steps below go one at a time)

**How it works, in 3 steps**

| Step | What you do | Command |
| --- | --- | --- |
| 1. Get | Download this folder | `git clone` or **Download ZIP** |
| 2. Build | Turn your notes into a viewer | `build-data.mjs` |
| 3. Open | Start the viewer and open it in your browser | `serve.mjs` → `http://127.0.0.1:8770/` |

> **Note**
> Your notes are only read. Nothing is changed, deleted or uploaded anywhere.

## Your first 5 minutes

You don't need to be comfortable with computers. Just follow these steps in order.

First you'll open the viewer with the **sample notes** that come with this project. Once that works, you'll switch to your own vault (your Obsidian notes folder).

### Step 1. Open a terminal

A terminal is a window where you type commands as text.

- **Windows**: click the Start button, type `PowerShell`, then click "Windows PowerShell".
- **Mac**: press `Command (⌘) + Space`, type `Terminal`, then press Enter.

### Step 2. Check that Node.js is installed

Node.js is a free program that runs this tool. Type this and press Enter:

```
node --version
```

- If you see a number above `v18` (for example `v22.11.0`), move on to Step 3.
- If you see "is not recognized" or `command not found`, download the **LTS** version (the stable, long-term-support release) from [nodejs.org](https://nodejs.org) and install it.

> **Tip**
> After installing Node.js, **close the terminal and open it again**, then check once more.

### Step 3. Get this folder

Pick **one** of the two ways below.

**A. If you have git** (a tool for downloading code)

```
git clone https://github.com/reedodev/obsidian-brain-3d.git
```

Then move into the downloaded folder:

```
cd obsidian-brain-3d
```

**B. If you don't have git**

1. Click the green **Code** button near the top of this page → **Download ZIP**.
2. Unzip the file. On Windows, right-click → "Extract All". Running it from inside the zip file won't work.
3. The unzipped folder is called `obsidian-brain-3d-main`.
4. In the terminal, type `cd ` (cd followed by one space), drag that folder onto the terminal window, and press Enter.

> **Check**
> Type `dir` on Windows or `ls` on Mac. If you see `README.md` and `skills`, you're in the right place.
> Type every command below **from inside this folder**.

### Step 4. Build the viewer from the sample notes

Copy and paste this line exactly:

```
node skills/obsidian-brain-3d/scripts/build-data.mjs skills/obsidian-brain-3d/examples/sample-vault --site brain-site
```

If it ends with `Done / 완료` ("Done"), it worked. A new `brain-site` folder with the viewer files is created.

### Step 5. Start the viewer

```
node skills/obsidian-brain-3d/scripts/serve.mjs brain-site
```

When you see `serving ... at http://127.0.0.1:8770/`, the viewer is running.

> **Important**
> **Leave this terminal open.** Closing the window turns the viewer off.

### Step 6. Open it in your browser

Type this into your browser's address bar (latest Chrome, Edge or Safari):

```
http://127.0.0.1:8770/
```

This address only opens on your own computer; nobody else can see it. Once the brain appears, try these:

| Action | What it does |
| --- | --- |
| `T` key | World tree |
| `B` key | Brain |
| `A` key | AI Engine tab |
| Drag | Rotate |
| Mouse wheel | Zoom |

### Step 7. Switch to your own vault

1. In the terminal from Step 5, press `Ctrl + C` to stop the viewer.
2. Run the Step 4 command again, but replace the sample path (`skills/obsidian-brain-3d/examples/sample-vault`) with **the path to your vault folder**.
3. Then do Steps 5 and 6 again.

Windows example:

```
node skills/obsidian-brain-3d/scripts/build-data.mjs "C:\Users\YourName\Documents\My Vault" --site brain-site
```

Mac example:

```
node skills/obsidian-brain-3d/scripts/build-data.mjs "/Users/YourName/Documents/My Vault" --site brain-site
```

**Finding your vault path**

- **Easiest**: drag your vault folder onto the terminal window, and the path is typed in for you.
- **Windows**: click the File Explorer address bar and copy it.
- **Mac**: select the folder in Finder and press `Option + Command + C` to copy its path.

> **Note**
> - If the path contains spaces, wrap it in double quotes `" "`. Folder names in other languages (such as Korean) work as they are.
> - An Obsidian vault is a folder that contains a hidden folder named `.obsidian`.
> - On a Mac, a vault stored in iCloud is usually at `"$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/VaultName"`.

### Step 8. Turn it off

Click the terminal running the viewer and press `Ctrl + C` (also `control + C` on Mac).

- To view it again later, just do Step 5.
- If you've added notes, start again from Step 4 (Step 7 for your own vault).

## Nothing shows up?

Check these 3 things first.

**1. Is the terminal from Step 5 still running?**

You should see the `serving ...` text. If you closed the window or pressed `Ctrl + C`, do Step 5 again.

If it says `Port 8770 is busy`, add a different number at the end:

```
node skills/obsidian-brain-3d/scripts/serve.mjs brain-site 8771
```

Then change the address to `http://127.0.0.1:8771/` as well.

**2. Is the address exactly right?**

It's `http`, not `https`, and you need the `:8770/` at the end. Double-clicking `index.html` to open it may be blocked depending on your browser settings, so always use this address.

**3. Only a black screen?**

- Hard-refresh with `Ctrl + F5` (`Command + Shift + R` on Mac) and try the latest Chrome or Edge.
- The viewer may not appear in browsers where 3D drawing (WebGL) is turned off, or over a remote-desktop connection.
- In Chrome, go to Settings → System and turn on "Use graphics acceleration when available".

**Other common messages**

| Message | What it means | What to do |
| --- | --- | --- |
| `Folder not found` (Step 4) | The path is wrong or the quotes are missing | Check the path and wrap it in `" "` |
| `no .md files found` | That folder has no notes (`.md` files) | Point to the folder that holds your notes |
| `Cannot find module` | You typed the command outside the folder from Step 3 | `cd` back into that folder |

> **Note**
> With thousands of notes, the first build can take a few dozen seconds.

## AI Engine tab

<p align="center"><img src="skills/obsidian-brain-3d/docs/preview-ai.png" alt="AI Engine tab: tool tiles connected to the central brain by streams of light" width="100%"></p>

You list your tools under `aiTools` in `config.js` inside the output folder (`brain-site`).

```js
aiTools: [
  { id: 'obsidian', name: 'Obsidian', sub: '노트 보관함', color: '#a87bff', match: 'obsidian|옵시디언' },
  { id: 'claude',   name: 'Claude',   sub: '글쓰기 · 코딩', color: '#ff8a5c', match: 'claude|클로드' }
]
```

**What each field means**

| Field | Meaning |
| --- | --- |
| `name` | The tool name shown on the tile |
| `sub` | The small caption under the name. In this example it is Korean for "note vault" and "writing · coding"; you can write it in any language. |
| `color` | The tile color |
| `match` | **The word(s) used to find the tool's name** in note titles. Join several with `\|` (a vertical bar meaning "or"). |

For example, `'claude|클로드'` counts notes whose **title** contains "claude" or "클로드" (Claude written in Korean).

- Upper and lower case don't matter, and note bodies are not searched.
- Only the number of notes that actually match is shown; no numbers are made up.
- The flow log at the bottom is an animation that shows real note titles one after another.

**Other settings**

- Set `aiTools: []` to remove the tab.
- Rename the tab with `aiTabName` (default 「AI 엔진」, Korean for "AI Engine"; like the other tabs, its button adds an English word: 「AI 엔진 ENGINE」).
- Add `?mode=ai` to the address to open straight into this tab.

> **Note**
> `match` is technically a regular expression (a pattern-matching rule), so symbols like `. * ( ) [ ] \` have special meanings. If you only use plain words and `|`, you don't need to worry about this.

## What do I need?

**Just one folder of `.md` files.** You don't strictly need the Obsidian app or an AI-maintained "LLM wiki".

That said, the viewer looks much richer when your notes:

- link to each other with `[[links]]`,
- are organized by folder or by a `type` field in the front matter (the small settings block at the top of a note),
- and have a `created` date.

If you only have a few notes, [SKILL.md](skills/obsidian-brain-3d/SKILL.md#노트가-아직-적다면-llm-위키처럼-키우기) (in Korean) explains how to ask your AI agent to tidy them up and link them first.

> **Tip**
> If you'd like to start, like the author, with a knowledge base that an AI keeps organized for you, build your vault with [obsidian-llm-wiki](https://github.com/reedodev/obsidian-llm-wiki) first and then draw it with this skill.

## Changing the look

Everything is changed in one file: `config.js` in the output folder. Just tell your agent things like:

- "open in the world tree view first"
- "make the background outer space"
- "brain only, no skull"
- "use warm colors for the regions"
- "add Cursor to the AI tab"

To try something without editing the file, add options to the end of the address:

```
?mode=tree&bg=space&skull=0
```

For the AI tab, use `?mode=ai`. A table matching what you can say to each setting is in [SKILL.md](skills/obsidian-brain-3d/SKILL.md#모양-바꾸기-이렇게-말하세요) (in Korean; the setting names are in English).

## Before sharing

The viewer data file (`data.js`) does not contain your note bodies, but it does contain titles, group names and dates as they are.

> **Warning**
> Before posting screenshots of a private vault or publishing the viewer, rebuild with `--hide-titles --hide-groups` added to the end of the Step 4 command.

After that, note titles become `그룹 #번호` ("Group #number") and group names become `Group A` to `Group F`. More precautions are listed in [SKILL.md](skills/obsidian-brain-3d/SKILL.md#공개할-때-주의) (in Korean).

## Install

"Your first 5 minutes" above is the type-the-commands-yourself way. If you use Claude Code (an AI assistant that runs in your terminal), you can install this as a skill and simply ask, for example, "show my Obsidian notes as a brain".

**Requirements**: Node.js 18 or later and a web browser (Chrome, Edge or Safari).

### Option 1. Install as a Claude Code plugin

Type these into the Claude Code chat:

```
/plugin marketplace add reedodev/obsidian-brain-3d
/plugin install obsidian-brain-3d@obsidian-brain-3d
```

To do the same from a regular terminal instead of the chat, run `claude plugin marketplace add reedodev/obsidian-brain-3d` and then `claude plugin install obsidian-brain-3d@obsidian-brain-3d`.

If `claude plugin list` shows `obsidian-brain-3d ... enabled`, it's installed.

### Option 2. Just copy the folder

Mac / Linux:

```bash
git clone https://github.com/reedodev/obsidian-brain-3d.git
mkdir -p ~/.claude/skills
cp -r obsidian-brain-3d/skills/obsidian-brain-3d ~/.claude/skills/
```

Windows PowerShell:

```powershell
git clone https://github.com/reedodev/obsidian-brain-3d.git
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse obsidian-brain-3d\skills\obsidian-brain-3d "$HOME\.claude\skills\"
```

## Quick try (for experienced users)

```bash
node skills/obsidian-brain-3d/scripts/build-data.mjs skills/obsidian-brain-3d/examples/sample-vault --site ./brain-site
node skills/obsidian-brain-3d/scripts/serve.mjs ./brain-site      # http://127.0.0.1:8770/
```

The full procedure, options and limitations are in [SKILL.md](skills/obsidian-brain-3d/SKILL.md) (written in Korean). Your agent reads that file and follows it step by step.

## Tests

`node tests/run.mjs` does three things:

1. checks the SKILL.md format,
2. checks every link, heading anchor and image path in both READMEs,
3. actually runs the scripts on the sample files.

GitHub Actions runs the same tests on every push (the test badge above).

<!-- credits -->
## Credits and inspiration

- **How it started and the visual idea**: It began with an [X post](https://x.com/karlarboledas/status/2111838109029552334) introducing [graphify](https://github.com/Graphify-Labs/graphify), which turns a folder into a knowledge graph, and the brain-shaped dashboard video in that post, which made me wonder, "Could my notes look like a brain too?" No graphify code or design files from that video were used; the viewer was built from scratch with three.js. To keep it from looking like a copy, it went in a different direction: x-ray, skull and world tree.
- **How the vault is organized**: The author's vault follows Andrej Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) approach, and that structure is documented in [obsidian-llm-wiki](https://github.com/reedodev/obsidian-llm-wiki).
- **Links as lines in a graph**: Like Obsidian's Graph view, each `[[link]]` is drawn as a line.
- **AI Engine tab**: The layout of tool tiles connected to a glowing central core by particle streams was inspired by an "AI setup" dashboard post by @yungeonu11 on Threads. No code, images or design files from that post were used, and the tool icons are abstract shapes, not product logos. No sound or music files are included.
- **3D models and libraries**: The brain and skull models come from NIH 3D (CC BY 4.0), and 3D rendering uses three.js (MIT). Full details are in [CREDITS.md](skills/obsidian-brain-3d/viewer/CREDITS.md).

## About the author

**Reedo**, an engineer with 20 years of experience who is learning AI hands-on, mistakes and all. This skill grew out of handing work to AI every day and fixing whatever got stuck along the way.

[YouTube @Reedodev](https://www.youtube.com/@Reedodev) · [Threads @reedo.dev](https://www.threads.com/@reedo.dev) · [GitHub @reedodev](https://github.com/reedodev)

**Other skills by the same author**

- [Check your notes first (vault-recall)](https://github.com/reedodev/vault-recall)
- [Turn work logs into lecture decks (work-to-lecture-deck)](https://github.com/reedodev/work-to-lecture-deck)
- [Korean tone check (korean-tone-check)](https://github.com/reedodev/korean-tone-check)
- [Naver "golden keywords" finder (naver-golden-keywords)](https://github.com/reedodev/naver-golden-keywords)
- [Fill Korean HWPX forms (hwpx-form-fill)](https://github.com/reedodev/hwpx-form-fill)
- [Fix clipped TTS endings (tts-tail-fix)](https://github.com/reedodev/tts-tail-fix)
- [Render card news from HTML (html-card-render)](https://github.com/reedodev/html-card-render)
- [Social video aspect-ratio check (social-video-gate)](https://github.com/reedodev/social-video-gate)
- [YouTube publishing checklist (youtube-publish-checklist)](https://github.com/reedodev/youtube-publish-checklist)

## License

MIT License ([LICENSE](LICENSE)). The bundled 3D models and libraries keep their own licenses ([CREDITS.md](skills/obsidian-brain-3d/viewer/CREDITS.md)).
