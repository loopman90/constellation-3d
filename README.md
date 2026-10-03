# Constellation 3D

Constellation 3D is an Obsidian community-plugin prototype inspired by Constella's graph controls and the supplied video. It turns the current vault's resolved note links into an animated, interactive 3D note space.

## Current scope

- Global, Local, and Current note graph scopes, with configurable local depth.
- Search, folder and tag filters, modified-date filters, minimum link count, and floating-note controls.
- Discovery modes for Wander, Path Journey, Recent Activity, Forgotten Knowledge, Hub Explorer, Hidden Gems, and Orphan Hunt.
- Automatic note travel plus previous/next navigation; click a note to open it.
- Right-click notes to pin or hide them, start route previews, or restore hidden notes.
- Hover a note to highlight its direct neighbors; route previews are highlighted in the graph.
- 3D animation styles: full-space orbit, folder-cluster orbit, timed cluster tour, drifting notes, and particles traveling along links.
- Folder cluster colors, with cluster layout based on the top-level folder in each note path.
- Visual presets, animation and camera speed, cluster visit interval, drift amount, link pulse speed, reduce-motion, glow, node/label size, line thickness, and FPS display.
- Vault counts and recent local create, edit, and delete activity.
- Refresh and fit controls, with no remote services or AI-agent claims.

This prototype does not run or control AI agents. Agent orchestration and external telemetry would need a separately designed integration.

## Install for local development

Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/constellation-three-d/`, then enable **Constellation 3D** under **Settings → Community plugins**. The plugin is plain JavaScript and needs no build step.

For a visual, step-by-step installation walkthrough, visit the [Constellation 3D installation guide](https://loopman90.github.io/constellation-3d/).

## GitHub Pages

The installation guide lives in `site/` and is deployed from the `main` branch by the workflow in `.github/workflows/pages.yml`. In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once, then future changes to `site/` deploy automatically.

Every push to `main` automatically increments the patch version in `manifest.json` and `versions.json`, creates a matching Git tag and GitHub Release, and attaches a ready-to-install `constellation-3d.zip`. The bot's version commit does not trigger another release.

## Controls

- Drag to rotate the 3D space.
- Use the search field, scope selector, and mode selector in the Quick Bar to filter and explore.
- Use **Start Travel**, **‹**, and **›** for automatic and manual note journeys.
- Click a note to open it. Right-click for pin, hide, or route-preview actions.
- Open **Settings → Constellation 3D** for the Graph, Visual, Motion, Discovery, Journey, and Display sections.
- In **Motion**, choose a 3D animation style. Cluster modes group notes by their top-level folder; Cluster tour moves the camera between those groups.

Settings are stored locally by Obsidian. The graph reads vault metadata and does not modify notes or send data to a remote service.
