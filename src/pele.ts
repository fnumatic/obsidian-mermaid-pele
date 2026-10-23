import { render as renderPele } from 'pele';

/** Renders Mermaid source to an SVG string. Throws when Pele rejects the source. */
export function renderSvg(source: string): string {
    return renderPele(source).svg;
}
