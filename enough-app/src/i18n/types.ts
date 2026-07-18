/**
 * Typed translation keys.
 *
 * Augmenting i18next's `CustomTypeOptions.resources` with the canonical English
 * resource gives every `t("namespace.key")` call:
 *  - autocomplete on the dotted key path,
 *  - a compile-time error on a typo'd or removed key,
 *  - typed interpolation variables for keys that contain `{{var}}` placeholders.
 *
 * The other three locales are plain objects; if they miss a key they fall back
 * to English at runtime (see index.ts `fallbackLng`). Type-checking of `t()`
 * is anchored to the English resource only — the single, complete source.
 */
import type enSG from "./locales/en-SG";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: typeof enSG;
  }
}
