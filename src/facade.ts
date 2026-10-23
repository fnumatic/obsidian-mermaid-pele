import { loadMermaid } from 'obsidian';
import { isMermaidApi } from './mermaid-api';
import type { MermaidApi, MermaidRenderResult } from './mermaid-api';
import { renderSvg } from './pele';

/**
 * Experimental: routes Obsidian's built-in ```mermaid rendering through Pele.
 *
 * Obsidian calls the global `mermaid` object from its own post processor. The
 * proven approach (see mermaid-elk-renderer) is to keep that object and wrap it
 * in a Proxy that only overrides `render`, instead of replacing it with a
 * foreign implementation. That keeps `initialize` and every future method
 * genuine, and it does not lose a race against Obsidian's lazy `mermaid.min.js`
 * loader that writes the same global.
 */

const FACADE_MARK = Symbol.for('mermaid-pele.facade');

export type FacadeInstallResult = 'installed' | 'already' | 'unavailable';
export type FacadeRemoveResult = 'restored' | 'skipped';

declare global {
    interface Window {
        /** Obsidian's global Mermaid object; set once its lazy loader has run. */
        mermaid?: unknown;
        /** Holds the Mermaid object the facade wraps, so it can be restored. */
        mermaidPeleOriginal?: MermaidApi;
    }
}

const isFacade = (value: unknown): value is MermaidApi =>
    isMermaidApi(value) && Reflect.get(value, FACADE_MARK) === true;

/** Pele is synchronous; Obsidian awaits `render`. */
const renderViaPele = async (
    _id: string,
    text: string,
    _container?: unknown,
): Promise<MermaidRenderResult> => {
    const svg = renderSvg(text);
    return { svg, bindFunctions: () => undefined };
};

/** Wraps the real Mermaid object, overriding only `render`. */
function createPeleFacade(original: MermaidApi): MermaidApi {
    return new Proxy(original, {
        get(target, prop, receiver): unknown {
            if (prop === FACADE_MARK) {
                return true;
            }
            if (prop === 'render') {
                return renderViaPele;
            }
            return Reflect.get(target, prop, receiver);
        },
        has(target, prop) {
            return prop === FACADE_MARK || prop in target;
        },
    });
}

/** Resolves the real Mermaid object, waiting for Obsidian's lazy loader. */
async function resolveOriginal(): Promise<MermaidApi | null> {
    try {
        if (typeof loadMermaid === 'function') {
            const loaded: unknown = await loadMermaid();
            if (isMermaidApi(loaded)) {
                return loaded;
            }
        }
    } catch {
        // Fall through to whatever already sits on the global.
    }

    return isMermaidApi(window.mermaid) ? window.mermaid : null;
}

/** Installs the facade unless it is already active. */
export async function installPeleFacade(): Promise<FacadeInstallResult> {
    if (isFacade(window.mermaid)) {
        return 'already';
    }

    const original = await resolveOriginal();
    if (!original) {
        return 'unavailable';
    }

    window.mermaidPeleOriginal = original;
    window.mermaid = createPeleFacade(original);
    return 'installed';
}

/** Restores the original global, but only while the facade is still in place. */
export function removePeleFacade(): FacadeRemoveResult {
    if (!isFacade(window.mermaid)) {
        return 'skipped';
    }

    window.mermaid = window.mermaidPeleOriginal;
    delete window.mermaidPeleOriginal;
    return 'restored';
}
