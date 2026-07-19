/**
 * Source-level checks for the desktop header. The i18n parity test missed
 * the missing `navigationShort` because the keys were absent from every
 * locale; this test catches the specific wiring the UI relies on.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const LAYOUT = readFileSync(
  resolve(__dirname, "../../components/Layout.tsx"),
  "utf8",
);

describe("header i18n wiring", () => {
  it("uses navigationShort for desktop nav items", () => {
    expect(LAYOUT).toMatch(/navigationShort\.home/);
    expect(LAYOUT).toMatch(/navigationShort\.plan/);
    expect(LAYOUT).toMatch(/navigationShort\.results/);
    expect(LAYOUT).toMatch(/navigationShort\.monitor/);
    expect(LAYOUT).toMatch(/navigationShort\.family/);
  });

  it("uses compact ViewToggle labels (navigationShort.parent / .child)", () => {
    expect(LAYOUT).toMatch(/navigationShort\.parent/);
    expect(LAYOUT).toMatch(/navigationShort\.child/);
  });

  it("does not use the old full labels for the desktop view-mode toggle", () => {
    // The compact prop falls back to navigationShort. The full labels
    // exist in the locale but must not be wired into the desktop header.
    const desktopViewBlock = LAYOUT.match(/<ViewToggle[\s\S]*?\/>/);
    expect(desktopViewBlock).not.toBeNull();
    expect(desktopViewBlock![0]).toMatch(/compact/);
  });
});

describe("header responsive layout", () => {
  it("does not use flex-wrap in the desktop header right group", () => {
    // The desktop right controls must use flex-nowrap. A flex-wrap on the
    // right group causes the language selector / view toggle to drop onto
    // a second row at long translated labels.
    const rightGroup = LAYOUT.match(
      /<div className="relative z-10 flex shrink-0 flex-nowrap items-center justify-end gap-2">/,
    );
    expect(rightGroup, "right group should use flex-nowrap").not.toBeNull();
    expect(LAYOUT).not.toMatch(/flex flex-wrap items-center justify-end/);
  });

  it("uses one consistent 1440px breakpoint for desktop nav, view toggle, language selector, hamburger, and drawer", () => {
    // The previous version mixed xl (1280px), min-[1500px], and 1440px.
    // All desktop-show / hamburger-hide flags must use the same
    // min-[1440px]: breakpoint.
    const matches = LAYOUT.match(/min-\[1440px\]:[a-z-]+/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(4);
    expect(LAYOUT).not.toMatch(/xl:hidden/);
    expect(LAYOUT).not.toMatch(/min-\[1500px\]/);
  });
});

describe("header i18n (regression)", () => {
  it("navigationShort is present in every locale", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    for (const file of ["en-SG", "zh-SG", "ms-SG", "ta-SG"]) {
      const src = fs.readFileSync(
        path.resolve(__dirname, `../../i18n/locales/${file}.ts`),
        "utf8",
      );
      expect(src, `${file} should define navigationShort`).toMatch(
        /navigationShort:\s*\{/,
      );
    }
  });
});
