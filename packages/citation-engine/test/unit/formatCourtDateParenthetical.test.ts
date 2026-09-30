import { describe, expect, it } from "vitest";
import { assembleCaseCitation } from "../../src/rules/case/assembleCaseCitation.js";
import { tokensToPlainText } from "../../src/render/tokensToPlainText.js";
import { getCourt } from "../../src/data/courts.js";
import type { CaseCitationInput } from "../../src/types/index.js";

/**
 * Synthetic/illustrative citations (not real reported cases) exercising the
 * court-required parenthetical rule across federal circuits/districts and
 * the MVP's state reporters (Oklahoma, Texas, California, New York).
 */
describe("formatCourtDateParenthetical via assembleCaseCitation", () => {
  it("requires no court abbreviation for U.S. Reports", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "500",
      reporterAbbrev: "U.S.",
      firstPage: "1",
      year: "2000",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 500 U.S. 1 (2000)",
    );
  });

  it("requires a circuit abbreviation for F.3d", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "100",
      reporterAbbrev: "F.3d",
      firstPage: "200",
      court: getCourt("2d-cir"),
      year: "2010",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 100 F.3d 200 (2d Cir. 2010)",
    );
  });

  it("requires a district abbreviation for F. Supp. 2d", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "50",
      reporterAbbrev: "F. Supp. 2d",
      firstPage: "75",
      court: getCourt("sdny"),
      year: "2005",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 50 F. Supp. 2d 75 (S.D.N.Y. 2005)",
    );
  });

  it("throws when a court-required reporter is given no court", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "100",
      reporterAbbrev: "F.3d",
      firstPage: "200",
      year: "2010",
    };
    expect(() => assembleCaseCitation(input)).toThrow(/requires a court abbreviation/);
  });

  it("needs no court abbreviation for Cal. Reports (Cal. Supreme Court implied)", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "10",
      reporterAbbrev: "Cal. 4th",
      firstPage: "20",
      year: "1999",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 10 Cal. 4th 20 (1999)",
    );
  });

  it("requires a court abbreviation for Cal. App. 4th", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "10",
      reporterAbbrev: "Cal. App. 4th",
      firstPage: "20",
      court: getCourt("cal-ct-app"),
      year: "1999",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 10 Cal. App. 4th 20 (Cal. Ct. App. 1999)",
    );
  });

  it("requires a court abbreviation for Texas's S.W.3d", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "300",
      reporterAbbrev: "S.W.3d",
      firstPage: "400",
      court: getCourt("tex-app"),
      year: "2015",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 300 S.W.3d 400 (Tex. App. 2015)",
    );
  });

  it("requires a court abbreviation for Oklahoma's P.3d", () => {
    const input: CaseCitationInput = {
      kind: "case",
      caseName: { kind: "two-party", plaintiff: "Test", defendant: "Case" },
      volume: "150",
      reporterAbbrev: "P.3d",
      firstPage: "250",
      court: getCourt("okla"),
      year: "2012",
    };
    expect(tokensToPlainText(assembleCaseCitation(input))).toBe(
      "Test v. Case, 150 P.3d 250 (Okla. 2012)",
    );
  });
});
