import { render as renderPele } from 'pele';

const describeError = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);

/**
 * Renders Mermaid source into `el` and returns whether it succeeded.
 * Never throws, so one broken diagram cannot break the surrounding note.
 */
export function renderDiagram(content: string, el: HTMLElement): boolean {
    try {
        const { svg } = renderPele(content.trim());

        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid pele-diagram';
        wrapper.innerHTML = svg;
        wrapper.querySelector('svg')?.setAttribute('role', 'graphics-document');
        el.appendChild(wrapper);
        return true;
    } catch (error) {
        console.error('[Pele] Diagram render error:', error);

        const failure = document.createElement('div');
        failure.className = 'pele-error';
        failure.textContent = `Diagram error: ${describeError(error)}`;
        el.appendChild(failure);
        return false;
    }
}
