#!/usr/bin/env node
// @ts-check
/*
 * update-data.mjs — Maintainer one-shot data rebuild for the CURRENT PoE2 patch.
 *
 * Run this whenever a game patch drops. It:
 *   1. Pulls fresh game data (pathofexile-dat) + trade API data, builds the
 *      per-language ndjson, and copies it into renderer/public/data/<lang>/.
 *   2. Regenerates the binary lookup indexes (.index.bin) for local builds.
 *   3. Writes renderer/public/data/data-version.json (the manifest the running
 *      app polls to know newer data exists).
 *
 * Then commit & push to YOUR repo — the app auto-pulls the new data from there.
 *
 * Usage:
 *   node scripts/update-data.mjs [--version <label>] [--no-pull] [--lang <code>]
 *
 *   --version <label>   Human patch label stored in the manifest (e.g. 0.5.3).
 *                       Defaults to a UTC timestamp. The app updates whenever
 *                       this value changes, so a timestamp is always enough.
 *   --no-pull           Skip the network pull; just rebuild from the data already
 *                       exported in dataParser/data/vendor (faster, for testing).
 *   --lang <code>       Only matters if you wire a single-language build; the
 *                       Python builder currently builds all languages.
 *
 * Prerequisites (maintainer machine only — NOT needed by end users):
 *   - Python 3 with: pandas numpy tqdm requests cloudscraper murmurhash2
 *   - pathofexile-dat on PATH  (npm i -g pathofexile-dat)   [needed for --pull]
 *   - Node + the renderer deps installed (npm i in renderer)
 */

import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_PARSER = join(ROOT, "dataParser");
const RENDERER = join(ROOT, "renderer");
const DATA_DIR = join(RENDERER, "public", "data");

// ---- args --------------------------------------------------------------
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = argv[i + 1];
  return next && !next.startsWith("--") ? next : true;
}
const noPull = argv.includes("--no-pull");
const version = String(
  arg("version", new Date().toISOString().replace(/[:.]/g, "-")),
);

const log = (m) => console.log(`\x1b[36m[update-data]\x1b[0m ${m}`);
const warn = (m) => console.warn(`\x1b[33m[update-data]\x1b[0m ${m}`);
const die = (m) => {
  console.error(`\x1b[31m[update-data] ${m}\x1b[0m`);
  process.exit(1);
};

function run(cmd, args, cwd) {
  log(`> ${cmd} ${args.join(" ")}   (in ${cwd})`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true });
  if (r.status !== 0) {
    die(`step failed (exit ${r.status ?? "?"}): ${cmd} ${args.join(" ")}`);
  }
}

// ---- sanity ------------------------------------------------------------
if (!existsSync(DATA_PARSER)) die(`dataParser not found at ${DATA_PARSER}`);
if (!existsSync(DATA_DIR)) die(`data dir not found at ${DATA_DIR}`);

const python =
  spawnSync("python", ["--version"], { shell: true }).status === 0
    ? "python"
    : "python3";

// ---- 1. build the data --------------------------------------------------
log(`Building data for version "${version}"${noPull ? " (no pull)" : ""}`);
const pyArgs = noPull
  ? ["src/main.py", "--push", "--main-repo-path", ".."]
  : ["src/main.py", "--pull", "--push", "--main-repo-path", ".."];
run(python, pyArgs, DATA_PARSER);

// ---- 2. regenerate binary indexes --------------------------------------
log("Regenerating lookup indexes (.index.bin)…");
run("npm", ["run", "make-index-files"], RENDERER);

// ---- 3. write the manifest ---------------------------------------------
const manifest = {
  version,
  builtAt: new Date().toISOString(),
  note: "Bumped by scripts/update-data.mjs. The app updates when `version` changes.",
};
const manifestPath = join(DATA_DIR, "data-version.json");
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
log(`Wrote ${manifestPath}`);

// ---- done ---------------------------------------------------------------
console.log("");
log("\x1b[32mData rebuilt.\x1b[0m Next steps to publish to your repo:");
console.log("    git add renderer/public/data");
console.log(`    git commit -m "data: ${version}"`);
console.log("    git push");
console.log("");
log("The running app will detect the new data-version.json and update itself.");
