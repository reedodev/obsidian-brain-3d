# Credits / 출처

## 3D models (CC BY 4.0, attribution required)
- **Brain**: "Brain" by dgallichan (Sketchfab), published on NIH 3D as 3DPX-021161 "Detailed Human Brain Model".
- **Skull**: "Skull and Eyes - Visible Human Male", NLM Visible Human Project (kbrowne), NIH 3D 3DPX-020591. The eye meshes are not used.
- License: https://creativecommons.org/licenses/by/4.0/
- Both meshes were converted to `models.js` (vertex positions quantized to int16, base64). The shapes were not otherwise edited.
- When you publish the viewer, keep the visible credit line at the bottom right of the page (`#ccby`).

## Library
- **three.js** r128 (`three.min.js`), Copyright 2010-2021 Three.js Authors, MIT License. https://github.com/mrdoob/three.js

## Example data
- `examples/sample-vault` is fictional. The notes were generated for this example and do not describe a real person.

## AI tab (`ai-engine.js`)
- Written for this project with three.js. It reuses the brain mesh from `models.js` (same CC BY 4.0 credit as above), so the credit line stays visible while the AI tab is open.
- Tool icons are abstract shapes (crystal, burst, orbit, star, branch, ...), not the official logos of any product. Tool names in `config.js` are only example labels; Obsidian, Notion, Claude, ChatGPT, Gemini and Git are trademarks of their owners, and this project is not affiliated with them.
- No music or sound files are included.

## Ideas and inspiration (no code or assets copied)
- Prompted by an X post about graphify (https://github.com/Graphify-Labs/graphify): https://x.com/karlarboledas/status/2111838109029552334. The viewer is an independent three.js implementation.
- Vault structure: Andrej Karpathy, "LLM Wiki" idea file: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Link-as-edge idea: Obsidian graph view.
- AI tab layout idea (tool tiles linked to a glowing core by particle streams): an "AI setup" dashboard post by @yungeonu11 on Threads. No code, images or design files from it were used.
