const { Plugin, PluginSettingTab, Setting, ItemView, Menu, Notice, setIcon } = require('obsidian');

const VIEW_TYPE = 'swarm-console-graph';
const COLOR_SCHEME_OPTIONS = {
	'age-gradient': 'Age Gradient', 'aqua-mint': 'Aqua Mint', 'archive-dust': 'Archive Dust', arctic: 'Arctic', aurora: 'Aurora',
	blueprint: 'Blueprint', candy: 'Candy', 'city-nights': 'City Nights', clusters: 'Cluster Based', 'cluster-neon': 'Cluster Neon',
	'constellation-white': 'Constellation White', 'copper-blue': 'Copper Blue', crystal: 'Crystal', cyberpunk: 'Cyberpunk',
	'dark-mode': 'Dark Mode', 'deep-ocean': 'Deep Ocean', 'electric-lime': 'Electric Lime', 'ember-profile': 'Ember',
	'focus-fade': 'Focus Fade', forest: 'Forest', 'galaxy-core': 'Galaxy Core', glacier: 'Glacier', graphite: 'Graphite',
	heatmap: 'Heatmap', 'high-contrast': 'High Contrast', infrared: 'Infrared', ink: 'Ink', lava: 'Lava',
	'library-night': 'Library Night', meadow: 'Meadow', 'midnight-gold': 'Midnight Gold', mint: 'Mint', 'moss-gold': 'Moss & Gold',
	'night-vision': 'Night Vision', nord: 'Nord', 'notebook-blue': 'Notebook Blue', 'ocean-depths': 'Ocean Depths',
	'ocean-sunset': 'Ocean Sunset', 'paper-minimal': 'Paper Minimal', pastel: 'Pastel', pearl: 'Pearl', 'polar-night': 'Polar Night',
	'prism-flow': 'Prism Flow', 'rainbow-flow': 'Rainbow Flow', 'red-alert': 'Red Alert', 'rose-garden': 'Rose Garden',
	'ruby-graph': 'Ruby Graph', 'sepia-archive': 'Sepia Archive', 'signal-strength': 'Signal Strength',
	'soft-lavender': 'Soft Lavender', 'solar-system': 'Solar System', solarized: 'Solarized', 'star-map': 'Star Map', sunset: 'Sunset',
	'terminal-amber': 'Terminal Amber', vaporwave: 'Vaporwave', 'violet-storm': 'Violet Storm', 'zen-garden': 'Zen Garden',
	'activity-based': 'Activity Based', 'age-based': 'Age Based', 'animated-gradient': 'Animated Gradient', 'connection-count': 'Connection Count',
	'custom-palette': 'Custom Palette', 'dual-color': 'Dual Color', 'folder-based': 'Folder Based', gradient: 'Gradient',
	'multi-color': 'Multi Color', monochrome: 'Monochrome', rainbow: 'Rainbow', 'single-color': 'Single Color',
	'tag-based': 'Tag Based', ember: 'Solar Ember', violet: 'Violet Cosmos',
};
const COLOR_PROFILE_CONFIG = {
	'aqua-mint': { hue: 164, step: 13, saturation: 0.72, lightness: 0.59 },
	'archive-dust': { hue: 32, step: 18, saturation: 0.37, lightness: 0.66 },
	arctic: { hue: 198, step: 11, saturation: 0.48, lightness: 0.76 },
	aurora: { hue: 174, step: 0, saturation: 0.78, lightness: 0.62 },
	blueprint: { hue: 212, step: 9, saturation: 0.83, lightness: 0.67 },
	candy: { hue: 326, step: 17, saturation: 0.78, lightness: 0.72 },
	'city-nights': { hue: 270, step: 24, saturation: 0.68, lightness: 0.61 },
	'cluster-neon': { hue: 176, step: 39, saturation: 0.98, lightness: 0.64, byCluster: true },
	'constellation-white': { hue: 204, step: 8, saturation: 0.3, lightness: 0.86 },
	'copper-blue': { hues: [205, 27], step: 8, saturation: 0.78, lightness: 0.64 },
	crystal: { hue: 189, step: 23, saturation: 0.58, lightness: 0.79 },
	cyberpunk: { hue: 310, step: 51, saturation: 0.96, lightness: 0.62 },
	'dark-mode': { hue: 218, step: 13, saturation: 0.38, lightness: 0.58 },
	'electric-lime': { hue: 88, step: 9, saturation: 0.96, lightness: 0.62 },
	'ember-profile': { hue: 12, step: 15, saturation: 0.88, lightness: 0.59 },
	'focus-fade': { hue: 192, step: 18, saturation: 0.78, lightness: 0.62, focusFade: true },
	glacier: { hue: 187, step: 12, saturation: 0.43, lightness: 0.74 },
	graphite: { hue: 210, step: 7, saturation: 0.18, lightness: 0.64 },
	'high-contrast': { hue: 48, step: 57, saturation: 0.98, lightness: 0.62 },
	infrared: { hue: 352, step: 13, saturation: 0.93, lightness: 0.56 },
	ink: { hue: 224, step: 7, saturation: 0.37, lightness: 0.64 },
	lava: { hue: 5, step: 18, saturation: 0.97, lightness: 0.56 },
	'library-night': { hue: 34, step: 10, saturation: 0.62, lightness: 0.67 },
	meadow: { hue: 112, step: 17, saturation: 0.59, lightness: 0.62 },
	'midnight-gold': { hue: 43, step: 10, saturation: 0.89, lightness: 0.62 },
	mint: { hue: 153, step: 11, saturation: 0.67, lightness: 0.68 },
	'moss-gold': { hues: [94, 45], step: 10, saturation: 0.67, lightness: 0.6 },
	'night-vision': { hue: 116, step: 8, saturation: 0.96, lightness: 0.57 },
	nord: { hue: 202, step: 14, saturation: 0.44, lightness: 0.69 },
	'notebook-blue': { hue: 215, step: 9, saturation: 0.65, lightness: 0.67 },
	'ocean-depths': { hue: 195, step: 13, saturation: 0.78, lightness: 0.53 },
	'ocean-sunset': { hue: 202, step: 33, saturation: 0.77, lightness: 0.62 },
	'paper-minimal': { hue: 42, step: 12, saturation: 0.28, lightness: 0.72 },
	pearl: { hue: 285, step: 23, saturation: 0.35, lightness: 0.82 },
	'polar-night': { hue: 223, step: 14, saturation: 0.64, lightness: 0.67 },
	'prism-flow': { hue: 0, step: 47, saturation: 0.9, lightness: 0.65, animated: true },
	'red-alert': { hue: 0, step: 8, saturation: 0.96, lightness: 0.58 },
	'rose-garden': { hue: 338, step: 19, saturation: 0.64, lightness: 0.68 },
	'ruby-graph': { hue: 350, step: 12, saturation: 0.87, lightness: 0.58 },
	'sepia-archive': { hue: 29, step: 12, saturation: 0.56, lightness: 0.61 },
	'signal-strength': { hue: 122, step: 0, saturation: 0.82, lightness: 0.52, byDegree: true },
	'soft-lavender': { hue: 267, step: 15, saturation: 0.48, lightness: 0.76 },
	'solar-system': { hue: 35, step: 37, saturation: 0.86, lightness: 0.62, byCluster: true },
	solarized: { hue: 193, step: 22, saturation: 0.55, lightness: 0.62 },
	'star-map': { hue: 220, step: 27, saturation: 0.32, lightness: 0.82 },
	vaporwave: { hue: 296, step: 31, saturation: 0.89, lightness: 0.66 },
	'violet-storm': { hue: 274, step: 21, saturation: 0.81, lightness: 0.62 },
	'zen-garden': { hue: 133, step: 17, saturation: 0.38, lightness: 0.69 },
};
const COLOR_PALETTES = {
	clusters: ['103, 224, 221', '255, 115, 180', '255, 199, 95', '156, 132, 255', '121, 226, 148', '255, 143, 100'],
	sunset: ['255, 91, 110', '255, 142, 89', '255, 193, 112', '202, 108, 171', '126, 90, 166'],
	forest: ['40, 110, 75', '72, 148, 94', '139, 177, 93', '30, 133, 126', '191, 166, 92'],
};

function colorFromHex(value) {
	const match = String(value).match(/^#?([\da-f]{6})$/i);
	if (!match) return null;
	const hex = match[1];
	return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)].join(', ');
}

function colorFromHsl(hue, saturation, lightness) {
	const h = ((hue % 360) + 360) % 360 / 60;
	const s = Math.max(0, Math.min(1, saturation));
	const l = Math.max(0, Math.min(1, lightness));
	const chroma = (1 - Math.abs(2 * l - 1)) * s;
	const secondary = chroma * (1 - Math.abs((h % 2) - 1));
	let rgb;
	if (h < 1) rgb = [chroma, secondary, 0];
	else if (h < 2) rgb = [secondary, chroma, 0];
	else if (h < 3) rgb = [0, chroma, secondary];
	else if (h < 4) rgb = [0, secondary, chroma];
	else if (h < 5) rgb = [secondary, 0, chroma];
	else rgb = [chroma, 0, secondary];
	const offset = l - chroma / 2;
	return rgb.map((channel) => Math.round((channel + offset) * 255)).join(', ');
}

function stableHash(value) {
	let hash = 0;
	for (const character of String(value || '')) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
	return Math.abs(hash);
}

const DEFAULT_SETTINGS = {
	mode: 'wander',
	visual: 'constellation',
	colors: 'aurora',
	customPalette: '#67e0dd, #ff73b4, #ffc75f, #9c84ff, #79e294, #ff8f64',
	graph: {
		scope: 'global',
		localDepth: 4,
		folderFilter: '',
		tagFilter: '',
		dateFilter: 'all',
		minimumConnections: 0,
		includeFloatingNotes: false,
		clusterBy: 'top-level',
		clusterLayout: 'islands',
		clusterSpacing: 1,
		noteSpacing: 1,
	},
	motion: {
		animationEnabled: false,
		noteMotionEnabled: true,
		linkAnimationEnabled: true,
		routeAnimationEnabled: true,
		colorAnimationEnabled: true,
		animationStyle: 'static',
		qualityMode: 'auto',
		maxVisibleNodes: 600,
		maxVisibleLinks: 400,
		frameRate: 30,
		animationSpeed: 0.55,
		cameraSpeed: 0.35,
		clusterPauseSeconds: 6,
		colorSpeed: 0.35,
		nodeDriftStrength: 0.08,
		connectionPulseSpeed: 0.7,
		lineAnimationStyle: 'flow',
		pathAnimationStyle: 'comet',
		backgroundStyle: 'nebula',
		backgroundParticles: 45,
		perspectiveStrength: 1,
		glowEnabled: true,
		reduceMotion: false,
	},
	display: {
		showHeader: false,
		showGraphLabel: true,
		showGraphStats: true,
		showQuickMenu: true,
		quickMenuItems: { search: true, scope: true, discovery: true, animationStyle: true, colors: true, journey: true, cameraMode: true, animationToggle: true, controlPanel: true, fit: true, optimize: true, refresh: true, notePath: true },
		showFooter: false,
		showLabels: true,
		showLinks: true,
		showSceneBackground: true,
		showBackgroundParticles: true,
		showFps: false,
		showPerformanceMetrics: false,
		labelSize: 10,
		edgeThickness: 1,
		nodeSize: 1,
		showNodeIcons: false,
		showDepthLayers: true,
		showClusterHalos: false,
		showVaultNotesCounter: true,
		showLinkedNotesCounter: true,
		showFolderCounter: true,
		showActivityCounter: true,
		showRecentChanges: true,
	},
	discovery: {
		recentDays: 30,
		forgottenDays: 180,
		includeOrphans: true,
	},
	journey: { nodePauseSeconds: 3 },
	template: { activeTemplateId: 'constellation', modified: false },
	interaction: { pinnedNodePaths: [], hiddenNodePaths: [], hiddenClusterNames: [], collapsedClusterNames: [], isolatedClusterName: null, nodeOffsets: {}, pathStartPath: null, pathPreview: [] },
};

function mergeSettings(saved) {
	const stored = saved || {};
	return {
		...DEFAULT_SETTINGS,
		...stored,
		customPalette: stored.customPalette || DEFAULT_SETTINGS.customPalette,
		graph: { ...DEFAULT_SETTINGS.graph, ...(stored.graph || {}) },
		motion: {
			...DEFAULT_SETTINGS.motion,
			...(stored.motion || {}),
			animationStyle: stored.motion?.animationStyle === 'link-pulse' ? 'orbit' : (stored.motion?.animationStyle ?? DEFAULT_SETTINGS.motion.animationStyle),
			animationEnabled: stored.motion?.animationEnabled ?? stored.animate ?? DEFAULT_SETTINGS.motion.animationEnabled,
			animationSpeed: stored.motion?.animationSpeed ?? stored.rotationSpeed ?? DEFAULT_SETTINGS.motion.animationSpeed,
			lineAnimationStyle: stored.motion?.lineAnimationStyle ?? (stored.motion?.animationStyle === 'link-pulse' ? 'pulse' : DEFAULT_SETTINGS.motion.lineAnimationStyle),
		},
		display: {
			...DEFAULT_SETTINGS.display,
			...(stored.display || {}),
			quickMenuItems: { ...DEFAULT_SETTINGS.display.quickMenuItems, ...(stored.display?.quickMenuItems || {}) },
			showLabels: stored.display?.showLabels ?? stored.showLabels ?? DEFAULT_SETTINGS.display.showLabels,
			showLinks: stored.display?.showLinks ?? stored.showLinks ?? DEFAULT_SETTINGS.display.showLinks,
		},
		visual: stored.visual || DEFAULT_SETTINGS.visual,
		colors: stored.colors || DEFAULT_SETTINGS.colors,
		discovery: { ...DEFAULT_SETTINGS.discovery, ...(stored.discovery || {}) },
		journey: { ...DEFAULT_SETTINGS.journey, ...(stored.journey || {}) },
		template: { ...DEFAULT_SETTINGS.template, ...(stored.template || {}) },
		interaction: { ...DEFAULT_SETTINGS.interaction, ...(stored.interaction || {}) },
	};
}

