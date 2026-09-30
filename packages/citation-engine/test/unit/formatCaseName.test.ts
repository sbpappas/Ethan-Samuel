import { describe, expect, it } from "vitest";
import { formatCaseName, getShortFormPartyName } from "../../src/rules/case/formatCaseName.js";
import { tokensToPlainText } from "../../src/render/tokensToPlainText.js";

/**
 * Synthetic/illustrative inputs (not real reported cases) used purely to
 * exercise word-abbreviation and party-name rules in isolation.
 */
describe("formatCaseName", () => {
  it("abbreviates common corporate designators", () => {
    const tokens = formatCaseName({
      kind: "two-party",
      plaintiff: "Smith",
      defendant: "Jones Manufacturing Corporation",
    });
    expect(tokensToPlainText(tokens)).toBe("Smith v. Jones Mfg. Corp.");
  });

  it("never abbreviates United States as a party name", () => {
    const tokens = formatCaseName({
      kind: "two-party",
      plaintiff: "United States",
      defendant: "Nixon",
    });
    expect(tokensToPlainText(tokens)).toBe("United States v. Nixon");
  });

  it("formats an ex parte single-party case", () => {
    const tokens = formatCaseName({ kind: "ex-parte", party: "Young" });
    expect(tokensToPlainText(tokens)).toBe("Ex parte Young");
    expect(tokens[0]?.italic).toBe(true);
  });

  it("derives the short-form party name for a two-party case", () => {
    expect(
      getShortFormPartyName({ kind: "two-party", plaintiff: "Brown", defendant: "Board of Education" }),
    ).toBe("Brown");
  });

  it("derives the short-form party name for an in-re case", () => {
    expect(getShortFormPartyName({ kind: "in-re", party: "Gault" })).toBe("In re Gault");
  });
});
