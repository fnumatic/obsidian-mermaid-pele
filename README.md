# Pele Mermaid

An Obsidian plugin that renders Mermaid diagrams with [Pele](https://pele.run/), a Mermaid renderer built by Obsidian for Obsidian.

## What it does

- Replaces Obsidian's bundled Mermaid for ```` ```mermaid ```` blocks, so diagrams use Pele's layout engine.
- Adds a ```` ```mermaid-pele ```` block for explicit use, and keeps ```` ```chart-mermaid ```` working for notes written for obsidian-charts.
- Colors come from CSS variables, so diagrams follow the active theme without extra configuration.

## Install

Copy `main.js`, `manifest.json` and `styles.css` into `<vault>/.obsidian/plugins/mermaid-pele/`, then enable the plugin in Settings → Community plugins.

## Development

```bash
pnpm install
pnpm dev        # build in watch mode and copy into a vault
pnpm check      # format, lint, types
pnpm test
pnpm build
```

`pnpm dev` asks for a vault on the first run and remembers the choice in `.vault`.

## Compatibility

Pele supports every diagram type built into Mermaid 12.1. Layout and spacing differ from Mermaid, HTML labels are not supported, and `themeVariables` do not apply. See [Pele's compatibility notes](https://pele.run/compatibility).

## License

AGPL-3.0
