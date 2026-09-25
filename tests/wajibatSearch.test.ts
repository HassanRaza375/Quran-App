import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET } from "../app/data/wajibat";
import { normalizeWajibatText, searchWajibat } from "../app/utils/wajibatSearch";

describe("normalizeWajibatText", () => {
  it("strips transliteration diacritics and ayn/hamza marks", () => {
    expect(normalizeWajibatText("al‑iḥtiyāṭ al‑mustaḥabb")).toBe("al ihtiyat al mustahabb");
    expect(normalizeWajibatText("ʿādil")).toBe("adil");
  });

  it("strips Arabic tashkeel and unifies Arabic/Urdu letter forms", () => {
    expect(normalizeWajibatText("تَقْلِيد")).toBe(normalizeWajibatText("تقلید"));
    expect(normalizeWajibatText("مكلف")).toBe(normalizeWajibatText("مکلف"));
  });
});

describe("searchWajibat", () => {
  it("returns nothing for an empty query", () => {
    expect(searchWajibat(WAJIBAT_DATASET, "   ")).toEqual({ topics: [], rulings: [], glossary: [] });
  });

  it("finds a topic by plain transliteration", () => {
    expect(searchWajibat(WAJIBAT_DATASET, "taqlid").topics.map((t) => t.id)).toContain("taqlid");
  });

  it("finds a topic by its Urdu title and by its Arabic term", () => {
    expect(searchWajibat(WAJIBAT_DATASET, "بلوغ").topics.map((t) => t.id)).toContain("bulugh");
    expect(searchWajibat(WAJIBAT_DATASET, "التقليد").topics.map((t) => t.id)).toContain("taqlid");
  });

  it("finds rulings by subject and glossary terms without diacritics", () => {
    const res = searchWajibat(WAJIBAT_DATASET, "ihtiyat");
    expect(res.rulings.map((r) => r.id)).toEqual(expect.arrayContaining(["ihtiyatwajib", "ihtiyatmustahab"]));
    expect(res.glossary.map((g) => g.id)).toEqual(expect.arrayContaining(["ihtiyat", "ihtiyatmustahab"]));
  });

  it("is case-insensitive", () => {
    expect(searchWajibat(WAJIBAT_DATASET, "BULUGH").topics.map((t) => t.id)).toContain("bulugh");
  });
});
