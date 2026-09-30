import { describe, expect, it } from "vitest";
import { computeCitationForms } from "../../src/rules/shortform/citationSequencer.js";
import type { CaseCitationInput, SequencedCitationEntry } from "../../src/types/index.js";

function caseSource(overrides: Partial<CaseCitationInput> = {}): CaseCitationInput {
  return {
    kind: "case",
    caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
    volume: "1",
    reporterAbbrev: "U.S.",
    firstPage: "1",
    year: "2000",
    ...overrides,
  };
}

describe("computeCitationForms", () => {
  it("handles [A, A, B, A]: full, id., full, short (not id.)", () => {
    const caseA = caseSource({ caseName: { kind: "two-party", plaintiff: "A", defendant: "One" } });
    const caseB = caseSource({ caseName: { kind: "two-party", plaintiff: "B", defendant: "Two" } });

    const entries: SequencedCitationEntry[] = [
      { id: "a1", source: caseA },
      { id: "a2", source: caseA },
      { id: "b1", source: caseB },
      { id: "a3", source: caseA },
    ];

    const forms = computeCitationForms(entries);

    expect(forms.get("a1")).toBe("full");
    expect(forms.get("a2")).toBe("id");
    expect(forms.get("b1")).toBe("full");
    expect(forms.get("a3")).toBe("short");
  });

  it("treats two separately-added library rows describing the same case as one authority", () => {
    const caseA1 = caseSource({ caseName: { kind: "two-party", plaintiff: "A", defendant: "One" } });
    // Same underlying case, re-entered as a distinct library row (different object identity).
    const caseA2 = caseSource({ caseName: { kind: "two-party", plaintiff: "A", defendant: "One" } });

    const entries: SequencedCitationEntry[] = [
      { id: "x1", source: caseA1 },
      { id: "x2", source: caseA2 },
    ];

    const forms = computeCitationForms(entries);
    expect(forms.get("x1")).toBe("full");
    expect(forms.get("x2")).toBe("id");
  });

  it("respects a user override forcing full form even on a repeat citation", () => {
    const caseA = caseSource();
    const entries: SequencedCitationEntry[] = [
      { id: "a1", source: caseA },
      { id: "a2", source: caseA },
    ];

    const forms = computeCitationForms(entries, { forceFullFormIds: new Set(["a2"]) });
    expect(forms.get("a1")).toBe("full");
    expect(forms.get("a2")).toBe("full");
  });
});
