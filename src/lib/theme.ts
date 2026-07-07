// Dual-theme controller. FOUC dicegah oleh inline script di <head> (set data-theme
// sebelum paint). Modul ini menangani toggle runtime + sinkronisasi listener.

export type Theme = "dark" | "light";
const KEY = "ws-theme";

export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "dark";
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  return next;
}
