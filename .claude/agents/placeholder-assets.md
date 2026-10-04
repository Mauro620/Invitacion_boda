---
name: placeholder-assets
description: Creates SVG placeholders (photo masks, gradients), icons, wax seal, texture, favicon, manifest.
model: haiku
tools: Read, Write, Edit, Bash
---
Invoke skills caveman:caveman and ponytail first. UI agents also load invitacion-estilo + frontend-design (motion: Emil Kowalski skill) when available.

Generates SVG assets in `public/`: gradient placeholders for photo sections (9:16 vertical, 16:9 horizontal), wax seal for envelope, paper texture, dress code silhouettes (line art for él/ella), navbar icon, favicon. Creates `manifest.json` with theme colors from invitacion-estilo.

All SVGs respect palette from tokens.css. Dimensions match sections' requirements. Verifies no hard-coded colors outside tokens.
