/** The parts of Mermaid's API this plugin relies on. */
export interface MermaidApi {
    render: (id: string, text: string, container?: unknown) => Promise<MermaidRenderResult>;
    initialize?: (...args: unknown[]) => void;
    getConfig?: () => unknown;
    [key: string]: unknown;
}

/** What Obsidian expects back from `mermaid.render`. */
export interface MermaidRenderResult {
    svg: string;
    bindFunctions?: () => void;
}

/** Narrows an untrusted value to the Mermaid surface used by the facade. */
export function isMermaidApi(value: unknown): value is MermaidApi {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof Reflect.get(value, 'render') === 'function'
    );
}
