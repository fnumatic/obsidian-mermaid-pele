# Pele Mermaid

An Obsidian plugin that renders Mermaid diagrams with [Pele](https://pele.run/), a Mermaid renderer built by Obsidian for Obsidian.

## What it does

- Replaces Obsidian's bundled Mermaid for ```` ```mermaid ```` blocks, so diagrams use Pele's layout engine.
- Adds a ```` ```mermaid-pele ```` block for explicit use, and keeps ```` ```chart-mermaid ```` working for notes written for obsidian-charts.
- Colors come from CSS variables, so diagrams follow the active theme without extra configuration.

## Install

The plugin is not in the community plugin list yet. To install a release:

1. Download `main.js`, `manifest.json` and `styles.css` from the latest release.
2. Copy them into `<vault>/.obsidian/plugins/mermaid-pele/`.
3. Enable **Pele Mermaid** under **Settings → Community plugins**.

For local development, `pnpm dev` builds and copies the plugin into a vault.

## Development

Node 22.18 or newer is required: the helper scripts are TypeScript and run through Node's native type stripping.

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

Do not run the upstream Charts plugin (3.x) next to this one: it registers the same `chart-mermaid` block, so every diagram would render twice. Charts 0.0.1 and later leave diagram blocks to this plugin.

## License

MIT
