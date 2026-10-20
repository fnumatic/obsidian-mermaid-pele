import { loadMermaid } from 'obsidian';
import { render as renderPele } from 'pele';

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

const FACADE_MARK = Symbol.for('obsidian-charts.pele-facade');

type AnyObject = Record<string | symbol, unknown>;

type MermaidWindow = Window & {
    mermaid?: unknown;
    obsidianChartsMermaid?: unknown;
};

const isFacade = (value: unknown): boolean =>
    typeof value === 'object' && value !== null && (value as AnyObject)[FACADE_MARK] === true;

/** Pele is synchronous; Obsidian awaits `render`. */
const renderViaPele = async (
    _id: string,
    text: string,
    _container?: unknown,
): Promise<{ svg: string; bindFunctions: () => void }> => {
    const { svg } = renderPele(text);
    return { svg, bindFunctions: () => undefined };
};

/** Wraps the real Mermaid object, overriding only `render`. */
export function createPeleFacade(original: AnyObject): AnyObject {
    return new Proxy(original, {
        get(target, prop, receiver) {
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
async function resolveOriginal(): Promise<AnyObject | null> {
    const win = window as MermaidWindow;

    try {
        if (typeof loadMermaid === 'function') {
            const loaded = await loadMermaid();
            if (typeof loaded === 'object' && loaded !== null) {
                return loaded as AnyObject;
            }
        }
    } catch {
        // Fall through to whatever already sits on the global.
    }

    return typeof win.mermaid === 'object' && win.mermaid !== null
        ? (win.mermaid as AnyObject)
        : null;
}

/** Installs the facade unless it is already active. */
export async function installPeleFacade(): Promise<'installed' | 'already' | 'unavailable'> {
    const win = window as MermaidWindow;
    if (isFacade(win.mermaid)) {
        return 'already';
    }

    const original = await resolveOriginal();
    if (!original) {
        return 'unavailable';
    }

    win.obsidianChartsMermaid = original;
    win.mermaid = createPeleFacade(original);
    return 'installed';
}

/** Restores the original global, but only while the facade is still in place. */
export function removePeleFacade(): 'restored' | 'skipped' {
    const win = window as MermaidWindow;
    if (!isFacade(win.mermaid)) {
        return 'skipped';
    }

    win.mermaid = win.obsidianChartsMermaid;
    delete win.obsidianChartsMermaid;
    return 'restored';
}
