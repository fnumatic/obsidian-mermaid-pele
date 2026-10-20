// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { renderDiagram } from './render';

describe('renderDiagram', () => {
    it('renders Mermaid source into SVG', () => {
        const el = document.createElement('div');

        expect(renderDiagram('flowchart LR\n A[Start] --> B[End]', el)).toBe(true);
        expect(el.querySelector('svg')).not.toBeNull();
        expect(el.querySelector('.pele-diagram')).not.toBeNull();
    });

    it('reports invalid source instead of throwing', () => {
        const el = document.createElement('div');

        expect(renderDiagram('this is not mermaid', el)).toBe(false);
        expect(el.querySelector('.pele-error')?.textContent).toContain('Diagram error');
    });
});
