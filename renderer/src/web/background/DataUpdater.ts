import { shallowRef } from "vue";
import { createGlobalState } from "@vueuse/core";
import { AppConfig } from "@/web/Config";
import * as Data from "@/assets/data";

const APPLIED_VERSION_KEY = "ee2:appliedDataVersion";
const DATA_PATH = "renderer/public/data"; // location within the repo

interface VersionManifest {
  version: string;
  builtAt?: string;
}

function rawBase(): string {
  const { repo, branch } = AppConfig().dataUpdate;
  return `https://raw.githubusercontent.com/${repo}/${branch}/${DATA_PATH}`;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  return JSON.parse(await fetchText(url)) as T;
}

/** Languages whose data we keep in sync — the active one plus English fallback. */
function targetLangs(): string[] {
  return Array.from(new Set([AppConfig().language, "en"]));
}

export const useDataUpdate = createGlobalState(() => {
  const busy = shallowRef(false);
  const message = shallowRef<string>("");
  const error = shallowRef<string | null>(null);
  const remoteVersion = shallowRef<string | null>(null);
  const bundledVersion = shallowRef<string | null>(null);
  const appliedVersion = shallowRef<string | null>(
    localStorage.getItem(APPLIED_VERSION_KEY),
  );

  /** The version currently in effect (override applied, else what shipped). */
  function currentVersion(): string | null {
    return appliedVersion.value ?? bundledVersion.value;
  }

  async function refreshVersions(): Promise<void> {
    try {
      bundledVersion.value = (
        await fetchJson<VersionManifest>(
          `${import.meta.env.BASE_URL}data/data-version.json`,
        )
      ).version;
    } catch {
      bundledVersion.value = null;
    }
    remoteVersion.value = (
      await fetchJson<VersionManifest>(`${rawBase()}/data-version.json`)
    ).version;
  }

  function updateAvailable(): boolean {
    return (
      remoteVersion.value != null && remoteVersion.value !== currentVersion()
    );
  }

  /** Download the newer ndjson and hot-swap it into the data layer. */
  async function apply(force = false): Promise<boolean> {
    if (busy.value) return false;
    busy.value = true;
    error.value = null;
    try {
      message.value = "Checking for updated data…";
      // Version check is best-effort: a repo without data-version.json can still
      // be force-updated (we just download the ndjson directly).
      try {
        await refreshVersions();
      } catch (e) {
        if (!force) throw e;
        remoteVersion.value = null;
      }

      if (!force && !updateAvailable()) {
        message.value = `Up to date (${currentVersion() ?? "unknown"}).`;
        return false;
      }

      for (const lang of targetLangs()) {
        message.value = `Downloading data (${lang})…`;
        const [items, stats] = await Promise.all([
          fetchText(`${rawBase()}/${lang}/items.ndjson`),
          fetchText(`${rawBase()}/${lang}/stats.ndjson`),
        ]);
        Data.setDataOverride(lang, { items, stats });
      }

      message.value = "Applying…";
      await Data.loadForLang(AppConfig().language);

      appliedVersion.value = remoteVersion.value;
      if (remoteVersion.value) {
        localStorage.setItem(APPLIED_VERSION_KEY, remoteVersion.value);
      }
      message.value = remoteVersion.value
        ? `Updated to ${remoteVersion.value}.`
        : "Updated (latest from repo).";
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      message.value = "Update failed.";
      Data.clearDataOverride();
      return false;
    } finally {
      busy.value = false;
    }
  }

  /** Run once on launch when auto-update is enabled. */
  async function maybeAutoUpdate(): Promise<void> {
    if (!AppConfig().dataUpdate.auto) return;
    try {
      await apply(false);
    } catch {
      /* never block startup on a data-update failure */
    }
  }

  return {
    busy,
    message,
    error,
    remoteVersion,
    bundledVersion,
    appliedVersion,
    currentVersion,
    updateAvailable,
    refreshVersions,
    apply,
    maybeAutoUpdate,
  };
});
