# <img src="./renderer/public/images/logo.png" width="34" align="top" alt="PoE2 Price"> PoE2 Price

A Path of Exile 2 overlay for fast, in-game item price checking.

Hover an item, hit a hotkey, and see what it's worth against the live trade —
without alt-tabbing.

## Usage

1. Download the latest installer from [Releases](../../releases) and run it.
2. Launch Path of Exile 2.
3. Open the overlay menu with **Shift + Space**.
4. Hover an item and hold **Ctrl + D** to price-check it.

Settings: open the overlay (**Shift + Space**) and click the **⚙** button, or
right-click the tray icon → **Settings**.

## Live data updates

Game data (items, mods, base types) is bundled with the app and can be refreshed
without reinstalling: **Settings → General → Game data updates → Update now**.
Point it at your data repo and enable auto-update to stay current across patches.

Maintainers regenerate the data with:

```bash
node scripts/update-data.mjs --version <patch>
# then commit & push renderer/public/data to your repo
```

## Development

```bash
# renderer (UI)
cd renderer && npm install && npm run make-index-files && npm run dev
# main (electron) — second terminal
cd main && npm install && npm run dev
```

Build the installer:

```bash
cd renderer && npm install && npm run make-index-files && npm run build
cd ../main && npm install && npm run build && npm run package
# → dist/ contains the installer + portable .exe
```

## License

MIT — see [LICENSE](./LICENSE).
