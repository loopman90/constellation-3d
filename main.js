const { Plugin, PluginSettingTab, Setting, ItemView, Menu, Notice } = require('obsidian');

const VIEW_TYPE = 'swarm-console-graph';
const DEFAULT_SETTINGS = {
	mode: 'wander',
	visual: 'constellation',
	colors: 'aurora',
	graph: {
		scope: 'global',
		localDepth: 4,
		folderFilter: '',
		tagFilter: '',
		dateFilter: 'all',
		minimumConnections: 0,
		includeFloatingNotes: true,
		clusterBy: 'top-level',
	},
	motion: {
		animationEnabled: true,
		animationStyle: 'orbit',
		animationSpeed: 0.55,
		cameraSpeed: 0.35,
		clusterPauseSeconds: 6,
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
		showLabels: true,
		showLinks: true,
		showFps: false,
		labelSize: 10,
		edgeThickness: 1,
		nodeSize: 1,
		showNodeIcons: false,
		showDepthLayers: true,
		showClusterHalos: true,
	},
	discovery: {
		recentDays: 30,
		forgottenDays: 180,
		includeOrphans: true,
	},
	journey: { nodePauseSeconds: 3 },
	template: { activeTemplateId: 'constellation', modified: false },
	interaction: { pinnedNodePaths: [], hiddenNodePaths: [], hiddenClusterNames: [], nodeOffsets: {}, pathStartPath: null, pathPreview: [] },
};

