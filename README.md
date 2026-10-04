# Constellation 3D

Constellation 3D turns the links between your Obsidian notes into an interactive, animated 3D space. Each note is a node; links between notes are the lines connecting them. Move through the space, follow paths, and spot the folders and notes that shape your knowledge network.

The plugin reads Markdown note paths, modification times, tags, and Obsidian's local resolved links to build the graph and counters. It uses Obsidian's metadata cache for note links and cached tag fields; it does not read note bodies or send vault data to a server. It uses the cached links to find connected notes. It enumerates all Markdown notes only when **Include floating notes** is enabled or **Orphan Hunt** is selected, since those features need to find unlinked notes.

## What you can do

- **Explore your graph:** switch between the whole vault, notes around the active note, and the active note's direct neighbors. Set how far local exploration reaches.
- **Find notes:** search by note name, then narrow the graph by folder, tag, last-modified date, or minimum number of connections. Folder filters are case-insensitive path matches; tag filters match note tags and frontmatter tags.
- **See folders as clusters:** group notes by their top-level folder or full folder path, adjust cluster and note spacing, and show cluster halos. Right-click any note to collapse or expand its cluster, isolate that cluster, or hide it. Click a collapsed cluster summary to expand it; right-click an isolated cluster and choose **Show all clusters** to return to the full graph.
- **Choose a visual style:** switch among Constellation, Timeline Map, Mind Palace, Circuit Minimal, Archive Fog, Focus Lens, Thread Weaver, Research Board, Signal Radar, Matrix Hacker, Star Map, Star System, Aqua Mint, Deep Space, Neon, Minimal, Soft Glow, Neural Bloom, Satellite View, Glass Minimal, Academic Light, and Ink Map. In Star System, notes appear as stars while folder clusters become planets with orbit rings. Choose the Star System preset for matching galaxy colors, nebula, and cluster-orbit motion.
- **Choose colors independently:** pick Aurora, Rainbow Flow, Deep Ocean, Monochrome, Sunset, Forest, Pastel, Custom Palette, Tag Based, Folder Based, Cluster Based, Animated Gradient, Heatmap, Age Gradient, Age Based, Galaxy Core, Terminal Amber, Violet Cosmos, Solar Ember, Single Color, Dual Color, Multi Color, Gradient, Rainbow, Connection Count, or Activity Based. Set custom HEX colors and Rainbow Flow speed in the Control Panel.
- **Animate and tune the space:** choose 3D camera orbit, notes orbiting clusters, a camera tour of clusters, or independently moving notes from the Quick Menu or Control Panel. Choosing a style enables animation; Reduce Motion remains available to pause movement. Pick a nebula, aurora, deep-space grid, deep void, solid black, or solid white background; tune star particles; and choose flowing particles, pulses, drawing lines, or moving dashes for links and route previews. Adjust color palettes, perspective depth, camera and animation speed, note movement distance, glow, and reduced motion.
- **Control settings in the graph:** use the Quick Menu for animation, Control Panel, Fit Network, Optimize View, Refresh, Note Path, and Clear Path actions. The in-view **Control Panel** groups settings into Camera, Appearance, Graph, Motion, Discovery, Interface, and Hidden Items, so you can adjust the view without leaving the graph. Set camera rotation, tilt, and zoom directly, resume automatic camera movement, or reset the view.
- **Use keyboard controls:** with the graph focused, press **← / →** to rotate, **↑ / ↓** to tilt, **+ / −** to zoom, and **W / A / S / D** to pan. Press **Space** to pause or resume animation, **F** to fit the network, **O** to optimize the view, **R** to refresh, or **Esc** to close the Control Panel. Hold **Shift** with an arrow key for a larger camera step. Shortcuts are ignored while typing in an input, dropdown, or button.
- **Take a guided journey:** browse recent or forgotten notes, hubs, hidden gems, and orphans. Start automatic travel or move one note at a time.
- **Inspect and organize visually:** click a node to open its note; hover to highlight direct neighbors; right-click to pin or hide a specific note or its folder cluster, or preview a route through linked notes. Restore items individually from **Hidden items** in the Control Panel.
- **Personalize the view:** use visual presets and color schemes, then adjust labels, node icons, depth guide rings, cluster halos, node size, link thickness, and the FPS display.
- **Customize the interface:** turn the header, graph title, node/link totals, Quick Menu, and bottom dashboard on or off. Show only the counters and recent changes you want, alongside the existing label, link, icon, depth, and halo controls.
- **Keep large graphs responsive:** search waits briefly until you pause typing before rebuilding the graph. Large graphs automatically use a lighter drawing mode; in very large graphs, up to 12,000 of the strongest links are drawn. Link animation runs on a representative sample; required route links are also kept visible.
- **Arrange the canvas:** drag a note node to reposition it, drag the background to orbit the 3D view, or switch to **Pan mode** to move the whole canvas. Scroll to zoom; **Fit Network** resets the view, while **Optimize View** automatically frames all currently visible notes.

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

- Drag a note to move it. Drag empty space to rotate; choose **Pan mode** in the Quick Bar to move the canvas instead. Scroll to zoom, or use the Control Panel's **Camera** sliders for precise rotation, tilt, and zoom.
- Click **Optimize View** to center and scale the currently visible graph. Right-click a note to hide that note or its cluster; use the Control Panel's **Hidden items** section to restore individual items or show everything again.
- Right-click a note and choose **Collapse cluster** to replace its folder's notes with one summary node. Click the summary or choose **Expand cluster** to restore its notes. Choose **Isolate cluster** to focus on one folder, then right-click it and choose **Show all clusters** to return to the full graph.
- Use **Start Travel**, **‹**, and **›** for automatic or manual note journeys.
- Choose **Notes Orbit Clusters** or **Moving Notes** in the Quick Menu to animate note movement; use the **Animation** button to pause or resume it.
- Click **Note Path** in the Quick Menu, then click a start note and a destination note to highlight the shortest linked route. Click **Clear Path** to remove it. Route highlights remain visible when regular links are hidden.
- **Animate a route:** choose **Glow**, **Traveling comet**, **Draw the route**, or **Moving dashes** under **Control Panel → Motion → Route animation**. Route motion continues when the general 3D animation is paused; **Reduce motion** pauses it.
- Click a node to open the note. Right-click for pin, hide, and route-preview actions.
- Click **Control Panel** in the graph toolbar to adjust Camera, Appearance, Graph, Motion, Discovery, Interface, and Hidden Items settings without opening Obsidian's main settings. The groups are collapsible; Camera and Appearance open first. Plugin configuration is also available under **Settings → Constellation 3D**.

## Releases and development

Every push to `main` automatically increments the patch version in `manifest.json` and `versions.json`, creates a matching Git tag and GitHub Release, publishes `main.js`, `manifest.json`, and `styles.css`, and creates GitHub artifact attestations for those files. The bot's version commit does not trigger another release.

The installation guide is in `site/` and deploys through `.github/workflows/pages.yml`. The plugin is plain JavaScript and requires no build step.
