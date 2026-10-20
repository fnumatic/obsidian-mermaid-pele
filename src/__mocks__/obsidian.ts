// Mock obsidian API for testing (vitest aliases 'obsidian' to this module).
export class Plugin {
    app: any;
    manifest: any;
    commands: any[] = [];
    settingTabs: any[] = [];
    codeBlockProcessors: Record<string, any> = {};
    data: any = null;

    constructor(app: any, manifest: any) {
        this.app = app;
        this.manifest = manifest;
    }

    addCommand(command: any) {
        this.commands.push(command);
    }

    addSettingTab(tab: any) {
        this.settingTabs.push(tab);
    }

    registerMarkdownCodeBlockProcessor(language: string, handler: any) {
        this.codeBlockProcessors[language] = handler;
    }

    async loadData() {
        return this.data;
    }

    async saveData(data: any) {
        this.data = data;
    }

    async onload(this: void) {}
    onunload(this: void) {}
}

export class Modal {
    app: any;
    contentEl: HTMLElement;
    modalEl: HTMLElement;

    constructor(app: any) {
        this.app = app;
        this.contentEl = document.createElement('div');
        this.modalEl = document.createElement('div');
    }

    open(this: void) {}
    close(this: void) {}
    onOpen(this: void) {}
    onClose(this: void) {}
}

export class Notice {
    message: string;

    constructor(message: string, _duration?: number) {
        this.message = message;
    }

    setMessage(message: string) {
        this.message = message;
    }

    hide() {}
}

export class TFile {
    path = '';
    basename = '';
    extension = '';
    name = '';
    stat: { mtime: number; ctime: number; size: number } = { mtime: 0, ctime: 0, size: 0 };
}

export class App {
    vault: any = {};
    workspace: any = {};
    metadataCache: any = {};
}

export class Component {
    load(this: void) {}
    unload(this: void) {}
}

export class MarkdownRenderChild {
    containerEl: HTMLElement;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
    }

    onload(this: void) {}
    onunload(this: void) {}
}

export class MarkdownRenderer {
    static async render(
        _app: any,
        _markdown: string,
        el: HTMLElement,
        _sourcePath: string,
        _component: any,
    ) {
        el.innerHTML = '<p>Mock rendered content</p>';
    }
}

export class PluginSettingTab {
    app: App;
    plugin: any;
    containerEl: HTMLElement;

    constructor(app: App, plugin: any) {
        this.app = app;
        this.plugin = plugin;
        this.containerEl = document.createElement('div');
    }

    display(this: void) {}
}

export class Setting {
    constructor(_containerEl: HTMLElement) {}

    setName(_name: string) {
        return this;
    }
    setDesc(_desc: string) {
        return this;
    }
    setHeading() {
        return this;
    }
    addDropdown(_cb: any) {
        return this;
    }
    addToggle(_cb: any) {
        return this;
    }
    addSlider(_cb: any) {
        return this;
    }
    addText(_cb: any) {
        return this;
    }
    addButton(_cb: any) {
        return this;
    }
    addExtraButton(_cb: any) {
        return this;
    }
}

export class Editor {
    getSelection(this: void) {
        return '';
    }
    replaceSelection(this: void, _text: string) {}
}

export function addIcon(this: void, _name: string, _svg: string) {}

export function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

/** Returns the object a test provides via `globalThis.__mockMermaid`. */
export async function loadMermaid(): Promise<unknown> {
    return (
        (globalThis as { __mockMermaid?: unknown }).__mockMermaid ?? {
            initialize() {},
            render: async () => ({ svg: '' }),
        }
    );
}

export function parseYaml(_yaml: string): any {
    return {};
}

export function arrayBufferToBase64(_buffer: ArrayBuffer): string {
    return '';
}

export function base64ToArrayBuffer(_base64: string): ArrayBuffer {
    return new ArrayBuffer(0);
}

// Minimal moment shim: the date adapter only checks for a function at runtime.
export const moment = () => null;

export const Platform = { isDesktopApp: true, isMobileApp: false };

export default {};
