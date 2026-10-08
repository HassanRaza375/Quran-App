// Decision B3: a production build must fail if the "show unreviewed helpers" dev flag is on.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assertNoUnreviewedHelpersInProduction, showUnreviewedHelpersRequested, SHOW_UNREVIEWED_ENV } from "../app/utils/wajibatBuildGuard";

describe("unreviewed-helpers build guard", () => {
  it("throws in a production build when the flag is on, in any common spelling", () => {
    for (const v of ["true", "TRUE", "1", "yes", "on", " true "]) {
      expect(() => assertNoUnreviewedHelpersInProduction({ NODE_ENV: "production", [SHOW_UNREVIEWED_ENV]: v }), v).toThrow(/production build/);
    }
    expect(() => assertNoUnreviewedHelpersInProduction({ VERCEL_ENV: "production", [SHOW_UNREVIEWED_ENV]: "true" })).toThrow();
  });
  it("allows production without the flag, or with it off", () => {
    for (const v of [undefined, "", "false", "0", "no"]) {
      expect(() => assertNoUnreviewedHelpersInProduction({ NODE_ENV: "production", [SHOW_UNREVIEWED_ENV]: v })).not.toThrow();
    }
  });
  it("allows the flag in development and tests", () => {
    expect(() => assertNoUnreviewedHelpersInProduction({ NODE_ENV: "development", [SHOW_UNREVIEWED_ENV]: "true" })).not.toThrow();
    expect(showUnreviewedHelpersRequested({ [SHOW_UNREVIEWED_ENV]: "true" })).toBe(true);
  });
  it("is wired into nuxt.config.ts, so `nuxt build` runs it", () => {
    const cfg = readFileSync("nuxt.config.ts", "utf8");
    expect(cfg).toMatch(/assertNoUnreviewedHelpersInProduction\(process\.env\)/);
  });
});
