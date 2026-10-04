# Constellation 3D

Constellation 3D turns the links between your Obsidian notes into an interactive, animated 3D space. Each note is a node; links between notes are the lines connecting them. Move through the space, follow paths, and spot the folders and notes that shape your knowledge network.

The plugin reads Markdown note paths, modification times, tags, and Obsidian's local resolved links to build the graph and counters. It uses Obsidian's metadata cache for note links and cached tag fields; it does not read note bodies or send vault data to a server. It uses the cached links to find connected notes. It enumerates all Markdown notes only when **Include floating notes** is enabled (off by default) or **Orphan Hunt** is selected, since those features need to find unlinked notes.

## What you can do

- **Explore your graph:** switch between the whole vault, notes around the active note, and the active note's direct neighbors. Set how far local exploration reaches.
- **Find notes:** search by note name, then narrow the graph by folder, tag, last-modified date, or minimum number of connections. Folder filters are case-insensitive path matches; tag filters match note tags and frontmatter tags.
- **See notes as clusters:** group notes by top-level folder, full folder path, or first tag; arrange the groups as islands, a grid, or a spiral; and adjust cluster and note spacing. Cross-cluster links are highlighted. Right-click any note to collapse or expand its cluster, isolate that cluster, or hide it.
- **Choose a visual style:** switch among Constellation, Timeline Map, Mind Palace, Circuit Minimal, Archive Fog, Focus Lens, Thread Weaver, Research Board, Signal Radar, Matrix Hacker, Star Map, Star System, Aqua Mint, Deep Space, Neon, Minimal, Soft Glow, Neural Bloom, Satellite View, Glass Minimal, Academic Light, and Ink Map. In Star System, notes appear as stars while folder clusters become planets with orbit rings. Choose the Star System preset for matching galaxy colors, nebula, and cluster-orbit motion.
- Visual styles change the graph's layout, note marker shapes, connection paths, backdrop, and focus or glow effects. Color schemes are independent and recolor the graph without replacing the selected visual style. Black and white backgrounds stay flat, while the note marker shapes and layouts still respond to the visual style.
- **Choose colors independently:** pick from profiles such as Age Gradient, Aqua Mint, Archive Dust, Arctic, Blueprint, Candy, City Nights, Cluster Neon, Constellation White, Copper Blue, Crystal, Cyberpunk, Electric Lime, Focus Fade, Glacier, Graphite, High Contrast, Infrared, Ink, Lava, Library Night, Meadow, Midnight Gold, Moss & Gold, Night Vision, Nord, Ocean Depths, Ocean Sunset, Paper Minimal, Pearl, Polar Night, Prism Flow, Red Alert, Rose Garden, Ruby Graph, Sepia Archive, Signal Strength, Soft Lavender, Solar System, Solarized, Star Map, Vaporwave, Violet Storm, and Zen Garden, alongside the existing palettes. Single-hue profiles keep a consistent color family; age, connection, and cluster profiles vary colors to show their data. Set custom HEX colors and Rainbow Flow speed in the Control Panel.
- **Animate and tune the space:** Static Camera is the default and keeps the view still until you move it. You can choose 3D camera orbit, Spaceflight to fly through notes with moving star streaks, notes orbiting clusters, a cluster camera tour, moving notes, Swarm, Chaos, or Blob Order from the Quick Menu or Control Panel. Choosing a moving style enables animation; Reduce Motion pauses note movement. Pick Nebula, Aurora, Deep Space Grid, Deep Void, Starfield, Horizon Perspective, Depth Bands, Topographic Contours, Blueprint Grid, Warm Paper, Black, or White. FAR, MID, and NEAR perspective guides help show distance. Tune star particles; choose flowing particles, pulses, drawing lines, or moving dashes for links and route previews. Link animations follow real note links, including those between clusters, and selecting one starts animation automatically. Connections between separate Obsidian vaults are not available because each graph shows one vault at a time. Tune color palettes, perspective depth, camera and animation speed, note movement distance, glow, and reduced motion.
- **Control settings in the graph:** use the Quick Menu for animation, Control Panel, Fit Network, Optimize View, Refresh, Note Path, and Clear Path actions. In **Control Panel → Interface → Quick Menu buttons**, choose which controls and selectors appear. Compact action buttons use icons with descriptive tooltips and accessible labels. The in-view **Control Panel** groups settings into Camera, Performance, Appearance, Graph, Motion, Discovery, Interface, and Hidden Items, so you can adjust the view without leaving the graph.
- **Use keyboard controls:** with the graph focused, press **← / →** to rotate, **↑ / ↓** to tilt, **+ / −** to zoom, and **W / A / S / D** to pan. Press **Space** to pause or resume animation, **F** to fit the network, **O** to optimize the view, **R** to refresh, or **Esc** to close the Control Panel. Hold **Shift** with an arrow key for a larger camera step. Shortcuts are ignored while typing in an input, dropdown, or button.
- **Take a guided journey:** browse recent or forgotten notes, hubs, hidden gems, and orphans. Start automatic travel or move one note at a time.
- **Inspect and organize visually:** click a node to open its note; hover to highlight direct neighbors; right-click to pin or hide a specific note or its folder cluster, or preview a route through linked notes. Restore items individually from **Hidden items** in the Control Panel.
- **Personalize the view:** use visual presets and color schemes, then adjust labels, node icons, the **FAR / MID / NEAR depth rings**, cluster halos, node size, link thickness, and the FPS display. Turn the whole scene background or its particles off independently.
- **Disable effects independently:** pause all animation, or turn off moving notes, animated links, route motion, and animated color profiles separately in Control Panel → Motion. This lets camera movement continue while individual effects stay still.
- **Customize the interface:** turn the header, graph title, node/link totals, Quick Menu, and bottom dashboard on or off. Choose each Quick Menu button and selector independently, then show only the counters and recent changes you want, alongside the existing label, link, icon, depth, and halo controls.
- **Keep large graphs responsive:** choose **Auto**, **Balanced**, or **Performance** under Control Panel → Performance → Rendering quality. Auto adapts node and link detail to graph size and drawing time; balanced modes keep active, pinned, route, and cluster representative notes visible. Enable **Performance metrics** under Performance to see graph build time, draw time, and the current quality. Search waits briefly until you pause typing before rebuilding the graph. For extra smoothness, pause animation or turn down background particles and link display.
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
- Choose **Spaceflight** to fly the camera along linked notes while star streaks rush outward from the center. Choose **Swarm**, **Chaos**, or **Blob Order** for additional note movement styles. **Notes Orbit Clusters** and **Moving Notes** are also available; use the **Animation** button to pause or resume movement.
- Notes can be grouped by top-level folder, full folder path, or first tag. Groups appear as spaced cluster islands by default; choose a grid or spiral under **Control Panel → Graph → Cluster arrangement**. Cross-cluster note links are highlighted so you can follow connections between groups.
- Click **Note Path** in the Quick Menu, then click a start note and a destination note to highlight the shortest linked route. Click **Clear Path** to remove it. Route highlights remain visible when regular links are hidden.
- **Animate a route:** choose **Glow**, **Traveling comet**, **Draw the route**, or **Moving dashes** under **Control Panel → Motion → Route animation**. Route motion continues when the general 3D animation is paused; **Reduce motion** pauses it.
- Click a node to open the note. Right-click for pin, hide, and route-preview actions.
- Click **Control Panel** in the graph toolbar to adjust Camera, Performance, Appearance, Graph, Motion, Discovery, Interface, and Hidden Items settings without opening Obsidian's main settings. The groups are collapsible; Camera, Performance, and Motion open first, while Appearance and Graph are available when needed. Plugin configuration is also available under **Settings → Constellation 3D**.

## Releases and development

Every push to `main` automatically increments the patch version in `manifest.json` and `versions.json`, creates a matching Git tag and GitHub Release, publishes `main.js`, `manifest.json`, and `styles.css`, and creates GitHub artifact attestations for those files. The bot's version commit does not trigger another release.

The installation guide is in `site/` and deploys through `.github/workflows/pages.yml`. The plugin is plain JavaScript and requires no build step.
