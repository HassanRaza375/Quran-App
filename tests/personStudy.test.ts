import { describe, expect, it } from "vitest";
import {
  clearStudyState,
  getStudyState,
  updatePassageView,
  updateReference,
  updateSection,
  type PersonStudyRecord,
} from "../app/utils/personStudy";

describe("getStudyState", () => {
  it("returns null for a person with no saved state", () => {
    expect(getStudyState({}, "nuh")).toBeNull();
  });
});

describe("updateSection", () => {
  it("creates a fresh state defaulting passageView to 'surah' on first write", () => {
    const record = updateSection({}, "nuh", "key-lessons", 1000);
    expect(record.nuh).toMatchObject({ personId: "nuh", lastSection: "key-lessons", passageView: "surah", updatedAt: 1000 });
  });

  it("updates only lastSection/updatedAt, preserving other fields already set", () => {
    let record: PersonStudyRecord = updateSection({}, "nuh", "overview", 1000);
    record = updatePassageView(record, "nuh", "story", 1100);
    record = updateReference(record, "nuh", 11, 25, 1200);

    record = updateSection(record, "nuh", "related-passages", 1300);

    expect(record.nuh).toEqual({
      personId: "nuh",
      lastSection: "related-passages",
      passageView: "story",
      lastSurahNo: 11,
      lastAyahNo: 25,
      updatedAt: 1300,
    });
  });

  it("does not mutate other persons' state", () => {
    let record: PersonStudyRecord = updateSection({}, "nuh", "overview", 1000);
    record = updateSection(record, "musa", "family", 1001);
    expect(record.nuh.lastSection).toBe("overview");
    expect(record.musa.lastSection).toBe("family");
  });
});

describe("updatePassageView", () => {
  it("sets passageView independently of lastSection", () => {
    const record = updatePassageView({}, "yusuf", "story", 500);
    expect(record.yusuf.passageView).toBe("story");
    expect(record.yusuf.lastSection).toBe("overview"); // default on first write
  });
});

describe("updateReference", () => {
  it("records the last-viewed surah/ayah", () => {
    const record = updateReference({}, "musa", 20, 9, 700);
    expect(record.musa.lastSurahNo).toBe(20);
    expect(record.musa.lastAyahNo).toBe(9);
  });

  it("overwrites a previous reference with the latest one", () => {
    let record = updateReference({}, "musa", 20, 9, 700);
    record = updateReference(record, "musa", 28, 3, 800);
    expect(record.musa).toMatchObject({ lastSurahNo: 28, lastAyahNo: 3, updatedAt: 800 });
  });
});

describe("clearStudyState", () => {
  it("removes a person's saved state", () => {
    let record = updateSection({}, "nuh", "overview", 1000);
    record = clearStudyState(record, "nuh");
    expect(record.nuh).toBeUndefined();
    expect(getStudyState(record, "nuh")).toBeNull();
  });

  it("is a no-op for a person with no saved state", () => {
    const record = updateSection({}, "nuh", "overview", 1000);
    const result = clearStudyState(record, "musa");
    expect(result).toEqual(record);
  });

  it("does not remove other persons' state", () => {
    let record = updateSection({}, "nuh", "overview", 1000);
    record = updateSection(record, "musa", "overview", 1000);
    record = clearStudyState(record, "nuh");
    expect(record.musa).toBeDefined();
    expect(record.nuh).toBeUndefined();
  });
});
