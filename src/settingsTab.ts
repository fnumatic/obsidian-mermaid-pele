import type { App } from 'obsidian';
import { Notice, PluginSettingTab, Setting } from 'obsidian';
import type PeleMermaidPlugin from './main';

export class PeleSettingTab extends PluginSettingTab {
    plugin: PeleMermaidPlugin;

    constructor(app: App, plugin: PeleMermaidPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl, plugin } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Pele Mermaid' });

        new Setting(containerEl)
            .setName('Render built-in Mermaid blocks')
            .setDesc(
                "Use Pele for ```mermaid blocks instead of Obsidian's bundled Mermaid. Every diagram type from Mermaid 12.1 is supported; colors come from CSS variables. Reopen a note to apply.",
            )
            .addToggle((toggle) => {
                toggle.setValue(plugin.settings.replaceBuiltin).onChange(async (value) => {
                    plugin.settings.replaceBuiltin = value;
                    await plugin.saveSettings();
                    await plugin.applyRenderer();
                    void new Notice('Reopen the note to apply the renderer change.');
                });
            });

        containerEl.createEl('p', {
            cls: 'setting-item-description',
            text: 'While active, Obsidian renders Mermaid through Pele. Disable the plugin to get the built-in renderer back.',
        });
    }
}
