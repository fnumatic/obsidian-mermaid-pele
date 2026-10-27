# Releasing

Versions are managed by [release-please](https://github.com/googleapis/release-please).
The repository starts at `0.0.1`, so the first release with a `feat` commit becomes
`0.1.0`.

## First release

1. Create the public repository and push `main`:

    ```bash
    gh repo create fnumatic/obsidian-mermaid-pele --public --source=. --remote=origin --push
    ```

2. In the repository settings, under **Actions → General**, allow GitHub Actions to
   create and approve pull requests. Release Please needs this to open its PR.

3. The **Release Please** workflow opens `chore(main): release 0.1.0`. Merge it.

4. Release Please creates tag `0.1.0` and the GitHub release. The **Release** workflow
   then runs checks and tests, builds, attaches `main.js`, `manifest.json`,
   `styles.css` and `mermaid-pele.zip`, and adds the version to `versions.json`.

## Later releases

Merge the release-please PRs. Tags carry no `v` prefix (`0.1.0`, `0.2.0`, …).
`versions.json` is updated by the release workflow.

## Manual rebuild

```bash
gh workflow run release.yml -f tag=0.1.0
```

## Community list

The plugin is not in Obsidian's community list yet. After a working public release,
submit it to [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases).
