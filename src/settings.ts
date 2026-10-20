/** Persisted plugin settings. */
export interface PeleSettings {
    /** Route Obsidian's built-in ```mermaid blocks through Pele. */
    replaceBuiltin: boolean;
}

export const DEFAULT_SETTINGS: PeleSettings = {
    replaceBuiltin: true,
};