class SwarmGraphView extends ItemView {
	constructor(leaf, plugin) {
		super(leaf);
		this.plugin = plugin;
		this.nodes = [];
		this.edges = [];
		this.renderNodes = this.nodes;
		this.renderEdges = [];
		this.fullRenderEdges = [];
		this.renderLevels = {};
		this.renderQuality = 'full';
		this.hoveredNode = null;
		this.lastBuildMs = 0;
		this.lastDrawMs = 0;
		this.averageDrawMs = 0;
		this.performanceUiAt = 0;
		this.lastFrameAt = 0;
		this.spaceflightWaypoints = null;
		this.spaceflightWasActive = false;
		this.frame = 0;
		this.animation = 0;
		this.rotation = 0;
		this.tiltOffset = 0;
		this.zoom = 1;
		this.manualCameraControl = false;
		this.dragPoint = null;
		this.dragMoved = false;
		this.dragNode = null;
		this.panGesture = false;
		this.panX = 0;
		this.panY = 0;
		this.backgroundParticles = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), size: 0.35 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2 }));
		this.fpsFrames = 0;
		this.fpsLast = performance.now();
		this.lastClockSecond = -1;
		this.lastFpsLabel = '';
		this.journeyTimer = null;
		this.journeyNodes = [];
		this.journeyIndex = -1;
		this.focusedPath = null;
		this.resizeObserver = null;
		this.searchTimer = null;
	}
	getViewType() { return VIEW_TYPE; }
	getDisplayText() { return 'Constellation 3D'; }
	getIcon() { return 'orbit'; }

	async onOpen() {
		this.containerEl.addClass('swarm-console-view');
		this.contentEl.empty();
		this.root = this.contentEl.createDiv({ cls: 'swarm-console' });
		this.plugin.settings.motion.animationEnabled = false;
		this.buildShell();
		await this.plugin.saveData(this.plugin.settings);
		this.rebuildGraph();
		this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
		this.resizeObserver.observe(this.root);
		this.resizeCanvas();
		this.scheduleDraw();
		this.registerDomEvent(document, 'visibilitychange', () => {
			if (!document.hidden) this.scheduleDraw();
		});
	}

	async onClose() {
		window.cancelAnimationFrame(this.animation);
		window.clearTimeout(this.drawTimer);
		window.clearTimeout(this.graphRefreshTimer);
		if (this.journeyTimer) window.clearInterval(this.journeyTimer);
		window.clearTimeout(this.searchTimer);
		this.resizeObserver?.disconnect();
	}

	buildShell() {
		const header = this.root.createDiv({ cls: 'swarm-header' });
		this.header = header;
		const identity = header.createDiv({ cls: 'swarm-identity' });
		identity.createDiv({ cls: 'swarm-mark', text: 'S' });
		const title = identity.createDiv();
		title.createDiv({ cls: 'swarm-title', text: 'CONSTELLATION 3D' });
		title.createDiv({ cls: 'swarm-subtitle', text: 'LOCAL KNOWLEDGE NETWORK' });
		const headerRight = header.createDiv({ cls: 'swarm-header-right' });
		this.liveIndicator = headerRight.createSpan({ cls: 'swarm-live-dot' });
		headerRight.createSpan({ cls: 'swarm-live-label', text: 'VAULT CONNECTED' });
		this.fpsIndicator = headerRight.createSpan({ cls: 'swarm-fps' });
		this.performanceIndicator = headerRight.createSpan({ cls: 'swarm-performance is-hidden' });
		this.clock = headerRight.createSpan({ cls: 'swarm-clock' });

		const main = this.root.createDiv({ cls: 'swarm-main' });
		const quickbar = main.createDiv({ cls: 'swarm-quickbar' });
		this.quickbar = quickbar;
		this.searchInput = quickbar.createEl('input', { cls: 'swarm-search', attr: { type: 'search', placeholder: 'Search notes…', 'aria-label': 'Search notes' } });
		this.searchInput.addEventListener('input', () => {
			this.searchQuery = this.searchInput.value.trim().toLowerCase();
			window.clearTimeout(this.searchTimer);
			this.searchTimer = window.setTimeout(() => this.rebuildGraph(), 140);
		});
		this.scopeSelect = quickbar.createEl('select', { cls: 'swarm-select', attr: { 'aria-label': 'Graph scope' } });
			for (const [value, label] of [['global', 'Global'], ['local', 'Local'], ['current', 'Current note']]) {
			this.scopeSelect.createEl('option', { value, text: label });
		}
		this.scopeSelect.value = this.plugin.settings.graph.scope;
		this.scopeSelect.addEventListener('change', () => this.plugin.setSetting('graph', 'scope', this.scopeSelect.value, true));
		this.modeSelect = quickbar.createEl('select', { cls: 'swarm-select', attr: { 'aria-label': 'Discovery mode' } });
		for (const [value, label] of [['wander', 'Wander'], ['path-journey', 'Path journey'], ['recent-activity', 'Recent activity'], ['forgotten-knowledge', 'Forgotten knowledge'], ['hub-explorer', 'Hub explorer'], ['hidden-gems', 'Hidden gems'], ['orphan-hunt', 'Orphan hunt']]) {
			this.modeSelect.createEl('option', { value, text: label });
		}
		this.modeSelect.value = this.plugin.settings.mode;
		this.modeSelect.title = 'Choose a discovery route, then press START TRAVEL to follow the notes.';
		this.modeSelect.addEventListener('change', () => this.plugin.setSetting(null, 'mode', this.modeSelect.value, true));
		this.animationStyleSelect = quickbar.createEl('select', { cls: 'swarm-select swarm-animation-style-select', attr: { 'aria-label': 'Note animation style' } });
		for (const [value, label] of [['static', 'Static Camera'], ['orbit', '3D Camera Orbit'], ['spaceflight', 'Spaceflight (Fly Through Notes)'], ['cluster-orbit', 'Notes Orbit Clusters'], ['cluster-tour', 'Cluster Camera Tour'], ['node-drift', 'Moving Notes'], ['swarm', 'Swarm'], ['chaos', 'Chaos'], ['blob-order', 'Blob Order']]) {
			this.animationStyleSelect.createEl('option', { value, text: label });
		}
		this.animationStyleSelect.value = this.plugin.settings.motion.animationStyle;
		this.animationStyleSelect.title = 'Choose how notes or the camera move. Spaceflight flies through linked notes with star streaks. Selecting a mode enables animation.';
		this.animationStyleSelect.addEventListener('change', () => this.plugin.setAnimationStyle(this.animationStyleSelect.value));
		this.colorSelect = quickbar.createEl('select', { cls: 'swarm-select swarm-color-select', attr: { 'aria-label': 'Color scheme' } });
		for (const [value, label] of Object.entries(COLOR_SCHEME_OPTIONS)) this.colorSelect.createEl('option', { value, text: label });
		this.colorSelect.value = this.plugin.settings.colors;
		this.colorSelect.addEventListener('change', () => this.plugin.setSetting(null, 'colors', this.colorSelect.value));
		this.journeyButton = quickbar.createEl('button', { cls: 'swarm-control-button swarm-journey-button', text: 'START TRAVEL' });
		this.journeyButton.addEventListener('click', () => this.toggleJourney());
		this.previousButton = quickbar.createEl('button', { cls: 'swarm-control-button swarm-step-button', text: '‹' });
		this.previousButton.setAttribute('aria-label', 'Previous note');
		this.previousButton.addEventListener('click', () => this.stepJourney(-1));
		this.nextButton = quickbar.createEl('button', { cls: 'swarm-control-button swarm-step-button', text: '›' });
		this.nextButton.setAttribute('aria-label', 'Next note');
		this.nextButton.addEventListener('click', () => this.stepJourney(1));
		this.panButton = quickbar.createEl('button', { cls: 'swarm-control-button', text: 'ORBIT MODE' });
		this.panButton.setAttribute('aria-label', 'Switch graph drag mode');
		this.panButton.title = 'Switch between orbiting and panning the canvas';
		this.panButton.addEventListener('click', () => {
			this.panMode = !this.panMode;
			this.panButton.setText(this.panMode ? 'PAN MODE' : 'ORBIT MODE');
			this.panButton.setAttribute('aria-pressed', String(this.panMode));
		});
		this.quickMenuElements = {
			search: this.searchInput, scope: this.scopeSelect, discovery: this.modeSelect, animationStyle: this.animationStyleSelect,
			colors: this.colorSelect, journey: this.journeyButton, cameraMode: this.panButton,
		};
		const controls = quickbar.createDiv({ cls: 'swarm-quick-controls' });
		this.hideQuickbarButton = quickbar.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.hideQuickbarButton, 'chevron-up');
		this.hideQuickbarButton.setAttribute('aria-label', 'Hide quick menu');
		this.hideQuickbarButton.title = 'Hide Quick Menu';
		this.hideQuickbarButton.addEventListener('click', () => this.setQuickbarVisible(false));
		this.showQuickbarButton = main.createEl('button', { cls: 'swarm-control-button swarm-icon-button swarm-show-menu is-hidden' });
		setIcon(this.showQuickbarButton, 'menu');
		this.showQuickbarButton.setAttribute('aria-label', 'Show quick menu');
		this.showQuickbarButton.title = 'Show Quick Menu';
		this.showQuickbarButton.addEventListener('click', () => this.setQuickbarVisible(true));
		this.canvas = main.createEl('canvas', { cls: 'swarm-canvas' });
		this.ctx = this.canvas.getContext('2d');
		this.tooltip = main.createDiv({ cls: 'swarm-tooltip' });
		this.graphLabel = main.createDiv({ cls: 'swarm-graph-label', text: '3D NOTE SPACE' });
		this.graphStats = main.createDiv({ cls: 'swarm-graph-stats' });
		this.graphStats.createSpan({ text: 'NODES ' });
		this.nodeCount = this.graphStats.createEl('b', { text: '0' });
		this.graphStats.createSpan({ text: '  /  LINKS ' });
		this.edgeCount = this.graphStats.createEl('b', { text: '0' });
		this.animationButton = controls.createEl('button', { cls: 'swarm-control-button swarm-animation-button' });
		this.animationButton.addClass('swarm-icon-button');
		this.animationButton.addEventListener('click', () => this.plugin.toggleAnimation());
		this.settingsButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.settingsButton, 'settings');
		this.settingsButton.setAttribute('aria-label', 'Open control panel');
		this.settingsButton.title = 'Control Panel';
		this.settingsButton.setAttribute('aria-expanded', 'false');
		this.settingsButton.addEventListener('click', () => this.toggleControlPanel());
		this.fitButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.fitButton, 'maximize');
		this.fitButton.setAttribute('aria-label', 'Fit network'); this.fitButton.title = 'Fit Network';
		this.fitButton.addEventListener('click', () => this.fitNetwork());
		this.optimizeButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.optimizeButton, 'scan');
		this.optimizeButton.setAttribute('aria-label', 'Optimize view to fit visible notes');
		this.optimizeButton.title = 'Optimize View';
		this.optimizeButton.addEventListener('click', () => this.optimizeView());
		this.refreshButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.refreshButton, 'refresh-cw');
		this.refreshButton.setAttribute('aria-label', 'Refresh graph'); this.refreshButton.title = 'Refresh';
		this.refreshButton.addEventListener('click', () => this.rebuildGraph());
		this.pathButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button' });
		setIcon(this.pathButton, 'route');
		this.pathButton.setAttribute('aria-label', 'Show a path between two notes');
		this.pathButton.title = 'Note Path: select two notes to show the shortest linked path';
		this.pathButton.addEventListener('click', () => this.togglePathSelection());
		this.clearPathButton = controls.createEl('button', { cls: 'swarm-control-button swarm-icon-button is-hidden' });
		setIcon(this.clearPathButton, 'x');
		this.clearPathButton.setAttribute('aria-label', 'Clear note path');
		this.clearPathButton.title = 'Clear Note Path';
		this.clearPathButton.addEventListener('click', () => this.clearPathPreview());
		Object.assign(this.quickMenuElements, {
			animationToggle: this.animationButton, controlPanel: this.settingsButton, fit: this.fitButton,
			optimize: this.optimizeButton, refresh: this.refreshButton, notePath: this.pathButton,
		});
		this.controlPanel = main.createDiv({ cls: 'swarm-control-panel is-hidden' });
		const controlPanelHeader = this.controlPanel.createDiv({ cls: 'swarm-control-panel-header' });
		controlPanelHeader.createDiv({ cls: 'swarm-control-panel-title', text: 'CONSTELLATION 3D CONTROL PANEL' });
		const closePanelButton = controlPanelHeader.createEl('button', { cls: 'swarm-control-button swarm-control-panel-close', text: 'CLOSE' });
		closePanelButton.setAttribute('aria-label', 'Close control panel');
		closePanelButton.addEventListener('click', () => this.toggleControlPanel(false));
		this.controlPanelBody = this.controlPanel.createDiv({ cls: 'swarm-control-panel-body' });
		this.controlSettings = new SwarmConsoleSettingTab(this.app, this.plugin);
		this.controlSettings.renderSettings(this.controlPanelBody, this);
		this.keyboardHelp = this.controlPanelBody.createDiv({ cls: 'swarm-keyboard-help' });
		this.keyboardHelp.createEl('div', { cls: 'swarm-keyboard-help-title', text: 'KEYBOARD CONTROLS' });
		this.keyboardHelp.createEl('p', { text: '← → rotate · ↑ ↓ tilt · + − zoom · WASD pan · Space pause / play · F fit network · O optimize view · R refresh · Esc close panel' });
		this.updateControlLabels();
		this.updateDisplayVisibility();
		this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event));
		this.canvas.addEventListener('pointerleave', () => {
			this.tooltip.addClass('is-hidden');
			if (this.hoveredNode) { this.hoveredNode.hovered = false; this.hoveredNode = null; this.scheduleDraw(); }
		});
		this.canvas.addEventListener('pointerdown', (event) => {
			this.dragPoint = { x: event.clientX, y: event.clientY };
			this.dragMoved = false;
			this.dragNode = event.button === 0 && !event.shiftKey && !this.panMode ? this.findNode(event) : null;
			this.panGesture = event.button === 1 || event.shiftKey || this.panMode;
			this.canvas.setPointerCapture(event.pointerId);
		});
		this.canvas.addEventListener('pointerup', () => this.finishPointerGesture());
		this.canvas.addEventListener('pointercancel', () => this.finishPointerGesture());
		this.canvas.addEventListener('wheel', (event) => {
			event.preventDefault();
			this.zoom = Math.max(0.1, Math.min(12, (this.zoom || 1) * Math.exp(-event.deltaY * 0.001)));
			this.controlSettings?.syncCameraControls();
			this.scheduleDraw();
		}, { passive: false });
		this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));
		this.canvas.addEventListener('contextmenu', (event) => this.onCanvasContextMenu(event));
		this.registerDomEvent(this.containerEl, 'keydown', (event) => this.onKeyboardControl(event));

		const footer = this.root.createDiv({ cls: 'swarm-footer' });
		this.footer = footer;
		this.vaultNotesMetric = this.makeMetric(footer, 'VAULT NOTES', 'metric-notes');
		this.linkedNotesMetric = this.makeMetric(footer, 'LINKED NOTES', 'metric-linked');
		this.folderMetric = this.makeMetric(footer, 'FOLDERS', 'metric-folders');
		this.activityMetric = this.makeMetric(footer, 'RECENT ACTIVITY', 'metric-activity');
		this.recentChangesPanel = this.makeActivityPanel(footer);
		this.updateDisplayVisibility();
	}

	setQuickbarVisible(visible) {
		this.plugin.setSetting('display', 'showQuickMenu', visible);
		this.updateDisplayVisibility();
	}

	toggleControlPanel(force) {
		const open = force ?? this.controlPanel?.hasClass('is-hidden');
		this.controlPanel?.toggleClass('is-hidden', !open);
		this.settingsButton?.setAttribute('aria-expanded', String(open));
	}

	onKeyboardControl(event) {
		if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
		const target = event.target;
		if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName))) return;
		const key = event.key.toLowerCase();
		const step = event.shiftKey ? 48 : 24;
		let handled = true;
		switch (key) {
		case 'arrowleft': this.manualCameraControl = true; this.rotation -= step * Math.PI / 180; break;
		case 'arrowright': this.manualCameraControl = true; this.rotation += step * Math.PI / 180; break;
		case 'arrowup': this.manualCameraControl = true; this.tiltOffset = Math.max(-0.96, this.tiltOffset - step * Math.PI / 180); break;
		case 'arrowdown': this.manualCameraControl = true; this.tiltOffset = Math.min(0.96, this.tiltOffset + step * Math.PI / 180); break;
		case '+': case '=': this.zoom = Math.min(12, (this.zoom || 1) * 1.15); break;
		case '-': case '_': this.zoom = Math.max(0.1, (this.zoom || 1) / 1.15); break;
		case 'w': this.panY += step; break;
		case 's': this.panY -= step; break;
		case 'a': this.panX += step; break;
		case 'd': this.panX -= step; break;
		case ' ': void this.plugin.toggleAnimation(); break;
		case 'f': this.fitNetwork(); break;
		case 'o': this.optimizeView(); break;
		case 'r': this.rebuildGraph(); break;
		case 'escape':
			if (!this.controlPanel?.hasClass('is-hidden')) this.toggleControlPanel(false);
			else handled = false;
			break;
		default: handled = false;
		}
		if (!handled) return;
		event.preventDefault();
		if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', '+', '=', '-', '_', 'w', 'a', 's', 'd'].includes(key)) {
			this.controlSettings?.syncCameraControls();
			this.scheduleDraw();
		}
	}

	updateDisplayVisibility() {
		const display = this.plugin.settings.display;
		this.header?.toggleClass('is-hidden', !display.showHeader);
		this.graphLabel?.toggleClass('is-hidden', !display.showGraphLabel);
		this.graphStats?.toggleClass('is-hidden', !display.showGraphStats);
		this.quickbar?.toggleClass('is-hidden', !display.showQuickMenu);
		for (const [key, element] of Object.entries(this.quickMenuElements || {})) element?.toggleClass('is-hidden', !display.quickMenuItems?.[key]);
		this.performanceIndicator?.toggleClass('is-hidden', !display.showPerformanceMetrics);
		this.showQuickbarButton?.toggleClass('is-hidden', display.showQuickMenu);
		this.vaultNotesMetric?.toggleClass('is-hidden', !display.showVaultNotesCounter);
		this.linkedNotesMetric?.toggleClass('is-hidden', !display.showLinkedNotesCounter);
		this.folderMetric?.toggleClass('is-hidden', !display.showFolderCounter);
		this.activityMetric?.toggleClass('is-hidden', !display.showActivityCounter);
		this.recentChangesPanel?.toggleClass('is-hidden', !display.showRecentChanges);
		const metricCount = [display.showVaultNotesCounter, display.showLinkedNotesCounter, display.showFolderCounter, display.showActivityCounter].filter(Boolean).length;
		this.footer?.style.setProperty('--swarm-metric-count', String(metricCount));
		const hasFooterContent = metricCount > 0 || display.showRecentChanges;
		this.footer?.toggleClass('is-hidden', !display.showFooter || !hasFooterContent);
		this.footer?.toggleClass('without-activity', !display.showRecentChanges);
	}

	makeMetric(parent, label, key) {
		const panel = parent.createDiv({ cls: 'swarm-panel swarm-metric' });
		panel.createDiv({ cls: 'swarm-panel-label', text: label });
		panel.createDiv({ cls: 'swarm-metric-value', attr: { 'data-metric': key }, text: '—' });
		return panel;
	}

	makeActivityPanel(parent) {
		const panel = parent.createDiv({ cls: 'swarm-panel swarm-activity' });
		panel.createDiv({ cls: 'swarm-panel-label', text: 'RECENT VAULT CHANGES' });
		this.activityList = panel.createDiv({ cls: 'swarm-activity-list' });
		return panel;
	}

	rebuildGraph() {
		const buildStartedAt = performance.now();
		this.autoQualityFloor = 'full';
		this.averageDrawMs = 0;
		this.spaceflightWaypoints = null;
		const graphSettings = this.plugin.settings.graph;
		const discoverySettings = this.plugin.settings.discovery;
		const interaction = this.plugin.settings.interaction;
		const hiddenNodePaths = new Set(interaction.hiddenNodePaths);
		const now = Date.now();
		const folderTokens = graphSettings.folderFilter.split(/[,;\n]/).map((value) => value.trim().toLowerCase()).filter(Boolean);
		const tagTokens = graphSettings.tagFilter.split(/[,;\n]/).map((value) => value.trim().replace(/^#/, '').toLowerCase()).filter(Boolean);
		const mode = this.plugin.settings.mode;
		const resolvedLinks = this.app.metadataCache.resolvedLinks;
		const linkedPaths = new Set();
		for (const [source, targets] of Object.entries(resolvedLinks)) {
			linkedPaths.add(source);
			for (const target of Object.keys(targets)) linkedPaths.add(target);
		}
		// Enumerate Markdown paths only when the user enables floating notes or selects Orphan Hunt.
		const includeAllMarkdown = (graphSettings.includeFloatingNotes && discoverySettings.includeOrphans) || mode === 'orphan-hunt';
		const candidateFiles = includeAllMarkdown
			? this.app.vault.getMarkdownFiles()
			: [...linkedPaths].map((path) => this.app.vault.getAbstractFileByPath(path)).filter((file) => file?.extension === 'md');
		const fileCaches = new Map();
		const files = candidateFiles.filter((file) => {
			if (folderTokens.length && !folderTokens.some((token) => file.path.toLowerCase().includes(token))) return false;
			if (graphSettings.dateFilter === 'recent' && now - file.stat.mtime > discoverySettings.recentDays * 86400000) return false;
			if (graphSettings.dateFilter === 'forgotten' && now - file.stat.mtime < discoverySettings.forgottenDays * 86400000) return false;
			if (tagTokens.length) {
				const cache = this.app.metadataCache.getFileCache(file);
				fileCaches.set(file.path, cache);
				const tags = new Set((cache?.tags || []).map((tag) => tag.tag.replace(/^#/, '').toLowerCase()));
				const frontmatterTags = cache?.frontmatter?.tags;
				for (const tag of (Array.isArray(frontmatterTags) ? frontmatterTags : typeof frontmatterTags === 'string' ? [frontmatterTags] : [])) tags.add(tag.replace(/^#/, '').toLowerCase());
				if (!tagTokens.some((token) => [...tags].some((tag) => tag === token || tag.startsWith(`${token}/`)))) return false;
			}
			return true;
		});
		const byPath = new Map(files.map((file) => [file.path, file]));
		const degree = new Map(files.map((file) => [file.path, 0]));
		const edges = [];
		for (const [source, targets] of Object.entries(resolvedLinks)) {
			for (const [target, count] of Object.entries(targets)) {
				if (!byPath.has(source) || !byPath.has(target)) continue;
				edges.push({ source, target, count });
				degree.set(source, (degree.get(source) || 0) + count);
				degree.set(target, (degree.get(target) || 0) + count);
			}
		}
		let visiblePaths = new Set(files.map((file) => file.path));
		const activeFile = this.app.workspace.getActiveFile();
		if (graphSettings.scope !== 'global' && activeFile && byPath.has(activeFile.path)) {
			const adjacency = new Map(files.map((file) => [file.path, new Set()]));
			for (const edge of edges) {
				adjacency.get(edge.source)?.add(edge.target);
				adjacency.get(edge.target)?.add(edge.source);
			}
			const depth = graphSettings.scope === 'current' ? 1 : Math.max(1, Math.min(50, graphSettings.localDepth));
			visiblePaths = new Set([activeFile.path]);
			let frontier = [activeFile.path];
			for (let step = 0; step < depth; step++) {
				const next = [];
				for (const path of frontier) for (const neighbor of (adjacency.get(path) || [])) {
					if (!visiblePaths.has(neighbor)) { visiblePaths.add(neighbor); next.push(neighbor); }
				}
				frontier = next;
				if (!frontier.length) break;
			}
		}
		if (graphSettings.includeFloatingNotes && discoverySettings.includeOrphans && mode !== 'orphan-hunt') {
			for (const file of candidateFiles) if ((degree.get(file.path) || 0) === 0 && (graphSettings.scope === 'global' || visiblePaths.has(file.path))) visiblePaths.add(file.path);
		}
		const minimumConnections = Math.max(graphSettings.minimumConnections, 0);
		let visibleFiles = files.filter((file) => {
			const connections = degree.get(file.path) || 0;
			if (hiddenNodePaths.has(file.path)) return false;
			if (!visiblePaths.has(file.path) || (connections < minimumConnections && file.path !== activeFile?.path)) return false;
			if (mode === 'recent-activity' && now - file.stat.mtime > discoverySettings.recentDays * 86400000) return false;
			if (mode === 'forgotten-knowledge' && now - file.stat.mtime < discoverySettings.forgottenDays * 86400000) return false;
			if (mode === 'hub-explorer' && connections < Math.max(3, minimumConnections)) return false;
			if (mode === 'hidden-gems' && (connections === 0 || connections > 2)) return false;
			if (mode === 'orphan-hunt' && connections !== 0) return false;
			return !this.searchQuery || `${file.basename} ${file.path}`.toLowerCase().includes(this.searchQuery);
		});
		if (mode !== 'orphan-hunt' && (!graphSettings.includeFloatingNotes || !discoverySettings.includeOrphans)) {
			visibleFiles = visibleFiles.filter((file) => (degree.get(file.path) || 0) > 0 || file.path === activeFile?.path);
		}
		const visibleSet = new Set(visibleFiles.map((file) => file.path));
		const isolatedClusterName = interaction.isolatedClusterName;
		const hiddenClusterNames = new Set(interaction.hiddenClusterNames);
		const clusterNameFor = (file) => {
			if (graphSettings.clusterBy === 'tag') {
				const cache = fileCaches.get(file.path) || this.app.metadataCache.getFileCache(file);
				const frontmatterTags = cache?.frontmatter?.tags;
				const tag = (cache?.tags || []).map((item) => item.tag.replace(/^#/, ''))[0]
					|| (Array.isArray(frontmatterTags) ? frontmatterTags[0] : typeof frontmatterTags === 'string' ? frontmatterTags.split(/[,; ]+/)[0] : null);
				return tag ? tag.replace(/^#/, '') : 'Untagged';
			}
			const folders = file.path.split('/').slice(0, -1);
			if (!folders.length) return 'Vault root';
			return graphSettings.clusterBy === 'folder' ? folders.join('/') : folders[0];
		};
		visibleFiles = visibleFiles.filter((file) => !hiddenClusterNames.has(clusterNameFor(file)) && (!isolatedClusterName || clusterNameFor(file) === isolatedClusterName));
		const clusterVisiblePaths = new Set(visibleFiles.map((file) => file.path));
		const visibleEdges = edges.filter((edge) => clusterVisiblePaths.has(edge.source) && clusterVisiblePaths.has(edge.target));
		const clusterKeys = [...new Set(visibleFiles.map(clusterNameFor))].sort();
		const clusterIndex = new Map(clusterKeys.map((key, index) => [key, index]));
		const clusterMembers = new Map(clusterKeys.map((key) => [key, []]));
		for (const file of visibleFiles) clusterMembers.get(clusterNameFor(file)).push(file);
		const clusterLocalIndexes = new Map(clusterKeys.map((key) => [key, new Map(clusterMembers.get(key).map((file, index) => [file.path, index]))]));
		const oldestNoteTime = visibleFiles.reduce((oldest, file) => Math.min(oldest, file.stat.mtime), Infinity);
		const newestNoteTime = visibleFiles.reduce((newest, file) => Math.max(newest, file.stat.mtime), 0);
		this.timelineRange = [oldestNoteTime, newestNoteTime];
		this.nodes = visibleFiles.map((file, index) => {
			const clusterName = clusterNameFor(file);
			const clusterId = clusterIndex.get(clusterName) || 0;
			let x; let y; let z; let clusterCenterX = 0; let clusterCenterY = 0; let clusterCenterZ = 0;
			if (this.plugin.settings.visual === 'timeline-map') {
				const timeRange = Math.max(1, newestNoteTime - oldestNoteTime);
				const progress = (file.stat.mtime - oldestNoteTime) / timeRange;
				x = (progress * 2.5 - 1.25) * graphSettings.noteSpacing;
				y = (((clusterId - (clusterKeys.length - 1) / 2) * 0.12 * graphSettings.clusterSpacing) + Math.sin(index * 1.7) * 0.035) * graphSettings.noteSpacing;
				z = Math.min(degree.get(file.path) || 0, 12) * 0.012 * graphSettings.noteSpacing;
			} else {
				const totalClusters = Math.max(clusterKeys.length, 1);
				const layout = graphSettings.clusterLayout || 'islands';
				if (layout === 'grid') {
					const columns = Math.ceil(Math.sqrt(totalClusters));
					const rows = Math.ceil(totalClusters / columns);
					clusterCenterX = ((clusterId % columns) - (columns - 1) / 2) * 0.9 * graphSettings.clusterSpacing;
					clusterCenterY = Math.sin(clusterId * 1.7) * 0.08 * graphSettings.clusterSpacing;
					clusterCenterZ = (Math.floor(clusterId / columns) - (rows - 1) / 2) * 0.9 * graphSettings.clusterSpacing;
				} else {
					const centerY = 1 - ((clusterId + 0.5) / totalClusters) * 2;
					const centerRing = Math.sqrt(Math.max(0, 1 - centerY * centerY));
					const centerAngle = clusterId * Math.PI * (3 - Math.sqrt(5));
					const centerRadius = layout === 'spiral' ? 0.45 + Math.sqrt(clusterId / totalClusters) * 0.9 : 1.12;
					clusterCenterX = Math.cos(centerAngle) * centerRing * centerRadius * graphSettings.clusterSpacing;
					clusterCenterY = centerY * centerRadius * graphSettings.clusterSpacing;
					clusterCenterZ = Math.sin(centerAngle) * centerRing * centerRadius * graphSettings.clusterSpacing;
				}
				const members = clusterMembers.get(clusterName) || [];
				const localIndex = clusterLocalIndexes.get(clusterName).get(file.path) || 0;
				const localY = 1 - ((localIndex + 0.5) / Math.max(members.length, 1)) * 2;
				const localRing = Math.sqrt(Math.max(0, 1 - localY * localY));
				const localAngle = localIndex * Math.PI * (3 - Math.sqrt(5));
				const localRadius = Math.min(0.38, 0.18 + Math.sqrt(members.length) * 0.012) * graphSettings.noteSpacing;
				x = clusterCenterX + Math.cos(localAngle) * localRing * localRadius;
				y = clusterCenterY + localY * localRadius;
				z = clusterCenterZ + Math.sin(localAngle) * localRing * localRadius;
			}
			const fileCache = fileCaches.get(file.path) || this.app.metadataCache.getFileCache(file);
			const frontmatterTags = fileCache?.frontmatter?.tags;
			const tags = [
				...(fileCache?.tags || []).map((tag) => tag.tag),
				...(Array.isArray(frontmatterTags) ? frontmatterTags : typeof frontmatterTags === 'string' ? frontmatterTags.split(/[,; ]+/) : []),
			].filter(Boolean);
			return {
				path: file.path,
				name: file.basename,
				folder: file.parent?.name || 'Vault root',
				folderPath: file.parent?.path || 'Vault root',
				tags,
				tagHash: stableHash(tags[0] || 'untagged'),
				folderHash: stableHash(file.parent?.path || 'Vault root'),
				ageRatio: Math.max(0, Math.min(1, (file.stat.mtime - oldestNoteTime) / Math.max(1, newestNoteTime - oldestNoteTime))),
				recentActivityRatio: Math.max(0, 1 - (now - file.stat.mtime) / (365 * 86400000)),
				index,
				clusterName, clusterId, clusterCenterX, clusterCenterY, clusterCenterZ,
				degree: degree.get(file.path) || 0,
				mtime: file.stat.mtime,
				pinned: this.plugin.settings.interaction.pinnedNodePaths.includes(file.path),
				focused: this.focusedPath === file.path,
				x, y, z,
				screenX: 0, screenY: 0, depth: 0,
				phase: Math.random() * Math.PI * 2,
				offsetX: this.plugin.settings.interaction.nodeOffsets[file.path]?.x || 0,
				offsetY: this.plugin.settings.interaction.nodeOffsets[file.path]?.y || 0,
			};
		});
		const sourceNodes = this.nodes;
		const collapsedClusters = new Set(interaction.collapsedClusterNames || []);
		const pathToDisplayPath = new Map();
		const nodesByCluster = new Map();
		for (const node of sourceNodes) {
			if (!nodesByCluster.has(node.clusterName)) nodesByCluster.set(node.clusterName, []);
			nodesByCluster.get(node.clusterName).push(node);
		}
		this.nodes = [];
		for (const [clusterName, members] of nodesByCluster) {
			if (collapsedClusters.has(clusterName)) {
				const summaryPath = `cluster::${clusterName}`;
				this.nodes.push({ ...members[0], path: summaryPath, name: `${clusterName} (${members.length})`, degree: members.reduce((sum, node) => sum + node.degree, 0), isClusterSummary: true, clusterCount: members.length, focused: members.some((node) => node.focused), pinned: false });
				for (const member of members) pathToDisplayPath.set(member.path, summaryPath);
			} else {
				for (const member of members) { this.nodes.push(member); pathToDisplayPath.set(member.path, member.path); }
			}
		}
		this.nodeByPath = new Map(this.nodes.map((node) => [node.path, node]));
		const groupsForDrawing = new Map();
		for (const node of this.nodes) {
			if (!groupsForDrawing.has(node.clusterName)) groupsForDrawing.set(node.clusterName, []);
			groupsForDrawing.get(node.clusterName).push(node);
		}
		this.clusterGroups = [...groupsForDrawing.values()];
		this.clusterTourTargets = [...groupsForDrawing.values()].map((nodes) => nodes[0]).sort((a, b) => a.clusterId - b.clusterId);
		this.pathDisplayBySource = pathToDisplayPath;
		const aggregatedEdges = new Map();
		for (const edge of visibleEdges) {
			const source = pathToDisplayPath.get(edge.source);
			const target = pathToDisplayPath.get(edge.target);
			if (!source || !target || source === target) continue;
			const key = source < target ? `${source}\u0000${target}` : `${target}\u0000${source}`;
			const current = aggregatedEdges.get(key);
			if (current) current.count += edge.count;
			else aggregatedEdges.set(key, { source, target, count: edge.count });
		}
		this.edges = [...aggregatedEdges.values()].map((edge, renderIndex) => ({ ...edge, renderIndex }));
		this.adjacency = new Map(this.nodes.map((node) => [node.path, new Set()]));
		for (const edge of this.edges) {
			this.adjacency.get(edge.source)?.add(edge.target);
			this.adjacency.get(edge.target)?.add(edge.source);
		}
		if (this.edges.length > 12000) {
			const routePairs = new Set();
			const route = interaction.pathPreview || [];
			for (let index = 1; index < route.length; index++) {
				const source = pathToDisplayPath.get(route[index - 1]);
				const target = pathToDisplayPath.get(route[index]);
				if (source && target && source !== target) {
					routePairs.add(`${source}|${target}`);
					routePairs.add(`${target}|${source}`);
				}
			}
			const routeEdges = this.edges.filter((edge) => routePairs.has(`${edge.source}|${edge.target}`));
			const routeKeys = new Set(routeEdges.map((edge) => `${edge.source}|${edge.target}`));
			const edgeBudget = Math.max(0, 12000 - routeEdges.length);
			const stride = Math.max(1, Math.ceil(this.edges.length / Math.max(1, edgeBudget)));
			const spreadEdges = [];
			for (let index = 0; index < this.edges.length && spreadEdges.length < edgeBudget; index += stride) {
				const edge = this.edges[index];
				if (!routeKeys.has(`${edge.source}|${edge.target}`)) spreadEdges.push(edge);
			}
			this.renderEdges = [...routeEdges, ...spreadEdges];
		} else this.renderEdges = this.edges;
		this.fullRenderEdges = this.renderEdges;
		this.renderLevels = this.buildRenderLevels();
		this.renderQuality = this.resolveRenderQuality();
		this.selectRenderLevel(this.renderQuality);
		this.nodeCount?.setText(String(this.nodes.length));
		this.edgeCount?.setText(String(this.edges.length));
		this.updatePathControls();
		this.updateMetrics(visibleFiles);
		this.renderActivity();
		this.controlSettings?.refreshVisibilityManager();
		if (this.scopeSelect) this.scopeSelect.value = graphSettings.scope;
		if (this.modeSelect) this.modeSelect.value = mode;
		if (this.animationStyleSelect) this.animationStyleSelect.value = this.plugin.settings.motion.animationStyle;
		this.updateControlLabels();
		this.lastBuildMs = performance.now() - buildStartedAt;
		this.updatePerformanceIndicator();
	this.scheduleDraw();
	}

	resolveRenderQuality() {
		const requested = this.plugin.settings.motion.qualityMode || 'auto';
		if (requested === 'balanced' || requested === 'performance') return requested;
		let quality = 'full';
		if (this.nodes.length > 600 || this.edges.length > 1800 || this.averageDrawMs > 20) quality = 'performance';
		else if (this.nodes.length > 180 || this.edges.length > 500 || this.averageDrawMs > 12) quality = 'balanced';
		// Hold automatic reductions until the next graph build, rather than repeatedly
		// switching quality and reallocating the canvas when cheaper frames get faster.
		const ranks = { full: 0, balanced: 1, performance: 2 };
		if (ranks[quality] > ranks[this.autoQualityFloor || 'full']) this.autoQualityFloor = quality;
		return this.autoQualityFloor || quality;
	}

	buildRenderLevels() {
		const full = { nodes: this.nodes, edges: this.fullRenderEdges, clusters: this.clusterGroups };
		const buildLevel = (nodeLimit, edgeLimit) => {
			if (this.nodes.length <= nodeLimit && this.fullRenderEdges.length <= edgeLimit) return full;
			const selectedPaths = new Set();
			const addPath = (path) => {
				const displayPath = this.pathDisplayBySource?.get(path) || path;
				if (this.nodeByPath.has(displayPath)) selectedPaths.add(displayPath);
			};
			addPath(this.app.workspace.getActiveFile()?.path);
			addPath(this.focusedPath);
			for (const path of this.plugin.settings.interaction.pinnedNodePaths || []) addPath(path);
			for (const path of this.plugin.settings.interaction.pathPreview || []) addPath(path);
			addPath(this.plugin.settings.interaction.pathStartPath);
			if (this.journeyTimer && this.journeyNodes.length) {
				const start = Math.max(0, this.journeyIndex - 80);
				for (const path of this.journeyNodes.slice(start, start + 160)) addPath(path);
			}
			const representatives = this.clusterGroups.map((group) => group.reduce((best, node) => !best || node.degree > best.degree ? node : best, null)).filter(Boolean);
			const representativeSlots = Math.max(1, Math.floor(nodeLimit * 0.3) - selectedPaths.size);
			const representativeStride = Math.max(1, Math.ceil(representatives.length / Math.max(1, representativeSlots)));
			for (let index = 0; index < representatives.length && selectedPaths.size < nodeLimit; index += representativeStride) selectedPaths.add(representatives[index].path);
			let slots = Math.max(0, nodeLimit - selectedPaths.size);
			if (slots) {
				for (let slot = 0; slot < slots; slot++) {
					const path = this.nodes[Math.floor((slot + 0.5) * this.nodes.length / slots)]?.path;
					if (path) selectedPaths.add(path);
				}
				for (const node of this.nodes) { if (selectedPaths.size >= nodeLimit) break; selectedPaths.add(node.path); }
			}
			const nodes = this.nodes.filter((node) => selectedPaths.has(node.path));
			const routePairs = new Set();
			const route = this.plugin.settings.interaction.pathPreview || [];
			for (let index = 1; index < route.length; index++) {
				const source = this.pathDisplayBySource?.get(route[index - 1]); const target = this.pathDisplayBySource?.get(route[index]);
				if (source && target) routePairs.add(source < target ? `${source}\u0000${target}` : `${target}\u0000${source}`);
			}
			const candidates = this.fullRenderEdges.filter((edge) => selectedPaths.has(edge.source) && selectedPaths.has(edge.target));
			const chosen = []; const chosenSet = new Set();
			const addSpread = (list, count) => {
				if (!count || !list.length) return;
				const slotsToAdd = Math.min(count, list.length);
				for (let slot = 0; slot < slotsToAdd; slot++) {
					const edge = list[Math.floor((slot + 0.5) * list.length / slotsToAdd)];
					if (!chosenSet.has(edge)) { chosenSet.add(edge); chosen.push(edge); }
				}
			};
			for (const edge of candidates) {
				const key = edge.source < edge.target ? `${edge.source}\u0000${edge.target}` : `${edge.target}\u0000${edge.source}`;
				if (routePairs.has(key)) { chosenSet.add(edge); chosen.push(edge); }
			}
			const crossCluster = candidates.filter((edge) => edge.source !== edge.target && this.nodeByPath.get(edge.source)?.clusterId !== this.nodeByPath.get(edge.target)?.clusterId && !chosenSet.has(edge));
			addSpread(crossCluster, Math.min(Math.floor(edgeLimit * 0.35), edgeLimit - chosen.length));
			const remainder = candidates.filter((edge) => !chosenSet.has(edge));
			addSpread(remainder, Math.max(0, edgeLimit - chosen.length));
			const clusters = this.clusterGroups.map((group) => group.filter((node) => selectedPaths.has(node.path))).filter((group) => group.length);
			return { nodes, edges: chosen, clusters };
		};
		const nodeLimit = Math.max(100, Math.min(3000, Number(this.plugin.settings.motion.maxVisibleNodes) || 600));
		const edgeLimit = Math.max(50, Math.min(2000, Number(this.plugin.settings.motion.maxVisibleLinks) || 400));
		return { full: buildLevel(nodeLimit, edgeLimit), balanced: buildLevel(Math.min(nodeLimit, 800), Math.min(edgeLimit, 400)), performance: buildLevel(Math.min(nodeLimit, 300), Math.min(edgeLimit, 120)) };
	}

	selectRenderLevel(quality) {
		const level = this.renderLevels[quality] || this.renderLevels.full || { nodes: this.nodes, edges: this.fullRenderEdges, clusters: this.clusterGroups };
		this.renderQuality = quality;
		this.renderNodes = level.nodes;
		this.renderNodePaths = new Set(level.nodes.map((node) => node.path));
		this.renderEdges = level.edges;
		this.renderClusterGroups = level.clusters;
		this.renderClusterLinkCount = this.renderEdges.reduce((total, edge) => total + (this.nodeByPath.get(edge.source)?.clusterId !== this.nodeByPath.get(edge.target)?.clusterId ? 1 : 0), 0);
		if (this.hoveredNode && !this.renderNodes.includes(this.hoveredNode)) { this.hoveredNode.hovered = false; this.hoveredNode = null; }
	}

	refreshRenderLevels() {
		if (!this.nodes.length || !this.renderLevels) return;
		this.renderLevels = this.buildRenderLevels();
		this.selectRenderLevel(this.resolveRenderQuality());
		this.scheduleDraw();
	}

	updatePerformanceIndicator() {
		if (!this.performanceIndicator) return;
		this.performanceIndicator.toggleClass('is-hidden', !this.plugin.settings.display.showPerformanceMetrics);
		if (!this.plugin.settings.display.showPerformanceMetrics) return;
		this.performanceIndicator.setText(`Build ${this.lastBuildMs.toFixed(0)} ms · Draw ${this.lastDrawMs.toFixed(1)} ms · ${this.renderQuality}`);
	}

	togglePathSelection() {
		this.pathPickMode = !this.pathPickMode;
		this.pendingPathStart = null;
		this.updatePathControls();
		new Notice(this.pathPickMode ? 'Click the note where the path should start.' : 'Note path selection cancelled.');
	}

	updatePathControls() {
		if (!this.pathButton) return;
		this.pathButton.setAttribute('aria-pressed', String(Boolean(this.pathPickMode)));
		this.pathButton.title = this.pathPickMode
			? (this.pendingPathStart ? 'Note Path: click a destination note' : 'Note Path: click a start note')
			: 'Note Path: select two notes to show the shortest linked path';
		this.pathButton.toggleClass('is-active', Boolean(this.pathPickMode));
		const interaction = this.plugin.settings.interaction;
		this.clearPathButton?.toggleClass('is-hidden', !interaction.pathPreview.length && !interaction.pathStartPath);
	}

	async selectPathNode(node) {
		if (node.isClusterSummary) {
			new Notice('Expand this cluster before selecting a note for the path.');
			return;
		}
		if (!this.pendingPathStart) {
			this.pendingPathStart = node.path;
			await this.plugin.setSetting('interaction', 'pathStartPath', node.path, false);
			this.updatePathControls();
			new Notice(`Start note: ${node.name}. Now click the destination note.`);
			return;
		}
		if (node.path === this.pendingPathStart) {
			new Notice('Choose a different destination note.');
			return;
		}
		const path = this.findShortestPath(this.pendingPathStart, node.path);
		if (!path.length) {
			new Notice('No linked path found between those notes in the current graph.');
			return;
		}
		await this.plugin.setSetting('interaction', 'pathPreview', path, false);
		this.pathPickMode = false;
		this.pendingPathStart = null;
		this.updatePathControls();
		new Notice(`Note path shown: ${path.length} notes.`);
	}

	async clearPathPreview() {
		this.plugin.settings.interaction.pathStartPath = null;
		this.plugin.settings.interaction.pathPreview = [];
		this.pathPickMode = false;
		this.pendingPathStart = null;
		await this.plugin.saveSettings();
		this.updatePathControls();
	}

	async toggleJourney() {
		if (this.journeyTimer) {
			window.clearInterval(this.journeyTimer);
			this.journeyTimer = null;
			this.journeyButton?.setText('START TRAVEL');
			return;
		}
		if (!this.nodes.length) { new Notice('No notes match the current graph filters.'); return; }
		const motion = this.plugin.settings.motion;
		const resumedReducedMotion = motion.reduceMotion;
		motion.animationEnabled = true;
		motion.reduceMotion = false;
		await this.plugin.saveSettings();
		if (resumedReducedMotion) new Notice('Travel started. Reduce Motion was turned off so the camera and route can animate.');
		this.journeyNodes = this.buildJourneyOrder();
		this.journeyIndex = -1;
		this.journeyButton?.setText('PAUSE TRAVEL');
		this.journeyTimer = window.setInterval(() => this.stepJourney(1), Math.max(1, this.plugin.settings.journey.nodePauseSeconds) * 1000);
		this.stepJourney(1);
	}

	stepJourney(direction) {
		if (!this.nodes.length) { new Notice('No notes match the current graph filters.'); return; }
		if (!this.journeyNodes.length || this.journeyNodes.some((path) => !this.nodeByPath.has(path))) this.journeyNodes = this.buildJourneyOrder();
		const length = this.journeyNodes.length;
		this.journeyIndex = (this.journeyIndex + direction + length) % length;
		this.focusedPath = this.journeyNodes[this.journeyIndex];
		const focused = this.nodeByPath.get(this.focusedPath);
		if (focused && this.graphLabel) this.graphLabel.setText(`3D NOTE SPACE  ·  ${focused.name}`);
		this.scheduleDraw();
	}

	buildJourneyOrder(mode = this.plugin.settings.mode) {
		const nodes = [...this.nodes];
		if (mode === 'recent-activity') return nodes.sort((a, b) => b.mtime - a.mtime).map((node) => node.path);
		if (mode === 'forgotten-knowledge') return nodes.sort((a, b) => a.mtime - b.mtime).map((node) => node.path);
		if (mode === 'hub-explorer') return nodes.sort((a, b) => b.degree - a.degree).map((node) => node.path);
		if (mode === 'hidden-gems') return nodes.sort((a, b) => a.degree - b.degree).map((node) => node.path);
		if (mode === 'orphan-hunt') return nodes.map((node) => node.path);
		if (mode === 'path-journey') {
			const visited = new Set();
			const route = [];
			const activePath = this.app.workspace.getActiveFile()?.path;
			const starts = [...nodes].sort((a, b) => a.index - b.index);
			const activeIndex = starts.findIndex((node) => node.path === activePath);
			if (activeIndex > 0) starts.unshift(...starts.splice(activeIndex, 1));
			for (const start of starts) {
				if (visited.has(start.path)) continue;
				visited.add(start.path); route.push(start.path);
				const stack = [{ path: start.path, neighbors: [...(this.adjacency.get(start.path) || [])].sort((a, b) => (this.nodeByPath.get(a)?.index || 0) - (this.nodeByPath.get(b)?.index || 0)), next: 0 }];
				while (stack.length) {
					const current = stack[stack.length - 1];
					while (current.next < current.neighbors.length && visited.has(current.neighbors[current.next])) current.next++;
					if (current.next >= current.neighbors.length) {
						stack.pop();
						if (stack.length) route.push(stack[stack.length - 1].path);
						continue;
					}
					const nextPath = current.neighbors[current.next++];
					visited.add(nextPath); route.push(nextPath);
					stack.push({ path: nextPath, neighbors: [...(this.adjacency.get(nextPath) || [])].sort((a, b) => (this.nodeByPath.get(a)?.index || 0) - (this.nodeByPath.get(b)?.index || 0)), next: 0 });
				}
			}
			return route;
		}
		const adjacency = new Map(nodes.map((node) => [node.path, []]));
		for (const edge of this.edges) {
			adjacency.get(edge.source)?.push(edge.target);
			adjacency.get(edge.target)?.push(edge.source);
		}
		const remaining = new Set(nodes.map((node) => node.path));
		const activePath = this.app.workspace.getActiveFile()?.path;
		let current = remaining.has(activePath) ? activePath : nodes[Math.floor(Math.random() * nodes.length)].path;
		const route = [];
		while (remaining.size) {
			route.push(current);
			remaining.delete(current);
			const neighbors = (adjacency.get(current) || []).filter((path) => remaining.has(path));
			current = neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : [...remaining][Math.floor(Math.random() * remaining.size)];
		}
		return route;
	}

	getSpaceflightPoint(progress) {
		if (!this.spaceflightWaypoints) {
			this.spaceflightWaypoints = this.buildJourneyOrder('path-journey')
				.map((path) => this.nodeByPath.get(path))
				.filter(Boolean);
		}
		const waypoints = this.spaceflightWaypoints;
		if (!waypoints.length) return null;
		if (waypoints.length === 1) return { ...waypoints[0], dx: 0, dy: 0, dz: 1 };
		const position = ((progress % waypoints.length) + waypoints.length) % waypoints.length;
		const index = Math.floor(position);
		const from = waypoints[index]; const to = waypoints[(index + 1) % waypoints.length];
		const amount = position - index;
		return {
			x: from.x + (to.x - from.x) * amount,
			y: from.y + (to.y - from.y) * amount,
			z: from.z + (to.z - from.z) * amount,
			dx: to.x - from.x, dy: to.y - from.y, dz: to.z - from.z,
		};
	}

	updateMetrics(files) {
		const folders = new Set(files.map((file) => file.parent?.path).filter(Boolean));
		const linked = new Set(this.edges.flatMap((edge) => [edge.source, edge.target])).size;
		this.root.querySelector('[data-metric="metric-notes"]')?.setText(String(files.length));
		this.root.querySelector('[data-metric="metric-linked"]')?.setText(String(linked));
		this.root.querySelector('[data-metric="metric-folders"]')?.setText(String(folders.size));
		this.root.querySelector('[data-metric="metric-activity"]')?.setText(String(this.plugin.activity.length));
	}

	renderActivity() {
		this.activityList?.empty();
		if (!this.plugin.activity.length) {
			this.activityList?.createDiv({ cls: 'swarm-empty', text: 'Waiting for vault changes…' });
			return;
		}
		for (const event of this.plugin.activity.slice(0, 5)) {
			const row = this.activityList.createDiv({ cls: 'swarm-event' });
			row.createSpan({ cls: `swarm-event-dot ${event.kind}` });
			row.createSpan({ cls: 'swarm-event-text', text: `${event.kind} · ${event.name}` });
			row.createSpan({ cls: 'swarm-event-time', text: event.time });
		}
	}

	resizeCanvas() {
		if (!this.canvas) return;
		const rect = this.canvas.getBoundingClientRect();
		const quality = this.resolveRenderQuality();
		const dprLimit = quality === 'performance' ? 1 : quality === 'balanced' ? 1.35 : 1.75;
		const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
		const canvasWidth = Math.max(1, Math.floor(rect.width * dpr));
		const canvasHeight = Math.max(1, Math.floor(rect.height * dpr));
		if (this.canvas.width === canvasWidth && this.canvas.height === canvasHeight) return;
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.scheduleDraw();
	}

	fitNetwork() {
		this.zoom = 1;
		this.panX = 0; this.panY = 0;
		this.rotation = 0; this.tiltOffset = 0;
		this.manualCameraControl = false;
		this.scheduleDraw();
		this.controlSettings?.syncCameraControls();
	}

	optimizeView() {
		const width = this.canvas?.clientWidth || 0;
		const height = this.canvas?.clientHeight || 0;
		const projected = this.renderNodes.filter((node) => Number.isFinite(node.screenX) && Number.isFinite(node.screenY));
		if (!projected.length || width < 1 || height < 1) {
			new Notice('There are no visible notes to fit.');
			return;
		}
		const minX = Math.min(...projected.map((node) => node.screenX));
		const maxX = Math.max(...projected.map((node) => node.screenX));
		const minY = Math.min(...projected.map((node) => node.screenY));
		const maxY = Math.max(...projected.map((node) => node.screenY));
		const centerX = (minX + maxX) / 2;
		const centerY = (minY + maxY) / 2;
		const fitScale = Math.min((width - 80) / Math.max(1, maxX - minX), (height - 80) / Math.max(1, maxY - minY));
		const oldZoom = this.zoom || 1;
		const nextZoom = Math.max(0.1, Math.min(12, oldZoom * fitScale * 0.94));
		const appliedScale = nextZoom / oldZoom;
		this.zoom = nextZoom;
		this.panX = (this.panX + width / 2 - centerX) * appliedScale;
		this.panY = (this.panY + height / 2 - centerY) * appliedScale;
		this.scheduleDraw();
		this.controlSettings?.syncCameraControls();
		new Notice('View optimized to fit visible notes.');
	}

	draw() {
		if (!this.ctx || !this.canvas?.isConnected) return;
		const drawStartedAt = performance.now();
		const ctx = this.ctx;
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		if (!width || !height) return;
		ctx.clearRect(0, 0, width, height);
		const motion = this.plugin.settings.motion;
		const display = this.plugin.settings.display;
		const visual = this.plugin.settings.visual;
		const nextQuality = this.resolveRenderQuality();
		const renderLevel = this.renderLevels[nextQuality] || this.renderLevels.full || { nodes: this.nodes, edges: this.fullRenderEdges, clusters: this.clusterGroups };
		if (nextQuality !== this.renderQuality || this.renderNodes !== renderLevel.nodes) {
			this.selectRenderLevel(nextQuality);
			this.resizeCanvas();
		}
		const renderNodes = this.renderNodes;
		const renderNodePaths = this.renderNodePaths || new Set();
		const animationClock = performance.now() * 0.06 * motion.animationSpeed;
		if (motion.animationEnabled) this.frame += motion.animationSpeed;
		const spaceflightActive = motion.animationStyle === 'spaceflight' && motion.animationEnabled && !motion.reduceMotion && !this.manualCameraControl && this.nodes.length > 0;
		let flightCamera = null; let flightSpin = 0; let flightTilt = 0;
		if (spaceflightActive) {
			const flightRate = Math.max(0.08, motion.animationSpeed * motion.cameraSpeed * 1.8);
			const flightProgress = performance.now() / 1000 * flightRate;
			flightCamera = this.getSpaceflightPoint(flightProgress);
			const lookAhead = this.getSpaceflightPoint(flightProgress + 0.22);
			if (flightCamera && lookAhead) {
				const dx = lookAhead.x - flightCamera.x; const dy = lookAhead.y - flightCamera.y; const dz = lookAhead.z - flightCamera.z;
				flightSpin = Math.atan2(dx, dz);
				flightTilt = Math.atan2(dy, Math.hypot(dx, dz));
				if (this.spaceflightWasActive) {
					this.rotation += Math.atan2(Math.sin(flightSpin - this.rotation), Math.cos(flightSpin - this.rotation)) * 0.075;
					this.tiltOffset += (flightTilt - this.tiltOffset) * 0.075;
				} else {
					this.rotation = flightSpin; this.tiltOffset = flightTilt;
				}
				flightSpin = this.rotation; flightTilt = this.tiltOffset;
			}
		}
		this.spaceflightWasActive = spaceflightActive;
		if (display.showSceneBackground) this.drawBackground(ctx, width, height, motion);
		if (display.showSceneBackground && display.showBackgroundParticles && spaceflightActive) this.drawSpaceflightStreaks(ctx, width, height, motion);
		const timelineMode = this.plugin.settings.visual === 'timeline-map';
		const staticCamera = motion.animationStyle === 'static';
		const animatedSpin = staticCamera || timelineMode || this.manualCameraControl || spaceflightActive ? 0 : this.frame * 0.0018 * (motion.reduceMotion ? 0.2 : motion.cameraSpeed);
		let focusedNode = staticCamera || this.manualCameraControl || spaceflightActive ? null : this.nodeByPath.get(this.focusedPath);
		if (!staticCamera && !this.manualCameraControl && !focusedNode && motion.animationStyle === 'cluster-tour' && this.nodes.length) {
			const clusters = this.clusterTourTargets || [];
			const pause = Math.max(1, motion.clusterPauseSeconds) * 1000;
			const activeCluster = clusters[Math.floor(Date.now() / pause) % clusters.length];
			if (activeCluster) focusedNode = { x: activeCluster.clusterCenterX, y: activeCluster.clusterCenterY, z: activeCluster.clusterCenterZ };
		}
		if (focusedNode) {
			const yaw = Math.atan2(focusedNode.x, focusedNode.z) - animatedSpin;
			const pitch = Math.atan2(focusedNode.y, Math.hypot(focusedNode.x, focusedNode.z));
			const naturalTilt = !staticCamera && !this.manualCameraControl && motion.animationEnabled && !motion.reduceMotion ? Math.sin(this.frame * 0.0007) * 0.22 : 0;
			if (motion.animationEnabled) {
				this.rotation += Math.atan2(Math.sin(yaw - this.rotation), Math.cos(yaw - this.rotation)) * 0.045;
				this.tiltOffset += (pitch - naturalTilt - this.tiltOffset) * 0.045;
			} else {
				this.rotation = yaw;
				this.tiltOffset = pitch;
			}
		}
		const spin = spaceflightActive ? flightSpin : this.rotation + animatedSpin;
		const tilt = spaceflightActive ? flightTilt : this.tiltOffset + (!staticCamera && !this.manualCameraControl && !timelineMode && motion.animationEnabled && !motion.reduceMotion ? Math.sin(this.frame * 0.0007) * 0.22 : 0);
		const radius = (timelineMode ? width * 0.37 : Math.min(width, height) * (motion.reduceMotion ? 0.34 : 0.39)) * (this.zoom || 1);
		const focalLength = 4.5 - motion.perspectiveStrength * 1.3;
		if (this.plugin.settings.visual === 'timeline-map') this.drawTimelineAxis(ctx, width, height);
		if (['signal-radar', 'satellite-view'].includes(this.plugin.settings.visual)) this.drawRadar(ctx, width, height, radius, this.plugin.settings.visual);
		for (const node of renderNodes) {
			let nx = node.x; let ny = node.y; let nz = node.z;
			if (flightCamera) { nx -= flightCamera.x; ny -= flightCamera.y; nz -= flightCamera.z; }
			if (motion.animationEnabled && motion.noteMotionEnabled && !motion.reduceMotion && ['cluster-orbit', 'swarm', 'blob-order'].includes(motion.animationStyle)) {
				const angle = this.frame * (motion.animationStyle === 'swarm' ? 0.0022 : 0.006) + node.clusterId * 0.73;
				const dx = nx - node.clusterCenterX; const dz = nz - node.clusterCenterZ;
				const turnX = dx * Math.cos(angle) - dz * Math.sin(angle);
				const turnZ = dx * Math.sin(angle) + dz * Math.cos(angle);
				if (motion.animationStyle === 'swarm') {
					const phase = this.frame * 0.004 + node.clusterId * 1.9;
					nx = node.clusterCenterX + turnX + Math.sin(phase) * 0.13;
					ny += Math.sin(phase * 0.83 + node.phase) * 0.07;
					nz = node.clusterCenterZ + turnZ + Math.cos(phase * 0.71) * 0.13;
				} else if (motion.animationStyle === 'blob-order') {
					const breathe = 1 + Math.sin(this.frame * 0.008 + node.clusterId * 1.4) * 0.18;
					nx = node.clusterCenterX + turnX * breathe;
					nz = node.clusterCenterZ + turnZ * breathe;
					ny = node.clusterCenterY + (ny - node.clusterCenterY) * breathe + Math.sin(this.frame * 0.006 + node.phase) * 0.025;
				} else {
					nx = node.clusterCenterX + turnX;
					nz = node.clusterCenterZ + turnZ;
				}
			}
			if (motion.animationEnabled && motion.noteMotionEnabled && !motion.reduceMotion && motion.animationStyle === 'node-drift') {
				const drift = motion.nodeDriftStrength;
				nx += Math.sin(this.frame * 0.012 + node.phase) * drift;
				ny += Math.cos(this.frame * 0.009 + node.phase) * drift;
				nz += Math.sin(this.frame * 0.01 + node.phase * 1.7) * drift;
			}
			if (motion.animationEnabled && motion.noteMotionEnabled && !motion.reduceMotion && motion.animationStyle === 'chaos') {
				const drift = motion.nodeDriftStrength * 1.8;
				nx += (Math.sin(this.frame * 0.014 + node.phase) + Math.sin(this.frame * 0.006 + node.phase * 2.3) * 0.45) * drift;
				ny += (Math.cos(this.frame * 0.011 + node.phase * 1.3) + Math.sin(this.frame * 0.005 + node.phase * 3.1) * 0.4) * drift;
				nz += (Math.sin(this.frame * 0.012 + node.phase * 1.7) + Math.cos(this.frame * 0.007 + node.phase * 2.1) * 0.45) * drift;
			}
			const rx = nx * Math.cos(spin) - nz * Math.sin(spin);
			const rz = nx * Math.sin(spin) + nz * Math.cos(spin);
			const ry = ny * Math.cos(tilt) - rz * Math.sin(tilt);
			const depth = ny * Math.sin(tilt) + rz * Math.cos(tilt);
			const perspective = focalLength / (focalLength - depth);
			node.screenX = width / 2 + this.panX + rx * radius * perspective + node.offsetX * width;
			node.screenY = height / 2 + this.panY + ry * radius * perspective + node.offsetY * height;
			node.depth = depth;
			node.perspective = perspective;
			node.color = this.getNodeColor(node);
		}
		const nodeMap = this.nodeByPath;
		const simplifiedRendering = this.renderQuality !== 'full' || this.nodes.length > 240 || this.renderEdges.length > 1400;
		const sortedEdges = simplifiedRendering ? this.renderEdges : [...this.renderEdges].sort((a, b) => {
			const depthA = (nodeMap.get(a.source)?.depth || 0) + (nodeMap.get(a.target)?.depth || 0);
			const depthB = (nodeMap.get(b.source)?.depth || 0) + (nodeMap.get(b.target)?.depth || 0);
			return depthA - depthB;
		});
		const edgeStride = simplifiedRendering ? Math.max(1, Math.ceil(sortedEdges.length / 2400)) : 1;
		const animationStride = simplifiedRendering ? Math.max(1, Math.ceil(sortedEdges.length / 900)) : 1;
		const crossClusterStride = simplifiedRendering ? Math.max(1, Math.ceil((this.renderClusterLinkCount || 0) / 600)) : 1;
		const interaction = this.plugin.settings.interaction;
		const routeEdges = new Set();
		const routeNodes = new Set();
		const routeOrder = new Map();
		let previousRouteNode = null;
		const discoveryRouteActive = Boolean(this.journeyTimer) && ['wander', 'path-journey'].includes(this.plugin.settings.mode);
		const routeWindowStart = Math.max(0, this.journeyIndex - 80);
		const journeyRouteWindow = discoveryRouteActive ? this.journeyNodes.slice(routeWindowStart, routeWindowStart + 160) : [];
		const visibleRoute = interaction.pathPreview.length ? interaction.pathPreview : journeyRouteWindow;
		for (const sourcePath of visibleRoute) {
			const displayPath = this.pathDisplayBySource?.get(sourcePath);
			if (!displayPath || !nodeMap.has(displayPath)) { previousRouteNode = null; continue; }
			routeNodes.add(displayPath);
			if (!routeOrder.has(displayPath)) routeOrder.set(displayPath, routeOrder.size);
			if (previousRouteNode && previousRouteNode !== displayPath) {
				routeEdges.add(`${previousRouteNode}|${displayPath}`);
				routeEdges.add(`${displayPath}|${previousRouteNode}`);
			}
			previousRouteNode = displayPath;
		}
		const hoveredNode = this.hoveredNode;
		const hoveredNeighborhood = new Set(hoveredNode ? [hoveredNode.path] : []);
		if (hoveredNode) for (const path of this.adjacency.get(hoveredNode.path) || []) if (renderNodePaths.has(path)) hoveredNeighborhood.add(path);
		if (display.showDepthLayers) this.drawDepthLayers(ctx, width, height, radius);
		if (display.showClusterHalos) this.drawClusterHalos(ctx, width, height, visual, this.renderClusterGroups);
		if (simplifiedRendering) ctx.setLineDash([]);
		let crossClusterIndex = 0;
		for (let edgeIndex = 0; edgeIndex < sortedEdges.length; edgeIndex++) {
			const edge = sortedEdges[edgeIndex];
			const a = nodeMap.get(edge.source);
			const b = nodeMap.get(edge.target);
			if (!a || !b) continue;
			if ((a.screenX < 0 && b.screenX < 0) || (a.screenX > width && b.screenX > width) || (a.screenY < 0 && b.screenY < 0) || (a.screenY > height && b.screenY > height)) continue;
			const isRoute = routeEdges.has(`${edge.source}|${edge.target}`) || routeEdges.has(`${edge.target}|${edge.source}`);
			const isClusterLink = a.clusterId !== b.clusterId;
			const keepClusterLink = isClusterLink && crossClusterIndex++ % crossClusterStride === 0;
			const animateLine = !simplifiedRendering || keepClusterLink || edgeIndex % animationStride === 0;
			if (edgeIndex % edgeStride !== 0 && !isRoute && !keepClusterLink) continue;
			if (!display.showLinks && !isRoute) continue;
			const isNeighbor = hoveredNode && hoveredNeighborhood.has(edge.source) && hoveredNeighborhood.has(edge.target);
			const alpha = isRoute ? 0.94 : Math.max(isClusterLink ? 0.16 : 0.025, Math.min(isClusterLink ? 0.72 : 0.5, (0.1 + (a.depth + b.depth) * 0.06 + Math.min(edge.count, 4) * 0.025 + (isClusterLink ? 0.24 : 0)) * (hoveredNode && !isNeighbor ? 0.25 : 1)));
			const pathStyle = motion.pathAnimationStyle;
			ctx.beginPath();
			ctx.moveTo(a.screenX, a.screenY);
			if (this.plugin.settings.visual === 'circuit-minimal') {
				const middleX = (a.screenX + b.screenX) / 2;
				ctx.lineTo(middleX, a.screenY); ctx.lineTo(middleX, b.screenY); ctx.lineTo(b.screenX, b.screenY);
			} else if (this.plugin.settings.visual === 'thread-weaver') {
				const bend = ((edge.renderIndex % 2) ? 1 : -1) * Math.min(45, Math.hypot(b.screenX - a.screenX, b.screenY - a.screenY) * 0.15);
				ctx.quadraticCurveTo((a.screenX + b.screenX) / 2 + bend, (a.screenY + b.screenY) / 2 - bend, b.screenX, b.screenY);
			} else ctx.lineTo(b.screenX, b.screenY);
			const linkColor = a.color;
			ctx.strokeStyle = isRoute ? `rgba(255, 195, 105, ${alpha})` : isClusterLink ? `rgba(190, 225, 255, ${alpha})` : `rgba(${linkColor}, ${alpha})`;
			ctx.lineWidth = (0.5 + Math.min(edge.count, 4) * 0.13) * display.edgeThickness * ((a.perspective + b.perspective) / 2);
			const lineStyle = motion.lineAnimationStyle;
			const linkMotionEnabled = animateLine && motion.animationEnabled && motion.linkAnimationEnabled && !motion.reduceMotion;
			const routeMotionEnabled = isRoute && motion.animationEnabled && motion.routeAnimationEnabled && !motion.reduceMotion && pathStyle !== 'static';
			const useDashes = (linkMotionEnabled && lineStyle === 'dashes') || (isRoute && pathStyle === 'dashes' && routeMotionEnabled);
			if (useDashes) {
				ctx.setLineDash([5, 7]);
				ctx.lineDashOffset = -(motion.animationEnabled ? this.frame : performance.now() * 0.06) * 0.12 * motion.connectionPulseSpeed;
			}
			if (isRoute && pathStyle === 'glow') { ctx.shadowColor = 'rgba(255,191,91,.85)'; ctx.shadowBlur = 10; }
			ctx.stroke();
			ctx.shadowBlur = 0;
			if (!simplifiedRendering || useDashes) ctx.setLineDash([]);
			if (linkMotionEnabled && ['flow', 'pulse'].includes(lineStyle)) {
				const progress = (animationClock * 0.008 * motion.connectionPulseSpeed + edge.renderIndex * 0.137) % 1;
				const px = a.screenX + (b.screenX - a.screenX) * progress;
				const py = a.screenY + (b.screenY - a.screenY) * progress;
				ctx.beginPath();
				ctx.arc(px, py, 2.4 + Math.min(edge.count, 3) * 0.35, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(145, 245, 255, 0.92)';
				ctx.shadowColor = 'rgba(92, 230, 255, 0.9)';
				ctx.shadowBlur = 8;
				ctx.fill();
				ctx.shadowBlur = 0;
			}
			if (linkMotionEnabled && lineStyle === 'draw') {
				const progress = (animationClock * 0.009 * motion.connectionPulseSpeed + edge.renderIndex * 0.137) % 1;
				ctx.beginPath(); ctx.moveTo(a.screenX, a.screenY);
				ctx.lineTo(a.screenX + (b.screenX - a.screenX) * progress, a.screenY + (b.screenY - a.screenY) * progress);
				ctx.strokeStyle = `rgba(145, 245, 255, ${Math.min(0.9, alpha + 0.3)})`; ctx.stroke();
			}
			if (routeMotionEnabled && ['comet', 'draw'].includes(pathStyle)) {
				const sourceIndex = routeOrder.get(edge.source) ?? -1;
				const targetIndex = routeOrder.get(edge.target) ?? -1;
				const routeIndex = Math.min(sourceIndex, targetIndex);
				const forward = sourceIndex >= 0 && sourceIndex < targetIndex;
				const start = forward ? a : b; const end = forward ? b : a;
				const phase = (animationClock * 0.012 * motion.connectionPulseSpeed + Math.max(0, routeIndex) * 0.23) % 1;
				ctx.beginPath();
				if (pathStyle === 'draw') {
					const progress = phase < 0.72 ? phase / 0.72 : 1;
					const px = start.screenX + (end.screenX - start.screenX) * progress;
					const py = start.screenY + (end.screenY - start.screenY) * progress;
					ctx.moveTo(start.screenX, start.screenY); ctx.lineTo(px, py);
					ctx.strokeStyle = 'rgba(255,225,155,.98)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(255,191,91,.95)'; ctx.shadowBlur = 9; ctx.stroke(); ctx.shadowBlur = 0;
				} else {
					const progress = phase;
					const px = start.screenX + (end.screenX - start.screenX) * progress;
					const py = start.screenY + (end.screenY - start.screenY) * progress;
					ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,229,166,.98)'; ctx.shadowColor = 'rgba(255,191,91,.95)'; ctx.shadowBlur = 13; ctx.fill(); ctx.shadowBlur = 0;
				}
			}
		}
		const orderedNodes = simplifiedRendering ? renderNodes : [...renderNodes].sort((a, b) => a.depth - b.depth);
		const activeNodePath = this.app.workspace.getActiveFile()?.path;
		const glowScale = visual === 'neon' || visual === 'neural-bloom' || visual === 'soft-glow' || visual === 'deep-space' || visual === 'star-system' ? 3.8 : visual === 'glass-minimal' || visual === 'minimal' || visual === 'circuit-minimal' ? 1.8 : 2.7;
		for (const node of orderedNodes) {
			if (!Number.isFinite(node.screenX) || !Number.isFinite(node.screenY) || node.screenX < -40 || node.screenX > width + 40 || node.screenY < -40 || node.screenY > height + 40) continue;
			const pulse = simplifiedRendering ? 1 : 0.78 + Math.sin(this.frame * 0.018 + node.phase) * 0.22;
			const nodeRadius = Math.min(7, 2.1 + Math.sqrt(node.degree) * 0.8) * display.nodeSize * node.perspective;
			const hue = node.color;
			if (motion.glowEnabled && !['minimal', 'circuit-minimal', 'glass-minimal', 'academic-light', 'ink-map', 'research-board'].includes(visual)) {
				ctx.beginPath();
				this.traceNodeShape(ctx, node.screenX, node.screenY, nodeRadius * glowScale * pulse, visual);
				const glowAlpha = Math.max(0.11, Math.min(0.26, 0.16 + node.depth * 0.025));
				ctx.fillStyle = `rgba(${hue}, ${glowAlpha})`;
				ctx.fill();
			}
			ctx.save();
			if (motion.glowEnabled && (!simplifiedRendering || node.hovered || node.focused) && !['minimal', 'circuit-minimal', 'glass-minimal', 'academic-light', 'ink-map', 'research-board'].includes(visual)) {
				ctx.shadowColor = `rgba(${hue}, .9)`;
				ctx.shadowBlur = Math.max(7, nodeRadius * 2.2);
			}
			ctx.beginPath();
			this.traceNodeShape(ctx, node.screenX, node.screenY, nodeRadius * pulse, visual);
			const isNeighbor = hoveredNode && hoveredNeighborhood.has(node.path);
			const isRouteNode = routeNodes.has(node.path);
			const focusFade = visual === 'focus-lens' && !node.focused && node.path !== activeNodePath && !node.hovered ? 0.34 : 1;
			const fade = (hoveredNode && !isNeighbor ? 0.22 : 1) * focusFade * (routeNodes.size && !isRouteNode ? 0.32 : 1);
			ctx.fillStyle = `rgba(${hue}, ${Math.max(0.18, Math.min(0.95, 0.58 + node.depth * 0.28)) * fade})`;
			ctx.fill();
			if (['glass-minimal', 'academic-light', 'research-board', 'neon', 'deep-space', 'constellation', 'mind-palace', 'archive-fog', 'soft-glow'].includes(visual)) {
				ctx.beginPath();
				this.traceNodeShape(ctx, node.screenX, node.screenY, nodeRadius * pulse * (visual === 'mind-palace' ? 0.58 : 0.78), visual);
				ctx.lineWidth = visual === 'neon' ? 1.4 : visual === 'glass-minimal' ? 1.1 : visual === 'soft-glow' ? 0.9 : 0.8;
				ctx.strokeStyle = visual === 'neon' ? `rgba(${hue}, .95)` : visual === 'deep-space' ? 'rgba(211,198,255,.8)' : visual === 'constellation' ? 'rgba(198,239,255,.85)' : visual === 'mind-palace' ? 'rgba(255,208,145,.75)' : visual === 'archive-fog' ? 'rgba(223,197,159,.55)' : visual === 'soft-glow' ? `rgba(${hue}, .64)` : 'rgba(34,48,58,.7)';
				if (['neon', 'soft-glow'].includes(visual) && !simplifiedRendering && motion.glowEnabled) { ctx.shadowColor = `rgba(${hue}, .95)`; ctx.shadowBlur = visual === 'neon' ? 8 : 4; }
				ctx.stroke(); ctx.shadowBlur = 0;
				if (visual === 'archive-fog' && nodeRadius > 2) {
					ctx.beginPath(); ctx.arc(node.screenX, node.screenY, nodeRadius * 1.65, 0, Math.PI * 2);
					ctx.strokeStyle = 'rgba(223,197,159,.16)'; ctx.lineWidth = 1; ctx.stroke();
				}
				if (visual === 'constellation' && nodeRadius > 2.5) {
					const ray = nodeRadius * 1.7; ctx.beginPath();
					ctx.moveTo(node.screenX - ray, node.screenY); ctx.lineTo(node.screenX + ray, node.screenY);
					ctx.moveTo(node.screenX, node.screenY - ray); ctx.lineTo(node.screenX, node.screenY + ray);
					ctx.strokeStyle = 'rgba(198,239,255,.48)'; ctx.lineWidth = 0.7; ctx.stroke();
				}
			}
			ctx.restore();
			if (display.showNodeIcons && nodeRadius > 3) {
				const lightVisual = ['research-board', 'academic-light', 'ink-map'].includes(visual);
				const lightBackground = ['white', 'paper'].includes(motion.backgroundStyle) || (motion.backgroundStyle === 'nebula' && lightVisual);
				ctx.fillStyle = lightBackground ? '#17222b' : '#071015';
				ctx.font = `600 ${Math.max(5, nodeRadius * 1.15)}px sans-serif`;
				ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
				ctx.fillText(node.name.slice(0, 1).toUpperCase(), node.screenX, node.screenY + 0.3);
				ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
			}
			if (node.pinned || node.focused || isRouteNode) {
				ctx.beginPath();
				ctx.arc(node.screenX, node.screenY, nodeRadius + (isRouteNode ? 7 : node.focused ? 6 : 4), 0, Math.PI * 2);
				ctx.strokeStyle = isRouteNode ? 'rgba(255, 195, 105, 1)' : node.focused ? 'rgba(255, 205, 112, 1)' : 'rgba(255, 205, 112, 0.72)';
				ctx.lineWidth = isRouteNode ? 2.4 : node.focused ? 1.8 : 1.2;
				if (isRouteNode) { ctx.shadowColor = 'rgba(255, 191, 91, .85)'; ctx.shadowBlur = 10; }
				ctx.stroke();
				ctx.shadowBlur = 0;
			}
		}
		if (display.showLabels) {
			const labelLimit = this.renderQuality === 'performance' ? 90 : this.renderQuality === 'balanced' ? 240 : 450;
			const labelStride = Math.max(1, Math.ceil(renderNodes.length / labelLimit));
			const lightVisual = ['research-board', 'academic-light', 'ink-map'].includes(visual);
			const lightStyle = ['white', 'paper'].includes(motion.backgroundStyle) || (motion.backgroundStyle === 'nebula' && lightVisual);
			ctx.save();
			ctx.font = `${display.labelSize}px var(--font-monospace)`;
			ctx.lineWidth = 3;
			ctx.lineJoin = 'round';
			ctx.strokeStyle = lightStyle ? 'rgba(255,255,255,.88)' : 'rgba(3,8,12,.88)';
			for (const node of orderedNodes) {
				if (node.screenX < -40 || node.screenX > width + 40 || node.screenY < -40 || node.screenY > height + 40) continue;
				const isRouteNode = routeNodes.has(node.path);
				if (!node.hovered && !node.focused && !isRouteNode && node.index % labelStride !== 0) continue;
				const nodeRadius = Math.min(7, 2.1 + Math.sqrt(node.degree) * 0.8) * display.nodeSize * node.perspective;
				const label = node.name.slice(0, 26);
				const x = node.screenX + nodeRadius + 5;
				const y = node.screenY + 3;
				ctx.fillStyle = node.hovered ? (lightStyle ? '#17222b' : '#fff') : lightStyle ? 'rgba(35,48,55,.82)' : visual === 'matrix-hacker' ? 'rgba(156,255,178,.95)' : 'rgba(220,232,240,.9)';
				ctx.strokeText(label, x, y);
				ctx.fillText(label, x, y);
			}
			ctx.restore();
		}
		const clockSecond = Math.floor(Date.now() / 1000);
		if (clockSecond !== this.lastClockSecond) {
			const clockLabel = new Date(clockSecond * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			this.clock?.setText(clockLabel);
			this.lastClockSecond = clockSecond;
		}
		if (display.showFps) {
			this.fpsFrames++;
			const now = performance.now();
			if (now - this.fpsLast >= 1000) {
				const fpsLabel = `${Math.round(this.fpsFrames * 1000 / (now - this.fpsLast))} FPS`;
				if (fpsLabel !== this.lastFpsLabel) this.fpsIndicator?.setText(fpsLabel);
				this.lastFpsLabel = fpsLabel;
				this.fpsFrames = 0;
				this.fpsLast = now;
			}
		} else if (this.lastFpsLabel) {
			this.fpsIndicator?.setText('');
			this.lastFpsLabel = '';
		}
		this.lastDrawMs = performance.now() - drawStartedAt;
		this.averageDrawMs = this.averageDrawMs ? this.averageDrawMs * 0.86 + this.lastDrawMs * 0.14 : this.lastDrawMs;
		if (performance.now() - this.performanceUiAt > 500) {
			this.updatePerformanceIndicator();
			this.performanceUiAt = performance.now();
		}
		if (motion.animationEnabled) this.scheduleDraw();
	}

	getNodeColor(node) {
		const scheme = this.plugin.settings.colors;
		const motion = this.plugin.settings.motion;
		const degreeRatio = Math.max(0, Math.min(1, node.degree / 12));
		const animationOffset = motion.animationEnabled && motion.colorAnimationEnabled && !motion.reduceMotion ? this.frame * motion.colorSpeed * 1.5 : 0;
		if (this.cachedPaletteSource !== this.plugin.settings.customPalette) {
			this.cachedPaletteSource = this.plugin.settings.customPalette;
			this.cachedCustomPalette = (String(this.cachedPaletteSource || '').match(/#?[\da-f]{6}\b/gi) || []).map(colorFromHex).filter(Boolean);
		}
		const palette = this.cachedCustomPalette?.length ? this.cachedCustomPalette : COLOR_PALETTES.clusters;
		const paletteColor = (colors, index) => colors[Math.abs(index) % colors.length];
		const profile = COLOR_PROFILE_CONFIG[scheme];
		if (profile) {
			const profileIndex = profile.byDegree ? Math.round(degreeRatio * 5) : (profile.byCluster || profile.hues) ? node.clusterId : 0;
			const profileHue = profile.hues
				? profile.hues[Math.abs(profileIndex) % profile.hues.length] + Math.floor(Math.abs(profileIndex) / profile.hues.length) * profile.step
				: profile.hue + profileIndex * profile.step;
			const profileSaturation = profile.saturation * (profile.focusFade && !node.focused && !node.hovered ? 0.32 : 1);
			const profileLightness = profile.byDegree ? profile.lightness + degreeRatio * 0.16 : profile.lightness;
			return colorFromHsl(profileHue + (profile.animated ? animationOffset : 0), profileSaturation, profileLightness);
		}
		switch (scheme) {
		case 'deep-ocean': return node.degree > 5 ? '104, 166, 255' : '93, 218, 229';
		case 'monochrome': return '198, 211, 220';
		case 'violet': return node.degree > 5 ? '205, 139, 255' : '127, 190, 255';
		case 'ember': return node.degree > 5 ? '255, 111, 82' : '255, 202, 106';
		case 'sunset': return paletteColor(COLOR_PALETTES.sunset, node.clusterId);
		case 'forest': return paletteColor(COLOR_PALETTES.forest, node.clusterId);
		case 'pastel': return colorFromHsl(node.index * 47 + node.clusterId * 18, 0.58, 0.72);
		case 'custom-palette': case 'multi-color': return paletteColor(palette, node.clusterId);
		case 'single-color': return palette[0];
		case 'dual-color': return palette[node.degree > 4 ? Math.min(1, palette.length - 1) : 0];
		case 'clusters': case 'cluster-based': return paletteColor(COLOR_PALETTES.clusters, node.clusterId);
		case 'tag-based': return paletteColor(COLOR_PALETTES.clusters, node.tagHash);
		case 'folder-based': return paletteColor(COLOR_PALETTES.clusters, node.folderHash);
		case 'age-gradient': case 'gradient': return colorFromHsl(155 - node.ageRatio * 135, 0.78, 0.56);
		case 'age-based': return colorFromHsl(210 - node.ageRatio * 195, 0.8, 0.54);
		case 'connection-count': return colorFromHsl(195 - degreeRatio * 150, 0.84, 0.42 + degreeRatio * 0.16);
		case 'heatmap': return colorFromHsl(225 - degreeRatio * 225, 0.92, 0.52);
		case 'galaxy-core': return colorFromHsl(275 - degreeRatio * 220, 0.88, 0.5 + degreeRatio * 0.08);
		case 'terminal-amber': return colorFromHsl(38, 0.96, 0.27 + degreeRatio * 0.3);
		case 'activity-based': return colorFromHsl(35 + node.recentActivityRatio * 105, 0.82, 0.46);
		case 'rainbow-flow': return colorFromHsl(node.index * 29 + animationOffset, 0.9, 0.6);
		case 'rainbow': return colorFromHsl(node.index * 29, 0.9, 0.6);
		case 'animated-gradient': return colorFromHsl(185 + node.ageRatio * 115 + animationOffset, 0.85, 0.58);
		default: return node.degree > 5 ? '255, 115, 180' : '103, 224, 221';
		}
	}

	traceNodeShape(ctx, x, y, size, style) {
		if (['circuit-minimal', 'matrix-hacker', 'research-board'].includes(style)) {
			ctx.rect(x - size * 0.72, y - size * 0.72, size * 1.44, size * 1.44);
			return;
		}
		if (['signal-radar', 'satellite-view', 'neon'].includes(style)) {
			ctx.moveTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y); ctx.closePath();
			return;
		}
		if (style === 'mind-palace') {
			if (typeof ctx.roundRect === 'function') ctx.roundRect(x - size, y - size * 0.76, size * 2, size * 1.52, Math.max(1, size * 0.22));
			else ctx.rect(x - size, y - size * 0.76, size * 2, size * 1.52);
			return;
		}
		if (style === 'aqua-mint') {
			for (let point = 0; point < 6; point++) {
				const angle = point * Math.PI / 3;
				const px = x + Math.cos(angle) * size; const py = y + Math.sin(angle) * size;
				if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
			}
			ctx.closePath(); return;
		}
		if (style === 'neural-bloom') {
			for (let point = 0; point < 16; point++) {
				const angle = -Math.PI / 2 + point * Math.PI / 8;
				const radius = point % 2 ? size * 0.64 : size;
				const px = x + Math.cos(angle) * radius; const py = y + Math.sin(angle) * radius;
				if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
			}
			ctx.closePath(); return;
		}
		if (style === 'ink-map') {
			for (let point = 0; point < 10; point++) {
				const angle = point * Math.PI / 5;
				const radius = size * (0.82 + ((point * 7) % 4) * 0.06);
				const px = x + Math.cos(angle) * radius; const py = y + Math.sin(angle) * radius;
				if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
			}
			ctx.closePath(); return;
		}
		if (style === 'star-map' || style === 'star-system') {
			for (let point = 0; point < 10; point++) {
				const angle = -Math.PI / 2 + point * Math.PI / 5;
				const radius = point % 2 ? size * 0.42 : size;
				const px = x + Math.cos(angle) * radius; const py = y + Math.sin(angle) * radius;
				if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
			}
			ctx.closePath(); return;
		}
		ctx.arc(x, y, size, 0, Math.PI * 2);
	}

		drawBackground(ctx, width, height, motion) {
		const style = motion.backgroundStyle;
		const visual = this.plugin.settings.visual;
		const visualBackgrounds = {
			'constellation': '#07121c', 'deep-space': '#050817', 'neon': '#100719', 'minimal': '#090d12',
			'timeline-map': '#101722', 'circuit-minimal': '#071115', 'archive-fog': '#111318',
			'research-board': '#e8e5dc', 'matrix-hacker': '#020b07', 'star-map': '#050a18', 'star-system': '#030611',
			'aqua-mint': '#061512', 'signal-radar': '#07121d', 'mind-palace': '#100a1d',
			'focus-lens': '#080d17', 'thread-weaver': '#0c0b18', 'ink-map': '#e9e4d6',
			'neural-bloom': '#100817', 'satellite-view': '#071017', 'glass-minimal': '#10171c',
			'academic-light': '#f0efe8', 'soft-glow': '#090d17', 'focus-lens': '#050a13',
		};
		const backgroundBases = {
			nebula: '#050713', aurora: '#061218', grid: '#07121a', void: '#05070c',
		horizon: '#08131c', 'depth-bands': '#07101b', topographic: '#0b1514',
		blueprint: '#08172a', starfield: '#030611', paper: '#eeeade', black: '#000000', white: '#ffffff',
		};
		const base = style === 'nebula' ? visualBackgrounds[visual] || backgroundBases.nebula : backgroundBases[style] || visualBackgrounds[visual] || '#070a12';
		ctx.fillStyle = base; ctx.fillRect(0, 0, width, height);
		if (style === 'black' || style === 'white') return;
		const paperStyle = style === 'paper' || (style === 'nebula' && ['research-board', 'ink-map', 'academic-light'].includes(visual));
		const flatStyle = style === 'nebula' && ['matrix-hacker', 'circuit-minimal', 'signal-radar', 'star-map', 'satellite-view'].includes(visual);
		if (style === 'horizon') {
			const horizonY = height * 0.43;
			const sky = ctx.createLinearGradient(0, 0, 0, height);
			sky.addColorStop(0, 'rgba(28,57,86,.08)'); sky.addColorStop(.42, 'rgba(81,151,183,.2)'); sky.addColorStop(1, 'rgba(6,13,24,.02)');
			ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
			ctx.strokeStyle = 'rgba(125,213,238,.42)'; ctx.lineWidth = 1;
			ctx.beginPath(); ctx.moveTo(0, horizonY); ctx.lineTo(width, horizonY); ctx.stroke();
			ctx.strokeStyle = 'rgba(108,196,226,.2)';
			for (let ray = -8; ray <= 8; ray++) { ctx.beginPath(); ctx.moveTo(width / 2, horizonY); ctx.lineTo(width / 2 + ray * width * .15, height); ctx.stroke(); }
			for (let row = 1; row <= 9; row++) {
				const progress = row / 9; const y = horizonY + (height - horizonY) * progress * progress;
				ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(width / 2, horizonY + (y - horizonY) * .82, width, y); ctx.stroke();
			}
		}
		if (style === 'depth-bands') {
			for (let band = 0; band < 7; band++) {
				const y = height * (.25 + band * .095); const bandHeight = height * (.09 + band * .008);
				const alpha = .035 + band * .012;
				ctx.fillStyle = `rgba(${band % 2 ? '98,153,211' : '77,210,203'},${alpha})`;
				ctx.beginPath(); ctx.ellipse(width * .5, y, width * (.24 + band * .105), bandHeight, 0, 0, Math.PI * 2); ctx.fill();
				ctx.strokeStyle = `rgba(154,210,229,${alpha + .11})`; ctx.lineWidth = 1; ctx.stroke();
			}
		}
		if (style === 'topographic') {
			ctx.save(); ctx.strokeStyle = 'rgba(166,210,153,.17)'; ctx.lineWidth = 1;
			for (let contour = 0; contour < 12; contour++) {
				const cx = width * (.28 + (contour % 3) * .23); const cy = height * (.32 + Math.floor(contour / 3) * .2);
				ctx.beginPath();
				for (let point = 0; point <= 48; point++) {
					const angle = point / 48 * Math.PI * 2;
					const ripple = 1 + .055 * Math.sin(angle * 3 + contour) + .035 * Math.cos(angle * 5 - contour * .7);
					const rx = (18 + contour * 8) * ripple; const ry = rx * .52;
					if (!point) ctx.moveTo(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
					else ctx.lineTo(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
				}
				ctx.stroke();
			}
			ctx.restore();
		}
		if (style === 'blueprint') {
			ctx.strokeStyle = 'rgba(112,190,255,.12)'; ctx.lineWidth = 1;
			for (let x = width / 2 % 20; x < width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
			for (let y = height / 2 % 20; y < height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
			ctx.strokeStyle = 'rgba(143,210,255,.23)';
			for (let x = width / 2 % 100; x < width; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
			for (let y = height / 2 % 100; y < height; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
		}
		if (visual === 'star-system') {
			const nebula = ctx.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.68);
			nebula.addColorStop(0, 'rgba(76, 58, 142, .30)'); nebula.addColorStop(.42, 'rgba(37, 60, 122, .19)'); nebula.addColorStop(1, 'rgba(3, 6, 17, 0)');
			ctx.fillStyle = nebula; ctx.fillRect(0, 0, width, height);
		}
		if (!paperStyle && !flatStyle && (style === 'nebula' || style === 'aurora' || ['constellation', 'deep-space', 'neural-bloom', 'mind-palace', 'archive-fog', 'soft-glow', 'thread-weaver', 'neon', 'aqua-mint'].includes(visual))) {
			const glow = ctx.createRadialGradient(width * 0.52, height * 0.48, 0, width * 0.52, height * 0.48, Math.max(width, height) * 0.72);
			const atmosphere = {
				constellation: ['rgba(22,118,163,.31)', 'rgba(24,57,91,.18)'],
				'deep-space': ['rgba(83,49,171,.34)', 'rgba(38,35,94,.18)'],
				'neural-bloom': ['rgba(214,68,255,.30)', 'rgba(111,39,140,.18)'],
				'mind-palace': ['rgba(142,77,177,.28)', 'rgba(70,43,102,.16)'],
				'archive-fog': ['rgba(177,145,97,.24)', 'rgba(100,91,73,.16)'],
				'soft-glow': ['rgba(76,129,173,.25)', 'rgba(40,76,104,.16)'],
				'thread-weaver': ['rgba(138,78,181,.27)', 'rgba(69,54,110,.17)'],
				neon: ['rgba(201,34,170,.27)', 'rgba(91,28,106,.17)'],
				'aqua-mint': ['rgba(26,145,121,.30)', 'rgba(28,77,93,.18)'],
			};
			const colors = atmosphere[visual] || (style === 'aurora' ? ['rgba(26,105,111,.32)', 'rgba(28,57,93,.18)'] : ['rgba(53,42,112,.34)', 'rgba(18,50,69,.16)']);
			glow.addColorStop(0, colors[0]);
			glow.addColorStop(0.55, colors[1]);
			glow.addColorStop(1, 'rgba(4,7,13,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
		}
		if (style === 'aurora') {
			ctx.save(); ctx.globalCompositeOperation = 'screen';
			for (let ribbon = 0; ribbon < 4; ribbon++) {
				const y = height * (.27 + ribbon * .105) + Math.sin(this.frame * .006 + ribbon) * height * .018;
				const gradient = ctx.createLinearGradient(0, y - 30, width, y + 30);
				gradient.addColorStop(0, 'rgba(36,245,190,0)'); gradient.addColorStop(.35, 'rgba(36,245,190,.1)');
				gradient.addColorStop(.68, 'rgba(108,119,255,.13)'); gradient.addColorStop(1, 'rgba(36,245,190,0)');
				ctx.beginPath(); ctx.moveTo(-20, y); ctx.bezierCurveTo(width * .25, y - 55, width * .62, y + 45, width + 20, y - 18);
				ctx.strokeStyle = gradient; ctx.lineWidth = 44; ctx.stroke();
			}
			ctx.restore();
		}
		if (style === 'grid' || (style === 'nebula' && ['timeline-map', 'circuit-minimal', 'research-board', 'matrix-hacker', 'academic-light', 'ink-map'].includes(visual))) {
			const light = ['research-board', 'academic-light', 'ink-map'].includes(visual);
			ctx.strokeStyle = light ? 'rgba(45,64,72,.12)' : visual === 'matrix-hacker' ? 'rgba(70,255,135,.10)' : 'rgba(103,224,221,.07)'; ctx.lineWidth = 1;
			const spacing = visual === 'research-board' || visual === 'academic-light' ? 24 : 36;
			for (let x = width / 2 % spacing; x < width; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
			for (let y = height / 2 % spacing; y < height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
		}
		const particleScale = this.plugin.settings.display.showBackgroundParticles ? (this.renderQuality === 'performance' ? 0.3 : this.renderQuality === 'balanced' ? 0.55 : 1) : 0;
		const count = Math.max(0, Math.min(140, Math.floor(motion.backgroundParticles * particleScale)));
		for (let i = 0; i < count; i++) {
			const star = this.backgroundParticles[i];
			const twinkle = motion.reduceMotion ? 0.55 : 0.3 + (Math.sin(this.frame * 0.012 + star.phase) + 1) * 0.3;
			ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
			ctx.fillStyle = visual === 'matrix-hacker' ? `rgba(104,255,151,${twinkle})` : ['research-board', 'academic-light', 'ink-map'].includes(visual) ? `rgba(51,75,83,${twinkle * 0.5})` : `rgba(190,225,255,${visual === 'star-system' ? Math.min(1, twinkle * 1.35) : twinkle})`; ctx.fill();
		}
		if (visual === 'star-system') {
			ctx.save(); ctx.translate(width * .5, height * .49);
			const orbitColor = 'rgba(177, 191, 255, .13)'; ctx.strokeStyle = orbitColor; ctx.lineWidth = 1;
			for (let ring = 0; ring < 3; ring++) { ctx.beginPath(); ctx.ellipse(0, 0, width * (.17 + ring * .085), height * (.075 + ring * .035), -.12 + ring * .08, 0, Math.PI * 2); ctx.stroke(); }
			ctx.restore();
		}
	}

	drawSpaceflightStreaks(ctx, width, height, motion) {
		const particleScale = this.plugin.settings.display.showBackgroundParticles ? (this.renderQuality === 'performance' ? 0.3 : this.renderQuality === 'balanced' ? 0.55 : 1) : 0;
		const count = Math.min(this.backgroundParticles.length, Math.max(0, Math.floor(motion.backgroundParticles * particleScale)));
		if (!count) return;
		const now = performance.now() / 1000;
		const speed = Math.max(0.15, motion.cameraSpeed * motion.animationSpeed * 2.2);
		ctx.save(); ctx.globalCompositeOperation = 'lighter';
		for (let index = 0; index < count; index++) {
			const star = this.backgroundParticles[index];
			const dx = star.x - 0.5; const dy = star.y - 0.5;
			const distance = Math.max(0.04, Math.hypot(dx, dy));
			const travel = (now * speed * (0.7 + star.size * 0.24) + star.phase / (Math.PI * 2)) % 1;
			const radius = 0.18 + travel * 1.25;
			const x = width * 0.5 + dx / distance * radius * width * 0.62;
			const y = height * 0.5 + dy / distance * radius * height * 0.62;
			const tail = 3 + travel * (12 + motion.cameraSpeed * 30);
			ctx.beginPath(); ctx.moveTo(x - dx / distance * tail, y - dy / distance * tail); ctx.lineTo(x, y);
			ctx.strokeStyle = `rgba(190,226,255,${0.12 + travel * 0.72})`;
			ctx.lineWidth = 0.45 + travel * 1.05; ctx.stroke();
		}
		ctx.restore();
	}

	drawTimelineAxis(ctx, width, height) {
		const y = height * 0.84;
		const fallback = [Date.now() - 4 * 365.25 * 86400000, Date.now()];
		const [oldest, newest] = this.timelineRange?.every(Number.isFinite) ? this.timelineRange : fallback;
		ctx.save(); ctx.strokeStyle = 'rgba(165,201,214,.44)'; ctx.fillStyle = 'rgba(188,213,225,.66)'; ctx.lineWidth = 1;
		ctx.beginPath(); ctx.moveTo(width * 0.12, y); ctx.lineTo(width * 0.88, y); ctx.stroke();
		for (let i = 0; i <= 4; i++) {
			const x = width * (0.12 + 0.19 * i); ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
			const year = new Date(oldest + ((newest - oldest) * i / 4)).getFullYear();
			ctx.font = '9px var(--font-monospace)'; ctx.textAlign = 'center'; ctx.fillText(String(year), x, y + 18);
		}
		ctx.restore();
	}

	drawRadar(ctx, width, height, radius, style) {
		const cx = width / 2 + this.panX; const cy = height / 2 + this.panY;
		ctx.save(); ctx.strokeStyle = style === 'satellite-view' ? 'rgba(105,190,255,.2)' : 'rgba(81,220,177,.18)'; ctx.lineWidth = 1;
		for (const scale of [0.28, 0.52, 0.78]) { ctx.beginPath(); ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2); ctx.stroke(); }
		if (this.plugin.settings.motion.animationEnabled && !this.plugin.settings.motion.reduceMotion) {
			const angle = this.frame * 0.008;
			ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * radius * 0.78, cy + Math.sin(angle) * radius * 0.78);
			ctx.strokeStyle = style === 'satellite-view' ? 'rgba(105,190,255,.5)' : 'rgba(94,255,185,.45)'; ctx.lineWidth = 1.4; ctx.stroke();
		}
		ctx.restore();
	}

	drawDepthLayers(ctx, width, height, radius) {
		const background = this.plugin.settings.motion.backgroundStyle;
		const visual = this.plugin.settings.visual;
		const lightVisual = ['research-board', 'academic-light', 'ink-map'].includes(visual);
		const light = ['paper', 'white'].includes(background) || (background === 'nebula' && lightVisual);
		const cx = width / 2 + this.panX; const cy = height / 2 + this.panY;
		ctx.save(); ctx.lineWidth = 1;
		for (let layer = 0; layer < 5; layer++) {
			const depth = layer / 4;
			const rx = radius * (0.38 + depth * 0.48);
			const ry = radius * (0.10 + depth * 0.16);
			const y = cy + (depth - 0.5) * radius * 0.54;
			ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2);
			ctx.strokeStyle = light ? `rgba(31,68,84,${0.12 + depth * 0.16})` : `rgba(124,205,231,${0.12 + depth * 0.18})`;
			ctx.setLineDash(layer === 0 || layer === 4 ? [3, 5] : []); ctx.stroke();
		}
		ctx.setLineDash([]);
		ctx.fillStyle = light ? 'rgba(31,68,84,.52)' : 'rgba(165,220,238,.58)';
		ctx.font = '9px var(--font-monospace)'; ctx.textAlign = 'left';
		const labelX = Math.min(width - 44, Math.max(8, cx - radius * .9));
		ctx.fillText('FAR', labelX, cy - radius * .26);
		ctx.fillText('MID', labelX, cy + 3);
		ctx.fillText('NEAR', labelX, cy + radius * .29);
		ctx.restore();
	}

	drawClusterHalos(ctx, width, height, visual = this.plugin.settings.visual, groups = this.clusterGroups || []) {
		const palette = ['103,224,221', '255,115,180', '255,199,95', '156,132,255', '121,226,148', '255,143,100'];
		for (const nodes of groups) {
			if (nodes.length < 2) continue;
			const cx = nodes.reduce((sum, node) => sum + node.screenX, 0) / nodes.length;
			const cy = nodes.reduce((sum, node) => sum + node.screenY, 0) / nodes.length;
			const radius = Math.min(190, Math.max(22, ...nodes.map((node) => Math.hypot(node.screenX - cx, node.screenY - cy) + 14)));
			const color = nodes[0].color || palette[nodes[0].clusterId % palette.length];
			if (visual === 'star-system') {
				const orbitRadius = Math.max(36, radius * .82);
				ctx.save(); ctx.strokeStyle = `rgba(${color}, .27)`; ctx.lineWidth = 1.2;
				ctx.beginPath(); ctx.ellipse(cx, cy, orbitRadius, orbitRadius * .38, -.17, 0, Math.PI * 2); ctx.stroke();
				const planetRadius = Math.max(8, Math.min(18, 6 + Math.sqrt(nodes.length) * 2.2));
				const planet = ctx.createRadialGradient(cx - planetRadius * .35, cy - planetRadius * .4, 1, cx, cy, planetRadius * 1.25);
				planet.addColorStop(0, `rgba(${color}, .98)`); planet.addColorStop(.68, `rgba(${color}, .82)`); planet.addColorStop(1, `rgba(${color}, .08)`);
				ctx.beginPath(); ctx.arc(cx, cy, planetRadius * 1.55, 0, Math.PI * 2); ctx.fillStyle = `rgba(${color}, .12)`; ctx.fill();
				ctx.beginPath(); ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2); ctx.fillStyle = planet; ctx.fill();
				ctx.strokeStyle = `rgba(225, 235, 255, .8)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, planetRadius * 1.65, planetRadius * .58, -.17, 0, Math.PI * 2); ctx.stroke();
				ctx.restore(); continue;
			}
			ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${color},.035)`; ctx.fill();
			ctx.strokeStyle = `rgba(${color},.16)`; ctx.lineWidth = 1; ctx.stroke();
		}
	}

	async finishPointerGesture() {
		const moved = this.dragMoved;
		if (this.dragNode && moved) {
			const offsets = { ...this.plugin.settings.interaction.nodeOffsets, [this.dragNode.path]: { x: this.dragNode.offsetX, y: this.dragNode.offsetY } };
			this.plugin.settings.interaction.nodeOffsets = offsets;
			await this.plugin.saveSettings();
		}
		this.dragPoint = null; this.dragNode = null; this.panGesture = false;
		this.canvas.style.cursor = 'grab';
	}

	scheduleDraw() {
		if (this.animation || this.drawTimer || !this.canvas?.isConnected || document.hidden || !this.canvas.getClientRects().length) return;
		const requestedFps = Math.max(15, Math.min(60, Number(this.plugin.settings.motion.frameRate) || 30));
		const fps = this.renderQuality === 'performance' ? Math.min(24, requestedFps) : requestedFps;
		const delay = Math.max(0, 1000 / fps - (performance.now() - (this.lastFrameAt || 0)));
		const queueFrame = () => {
			this.drawTimer = 0;
			this.animation = window.requestAnimationFrame(() => {
				this.animation = 0;
				if (document.hidden || !this.canvas?.isConnected || !this.canvas.getClientRects().length) return;
				this.lastFrameAt = performance.now();
				this.draw();
			});
		};
		if (delay > 1) this.drawTimer = window.setTimeout(queueFrame, delay);
		else queueFrame();
	}

	queueGraphRefresh() {
		window.clearTimeout(this.graphRefreshTimer);
		this.graphRefreshTimer = window.setTimeout(() => {
			this.graphRefreshTimer = 0;
			if (this.canvas?.isConnected) this.rebuildGraph();
		}, 300);
	}

	updateControlLabels() {
		if (!this.animationButton) return;
		const running = this.plugin.settings.motion.animationEnabled;
		this.animationButton.empty();
		setIcon(this.animationButton, running ? 'pause' : 'play');
		this.animationButton.title = running ? 'Pause animation' : 'Play animation';
		this.animationButton.setAttribute('aria-label', running ? 'Pause animation' : 'Play animation');
		this.animationButton.setAttribute('aria-pressed', String(running));
	}

	applySettings() {
		this.updateControlLabels();
		this.updateDisplayVisibility();
		this.updatePathControls();
		if (this.scopeSelect) this.scopeSelect.value = this.plugin.settings.graph.scope;
		if (this.modeSelect) this.modeSelect.value = this.plugin.settings.mode;
		if (this.colorSelect) this.colorSelect.value = this.plugin.settings.colors;
		if (this.animationStyleSelect) this.animationStyleSelect.value = this.plugin.settings.motion.animationStyle;
		this.resizeCanvas();
		this.scheduleDraw();
	}

	getCanvasPoint(event) {
		const rect = this.canvas.getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	findNode(event) {
		const point = this.getCanvasPoint(event);
		let best = null;
		let bestDistance = 15;
		for (const node of this.renderNodes) {
			const distance = Math.hypot(node.screenX - point.x, node.screenY - point.y);
			if (distance < bestDistance) { best = node; bestDistance = distance; }
		}
		return best;
	}

	onCanvasContextMenu(event) {
		event.preventDefault();
		const node = this.findNode(event);
		const interaction = this.plugin.settings.interaction;
		const menu = new Menu();
		if (node) {
			if (!node.isClusterSummary) {
				const pinned = interaction.pinnedNodePaths.includes(node.path);
				menu.addItem((item) => item.setTitle(pinned ? 'Unpin note' : 'Pin note').setIcon(pinned ? 'pin-off' : 'pin').onClick(() => {
					const values = pinned ? interaction.pinnedNodePaths.filter((path) => path !== node.path) : [...interaction.pinnedNodePaths, node.path];
					this.plugin.setSetting('interaction', 'pinnedNodePaths', values);
				}));
				menu.addItem((item) => item.setTitle('Hide note').setIcon('eye-off').onClick(() => {
					this.plugin.setSetting('interaction', 'hiddenNodePaths', [...interaction.hiddenNodePaths, node.path], true);
				}));
				if (interaction.nodeOffsets[node.path]) menu.addItem((item) => item.setTitle('Reset node position').setIcon('rotate-ccw').onClick(() => {
					const offsets = { ...interaction.nodeOffsets }; delete offsets[node.path];
					this.plugin.setSetting('interaction', 'nodeOffsets', offsets);
					const current = this.nodeByPath.get(node.path); if (current) { current.offsetX = 0; current.offsetY = 0; }
				}));
				menu.addItem((item) => item.setTitle('Set as route start').setIcon('route').onClick(() => {
					this.plugin.setSetting('interaction', 'pathStartPath', node.path);
				}));
				if (interaction.pathStartPath && interaction.pathStartPath !== node.path) {
					menu.addItem((item) => item.setTitle('Preview route to this note').setIcon('signpost').onClick(() => {
						const path = this.findShortestPath(interaction.pathStartPath, node.path);
						this.plugin.setSetting('interaction', 'pathPreview', path, false);
					}));
				}
			}
			const collapsed = interaction.collapsedClusterNames || [];
			const isCollapsed = collapsed.includes(node.clusterName);
			menu.addItem((item) => item.setTitle(isCollapsed ? `Expand cluster: ${node.clusterName}` : `Collapse cluster: ${node.clusterName}`).setIcon('layers').onClick(() => {
				const next = isCollapsed ? collapsed.filter((name) => name !== node.clusterName) : [...collapsed, node.clusterName];
				this.plugin.setSetting('interaction', 'collapsedClusterNames', next, true);
			}));
			menu.addItem((item) => item.setTitle(`Hide cluster: ${node.clusterName}`).setIcon('eye-off').onClick(() => {
				this.plugin.setSetting('interaction', 'hiddenClusterNames', [...new Set([...interaction.hiddenClusterNames, node.clusterName])], true);
			}));
			const isIsolated = interaction.isolatedClusterName === node.clusterName;
			menu.addItem((item) => item.setTitle(isIsolated ? 'Show all clusters' : `Isolate cluster: ${node.clusterName}`).setIcon(isIsolated ? 'eye' : 'focus').onClick(() => {
				this.plugin.setSetting('interaction', 'isolatedClusterName', isIsolated ? null : node.clusterName, true);
			}));
		}
		if (interaction.hiddenNodePaths.length) {
			menu.addItem((item) => item.setTitle('Show all hidden notes').setIcon('eye').onClick(() => {
				this.plugin.setSetting('interaction', 'hiddenNodePaths', [], true);
			}));
		}
		if (interaction.hiddenClusterNames.length) {
			menu.addItem((item) => item.setTitle('Show all hidden clusters').setIcon('layers').onClick(() => {
				this.plugin.setSetting('interaction', 'hiddenClusterNames', [], true);
			}));
		}
		if (interaction.isolatedClusterName && node?.clusterName !== interaction.isolatedClusterName) {
			menu.addItem((item) => item.setTitle('Show all clusters').setIcon('eye').onClick(() => this.plugin.setSetting('interaction', 'isolatedClusterName', null, true)));
		}
		if (interaction.pathPreview.length || interaction.pathStartPath) {
			menu.addItem((item) => item.setTitle('Clear route preview').setIcon('x').onClick(async () => {
				this.plugin.settings.interaction.pathStartPath = null;
				this.plugin.settings.interaction.pathPreview = [];
				await this.plugin.saveSettings();
				this.updatePathControls();
			}));
		}
		menu.showAtMouseEvent(event);
	}

	findShortestPath(start, end) {
		const adjacency = new Map();
		for (const edge of this.edges) {
			if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
			if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
			adjacency.get(edge.source).push(edge.target);
			adjacency.get(edge.target).push(edge.source);
		}
		const queue = [[start]];
		const visited = new Set([start]);
		while (queue.length) {
			const path = queue.shift();
			const current = path[path.length - 1];
			if (current === end) return path;
			for (const neighbor of adjacency.get(current) || []) if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push([...path, neighbor]);
			}
		}
		return [];
	}

	onPointerMove(event) {
		if (this.dragPoint) {
			if (Math.abs(event.clientX - this.dragPoint.x) + Math.abs(event.clientY - this.dragPoint.y) > 2) this.dragMoved = true;
			const dx = event.clientX - this.dragPoint.x;
			const dy = event.clientY - this.dragPoint.y;
			if (this.dragNode) {
				this.dragNode.offsetX += dx / Math.max(1, this.canvas.clientWidth);
				this.dragNode.offsetY += dy / Math.max(1, this.canvas.clientHeight);
			} else if (this.panGesture) {
				this.panX += dx; this.panY += dy;
			} else {
				this.rotation += dx * 0.006;
				this.tiltOffset = Math.max(-0.9, Math.min(0.9, this.tiltOffset + dy * 0.004));
			}
			this.controlSettings?.syncCameraControls();
			this.dragPoint = { x: event.clientX, y: event.clientY };
			this.canvas.style.cursor = this.dragNode ? 'move' : 'grabbing';
			this.scheduleDraw();
			return;
		}
		const found = this.findNode(event);
		const hoverChanged = this.hoveredNode !== found;
		if (this.hoveredNode && this.hoveredNode !== found) this.hoveredNode.hovered = false;
		if (found) found.hovered = true;
		this.hoveredNode = found;
		if (!found) { this.tooltip.addClass('is-hidden'); if (hoverChanged) this.scheduleDraw(); return; }
		this.tooltip.setText(found.isClusterSummary ? `${found.clusterName}  ·  ${found.clusterCount} notes  ·  click to expand` : `${found.name}  ·  ${found.degree} links  ·  ${found.folder}`);
		this.tooltip.style.left = `${event.clientX - this.canvas.getBoundingClientRect().left + 14}px`;
		this.tooltip.style.top = `${event.clientY - this.canvas.getBoundingClientRect().top + 14}px`;
		this.tooltip.removeClass('is-hidden');
		this.canvas.style.cursor = 'grab';
		if (hoverChanged) this.scheduleDraw();
	}

	onCanvasClick(event) {
		if (this.dragMoved) { this.dragMoved = false; return; }
		const node = this.findNode(event);
		if (!node) return;
		if (this.pathPickMode) { void this.selectPathNode(node); return; }
		if (node.isClusterSummary) {
			const collapsed = this.plugin.settings.interaction.collapsedClusterNames || [];
			this.plugin.setSetting('interaction', 'collapsedClusterNames', collapsed.filter((name) => name !== node.clusterName), true);
			return;
		}
		const file = this.app.vault.getAbstractFileByPath(node.path);
		if (file) this.app.workspace.openLinkText(node.path, '', false);
	}
}

module.exports = class SwarmConsolePlugin extends Plugin {
	async onload() {
		this.settings = mergeSettings(await this.loadData());
		this.activity = [];
		this.addSettingTab(new SwarmConsoleSettingTab(this.app, this));
		this.registerView(VIEW_TYPE, (leaf) => new SwarmGraphView(leaf, this));
		this.addRibbonIcon('orbit', 'Open Constellation 3D', () => this.activateView());
		this.addCommand({ id: 'open-console', name: 'Open network dashboard', callback: () => this.activateView() });
		this.addCommand({ id: 'refresh-graph', name: 'Refresh network graph', callback: () => this.refreshView() });
		this.addCommand({ id: 'toggle-animation', name: 'Toggle 3D animation', callback: () => this.toggleAnimation() });
		this.addCommand({ id: 'toggle-journey', name: 'Start or pause note journey', callback: () => this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]?.view.toggleJourney() });
		this.addCommand({ id: 'previous-journey-note', name: 'Previous note in journey', callback: () => this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]?.view.stepJourney(-1) });
		this.addCommand({ id: 'next-journey-note', name: 'Next note in journey', callback: () => this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]?.view.stepJourney(1) });
		this.registerEvent(this.app.vault.on('create', (file) => this.recordActivity('NEW', file)));
		this.registerEvent(this.app.vault.on('modify', (file) => this.recordActivity('EDIT', file)));
		this.registerEvent(this.app.vault.on('delete', (file) => this.recordActivity('DELETE', file)));
		this.registerEvent(this.app.metadataCache.on('resolved', () => this.queueRefreshView()));
		this.registerEvent(this.app.workspace.on('file-open', () => {
			if (this.settings.graph.scope !== 'global' || this.settings.graph.minimumConnections > 0 || !this.settings.discovery.includeOrphans) this.queueRefreshView();
			else for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.refreshRenderLevels();
		}));
		this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => {
			if (leaf?.view instanceof SwarmGraphView) leaf.view.scheduleDraw();
		}));
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
		if (!leaf) {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE, active: true });
		}
		workspace.revealLeaf(leaf);
	}

	refreshView() {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.rebuildGraph();
	}

	queueRefreshView() {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.queueGraphRefresh();
	}

	refreshSettings() {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.applySettings();
	}

	async setSetting(section, key, value, refreshGraph = false) {
		if (section === null) this.settings[key] = value;
		else this.settings[section][key] = value;
		if (section === 'motion' && ['maxVisibleNodes', 'maxVisibleLinks'].includes(key)) {
			for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.refreshRenderLevels();
		}
		if (section === 'interaction' && ['pathPreview', 'pathStartPath', 'pinnedNodePaths'].includes(key)) {
			for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.refreshRenderLevels();
		}
		await this.saveSettings(refreshGraph);
	}

	async saveSettings(refreshGraph = false) {
		await this.saveData(this.settings);
		if (refreshGraph) this.refreshView();
		else this.refreshSettings();
	}

	async toggleAnimation() {
		this.settings.motion.animationEnabled = !this.settings.motion.animationEnabled;
		if (this.settings.motion.animationEnabled) this.settings.motion.reduceMotion = false;
		await this.saveSettings();
	}

	async setAnimationStyle(style) {
		this.settings.motion.animationStyle = style;
		this.settings.motion.animationEnabled = style !== 'static';
		if (style !== 'static') this.settings.motion.reduceMotion = false;
		await this.saveSettings(true);
	}

	async setLinkAnimationStyle(style) {
		this.settings.motion.lineAnimationStyle = style;
		if (style !== 'none') {
			this.settings.motion.animationEnabled = true;
			this.settings.motion.reduceMotion = false;
		}
		await this.saveSettings();
	}

	async setPathAnimationStyle(style) {
		this.settings.motion.pathAnimationStyle = style;
		if (style !== 'static') {
			this.settings.motion.animationEnabled = true;
			this.settings.motion.reduceMotion = false;
		}
		await this.saveSettings();
	}

	async applyPreset(id) {
		const presets = {
			constellation: { visual: 'constellation', colors: 'clusters', motion: { animationStyle: 'cluster-orbit', animationSpeed: 0.55, cameraSpeed: 0.35, reduceMotion: false, glowEnabled: true } },
			starSystem: { visual: 'star-system', colors: 'galaxy-core', motion: { animationStyle: 'cluster-orbit', animationSpeed: 0.48, cameraSpeed: 0.3, backgroundStyle: 'nebula', backgroundParticles: 90, reduceMotion: false, glowEnabled: true } },
			deepSpace: { visual: 'deep-space', colors: 'deep-ocean', motion: { animationStyle: 'cluster-tour', animationSpeed: 0.38, cameraSpeed: 0.25, reduceMotion: false, glowEnabled: true } },
			neon: { visual: 'neon', colors: 'aurora', motion: { animationStyle: 'orbit', lineAnimationStyle: 'pulse', animationSpeed: 0.9, cameraSpeed: 0.7, reduceMotion: false, glowEnabled: true } },
			minimal: { visual: 'minimal', colors: 'monochrome', motion: { animationStyle: 'orbit', animationSpeed: 0.2, cameraSpeed: 0.15, reduceMotion: true, glowEnabled: false } },
		};
		const preset = presets[id];
		if (!preset) return;
		this.settings.template = { activeTemplateId: id, modified: false };
		this.settings.visual = preset.visual;
		this.settings.colors = preset.colors;
		this.settings.motion = { ...this.settings.motion, ...preset.motion };
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
			leaf.view.animationStyleSelect.value = this.settings.motion.animationStyle;
			leaf.view.colorSelect.value = this.settings.colors;
		}
		await this.saveSettings();
	}

	openSettings() {
		this.app.setting.open();
		this.app.setting.openTabById(this.manifest.id);
	}

	recordActivity(kind, file) {
		if (!file || file.extension !== 'md') return;
		this.activity.unshift({ kind, name: file.basename, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
		this.activity = this.activity.slice(0, 30);
		this.queueRefreshView();
	}
};

class SwarmConsoleSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Constellation 3D' });
		this.renderSettings(containerEl);
	}

	renderCameraControls(containerEl, view, compact = false) {
		this.cameraView = view;
		const cameraContainer = compact ? containerEl.createDiv({ cls: 'swarm-camera-controls' }) : containerEl;
		this.section(cameraContainer, 'Camera');
		if (!compact) cameraContainer.createEl('p', { text: 'Adjust the viewing angle and zoom. Manual angle controls pause automatic camera turning until you resume it or reset the camera.' });
		new Setting(cameraContainer).setName('Horizontal rotation').setDesc('Turn the camera around the note space.').addSlider((slider) => {
			this.cameraRotationSlider = slider;
			slider.setLimits(0, 359, 1).setValue(this.rotationDegrees()).setDynamicTooltip().onChange((value) => {
				view.manualCameraControl = true;
				view.rotation = value * Math.PI / 180;
				view.scheduleDraw();
			});
		});
		new Setting(cameraContainer).setName('Vertical angle').setDesc('Tilt the camera up or down.').addSlider((slider) => {
			this.cameraTiltSlider = slider;
			slider.setLimits(-55, 55, 1).setValue(Math.round(view.tiltOffset * 180 / Math.PI)).setDynamicTooltip().onChange((value) => {
				view.manualCameraControl = true;
				view.tiltOffset = value * Math.PI / 180;
				view.scheduleDraw();
			});
		});
		new Setting(cameraContainer).setName('Zoom').setDesc('Set the camera zoom from 0.1× to 12×.').addSlider((slider) => {
			this.cameraZoomSlider = slider;
			slider.setLimits(0.1, 12, 0.1).setValue(view.zoom).setDynamicTooltip().onChange((value) => {
				view.zoom = value;
				view.scheduleDraw();
			});
		});
		new Setting(cameraContainer).addButton((button) => button
			.setButtonText('Resume automatic camera')
			.onClick(() => {
				view.manualCameraControl = false;
				view.scheduleDraw();
			}));
		new Setting(cameraContainer).addButton((button) => button
			.setButtonText('Reset camera')
			.setCta()
			.onClick(() => view.fitNetwork()));
	}

	rotationDegrees() {
		const degrees = this.cameraView.rotation * 180 / Math.PI;
		return Math.round((degrees % 360 + 360) % 360);
	}

	syncCameraControls() {
		if (!this.cameraView) return;
		this.cameraRotationSlider?.setValue(this.rotationDegrees());
		this.cameraTiltSlider?.setValue(Math.round(this.cameraView.tiltOffset * 180 / Math.PI));
		this.cameraZoomSlider?.setValue(this.cameraView.zoom);
	}

	renderSettings(containerEl, view = null) {
		const cameraSection = this.section(containerEl, 'Camera', true);
		if (view) this.renderCameraControls(cameraSection, view, false);

		this.section(containerEl, 'Performance', true);
		this.dropdown(this.currentSection, 'Rendering quality', 'Auto lowers graph detail as vault size or drawing time increases. Balanced and Performance reduce the number of visible notes and animated links for smoother rendering.', 'motion', 'qualityMode', { auto: 'Auto', balanced: 'Balanced', performance: 'Performance' });
		this.slider(this.currentSection, 'Maximum visible notes', 'Limit drawn notes while keeping the full graph available for search and routes. Important and cluster representative notes are prioritized; Performance may lower this further.', 'motion', 'maxVisibleNodes', 100, 3000, 100);
		this.slider(this.currentSection, 'Maximum visible links', 'Limit drawn connections to reduce clutter and drawing work. Routes and connections between clusters are prioritized.', 'motion', 'maxVisibleLinks', 50, 2000, 50);
		this.slider(this.currentSection, 'Animation frame rate', 'Lower this to reduce CPU use during animation. Performance caps animation at 24 FPS. A paused graph redraws only when it changes.', 'motion', 'frameRate', 15, 60, 5);
		this.toggle(this.currentSection, 'Show FPS', 'Show the current rendering rate in the header.', 'display', 'showFps');
		this.toggle(this.currentSection, 'Performance metrics', 'Show graph build time, draw time, and active rendering quality in the header.', 'display', 'showPerformanceMetrics');

		this.section(containerEl, 'Appearance');
		this.dropdown(this.currentSection, 'Visual preset', 'Load a ready-made visual combination.', 'template', 'activeTemplateId', {
			constellation: 'Constellation', starSystem: 'Star System', deepSpace: 'Deep Space', neon: 'Neon', minimal: 'Minimal Focus',
		}, (value) => this.plugin.applyPreset(value));
		this.dropdown(this.currentSection, 'Visual style', 'Choose a graph layout and shape treatment. Color schemes remain independent.', null, 'visual', {
			constellation: 'Constellation', 'timeline-map': 'Timeline Map', 'mind-palace': 'Mind Palace', 'circuit-minimal': 'Circuit Minimal',
			'archive-fog': 'Archive Fog', 'focus-lens': 'Focus Lens', 'thread-weaver': 'Thread Weaver', 'research-board': 'Research Board',
			'signal-radar': 'Signal Radar', 'matrix-hacker': 'Matrix Hacker', 'star-map': 'Star Map', 'star-system': 'Star System', 'aqua-mint': 'Aqua Mint',
			'deep-space': 'Deep Space', neon: 'Neon', minimal: 'Minimal', 'soft-glow': 'Soft Glow', 'neural-bloom': 'Neural Bloom',
			'satellite-view': 'Satellite View', 'glass-minimal': 'Glass Minimal', 'academic-light': 'Academic Light', 'ink-map': 'Ink Map',
		}, null, true);
		this.dropdown(this.currentSection, 'Color scheme', 'Choose a color behavior independently of the visual style. Single-hue profiles keep notes in one color family; gradient and cluster profiles intentionally vary.', null, 'colors', COLOR_SCHEME_OPTIONS);
		this.text(this.currentSection, 'Custom palette colors', 'Enter comma-separated HEX colors.', null, 'customPalette');
		this.dropdown(this.currentSection, 'Background style', 'Choose a scene background. Horizon, depth bands, and depth guides make distance easier to judge.', 'motion', 'backgroundStyle', {
			nebula: 'Nebula', aurora: 'Aurora', grid: 'Deep Space Grid', void: 'Deep Void', starfield: 'Starfield',
			horizon: 'Horizon Perspective', 'depth-bands': 'Depth Bands', topographic: 'Topographic Contours', blueprint: 'Blueprint Grid', paper: 'Warm Paper', black: 'Black', white: 'White',
		});
		this.slider(this.currentSection, 'Background particles', 'Set the number of softly animated stars.', 'motion', 'backgroundParticles', 0, 140, 5);
		this.toggle(this.currentSection, 'Scene background', 'Show the selected scene color, background effects, and depth backdrop.', 'display', 'showSceneBackground');
		this.toggle(this.currentSection, 'Background particles', 'Show background stars and Spaceflight streaks.', 'display', 'showBackgroundParticles');
		this.toggle(this.currentSection, 'Node labels', 'Show note names. All labels appear in smaller graphs; large graphs sample labels automatically. Hover a note to reveal its name.', 'display', 'showLabels');
		this.toggle(this.currentSection, 'Link lines', 'Show connections between linked notes.', 'display', 'showLinks');
		this.toggle(this.currentSection, 'Node icons', 'Show the first letter of each note inside its node.', 'display', 'showNodeIcons');
		this.toggle(this.currentSection, 'FAR / MID / NEAR depth rings', 'Show or hide the labeled FAR, MID, and NEAR perspective rings.', 'display', 'showDepthLayers');
		this.toggle(this.currentSection, 'Cluster halos', 'Draw a boundary around notes in the same cluster. Available for all rendering quality levels.', 'display', 'showClusterHalos');
		this.slider(this.currentSection, 'Label size', 'Set the size of note names.', 'display', 'labelSize', 8, 18, 1);
		this.slider(this.currentSection, 'Node size', 'Scale the note markers.', 'display', 'nodeSize', 0.5, 2, 0.1);
		this.slider(this.currentSection, 'Link thickness', 'Scale the lines between linked notes.', 'display', 'edgeThickness', 0.4, 2, 0.1);

		this.section(containerEl, 'Graph');
		this.slider(this.currentSection, 'Node distance', 'Set how far apart notes appear in the 3D layouts from 0.1× to 6×.', 'graph', 'noteSpacing', 0.1, 6, 0.1, true);
		this.slider(this.currentSection, 'Cluster spacing', 'Set folder-cluster distance from 0.1× to 6×. Zoom out for wider spacing.', 'graph', 'clusterSpacing', 0.1, 6, 0.1, true);
		this.dropdown(this.currentSection, 'Cluster arrangement', 'Arrange folder groups as spaced islands, a grid, or a spiral. Links between notes remain visible across groups.', 'graph', 'clusterLayout', { islands: 'Cluster islands', grid: 'Cluster grid', spiral: 'Cluster spiral' }, null, true);
		this.dropdown(this.currentSection, 'Scope', 'Show the whole vault or notes around the active note.', 'graph', 'scope', { global: 'Global', local: 'Local', current: 'Current note' }, null, true);
		this.slider(this.currentSection, 'Local depth', 'Number of link steps around the active note.', 'graph', 'localDepth', 1, 10, 1, true);
		this.text(this.currentSection, 'Folder filter', 'Comma-separated folder names or path fragments.', 'graph', 'folderFilter', true);
		this.text(this.currentSection, 'Tag filter', 'Comma-separated tags from note content or frontmatter.', 'graph', 'tagFilter', true);
		this.dropdown(this.currentSection, 'Date filter', 'Limit notes by their last modified date.', 'graph', 'dateFilter', { all: 'All notes', recent: 'Recently modified', forgotten: 'Long time ago' }, null, true);
		this.slider(this.currentSection, 'Minimum connections', 'Hide notes with fewer links than this value.', 'graph', 'minimumConnections', 0, 20, 1, true);
		this.toggle(this.currentSection, 'Include floating notes', 'Show notes with no links. Enabling this scans Markdown note paths in the vault.', 'graph', 'includeFloatingNotes', true);
		this.dropdown(this.currentSection, 'Cluster notes by', 'Group notes by top-level folder, full folder path, or their first tag.', 'graph', 'clusterBy', { 'top-level': 'Top-level folder', folder: 'Full folder path', tag: 'First tag' }, null, true);

		this.section(containerEl, 'Motion', true);
		this.currentSection.createEl('h4', { text: 'Playback and independent effects' });
		this.toggle(this.currentSection, 'Animation', 'Rotate and gently move the note space.', 'motion', 'animationEnabled');
		this.toggle(this.currentSection, 'Moving notes', 'Enable Swarm, Chaos, Blob Order, Moving Notes, and Notes Orbit Clusters motion.', 'motion', 'noteMotionEnabled');
		this.toggle(this.currentSection, 'Animated links', 'Enable flowing particles, pulses, drawing lines, and moving dashes on note links.', 'motion', 'linkAnimationEnabled');
		this.toggle(this.currentSection, 'Animated route', 'Enable motion effects on the selected note path.', 'motion', 'routeAnimationEnabled');
		this.toggle(this.currentSection, 'Animated colors', 'Allow animated color profiles to cycle through their colors.', 'motion', 'colorAnimationEnabled');
		this.currentSection.createEl('h4', { text: 'Camera and note movement style' });
		this.dropdown(this.currentSection, 'Camera / note animation style', 'Choose Static Camera, Spaceflight, Camera Orbit, Cluster Tour, Notes Orbit Clusters, Moving Notes, Swarm, Chaos, or Blob Order. The moving-note choices are configured here.', 'motion', 'animationStyle', {
			static: 'Static camera', orbit: '3D camera orbit', spaceflight: 'Spaceflight (fly through notes)', 'cluster-orbit': 'Notes orbit clusters', 'cluster-tour': 'Cluster camera tour', 'node-drift': 'Moving notes',
			swarm: 'Swarm', chaos: 'Chaos', 'blob-order': 'Blob Order',
		}, (value) => this.plugin.setAnimationStyle(value));
		this.currentSection.createEl('h4', { text: 'Animation speed and line effects' });
		this.slider(this.currentSection, 'Animation speed', 'Set the speed of automatic rotation.', 'motion', 'animationSpeed', 0.1, 1.5, 0.05);
		this.slider(this.currentSection, 'Color animation speed', 'Set how fast animated color schemes cycle.', 'motion', 'colorSpeed', 0.05, 2, 0.05);
		this.slider(this.currentSection, 'Camera speed', 'Set how quickly the 3D view turns.', 'motion', 'cameraSpeed', 0.1, 1, 0.05);
		this.slider(this.currentSection, 'Cluster visit interval (seconds)', 'How long the camera stays with each folder cluster.', 'motion', 'clusterPauseSeconds', 2, 30, 1);
		this.slider(this.currentSection, 'Moving note distance', 'Set how far individual notes drift.', 'motion', 'nodeDriftStrength', 0.01, 0.5, 0.01);
		this.slider(this.currentSection, 'Link pulse speed', 'Set the speed of particles moving along note links.', 'motion', 'connectionPulseSpeed', 0.1, 2, 0.1);
		this.dropdown(this.currentSection, 'Link animation', 'Animate real note connections, including links between clusters. Keep Link lines enabled; choosing a style starts animation.', 'motion', 'lineAnimationStyle', { none: 'Static lines', flow: 'Flowing particles', pulse: 'Link pulses', draw: 'Drawing lines', dashes: 'Moving dashes' }, (value) => this.plugin.setLinkAnimationStyle(value));
		this.dropdown(this.currentSection, 'Route animation', 'Choose how a route preview is animated. Selecting an animated style starts motion.', 'motion', 'pathAnimationStyle', { static: 'Static highlight', glow: 'Glow', comet: 'Traveling comet', draw: 'Draw the route', dashes: 'Moving dashes' }, (value) => this.plugin.setPathAnimationStyle(value));
		this.slider(this.currentSection, '3D perspective depth', 'Increase or soften the perspective difference between near and far notes.', 'motion', 'perspectiveStrength', 0.2, 2.4, 0.1);
		this.toggle(this.currentSection, 'Reduce motion', 'Use a calmer camera with less ambient movement.', 'motion', 'reduceMotion');
		this.toggle(this.currentSection, 'Node glow', 'Show a soft glow around notes.', 'motion', 'glowEnabled');

		this.section(containerEl, 'Discovery');
		this.dropdown(this.currentSection, 'Mode', 'Focus on a particular way of exploring notes. Orphan Hunt scans Markdown note paths to find notes without links.', null, 'mode', {
			wander: 'Wander', 'path-journey': 'Path journey', 'recent-activity': 'Recent activity', 'forgotten-knowledge': 'Forgotten knowledge',
			'hub-explorer': 'Hub explorer', 'hidden-gems': 'Hidden gems', 'orphan-hunt': 'Orphan hunt',
		}, null, true);
		this.slider(this.currentSection, 'Recent window (days)', 'Used by Recent activity mode and the recent date filter.', 'discovery', 'recentDays', 1, 365, 1, true);
		this.slider(this.currentSection, 'Forgotten after (days)', 'Used by Forgotten knowledge mode and the forgotten date filter.', 'discovery', 'forgottenDays', 30, 1500, 10, true);
		this.slider(this.currentSection, 'Pause on each note (seconds)', 'Set the interval used by automatic note travel.', 'journey', 'nodePauseSeconds', 1, 30, 1);

		this.section(containerEl, 'Interface');
		this.toggle(this.currentSection, 'App header', 'Show the title and status bar.', 'display', 'showHeader');
		this.toggle(this.currentSection, 'Graph title', 'Show the 3D Note Space label.', 'display', 'showGraphLabel');
		this.toggle(this.currentSection, 'Node and link totals', 'Show live node and link counts.', 'display', 'showGraphStats');
		this.toggle(this.currentSection, 'Quick Menu', 'Show the Quick Menu and its controls.', 'display', 'showQuickMenu');
		this.currentSection.createEl('h4', { text: 'Quick Menu buttons' });
		this.currentSection.createEl('p', { text: 'Choose which controls appear in the Quick Menu. Hidden controls remain available through plugin settings where applicable.' });
		const quickMenuLabels = {
			search: 'Search notes', scope: 'Graph scope', discovery: 'Discovery mode', animationStyle: 'Animation style', colors: 'Color scheme',
			journey: 'Start travel', cameraMode: 'Orbit / Pan mode', animationToggle: 'Play / Pause', controlPanel: 'Control Panel',
			fit: 'Fit Network', optimize: 'Optimize View', refresh: 'Refresh graph', notePath: 'Note Path',
		};
		for (const [key, label] of Object.entries(quickMenuLabels)) {
			const setting = new Setting(this.currentSection).setName(label).addToggle((toggle) => toggle
				.setValue(this.plugin.settings.display.quickMenuItems[key])
				.onChange(async (value) => {
					this.plugin.settings.display.quickMenuItems[key] = value;
					await this.plugin.saveSettings();
				}));
			setting.settingEl.addClass('swarm-quick-menu-setting');
		}
		this.toggle(this.currentSection, 'Bottom dashboard', 'Show statistics and recent changes.', 'display', 'showFooter');
		this.toggle(this.currentSection, 'Vault note counter', 'Show the Vault Notes counter.', 'display', 'showVaultNotesCounter');
		this.toggle(this.currentSection, 'Linked notes counter', 'Show the Linked Notes counter.', 'display', 'showLinkedNotesCounter');
		this.toggle(this.currentSection, 'Folder counter', 'Show the Folders counter.', 'display', 'showFolderCounter');
		this.toggle(this.currentSection, 'Activity counter', 'Show the Recent Activity counter.', 'display', 'showActivityCounter');
		this.toggle(this.currentSection, 'Recent changes list', 'Show recent vault changes.', 'display', 'showRecentChanges');
		this.section(containerEl, 'Hidden items');
		this.currentSection.createEl('p', { text: 'Restore notes and clusters hidden from the graph.' });
		this.visibilityManager = this.currentSection.createDiv({ cls: 'swarm-hidden-items-manager' });
		this.refreshVisibilityManager();
	}

	refreshVisibilityManager() {
		if (!this.visibilityManager?.isConnected) return;
		const container = this.visibilityManager;
		container.empty();
		const { hiddenNodePaths, hiddenClusterNames } = this.plugin.settings.interaction;
		if (!hiddenNodePaths.length && !hiddenClusterNames.length) {
			container.createEl('p', { text: 'No hidden notes or clusters.' });
			return;
		}
		for (const path of hiddenNodePaths) {
			const file = this.app.vault.getAbstractFileByPath(path);
			const label = file?.basename || path;
			new Setting(container).setName(label).setDesc(path).addButton((button) => button
				.setButtonText('Show note')
				.onClick(async () => {
					const values = this.plugin.settings.interaction.hiddenNodePaths.filter((item) => item !== path);
					await this.plugin.setSetting('interaction', 'hiddenNodePaths', values, true);
					this.refreshVisibilityManager();
				}));
		}
		for (const name of hiddenClusterNames) {
			new Setting(container).setName(name).setDesc('Hidden folder cluster').addButton((button) => button
				.setButtonText('Show cluster')
				.onClick(async () => {
					const values = this.plugin.settings.interaction.hiddenClusterNames.filter((item) => item !== name);
					await this.plugin.setSetting('interaction', 'hiddenClusterNames', values, true);
					this.refreshVisibilityManager();
				}));
		}
		new Setting(container).addButton((button) => button
			.setButtonText('Show all hidden items')
			.setCta()
			.onClick(async () => {
				await this.plugin.setSetting('interaction', 'hiddenNodePaths', [], false);
				await this.plugin.setSetting('interaction', 'hiddenClusterNames', [], true);
				this.refreshVisibilityManager();
			}));
	}

	section(container, name, expandedByDefault = false) {
		const sectionEl = container.createEl('details', { cls: 'swarm-settings-section' });
		sectionEl.open = expandedByDefault;
		sectionEl.createEl('summary', { cls: 'swarm-settings-section-title', text: name });
		this.currentSection = sectionEl.createDiv({ cls: 'swarm-settings-section-content' });
		return this.currentSection;
	}

	dropdown(container, name, desc, section, key, options, callback = null, refreshGraph = false) {
		new Setting(container).setName(name).setDesc(desc).addDropdown((dropdown) => {
			for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
			dropdown.setValue(section ? this.plugin.settings[section][key] : this.plugin.settings[key]);
			dropdown.onChange(async (value) => {
				if (callback) await callback(value);
				else await this.plugin.setSetting(section, key, value, refreshGraph);
			});
		});
	}

	toggle(container, name, desc, section, key, refreshGraph = false) {
		new Setting(container).setName(name).setDesc(desc).addToggle((toggle) => toggle
			.setValue(this.plugin.settings[section][key])
			.onChange((value) => this.plugin.setSetting(section, key, value, refreshGraph)));
	}

	slider(container, name, desc, section, key, min, max, step, refreshGraph = false) {
		new Setting(container).setName(name).setDesc(desc).addSlider((slider) => slider
			.setLimits(min, max, step)
			.setValue(this.plugin.settings[section][key])
			.setDynamicTooltip()
			.onChange((value) => this.plugin.setSetting(section, key, value, refreshGraph)));
	}

	text(container, name, desc, section, key, refreshGraph = false) {
		new Setting(container).setName(name).setDesc(desc).addText((text) => text
			.setValue(section ? this.plugin.settings[section][key] : this.plugin.settings[key])
			.onChange((value) => this.plugin.setSetting(section, key, value, refreshGraph)));
	}
}
