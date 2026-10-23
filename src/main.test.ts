// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import PeleMermaidPlugin from './main';
import type { PeleSettings } from './settings';
import {
    createApp,
    createManifest,
    createMermaidMock,
    getWindowMermaid,
    pluginState,
    resetMermaidEnvironment,
    setMockMermaid,
} from './test-helpers';

const createPlugin = async (settings?: PeleSettings): Promise<PeleMermaidPlugin> => {
    const plugin = new PeleMermaidPlugin(createApp(), createManifest());
    if (settings) {
        await plugin.saveData(settings);
    }
    return plugin;
};

const registeredLanguages = (plugin: PeleMermaidPlugin): string[] =>
    Object.keys(pluginState(plugin).codeBlockProcessors);

describe('PeleMermaidPlugin', () => {
    afterEach(resetMermaidEnvironment);

    it('registers both diagram blocks and replaces the built-in renderer', async () => {
        setMockMermaid(createMermaidMock());
        const plugin = await createPlugin();

        await plugin.onload();

        expect(registeredLanguages(plugin)).toEqual(['mermaid-pele', 'chart-mermaid']);
        expect(getWindowMermaid()).toBeDefined();
    });

    it('leaves the built-in renderer alone when the setting is off', async () => {
        setMockMermaid(createMermaidMock());
        const plugin = await createPlugin({ replaceBuiltin: false });

        await plugin.onload();

        expect(registeredLanguages(plugin)).toEqual(['mermaid-pele', 'chart-mermaid']);
        expect(getWindowMermaid()).toBeUndefined();
    });

    it('installs the renderer when the setting is switched on', async () => {
        setMockMermaid(createMermaidMock());
        const plugin = await createPlugin({ replaceBuiltin: false });
        await plugin.onload();

        plugin.settings.replaceBuiltin = true;
        await plugin.applyRenderer();

        expect(getWindowMermaid()).toBeDefined();
    });

    it('restores the original renderer on unload', async () => {
        const original = createMermaidMock();
        setMockMermaid(original);
        const plugin = await createPlugin();
        await plugin.onload();

        plugin.onunload();

        expect(getWindowMermaid()).toBe(original);
    });
});
