// Minimal Obsidian API mock for tests (vitest aliases 'obsidian' to this module).
// Only the members this plugin touches are implemented.
import type { App, PluginManifest } from 'obsidian';
import { isMermaidApi } from '../mermaid-api';
import type { MermaidApi } from '../mermaid-api';

export class Plugin {
    app: App;
    manifest: PluginManifest;
    settingTabs: unknown[] = [];
    codeBlockProcessors: Record<string, unknown> = {};
    data: unknown = null;

    constructor(app: App, manifest: PluginManifest) {
        this.app = app;
        this.manifest = manifest;
    }

    addSettingTab(tab: unknown): void {
        this.settingTabs.push(tab);
    }

    registerMarkdownCodeBlockProcessor(language: string, handler: unknown): void {
        this.codeBlockProcessors[language] = handler;
    }

    async loadData(): Promise<unknown> {
        return this.data;
    }

    async saveData(data: unknown): Promise<void> {
        this.data = data;
    }
}

export class PluginSettingTab {
    app: App;
    plugin: Plugin;
    containerEl: HTMLElement;

    constructor(app: App, plugin: Plugin) {
        this.app = app;
        this.plugin = plugin;
        this.containerEl = document.createElement('div');
    }

    display(): void {}
}

/** Shape Settings pass to their `addToggle` callback. */
export interface ToggleMock {
    setValue(value: boolean): ToggleMock;
    onChange(callback: (value: boolean) => void | Promise<void>): ToggleMock;
}

export class Setting {
    setName(_name: string): this {
        return this;
    }

    setDesc(_desc: string): this {
        return this;
    }

    addToggle(_callback: (toggle: ToggleMock) => void): this {
        return this;
    }
}

export class Notice {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

const fallbackMermaid: MermaidApi = {
    initialize: () => undefined,
    render: async () => ({ svg: '' }),
};

/** Returns the object a test provides via `globalThis.__mockMermaid`. */
export async function loadMermaid(): Promise<MermaidApi> {
    const mock: unknown = Reflect.get(globalThis, '__mockMermaid');
    return isMermaidApi(mock) ? mock : fallbackMermaid;
}

export default {};
