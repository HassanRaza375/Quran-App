import { describe, expect, it } from "vitest";
import { chronologyText } from "../app/utils/personsChronology";

describe("chronologyText", () => {
  it("returns empty string when there is no chronology", () => {
    expect(chronologyText(null)).toBe("");
    expect(chronologyText(undefined)).toBe("");
  });

  it("returns just the label for a 'strong' chronology, with no qualifier", () => {
    expect(chronologyText({ label: "Final prophet, 6th-7th century CE", status: "strong" })).toBe(
      "Final prophet, 6th-7th century CE"
    );
  });

  it("appends a status qualifier for 'traditional'/'uncertain'/'unknown' when a label exists", () => {
    expect(chronologyText({ label: "Early prophetic period", status: "traditional" })).toBe(
      "Early prophetic period — Traditional chronology"
    );
    expect(chronologyText({ label: "Some period", status: "uncertain" })).toBe("Some period — Chronology uncertain");
    expect(chronologyText({ label: "Some period", status: "unknown" })).toBe("Some period — Chronology unknown");
  });

  it("falls back to just the status label when there is no label at all", () => {
    expect(chronologyText({ status: "unknown" })).toBe("Chronology unknown");
    expect(chronologyText({ status: "traditional" })).toBe("Traditional chronology");
  });

  it("never presents an uncertain/traditional status with the same bare-label confidence as 'strong'", () => {
    const strong = chronologyText({ label: "X", status: "strong" });
    const traditional = chronologyText({ label: "X", status: "traditional" });
    expect(strong).toBe("X");
    expect(traditional).not.toBe("X");
    expect(traditional).toContain("Traditional");
  });
});
