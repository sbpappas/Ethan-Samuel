import { describe, expect, it } from "vitest";
import { formatShortFormCase } from "../../src/rules/shortform/shortFormCase.js";
import { formatIdCitation } from "../../src/rules/shortform/idRule.js";
import { tokensToPlainText } from "../../src/render/tokensToPlainText.js";
import type { CaseCitationInput } from "../../src/types/index.js";

describe("formatShortFormCase", () => {
  it("uses the first party name, volume, reporter, and pincite", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Brown", defendant: "Board of Education" },
      volume: "347",
      reporterAbbrev: "U.S.",
      firstPage: "483",
      pincite: "495",
      year: "1954",
    };
    expect(tokensToPlainText(formatShortFormCase(input))).toBe("Brown, 347 U.S. at 495");
  });

  it("falls back to the first page when there is no pincite", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Brown", defendant: "Board of Education" },
      volume: "347",
      reporterAbbrev: "U.S.",
      firstPage: "483",
      year: "1954",
    };
    expect(tokensToPlainText(formatShortFormCase(input))).toBe("Brown, 347 U.S. at 483");
  });
});

describe("formatIdCitation", () => {
  it("renders bare Id. with no pincite", () => {
    expect(tokensToPlainText(formatIdCitation())).toBe("Id.");
  });

  it("renders Id. at <pincite> when a pincite is given", () => {
    expect(tokensToPlainText(formatIdCitation("495"))).toBe("Id. at 495");
  });
});
