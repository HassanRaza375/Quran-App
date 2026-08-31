import { describe, expect, it } from "vitest";
import { filterByCommandPerson, filterByCommandType, parseExactReference, searchCommands } from "../app/utils/commandsSearch";
import type { QuranCommand } from "../app/data/quranCommands";

const make = (overrides: Partial<QuranCommand>): QuranCommand => ({
  id: "test",
  title: "Test Command",
  arabicTitle: "أمر اختبار",
  type: "command",
  sourceBasis: "quran_explicit",
  audience: "general",
  description: "A test description.",
  passage: { id: "p1", surahNumber: 17, ayahStart: 23, ayahEnd: 23, source: "quran", verificationStatus: "verified" },
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("17:32")).toEqual({ surahNumber: 17, ayahNumber: 32 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Zina")).toBeNull();
  });
});

describe("searchCommands", () => {
  const commands = [
    make({ id: "a", title: "Honoring Parents", description: "Decreed alongside Tawhid." }),
    make({ id: "b", title: "Zina", description: "An immorality and an evil way.", passage: { id: "p2", surahNumber: 17, ayahStart: 32, ayahEnd: 32, source: "quran", verificationStatus: "verified" } }),
  ];

  it("returns all commands for an empty query", () => {
    expect(searchCommands(commands, "")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchCommands(commands, "honoring parents").map((c) => c.id)).toEqual(["a"]);
  });

  it("matches by description text", () => {
    expect(searchCommands(commands, "immorality").map((c) => c.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against the primary passage", () => {
    expect(searchCommands(commands, "17:32").map((c) => c.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against a parallel passage", () => {
    const withParallel = [make({ id: "c", parallelPassages: [{ id: "pp1", surahNumber: 5, ayahStart: 1, ayahEnd: 1, source: "quran", verificationStatus: "verified" }] })];
    expect(searchCommands(withParallel, "5:1").map((c) => c.id)).toEqual(["c"]);
  });

  it("matches Arabic title text (tashkeel-insensitive)", () => {
    const arabicCommands = [make({ id: "d", arabicTitle: "بِرُّ الْوَالِدَيْنِ" })];
    expect(searchCommands(arabicCommands, "بر الوالدين").map((c) => c.id)).toEqual(["d"]);
  });
});

describe("filterByCommandType", () => {
  const commands = [
    make({ id: "a", type: "command" }),
    make({ id: "b", type: "prohibition" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterByCommandType(commands, "all")).toHaveLength(2);
  });

  it("filters to commands only", () => {
    expect(filterByCommandType(commands, "command").map((c) => c.id)).toEqual(["a"]);
  });

  it("filters to prohibitions only", () => {
    expect(filterByCommandType(commands, "prohibition").map((c) => c.id)).toEqual(["b"]);
  });
});

describe("filterByCommandPerson", () => {
  const commands = [
    make({ id: "a", personIds: ["ibrahim", "ismail"] }),
    make({ id: "b", personIds: ["adam"] }),
  ];

  it("filters to commands involving the given person id", () => {
    expect(filterByCommandPerson(commands, "ibrahim").map((c) => c.id)).toEqual(["a"]);
  });

  it("returns an empty array when no command involves the given person", () => {
    expect(filterByCommandPerson(commands, "musa")).toEqual([]);
  });
});
