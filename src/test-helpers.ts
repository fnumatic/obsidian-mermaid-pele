import type { App, PluginManifest } from 'obsidian';
import { removePeleFacade } from './facade';
import { isMermaidApi } from './mermaid-api';
import type { MermaidApi, MermaidRenderResult } from './mermaid-api';
import type PeleMermaidPlugin from './main';

/** Obsidian's App is too broad to fake field by field in these tests. */
export const createApp = (): App => ({}) as App;

export const createManifest = (): PluginManifest => ({
    id: 'mermaid-pele',
    name: 'Pele Mermaid',
    version: '0.1.0',
    minAppVersion: '1.10.3',
    description: 'Test manifest',
    author: 'Test',
    isDesktopOnly: false,
});

/** Runtime-only fields that the Obsidian mock's Plugin base class adds. */
export interface PluginTestState {
    codeBlockProcessors: Record<string, unknown>;
}

export const pluginState = (plugin: PeleMermaidPlugin): PluginTestState =>
    plugin as unknown as PluginTestState;

/** Creates a minimal, fully typed Mermaid API stand-in for tests. */
export const createMermaidMock = (overrides: Partial<MermaidApi> = {}): MermaidApi => ({
    initialize: () => undefined,
    render: async (): Promise<MermaidRenderResult> => ({ svg: '' }),
    getConfig: () => ({}),
    ...overrides,
});

/** Value that the `obsidian` mock's `loadMermaid` returns. */
export const setMockMermaid = (mermaid: MermaidApi | undefined): void => {
    Reflect.set(globalThis, '__mockMermaid', mermaid);
};

export const getWindowMermaid = (): MermaidApi | undefined => {
    const value: unknown = Reflect.get(window, 'mermaid');
    return isMermaidApi(value) ? value : undefined;
};

export const setWindowMermaid = (mermaid: unknown): void => {
    Reflect.set(window, 'mermaid', mermaid);
};

export const resetMermaidEnvironment = (): void => {
    removePeleFacade();
    setWindowMermaid(undefined);
    setMockMermaid(undefined);
};
