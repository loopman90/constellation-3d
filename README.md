# Constellation 3D

Constellation 3D turns the links between your Obsidian notes into an interactive, animated 3D space. Each note is a node; links between notes are the lines connecting them. Move through the space, follow paths, and spot the folders and notes that shape your knowledge network.

The plugin reads Obsidian's local note and link metadata. It does not edit your notes or send vault data to a server.

## What you can do

- **Explore your graph:** switch between the whole vault, notes around the active note, and the active note's direct neighbors. Set how far local exploration reaches.
- **Find notes:** search by note name, then narrow the graph by folder, tag, last-modified date, or minimum number of connections.
- **See folders as clusters:** group notes by their top-level folder or full folder path, adjust how far clusters sit from each other and how far apart notes appear, color clusters, show cluster halos, hide a cluster from its context menu, rotate clusters independently, or let the camera tour them.
- **Choose a visual style:** switch among Constellation, Timeline Map, Mind Palace, Circuit Minimal, Archive Fog, Focus Lens, Thread Weaver, Research Board, Signal Radar, Matrix Hacker, Star Map, Aqua Mint, Deep Space, Neon, Minimal, Soft Glow, Neural Bloom, Satellite View, Glass Minimal, Academic Light, and Ink Map. Styles change the scene, layout, colors, node shapes, or connections to create distinct ways to view your vault.
- **Animate and tune the space:** choose 3D orbit, Cluster orbit, Cluster tour, or Floating notes. Pick a nebula, aurora, star-map grid, or deep-void background; tune star particles; and choose flowing particles, pulses, drawing lines, or moving dashes for links and route previews. Adjust color palettes, perspective depth, camera and animation speed, drift, glow, and reduced motion.
- **Take a guided journey:** browse recent or forgotten notes, hubs, hidden gems, and orphans. Start automatic travel or move one note at a time.
- **Inspect and organize visually:** click a node to open its note; hover to highlight direct neighbors; right-click to pin or hide a note, or preview a route through linked notes.
- **Personalize the view:** use visual presets and color schemes, then adjust labels, node icons, depth guide rings, cluster halos, node size, link thickness, and the FPS display.
- **Keep the view uncluttered:** hide or show the Quick Menu with its button, and turn the bottom Vault Notes counter on or off in Display settings.
- **Arrange the canvas:** drag a note node to reposition it, drag the background to orbit the 3D view, or switch to **Pan mode** to move the whole canvas. Scroll to zoom; **Fit Network** resets the view.

## Install in Obsidian

No coding, terminal, or build tools are needed.

1. **Download the plugin files.** Open the [latest release](https://github.com/loopman90/constellation-3d/releases/latest) and download `main.js`, `manifest.json`, and `styles.css` from its **Assets** list. Your browser may ask where to save each file; save all three somewhere easy to find, such as your Downloads folder.
2. **Open your vault's plugin folder.** In your file manager, open the folder where your Obsidian vault is stored. Show hidden files if needed, then open `.obsidian`, then `plugins`. If there is no `plugins` folder, create one.
   - **Mac:** In Finder, press `Command` + `Shift` + `.` to show hidden files.
   - **Windows:** In File Explorer, choose **View → Show → Hidden items**.
3. **Install the plugin.** Inside `.obsidian/plugins`, create a folder named exactly `constellation-three-d`. Move the three downloaded files directly into that folder. Do not put them in another folder inside it. The final layout must be:

   ```text
   Your vault/
   └── .obsidian/
       └── plugins/
           └── constellation-three-d/
               ├── main.js
               ├── manifest.json
               └── styles.css
   ```

   If you are updating an existing installation, replace the old `constellation-three-d` folder with the new one.
4. **Enable it.** Restart Obsidian. Open **Settings → Community plugins**. If **Restricted mode** is enabled, turn it off and confirm. Under **Installed plugins**, turn on **Constellation 3D**.
5. **Open the graph.** Open the command palette with `Command` + `P` on Mac or `Ctrl` + `P` on Windows. Search for **Open Constellation 3D** and select it. You can also click its orbit icon in the left ribbon.

For the illustrated walkthrough and troubleshooting tips, visit the [installation guide](https://loopman90.github.io/constellation-3d/).

### If it does not appear

- Check that the folder is named exactly `constellation-three-d` and that `manifest.json` is directly inside it, not one folder deeper.
- Confirm that you copied it into the `.obsidian/plugins` folder for the vault you currently have open.
- Restart Obsidian, then check **Settings → Community plugins → Installed plugins** again.
- If the graph is empty, link notes with Obsidian's `[[double brackets]]` syntax and press **Refresh** in Constellation 3D.

## Controls and settings

- Drag a note to move it. Drag empty space to rotate; choose **Pan mode** in the Quick Bar to move the canvas instead. Scroll to zoom.
- Use **Start Travel**, **‹**, and **›** for automatic or manual note journeys.
- Click a node to open the note. Right-click for pin, hide, and route-preview actions.
- Open **Settings → Constellation 3D** to adjust Graph, Visual, Background, Motion, Discovery, Journey, and Display settings, including cluster and note spacing, cluster grouping, particles, route animation, perspective depth, node icons, depth layers, and cluster halos.

## Releases and development

Every push to `main` automatically increments the patch version in `manifest.json` and `versions.json`, creates a matching Git tag and GitHub Release, publishes `main.js`, `manifest.json`, and `styles.css`, and creates GitHub artifact attestations for those files. The bot's version commit does not trigger another release.

The installation guide is in `site/` and deploys through `.github/workflows/pages.yml`. The plugin is plain JavaScript and requires no build step.
