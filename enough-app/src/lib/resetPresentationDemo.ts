/**
 * Reset the app's versioned localStorage keys and reload. Used by the
 * "Reset presentation demo" control on the public prototype.
 *
 * Only clears the app's own versioned keys so that other browser data
 * (saved logins, cookies, etc.) is untouched. After clearing, reloads
 * the page so the Plan store reinitialises from the default Mr Tan
 * worked example.
 */
const APP_KEY_PREFIXES = ["enough."];

function isAppKey(key: string): boolean {
  return APP_KEY_PREFIXES.some((p) => key.startsWith(p));
}

export function resetPresentationDemo(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && isAppKey(k)) keysToRemove.push(k);
  }
  for (const k of keysToRemove) {
    window.localStorage.removeItem(k);
  }
  window.location.reload();
}