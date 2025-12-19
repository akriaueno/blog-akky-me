# Repository Guidelines

## Project Structure & Module Organization
- `content/` holds site content. Posts live under `content/entry/` (Hugo section) and use YAML front matter.
- `layouts/` contains Hugo template overrides (preferred over editing theme files).
- `themes/mainroad/` is the upstream theme; treat it as a submodule and avoid direct edits unless updating the theme itself.
- `static/` and `assets/` hold static files and pipeline assets used by Hugo.
- `akky-me-honeycomb-worker/` is a separate Cloudflare Worker project with its own dependencies, tests, and build flow.

## Build, Test, and Development Commands
- `hugo server` runs the site locally with live reload.
- `hugo` builds the static site output (usually to `public/`).
- `npm test` at repo root is a placeholder and currently fails by design.
- Worker project (from `akky-me-honeycomb-worker/`):
  - `npm run dev` or `npm start` to run the worker locally via Wrangler.
  - `npm run deploy` to deploy the worker.
  - `npm test` runs Vitest.

## Coding Style & Naming Conventions
- Follow existing formatting in each file: tabs in many theme templates, two‑space indentation in `config.toml`.
- Content files are Markdown with YAML front matter.
- Post filenames follow `YYYYMMDD-slug.md` (e.g., `content/entry/20251213-why-cli.md`).
- Prefer adding overrides in `layouts/` rather than modifying theme templates directly.

## Testing Guidelines
- Site has no automated tests; validate changes by running `hugo server` and checking pages.
- Worker tests use Vitest; keep test files under `akky-me-honeycomb-worker/test/`.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages. Both plain and conventional prefixes (e.g., `feat:`, `style:`) appear in history.
- PRs should include a brief Summary and Testing section (e.g., “not run” when applicable).
- If changing URLs or structure, include migration notes (aliases/redirects) in the PR description.
- When `gh pr create` renders broken line breaks in the body, update the PR via GraphQL instead of re-running `gh pr create`.

## Configuration Tips
- Hugo settings live in `config.toml` (including social links and feature toggles).
- Avoid editing `public/` directly; it is generated output.
