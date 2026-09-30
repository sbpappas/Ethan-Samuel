import { describe, expect, it } from "vitest";
import { assembleCaseCitation } from "../../src/rules/case/assembleCaseCitation.js";
import { tokensToPlainText } from "../../src/render/tokensToPlainText.js";
import { tokensToHtml } from "../../src/render/tokensToHtml.js";
import type { CaseCitationInput } from "../../src/types/index.js";

/**
 * Golden fixtures use real, well-known, independently verifiable Supreme
 * Court citations. The Bluebook's own example prose is never copied — only
 * public citation facts (volume/reporter/page/year) are used.
 */
describe("assembleCaseCitation - golden real-case fixtures", () => {
  it("formats Brown v. Board of Education", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Brown", defendant: "Board of Education" },
      volume: "347",
      reporterAbbrev: "U.S.",
      firstPage: "483",
      year: "1954",
    };
    const tokens = assembleCaseCitation(input);
    expect(tokensToPlainText(tokens)).toBe("Brown v. Board of Education, 347 U.S. 483 (1954)");
    expect(tokensToHtml(tokens)).toBe(
      "<i>Brown v. Board of Education</i>, 347 U.S. 483 (1954)",
    );
  });

  it("formats Brown v. Board of Education with a pincite", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Brown", defendant: "Board of Education" },
      volume: "347",
      reporterAbbrev: "U.S.",
      firstPage: "483",
      pincite: "495",
      year: "1954",
    };
    const tokens = assembleCaseCitation(input);
    expect(tokensToPlainText(tokens)).toBe(
      "Brown v. Board of Education, 347 U.S. 483, 495 (1954)",
    );
  });

  it("formats Roe v. Wade", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Roe", defendant: "Wade" },
      volume: "410",
      reporterAbbrev: "U.S.",
      firstPage: "113",
      year: "1973",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Roe v. Wade, 410 U.S. 113 (1973)",
    );
  });

  it("formats Miranda v. Arizona", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Miranda", defendant: "Arizona" },
      volume: "384",
      reporterAbbrev: "U.S.",
      firstPage: "436",
      year: "1966",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Miranda v. Arizona, 384 U.S. 436 (1966)",
    );
  });

  it("formats a single-party In re case (In re Gault)", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "in-re", party: "Gault" },
      volume: "387",
      reporterAbbrev: "U.S.",
      firstPage: "1",
      year: "1967",
    };
    const tokens = assembleCaseCitation(input);
    expect(tokensToPlainText(tokens)).toBe("In re Gault, 387 U.S. 1 (1967)");
    expect(tokensToHtml(tokens)).toBe("<i>In re Gault</i>, 387 U.S. 1 (1967)");
  });
});
