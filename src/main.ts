import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS } from './settings';
import type { PeleSettings } from './settings';
import { PeleSettingTab } from './settingsTab';
import { renderDiagram } from './render';
import { installPeleFacade, removePeleFacade } from './facade';

import './styles.css';

const diagramProcessor = (content: string, el: HTMLElement): void => {
    renderDiagram(content, el);
};

export default class PeleMermaidPlugin extends Plugin {
    settings!: PeleSettings;

    async onload(): Promise<void> {
        await this.loadSettings();

        this.addSettingTab(new PeleSettingTab(this.app, this));

        this.registerMarkdownCodeBlockProcessor('mermaid-pele', diagramProcessor);
        // Compatibility with notes written for obsidian-charts.
        this.registerMarkdownCodeBlockProcessor('chart-mermaid', diagramProcessor);

        await this.applyRenderer();
    }

    onunload(): void {
        removePeleFacade();
    }

    /** Replaces or restores Obsidian's Mermaid renderer, depending on settings. */
    async applyRenderer(): Promise<void> {
        if (!this.settings.replaceBuiltin) {
            removePeleFacade();
            return;
        }

        if ((await installPeleFacade()) === 'unavailable') {
            console.warn(
                '[Pele] Built-in Mermaid is not available; keeping the original renderer.',
            );
        }
    }

    private async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