function mergeSettings(saved) {
	const stored = saved || {};
	return {
		...DEFAULT_SETTINGS,
		...stored,
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
		this.frame = 0;
		this.animation = 0;
		this.rotation = 0;
		this.tiltOffset = 0;
		this.dragPoint = null;
		this.dragMoved = false;
		this.dragNode = null;
		this.panGesture = false;
		this.panX = 0;
		this.panY = 0;
		this.backgroundParticles = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), size: 0.35 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2 }));
		this.fpsFrames = 0;
		this.fpsLast = performance.now();
		this.journeyTimer = null;
		this.journeyNodes = [];
		this.journeyIndex = -1;
		this.focusedPath = null;
		this.resizeObserver = null;
	}
	getViewType() { return VIEW_TYPE; }
	getDisplayText() { return 'Constellation 3D'; }
	getIcon() { return 'orbit'; }

	async onOpen() {
		this.containerEl.addClass('swarm-console-view');
		this.contentEl.empty();
		this.root = this.contentEl.createDiv({ cls: 'swarm-console' });
		this.buildShell();
		this.rebuildGraph();
		this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
		this.resizeObserver.observe(this.root);
		this.resizeCanvas();
		this.scheduleDraw();
	}

	async onClose() {
		window.cancelAnimationFrame(this.animation);
		if (this.journeyTimer) window.clearInterval(this.journeyTimer);
		this.resizeObserver?.disconnect();
	}

	buildShell() {
		const header = this.root.createDiv({ cls: 'swarm-header' });
		const identity = header.createDiv({ cls: 'swarm-identity' });
		identity.createDiv({ cls: 'swarm-mark', text: 'S' });
		const title = identity.createDiv();
		title.createDiv({ cls: 'swarm-title', text: 'CONSTELLATION 3D' });
		title.createDiv({ cls: 'swarm-subtitle', text: 'LOCAL KNOWLEDGE NETWORK' });
		const headerRight = header.createDiv({ cls: 'swarm-header-right' });
		this.liveIndicator = headerRight.createSpan({ cls: 'swarm-live-dot' });
		headerRight.createSpan({ cls: 'swarm-live-label', text: 'VAULT CONNECTED' });
		this.fpsIndicator = headerRight.createSpan({ cls: 'swarm-fps' });
		this.clock = headerRight.createSpan({ cls: 'swarm-clock' });

		const main = this.root.createDiv({ cls: 'swarm-main' });
		const quickbar = main.createDiv({ cls: 'swarm-quickbar' });
		this.searchInput = quickbar.createEl('input', { cls: 'swarm-search', attr: { type: 'search', placeholder: 'Search notes…', 'aria-label': 'Search notes' } });
		this.searchInput.addEventListener('input', () => {
			this.searchQuery = this.searchInput.value.trim().toLowerCase();
			this.rebuildGraph();
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
		this.modeSelect.addEventListener('change', () => this.plugin.setSetting(null, 'mode', this.modeSelect.value, true));
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
		this.canvas = main.createEl('canvas', { cls: 'swarm-canvas' });
		this.ctx = this.canvas.getContext('2d');
		this.tooltip = main.createDiv({ cls: 'swarm-tooltip' });
		this.graphLabel = main.createDiv({ cls: 'swarm-graph-label', text: '3D NOTE SPACE' });
		this.graphStats = main.createDiv({ cls: 'swarm-graph-stats' });
		this.graphStats.createSpan({ text: 'NODES ' });
		this.nodeCount = this.graphStats.createEl('b', { text: '0' });
		this.graphStats.createSpan({ text: '  /  LINKS ' });
		this.edgeCount = this.graphStats.createEl('b', { text: '0' });
		const controls = main.createDiv({ cls: 'swarm-controls' });
		this.animationButton = controls.createEl('button', { cls: 'swarm-control-button swarm-animation-button' });
		this.animationButton.addEventListener('click', () => this.plugin.toggleAnimation());
		this.settingsButton = controls.createEl('button', { cls: 'swarm-control-button', text: '⚙ SETTINGS' });
		this.settingsButton.addEventListener('click', () => this.plugin.openSettings());
		this.fitButton = controls.createEl('button', { cls: 'swarm-control-button', text: 'FIT NETWORK' });
		this.fitButton.addEventListener('click', () => this.fitNetwork());
		this.refreshButton = controls.createEl('button', { cls: 'swarm-control-button', text: '↻  REFRESH' });
		this.refreshButton.addEventListener('click', () => this.rebuildGraph());
		this.updateControlLabels();
		this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event));
		this.canvas.addEventListener('pointerleave', () => this.tooltip.addClass('is-hidden'));
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
			this.zoom = Math.max(0.45, Math.min(2.6, (this.zoom || 1) * Math.exp(-event.deltaY * 0.001)));
			this.scheduleDraw();
		}, { passive: false });
		this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));
		this.canvas.addEventListener('contextmenu', (event) => this.onCanvasContextMenu(event));

		const footer = this.root.createDiv({ cls: 'swarm-footer' });
		this.makeMetric(footer, 'VAULT NOTES', 'metric-notes');
		this.makeMetric(footer, 'LINKED NOTES', 'metric-linked');
		this.makeMetric(footer, 'FOLDERS', 'metric-folders');
		this.makeMetric(footer, 'RECENT ACTIVITY', 'metric-activity');
		this.makeActivityPanel(footer);
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
	}

	rebuildGraph() {
		const graphSettings = this.plugin.settings.graph;
		const discoverySettings = this.plugin.settings.discovery;
		const now = Date.now();
		const folderTokens = graphSettings.folderFilter.split(/[,;\n]/).map((value) => value.trim().toLowerCase()).filter(Boolean);
		const tagTokens = graphSettings.tagFilter.split(/[,;\n]/).map((value) => value.trim().replace(/^#/, '').toLowerCase()).filter(Boolean);
		const files = this.app.vault.getMarkdownFiles().filter((file) => {
			if (folderTokens.length && !folderTokens.some((token) => file.path.toLowerCase().includes(token))) return false;
			if (graphSettings.dateFilter === 'recent' && now - file.stat.mtime > discoverySettings.recentDays * 86400000) return false;
			if (graphSettings.dateFilter === 'forgotten' && now - file.stat.mtime < discoverySettings.forgottenDays * 86400000) return false;
			if (tagTokens.length) {
				const cache = this.app.metadataCache.getFileCache(file);
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
		const links = this.app.metadataCache.resolvedLinks;
		for (const [source, targets] of Object.entries(links)) {
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
			if (graphSettings.includeFloatingNotes && discoverySettings.includeOrphans) {
				for (const file of files) if ((degree.get(file.path) || 0) === 0) visiblePaths.add(file.path);
			}
		}
		const mode = this.plugin.settings.mode;
		const minimumConnections = Math.max(graphSettings.minimumConnections, 0);
		let visibleFiles = files.filter((file) => {
			const connections = degree.get(file.path) || 0;
		if (this.plugin.settings.interaction.hiddenNodePaths.includes(file.path)) return false;
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
		let visibleEdges = edges.filter((edge) => visibleSet.has(edge.source) && visibleSet.has(edge.target));
		const animationStyle = this.plugin.settings.motion.animationStyle;
		const clusterNameFor = (file) => {
			const folders = file.path.split('/').slice(0, -1);
			if (!folders.length) return 'Vault root';
			return graphSettings.clusterBy === 'folder' ? folders.join('/') : folders[0];
		};
		visibleFiles = visibleFiles.filter((file) => !this.plugin.settings.interaction.hiddenClusterNames.includes(clusterNameFor(file)));
		const clusterVisiblePaths = new Set(visibleFiles.map((file) => file.path));
		visibleEdges = edges.filter((edge) => clusterVisiblePaths.has(edge.source) && clusterVisiblePaths.has(edge.target));
		const clusterKeys = [...new Set(visibleFiles.map(clusterNameFor))].sort();
		const clusterIndex = new Map(clusterKeys.map((key, index) => [key, index]));
		const clusterMembers = new Map(clusterKeys.map((key) => [key, visibleFiles.filter((file) => clusterNameFor(file) === key)]));
		const count = Math.max(visibleFiles.length, 1);
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
				x = progress * 2.5 - 1.25;
				y = ((clusterId - (clusterKeys.length - 1) / 2) * 0.12) + Math.sin(index * 1.7) * 0.035;
				z = Math.min(degree.get(file.path) || 0, 12) * 0.012;
			} else if (animationStyle === 'cluster-orbit' || animationStyle === 'cluster-tour' || this.plugin.settings.visual === 'mind-palace') {
				const totalClusters = Math.max(clusterKeys.length, 1);
				const centerY = 1 - ((clusterId + 0.5) / totalClusters) * 2;
				const centerRing = Math.sqrt(Math.max(0, 1 - centerY * centerY));
				const centerAngle = clusterId * Math.PI * (3 - Math.sqrt(5));
				clusterCenterX = Math.cos(centerAngle) * centerRing * 0.46;
				clusterCenterY = centerY * 0.46;
				clusterCenterZ = Math.sin(centerAngle) * centerRing * 0.46;
				const members = clusterMembers.get(clusterName) || [];
				const localIndex = members.findIndex((member) => member.path === file.path);
				const localY = 1 - ((localIndex + 0.5) / Math.max(members.length, 1)) * 2;
				const localRing = Math.sqrt(Math.max(0, 1 - localY * localY));
				const localAngle = localIndex * Math.PI * (3 - Math.sqrt(5));
				const localRadius = Math.min(0.2, 0.09 + members.length * 0.004);
				x = clusterCenterX + Math.cos(localAngle) * localRing * localRadius;
				y = clusterCenterY + localY * localRadius;
				z = clusterCenterZ + Math.sin(localAngle) * localRing * localRadius;
			} else {
				// Fibonacci sphere distributes notes evenly through a volume.
				y = 1 - (index / Math.max(count - 1, 1)) * 2;
				const ring = Math.sqrt(Math.max(0, 1 - y * y));
				const angle = index * Math.PI * (3 - Math.sqrt(5));
				const radius = 0.58 + Math.min(degree.get(file.path) || 0, 12) * 0.018;
				x = Math.cos(angle) * ring * radius;
				y *= radius;
				z = Math.sin(angle) * ring * radius;
			}
			return {
				path: file.path,
				name: file.basename,
				folder: file.parent?.name || 'Vault root',
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
		this.nodeByPath = new Map(this.nodes.map((node) => [node.path, node]));
		this.edges = visibleEdges;
		this.zoom = 1;
		this.nodeCount?.setText(String(this.nodes.length));
		this.edgeCount?.setText(String(this.edges.length));
		this.updateMetrics(files);
		this.renderActivity();
		if (this.scopeSelect) this.scopeSelect.value = graphSettings.scope;
		if (this.modeSelect) this.modeSelect.value = mode;
	this.scheduleDraw();
	}

	toggleJourney() {
		if (this.journeyTimer) {
			window.clearInterval(this.journeyTimer);
			this.journeyTimer = null;
			this.journeyButton?.setText('START TRAVEL');
			return;
		}
		if (!this.nodes.length) { new Notice('No notes match the current graph filters.'); return; }
		this.journeyNodes = this.buildJourneyOrder();
		this.journeyIndex = -1;
		this.stepJourney(1);
		this.journeyButton?.setText('PAUSE TRAVEL');
		this.journeyTimer = window.setInterval(() => this.stepJourney(1), Math.max(1, this.plugin.settings.journey.nodePauseSeconds) * 1000);
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

	buildJourneyOrder() {
		const mode = this.plugin.settings.mode;
		const nodes = [...this.nodes];
		if (mode === 'recent-activity') return nodes.sort((a, b) => b.mtime - a.mtime).map((node) => node.path);
		if (mode === 'forgotten-knowledge') return nodes.sort((a, b) => a.mtime - b.mtime).map((node) => node.path);
		if (mode === 'hub-explorer') return nodes.sort((a, b) => b.degree - a.degree).map((node) => node.path);
		if (mode === 'hidden-gems') return nodes.sort((a, b) => a.degree - b.degree).map((node) => node.path);
		if (mode === 'orphan-hunt') return nodes.map((node) => node.path);
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
		const dpr = window.devicePixelRatio || 1;
		this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
		this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
		this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.fitNetwork();
	}

	fitNetwork() {
		this.zoom = 1;
		this.panX = 0; this.panY = 0;
		this.rotation = 0; this.tiltOffset = 0;
		this.scheduleDraw();
	}

	draw() {
		if (!this.ctx || !this.canvas?.isConnected) return;
		const ctx = this.ctx;
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		ctx.clearRect(0, 0, width, height);
		const motion = this.plugin.settings.motion;
		const display = this.plugin.settings.display;
		if (motion.animationEnabled) this.frame += motion.animationSpeed;
		this.drawBackground(ctx, width, height, motion);
		const timelineMode = this.plugin.settings.visual === 'timeline-map';
		const animatedSpin = timelineMode ? 0 : this.frame * 0.0018 * (motion.reduceMotion ? 0.2 : motion.cameraSpeed);
		let focusedNode = this.nodeByPath.get(this.focusedPath);
		if (!focusedNode && motion.animationStyle === 'cluster-tour' && this.nodes.length) {
			const clusters = [...new Map(this.nodes.map((node) => [node.clusterName, node])).values()].sort((a, b) => a.clusterId - b.clusterId);
			const pause = Math.max(1, motion.clusterPauseSeconds) * 1000;
			const activeCluster = clusters[Math.floor(Date.now() / pause) % clusters.length];
			if (activeCluster) focusedNode = { x: activeCluster.clusterCenterX, y: activeCluster.clusterCenterY, z: activeCluster.clusterCenterZ };
		}
		if (focusedNode) {
			const yaw = Math.atan2(focusedNode.x, focusedNode.z) - animatedSpin;
			const pitch = Math.atan2(focusedNode.y, Math.hypot(focusedNode.x, focusedNode.z));
			const naturalTilt = motion.animationEnabled && !motion.reduceMotion ? Math.sin(this.frame * 0.0007) * 0.22 : 0;
			if (motion.animationEnabled) {
				this.rotation += Math.atan2(Math.sin(yaw - this.rotation), Math.cos(yaw - this.rotation)) * 0.045;
				this.tiltOffset += (pitch - naturalTilt - this.tiltOffset) * 0.045;
			} else {
				this.rotation = yaw;
				this.tiltOffset = pitch;
			}
		}
		const spin = this.rotation + animatedSpin;
		const tilt = this.tiltOffset + (!timelineMode && motion.animationEnabled && !motion.reduceMotion ? Math.sin(this.frame * 0.0007) * 0.22 : 0);
		const radius = (timelineMode ? width * 0.37 : Math.min(width, height) * (motion.reduceMotion ? 0.34 : 0.39)) * (this.zoom || 1);
		const focalLength = 4.5 - motion.perspectiveStrength * 1.3;
		if (this.plugin.settings.visual === 'timeline-map') this.drawTimelineAxis(ctx, width, height);
		if (['signal-radar', 'satellite-view'].includes(this.plugin.settings.visual)) this.drawRadar(ctx, width, height, radius, this.plugin.settings.visual);
		for (const node of this.nodes) {
			let nx = node.x; let ny = node.y; let nz = node.z;
			if (motion.animationEnabled && !motion.reduceMotion && motion.animationStyle === 'cluster-orbit') {
				const angle = this.frame * 0.003 * motion.animationSpeed + node.clusterId * 0.73;
				const dx = nx - node.clusterCenterX; const dz = nz - node.clusterCenterZ;
				nx = node.clusterCenterX + dx * Math.cos(angle) - dz * Math.sin(angle);
				nz = node.clusterCenterZ + dx * Math.sin(angle) + dz * Math.cos(angle);
			}
			if (motion.animationEnabled && !motion.reduceMotion && motion.animationStyle === 'node-drift') {
				const drift = motion.nodeDriftStrength;
				nx += Math.sin(this.frame * 0.012 + node.phase) * drift;
				ny += Math.cos(this.frame * 0.009 + node.phase) * drift;
				nz += Math.sin(this.frame * 0.01 + node.phase * 1.7) * drift;
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
		}
		const nodeMap = this.nodeByPath;
		const sortedEdges = [...this.edges].sort((a, b) => {
			const depthA = (nodeMap.get(a.source)?.depth || 0) + (nodeMap.get(a.target)?.depth || 0);
			const depthB = (nodeMap.get(b.source)?.depth || 0) + (nodeMap.get(b.target)?.depth || 0);
			return depthA - depthB;
		});
		const interaction = this.plugin.settings.interaction;
		const routeEdges = new Set(interaction.pathPreview.slice(1).map((path, index) => `${interaction.pathPreview[index]}|${path}`));
		const hoveredNode = this.nodes.find((node) => node.hovered);
		const hoveredNeighborhood = new Set(hoveredNode ? [hoveredNode.path] : []);
		if (hoveredNode) for (const edge of this.edges) {
			if (edge.source === hoveredNode.path) hoveredNeighborhood.add(edge.target);
			if (edge.target === hoveredNode.path) hoveredNeighborhood.add(edge.source);
		}
		if (display.showDepthLayers) this.drawDepthLayers(ctx, width, height, radius);
		if (display.showClusterHalos) this.drawClusterHalos(ctx, width, height);
		for (const edge of (display.showLinks ? sortedEdges : [])) {
			const a = nodeMap.get(edge.source);
			const b = nodeMap.get(edge.target);
			if (!a || !b) continue;
			const isRoute = routeEdges.has(`${edge.source}|${edge.target}`) || routeEdges.has(`${edge.target}|${edge.source}`);
			const isNeighbor = hoveredNode && hoveredNeighborhood.has(edge.source) && hoveredNeighborhood.has(edge.target);
			const alpha = isRoute ? 0.94 : Math.max(0.025, Math.min(0.5, (0.1 + (a.depth + b.depth) * 0.06 + Math.min(edge.count, 4) * 0.025) * (hoveredNode && !isNeighbor ? 0.25 : 1)));
			const pathStyle = motion.pathAnimationStyle;
			ctx.beginPath();
			ctx.moveTo(a.screenX, a.screenY);
			if (this.plugin.settings.visual === 'circuit-minimal') {
				const middleX = (a.screenX + b.screenX) / 2;
				ctx.lineTo(middleX, a.screenY); ctx.lineTo(middleX, b.screenY); ctx.lineTo(b.screenX, b.screenY);
			} else if (this.plugin.settings.visual === 'thread-weaver') {
				const bend = ((this.edges.indexOf(edge) % 2) ? 1 : -1) * Math.min(45, Math.hypot(b.screenX - a.screenX, b.screenY - a.screenY) * 0.15);
				ctx.quadraticCurveTo((a.screenX + b.screenX) / 2 + bend, (a.screenY + b.screenY) / 2 - bend, b.screenX, b.screenY);
			} else ctx.lineTo(b.screenX, b.screenY);
			const visual = this.plugin.settings.visual;
			const linkColor = visual === 'matrix-hacker' ? '104,255,151' : ['research-board', 'academic-light', 'ink-map'].includes(visual) ? '61,72,78' : visual === 'aqua-mint' ? '104,255,205' : visual === 'signal-radar' ? '94,255,185' : visual === 'star-map' ? '151,195,255' : '119,194,213';
			ctx.strokeStyle = isRoute ? `rgba(255, 195, 105, ${alpha})` : `rgba(${linkColor}, ${alpha})`;
			ctx.lineWidth = (0.5 + Math.min(edge.count, 4) * 0.13) * display.edgeThickness * ((a.perspective + b.perspective) / 2);
			const lineStyle = motion.lineAnimationStyle;
			if ((lineStyle === 'dashes' || (isRoute && pathStyle === 'dashes')) && motion.animationEnabled && !motion.reduceMotion) {
				ctx.setLineDash([5, 7]);
				ctx.lineDashOffset = -this.frame * 0.12 * motion.connectionPulseSpeed;
			}
			if (isRoute && pathStyle === 'glow') { ctx.shadowColor = 'rgba(255,191,91,.85)'; ctx.shadowBlur = 10; }
			ctx.stroke();
			ctx.shadowBlur = 0;
			ctx.setLineDash([]);
			if (motion.animationEnabled && !motion.reduceMotion && ['flow', 'pulse'].includes(lineStyle)) {
				const progress = (this.frame * 0.008 * motion.connectionPulseSpeed + this.edges.indexOf(edge) * 0.137) % 1;
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
			if (motion.animationEnabled && !motion.reduceMotion && lineStyle === 'draw') {
				const progress = (this.frame * 0.002 * motion.connectionPulseSpeed + this.edges.indexOf(edge) * 0.137) % 1;
				ctx.beginPath(); ctx.moveTo(a.screenX, a.screenY);
				ctx.lineTo(a.screenX + (b.screenX - a.screenX) * progress, a.screenY + (b.screenY - a.screenY) * progress);
				ctx.strokeStyle = `rgba(145, 245, 255, ${Math.min(0.9, alpha + 0.3)})`; ctx.stroke();
			}
			if (isRoute && motion.animationEnabled && !motion.reduceMotion && ['comet', 'draw'].includes(pathStyle)) {
				const routeIndex = interaction.pathPreview.indexOf(edge.source);
				const forward = routeIndex >= 0 && interaction.pathPreview[routeIndex + 1] === edge.target;
				const start = forward ? a : b; const end = forward ? b : a;
				const progress = (this.frame * 0.004 * motion.connectionPulseSpeed + Math.max(0, routeIndex) * 0.23) % 1;
				const px = start.screenX + (end.screenX - start.screenX) * progress;
				const py = start.screenY + (end.screenY - start.screenY) * progress;
				ctx.beginPath();
				if (pathStyle === 'draw') { ctx.moveTo(start.screenX, start.screenY); ctx.lineTo(px, py); ctx.strokeStyle = 'rgba(255,225,155,.95)'; ctx.lineWidth = 2.2; ctx.stroke(); }
				else { ctx.arc(px, py, 3.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,229,166,.96)'; ctx.shadowColor = 'rgba(255,191,91,.9)'; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0; }
			}
		}
		const orderedNodes = [...this.nodes].sort((a, b) => a.depth - b.depth);
		for (const node of orderedNodes) {
			const pulse = 0.78 + Math.sin(this.frame * 0.018 + node.phase) * 0.22;
			const nodeRadius = Math.min(7, 2.1 + Math.sqrt(node.degree) * 0.8) * display.nodeSize * node.perspective;
			const visual = this.plugin.settings.visual;
			let hue = node.degree > 5 ? '255, 115, 180' : '103, 224, 221';
			if (this.plugin.settings.colors === 'monochrome') hue = '198, 211, 220';
			if (this.plugin.settings.colors === 'deep-ocean') hue = node.degree > 5 ? '104, 166, 255' : '93, 218, 229';
			if (this.plugin.settings.colors === 'violet') hue = node.degree > 5 ? '205, 139, 255' : '127, 190, 255';
			if (this.plugin.settings.colors === 'ember') hue = node.degree > 5 ? '255, 111, 82' : '255, 202, 106';
			if (this.plugin.settings.colors === 'aurora') hue = node.degree > 5 ? '255, 115, 180' : '103, 224, 221';
			if (this.plugin.settings.colors === 'age-gradient') hue = Date.now() - node.mtime > this.plugin.settings.discovery.forgottenDays * 86400000 ? '255, 128, 91' : '110, 230, 195';
			if (this.plugin.settings.colors === 'clusters') {
				const clusterPalette = ['103, 224, 221', '255, 115, 180', '255, 199, 95', '156, 132, 255', '121, 226, 148', '255, 143, 100'];
				hue = clusterPalette[node.clusterId % clusterPalette.length];
			}
			if (visual === 'deep-space') hue = node.depth > 0 ? '142, 129, 255' : '73, 191, 222';
			if (visual === 'neon') hue = node.degree > 5 ? '255, 72, 208' : '56, 230, 255';
			if (visual === 'minimal' || visual === 'circuit-minimal') hue = visual === 'minimal' ? '162, 190, 204' : '105, 229, 206';
			if (visual === 'timeline-map') hue = Date.now() - node.mtime > 180 * 86400000 ? '246, 157, 104' : '105, 207, 237';
			if (visual === 'mind-palace') hue = ['193,164,255', '255,164,207', '255,212,137', '135,224,215', '171,202,255', '226,179,247'][node.clusterId % 6];
			if (visual === 'archive-fog') hue = Date.now() - node.mtime > 180 * 86400000 ? '196, 153, 107' : '161, 180, 185';
			const activeNodePath = this.app.workspace.getActiveFile()?.path;
			if (visual === 'focus-lens') hue = node.focused || node.path === activeNodePath || node.hovered ? '255, 211, 120' : '116, 188, 224';
			if (visual === 'thread-weaver') hue = ['246,132,177', '158,145,255', '101,221,210', '255,196,117', '133,185,255', '206,142,239'][node.clusterId % 6];
			if (visual === 'research-board') hue = ['44,125,142', '190,102,83', '110,128,84', '119,102,156', '62,116,173', '176,133,53'][node.clusterId % 6];
			if (visual === 'signal-radar') hue = node.degree > 6 ? '255, 202, 87' : node.degree > 2 ? '98, 255, 179' : '76, 191, 195';
			if (visual === 'matrix-hacker') hue = node.degree > 5 ? '165, 255, 123' : '55, 218, 112';
			if (visual === 'star-map') hue = node.degree > 5 ? '255, 225, 168' : '156, 201, 255';
			if (visual === 'aqua-mint') hue = node.degree > 5 ? '117, 255, 201' : '64, 203, 172';
			if (visual === 'ink-map') hue = ['45,83,101', '143,82,61', '77,105,73', '100,81,128', '47,105,142', '160,118,51'][node.clusterId % 6];
			if (visual === 'neural-bloom') hue = ['255,95,185', '181,112,255', '107,220,255', '255,169,93'][node.clusterId % 4];
			if (visual === 'satellite-view') hue = node.degree > 5 ? '255, 185, 98' : '105, 211, 255';
			if (visual === 'glass-minimal') hue = node.degree > 5 ? '164, 228, 240' : '121, 190, 210';
			if (visual === 'academic-light') hue = ['53,119,143', '167,86,67', '87,121,73', '108,86,144', '58,103,155', '170,128,51'][node.clusterId % 6];
			if (visual === 'soft-glow') hue = node.degree > 5 ? '255, 160, 215' : '135, 218, 255';
			const glowScale = visual === 'neon' || visual === 'neural-bloom' || visual === 'soft-glow' ? 3.8 : visual === 'deep-space' ? 3.8 : visual === 'glass-minimal' || visual === 'minimal' || visual === 'circuit-minimal' ? 1.8 : 2.7;
			ctx.beginPath();
			this.traceNodeShape(ctx, node.screenX, node.screenY, nodeRadius * glowScale * pulse, visual);
			ctx.fillStyle = `rgba(${hue}, ${motion.glowEnabled && !['minimal', 'circuit-minimal'].includes(visual) ? 0.035 + node.depth * 0.012 : 0})`;
			ctx.fill();
			ctx.beginPath();
			this.traceNodeShape(ctx, node.screenX, node.screenY, nodeRadius * pulse, visual);
			const isNeighbor = hoveredNode && hoveredNeighborhood.has(node.path);
			const focusFade = visual === 'focus-lens' && !node.focused && node.path !== activeNodePath && !node.hovered ? 0.34 : 1;
			const fade = (hoveredNode && !isNeighbor ? 0.22 : 1) * focusFade;
			ctx.fillStyle = `rgba(${hue}, ${Math.max(0.18, Math.min(0.95, 0.58 + node.depth * 0.28)) * fade})`;
			ctx.fill();
			if (display.showNodeIcons && nodeRadius > 3) {
				ctx.fillStyle = '#071015';
				ctx.font = `600 ${Math.max(5, nodeRadius * 1.15)}px sans-serif`;
				ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
				ctx.fillText(node.name.slice(0, 1).toUpperCase(), node.screenX, node.screenY + 0.3);
				ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
			}
			if (node.pinned || node.focused) {
				ctx.beginPath();
				ctx.arc(node.screenX, node.screenY, nodeRadius + (node.focused ? 6 : 4), 0, Math.PI * 2);
				ctx.strokeStyle = node.focused ? 'rgba(255, 205, 112, 1)' : 'rgba(255, 205, 112, 0.72)';
				ctx.lineWidth = node.focused ? 1.8 : 1.2;
				ctx.stroke();
			}
			if (display.showLabels && (node.degree > 2 || node.hovered || node.focused)) {
				ctx.font = `${display.labelSize}px var(--font-monospace)`;
				const lightStyle = ['research-board', 'academic-light', 'ink-map'].includes(visual);
				ctx.fillStyle = node.hovered ? (lightStyle ? '#17222b' : '#fff') : lightStyle ? `rgba(35,48,55,${Math.max(0.52, 0.66 + node.depth * 0.2)})` : visual === 'matrix-hacker' ? 'rgba(156,255,178,.86)' : `rgba(220, 232, 240, ${Math.max(0.28, 0.48 + node.depth * 0.28)})`;
				ctx.fillText(node.name.slice(0, 26), node.screenX + nodeRadius + 5, node.screenY + 3);
			}
		}
		this.clock?.setText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
		if (display.showFps) {
			this.fpsFrames++;
			const now = performance.now();
			if (now - this.fpsLast >= 1000) {
				this.fpsIndicator?.setText(`${Math.round(this.fpsFrames * 1000 / (now - this.fpsLast))} FPS`);
				this.fpsFrames = 0;
				this.fpsLast = now;
			}
		} else this.fpsIndicator?.setText('');
		if (motion.animationEnabled) this.scheduleDraw();
	}

	traceNodeShape(ctx, x, y, size, style) {
		if (style === 'circuit-minimal' || style === 'matrix-hacker') {
			ctx.rect(x - size * 0.72, y - size * 0.72, size * 1.44, size * 1.44);
			return;
		}
		if (style === 'signal-radar') {
			ctx.moveTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y); ctx.closePath();
			return;
		}
		if (style === 'star-map') {
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
			'timeline-map': '#101722', 'circuit-minimal': '#071115', 'archive-fog': '#111318',
			'research-board': '#e8e5dc', 'matrix-hacker': '#020b07', 'star-map': '#050a18',
			'aqua-mint': '#061512', 'signal-radar': '#07121d', 'mind-palace': '#100a1d',
			'focus-lens': '#080d17', 'thread-weaver': '#0c0b18', 'ink-map': '#e9e4d6',
			'neural-bloom': '#100817', 'satellite-view': '#071017', 'glass-minimal': '#10171c',
			'academic-light': '#f0efe8', 'soft-glow': '#090d17',
		};
		const base = visualBackgrounds[visual] || (style === 'void' ? '#05070c' : style === 'aurora' ? '#07111a' : '#070a12');
		ctx.fillStyle = base; ctx.fillRect(0, 0, width, height);
		const paperStyle = ['research-board', 'ink-map', 'academic-light'].includes(visual);
		const flatStyle = ['matrix-hacker', 'circuit-minimal', 'signal-radar', 'star-map', 'satellite-view'].includes(visual);
		if (!paperStyle && !flatStyle && (style === 'nebula' || style === 'aurora' || visual === 'deep-space' || visual === 'neural-bloom' || visual === 'mind-palace' || visual === 'archive-fog' || visual === 'soft-glow' || visual === 'thread-weaver')) {
			const glow = ctx.createRadialGradient(width * 0.52, height * 0.48, 0, width * 0.52, height * 0.48, Math.max(width, height) * 0.72);
			const cool = style === 'aurora' || visual === 'aqua-mint';
			glow.addColorStop(0, visual === 'neural-bloom' ? 'rgba(214,68,255,.30)' : cool ? 'rgba(26,105,111,.32)' : 'rgba(53,42,112,.34)');
			glow.addColorStop(0.55, visual === 'archive-fog' ? 'rgba(155,143,119,.16)' : cool ? 'rgba(28,57,93,.18)' : 'rgba(18,50,69,.16)');
			glow.addColorStop(1, 'rgba(4,7,13,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
		}
		if (style === 'grid' || ['timeline-map', 'circuit-minimal', 'research-board', 'matrix-hacker', 'academic-light', 'ink-map'].includes(visual)) {
			const light = ['research-board', 'academic-light', 'ink-map'].includes(visual);
			ctx.strokeStyle = light ? 'rgba(45,64,72,.12)' : visual === 'matrix-hacker' ? 'rgba(70,255,135,.10)' : 'rgba(103,224,221,.07)'; ctx.lineWidth = 1;
			const spacing = visual === 'research-board' || visual === 'academic-light' ? 24 : 36;
			for (let x = width / 2 % spacing; x < width; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
			for (let y = height / 2 % spacing; y < height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
		}
		const count = Math.max(0, Math.min(140, motion.backgroundParticles));
		for (let i = 0; i < count; i++) {
			const star = this.backgroundParticles[i];
			const twinkle = motion.reduceMotion ? 0.55 : 0.3 + (Math.sin(this.frame * 0.012 + star.phase) + 1) * 0.3;
			ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
			ctx.fillStyle = visual === 'matrix-hacker' ? `rgba(104,255,151,${twinkle})` : ['research-board', 'academic-light', 'ink-map'].includes(visual) ? `rgba(51,75,83,${twinkle * 0.5})` : `rgba(190,225,255,${twinkle})`; ctx.fill();
		}
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
		ctx.save(); ctx.strokeStyle = 'rgba(113,179,201,.12)'; ctx.lineWidth = 1;
		for (const level of [-0.52, 0, 0.52]) {
			ctx.beginPath(); ctx.ellipse(width / 2 + this.panX, height / 2 + this.panY + level * radius * 0.38, radius * 0.78, radius * 0.2, 0, 0, Math.PI * 2); ctx.stroke();
		}
		ctx.restore();
	}

	drawClusterHalos(ctx, width, height) {
		const groups = new Map();
		for (const node of this.nodes) {
			if (!groups.has(node.clusterName)) groups.set(node.clusterName, []);
			groups.get(node.clusterName).push(node);
		}
		const palette = ['103,224,221', '255,115,180', '255,199,95', '156,132,255', '121,226,148', '255,143,100'];
		for (const nodes of groups.values()) {
			if (nodes.length < 2) continue;
			const cx = nodes.reduce((sum, node) => sum + node.screenX, 0) / nodes.length;
			const cy = nodes.reduce((sum, node) => sum + node.screenY, 0) / nodes.length;
			const radius = Math.min(190, Math.max(22, ...nodes.map((node) => Math.hypot(node.screenX - cx, node.screenY - cy) + 14)));
			const color = palette[nodes[0].clusterId % palette.length];
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
		if (this.animation || !this.canvas?.isConnected) return;
		this.animation = window.requestAnimationFrame(() => {
			this.animation = 0;
			this.draw();
		});
	}

	updateControlLabels() {
		if (!this.animationButton) return;
		const running = this.plugin.settings.motion.animationEnabled;
		this.animationButton.setText(running ? 'Ⅱ  PAUSE' : '▶  PLAY');
		this.animationButton.setAttribute('aria-label', running ? 'Pause animation' : 'Play animation');
	}

	applySettings() {
		this.updateControlLabels();
		if (this.scopeSelect) this.scopeSelect.value = this.plugin.settings.graph.scope;
		if (this.modeSelect) this.modeSelect.value = this.plugin.settings.mode;
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
		for (const node of this.nodes) {
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
			const pinned = interaction.pinnedNodePaths.includes(node.path);
			menu.addItem((item) => item.setTitle(pinned ? 'Unpin note' : 'Pin note').setIcon(pinned ? 'pin-off' : 'pin').onClick(() => {
				const values = pinned ? interaction.pinnedNodePaths.filter((path) => path !== node.path) : [...interaction.pinnedNodePaths, node.path];
				this.plugin.setSetting('interaction', 'pinnedNodePaths', values);
			}));
			menu.addItem((item) => item.setTitle('Hide note').setIcon('eye-off').onClick(() => {
				this.plugin.setSetting('interaction', 'hiddenNodePaths', [...interaction.hiddenNodePaths, node.path], true);
			}));
			menu.addItem((item) => item.setTitle(`Hide cluster: ${node.clusterName}`).setIcon('layers').onClick(() => {
				this.plugin.setSetting('interaction', 'hiddenClusterNames', [...new Set([...interaction.hiddenClusterNames, node.clusterName])], true);
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
		if (interaction.pathPreview.length || interaction.pathStartPath) {
			menu.addItem((item) => item.setTitle('Clear route preview').setIcon('x').onClick(async () => {
				this.plugin.settings.interaction.pathStartPath = null;
				this.plugin.settings.interaction.pathPreview = [];
				await this.plugin.saveSettings();
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
			this.dragPoint = { x: event.clientX, y: event.clientY };
			this.canvas.style.cursor = this.dragNode ? 'move' : 'grabbing';
			this.scheduleDraw();
			return;
		}
		const found = this.findNode(event);
		for (const node of this.nodes) node.hovered = node === found;
		if (!found) { this.tooltip.addClass('is-hidden'); this.scheduleDraw(); return; }
		this.tooltip.setText(`${found.name}  ·  ${found.degree} links  ·  ${found.folder}`);
		this.tooltip.style.left = `${event.clientX - this.canvas.getBoundingClientRect().left + 14}px`;
		this.tooltip.style.top = `${event.clientY - this.canvas.getBoundingClientRect().top + 14}px`;
		this.tooltip.removeClass('is-hidden');
		this.canvas.style.cursor = found ? 'grab' : 'grab';
		this.scheduleDraw();
	}

	onCanvasClick(event) {
		if (this.dragMoved) { this.dragMoved = false; return; }
		const node = this.findNode(event);
		if (!node) return;
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
		this.registerEvent(this.app.metadataCache.on('resolved', () => this.refreshView()));
		this.registerEvent(this.app.workspace.on('file-open', () => this.refreshView()));
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

	refreshSettings() {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) leaf.view.applySettings();
	}

	async setSetting(section, key, value, refreshGraph = false) {
		if (section === null) this.settings[key] = value;
		else this.settings[section][key] = value;
		await this.saveSettings(refreshGraph);
	}

	async saveSettings(refreshGraph = false) {
		await this.saveData(this.settings);
		if (refreshGraph) this.refreshView();
		else this.refreshSettings();
	}

	async toggleAnimation() {
		this.settings.motion.animationEnabled = !this.settings.motion.animationEnabled;
		await this.saveSettings();
	}

	async applyPreset(id) {
		const presets = {
			constellation: { visual: 'constellation', colors: 'clusters', motion: { animationStyle: 'cluster-orbit', animationSpeed: 0.55, cameraSpeed: 0.35, reduceMotion: false, glowEnabled: true } },
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
		this.refreshView();
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
		this.section(containerEl, 'Quick');
		this.dropdown(containerEl, 'Visual preset', 'Load a ready-made visual combination.', 'template', 'activeTemplateId', {
			constellation: 'Constellation', deepSpace: 'Deep Space', neon: 'Neon', minimal: 'Minimal Focus',
		}, (value) => this.plugin.applyPreset(value));
		this.section(containerEl, 'Graph');
		this.dropdown(containerEl, 'Graph scope', 'Show the whole vault or notes around the active note.', 'graph', 'scope', { global: 'Global', local: 'Local', current: 'Current note' }, null, true);
		this.slider(containerEl, 'Local depth', 'Number of link steps around the active note.', 'graph', 'localDepth', 1, 10, 1, true);
		this.text(containerEl, 'Folder filter', 'Comma-separated folder names or path fragments.', 'graph', 'folderFilter', true);
		this.text(containerEl, 'Tag filter', 'Comma-separated tags from note content or frontmatter.', 'graph', 'tagFilter', true);
		this.dropdown(containerEl, 'Date filter', 'Limit notes by their last modified date.', 'graph', 'dateFilter', { all: 'All notes', recent: 'Recently modified', forgotten: 'Long time ago' }, null, true);
		this.slider(containerEl, 'Minimum connections', 'Hide notes with fewer links than this value.', 'graph', 'minimumConnections', 0, 20, 1, true);
		this.toggle(containerEl, 'Include floating notes', 'Keep notes with no links visible.', 'graph', 'includeFloatingNotes', true);
		this.dropdown(containerEl, 'Cluster notes by', 'Choose whether clusters follow top-level folders or the complete folder path.', 'graph', 'clusterBy', { 'top-level': 'Top-level folder', folder: 'Full folder path' }, null, true);
		this.section(containerEl, 'Visual');
		this.dropdown(containerEl, 'Visual style', 'Choose a complete visual treatment for the graph.', null, 'visual', {
			constellation: 'Constellation', 'timeline-map': 'Timeline Map', 'mind-palace': 'Mind Palace', 'circuit-minimal': 'Circuit Minimal',
			'archive-fog': 'Archive Fog', 'focus-lens': 'Focus Lens', 'thread-weaver': 'Thread Weaver', 'research-board': 'Research Board',
			'signal-radar': 'Signal Radar', 'matrix-hacker': 'Matrix Hacker', 'star-map': 'Star Map', 'aqua-mint': 'Aqua Mint',
			'deep-space': 'Deep Space', neon: 'Neon', minimal: 'Minimal', 'soft-glow': 'Soft Glow', 'neural-bloom': 'Neural Bloom',
			'satellite-view': 'Satellite View', 'glass-minimal': 'Glass Minimal', 'academic-light': 'Academic Light', 'ink-map': 'Ink Map',
		}, null, true);
		this.dropdown(containerEl, 'Color scheme', 'Color by link activity, age, folder cluster, or a fixed palette.', null, 'colors', { aurora: 'Aurora', 'deep-ocean': 'Deep Ocean', violet: 'Violet cosmos', ember: 'Solar ember', monochrome: 'Monochrome', 'age-gradient': 'Age Gradient', clusters: 'Folder clusters' });
		this.section(containerEl, 'Background');
		this.dropdown(containerEl, 'Background style', 'Set the atmosphere behind the 3D note space.', 'motion', 'backgroundStyle', { nebula: 'Nebula', aurora: 'Aurora', grid: 'Star map grid', void: 'Deep void' });
		this.slider(containerEl, 'Background particles', 'Set the number of softly animated stars.', 'motion', 'backgroundParticles', 0, 140, 5);
		this.section(containerEl, 'Motion');
		this.toggle(containerEl, 'Animation', 'Rotate and gently move the note space.', 'motion', 'animationEnabled');
		this.dropdown(containerEl, '3D animation style', 'Choose how the note space moves. Cluster styles group notes by their top-level vault folder.', 'motion', 'animationStyle', {
			orbit: '3D orbit', 'cluster-orbit': 'Cluster orbit', 'cluster-tour': 'Cluster tour', 'node-drift': 'Floating notes',
		}, null, true);
		this.slider(containerEl, 'Animation speed', 'Set the speed of automatic rotation.', 'motion', 'animationSpeed', 0.1, 1.5, 0.05);
		this.slider(containerEl, 'Camera speed', 'Set how quickly the 3D view turns.', 'motion', 'cameraSpeed', 0.1, 1, 0.05);
		this.slider(containerEl, 'Cluster visit interval (seconds)', 'How long the camera stays with each folder cluster in Cluster tour.', 'motion', 'clusterPauseSeconds', 2, 30, 1);
		this.slider(containerEl, 'Floating amount', 'Set how far individual notes drift in Floating notes mode.', 'motion', 'nodeDriftStrength', 0.01, 0.2, 0.01);
		this.slider(containerEl, 'Link pulse speed', 'Set the speed of particles moving along note links.', 'motion', 'connectionPulseSpeed', 0.1, 2, 0.1);
		this.dropdown(containerEl, 'Link animation', 'Choose how motion travels along connections.', 'motion', 'lineAnimationStyle', { none: 'Static lines', flow: 'Flowing particles', pulse: 'Link pulses', draw: 'Drawing lines', dashes: 'Moving dashes' });
		this.dropdown(containerEl, 'Route animation', 'Choose how a route preview is animated.', 'motion', 'pathAnimationStyle', { static: 'Static highlight', glow: 'Glow', comet: 'Traveling comet', draw: 'Draw the route', dashes: 'Moving dashes' });
		this.slider(containerEl, '3D perspective depth', 'Increase or soften the perspective difference between near and far notes.', 'motion', 'perspectiveStrength', 0.2, 2.4, 0.1);
		this.toggle(containerEl, 'Reduce motion', 'Use a calmer camera with less ambient movement.', 'motion', 'reduceMotion');
		this.toggle(containerEl, 'Node glow', 'Show a soft glow around notes.', 'motion', 'glowEnabled');
		this.section(containerEl, 'Discovery');
		this.dropdown(containerEl, 'Mode', 'Focus on a particular way of exploring notes.', null, 'mode', {
			wander: 'Wander', 'path-journey': 'Path journey', 'recent-activity': 'Recent activity', 'forgotten-knowledge': 'Forgotten knowledge',
			'hub-explorer': 'Hub explorer', 'hidden-gems': 'Hidden gems', 'orphan-hunt': 'Orphan hunt',
		}, null, true);
		this.slider(containerEl, 'Recent window (days)', 'Used by Recent activity mode and the recent date filter.', 'discovery', 'recentDays', 1, 365, 1, true);
		this.slider(containerEl, 'Forgotten after (days)', 'Used by Forgotten knowledge mode and the forgotten date filter.', 'discovery', 'forgottenDays', 30, 1500, 10, true);
		this.section(containerEl, 'Journey');
		this.slider(containerEl, 'Pause on each note (seconds)', 'Set the interval used by automatic note travel.', 'journey', 'nodePauseSeconds', 1, 30, 1);
		this.section(containerEl, 'Display');
		this.toggle(containerEl, 'Note labels', 'Show names for connected notes and the focused note.', 'display', 'showLabels');
		this.toggle(containerEl, 'Link lines', 'Show connections between linked notes.', 'display', 'showLinks');
		this.toggle(containerEl, 'Node icons', 'Show the first letter of each note inside its node.', 'display', 'showNodeIcons');
		this.toggle(containerEl, 'Depth layers', 'Draw subtle guide rings to make 3D depth easier to read.', 'display', 'showDepthLayers');
		this.toggle(containerEl, 'Cluster halos', 'Draw a soft boundary around notes in the same folder cluster.', 'display', 'showClusterHalos');
		this.toggle(containerEl, 'FPS indicator', 'Show the current rendering rate in the header.', 'display', 'showFps');
		this.slider(containerEl, 'Label size', 'Set the size of note names.', 'display', 'labelSize', 8, 18, 1);
		this.slider(containerEl, 'Node size', 'Scale the note markers.', 'display', 'nodeSize', 0.5, 2, 0.1);
		this.slider(containerEl, 'Link thickness', 'Scale the lines between notes.', 'display', 'edgeThickness', 0.4, 2, 0.1);
	}

	section(container, name) { new Setting(container).setName(name).setHeading(); }

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
			.setValue(this.plugin.settings[section][key])
			.onChange((value) => this.plugin.setSetting(section, key, value, refreshGraph)));
	}
}
