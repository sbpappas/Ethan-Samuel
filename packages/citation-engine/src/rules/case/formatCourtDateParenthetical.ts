import type { CitationToken } from "../../types/index.js";
import type { ReporterInfo } from "../../data/reporters.js";

/**
 * Bluebook Rule 10.4/10.5: the parenthetical needs a court abbreviation only
 * when the reporter itself doesn't unambiguously identify the deciding
 * court (e.g. "F.3d" covers every circuit, so "(2d Cir. 2009)" is required;
 * "U.S." only ever means the Supreme Court, so "(1954)" is sufficient).
 */
export function formatCourtDateParenthetical(
  reporter: ReporterInfo,
  court: string | undefined,
  year: string,
): CitationToken[] {
  if (reporter.parentheticalRequirement === "court-required") {
    if (!court) {
      throw new Error(
        `Reporter "${reporter.abbrev}" requires a court abbreviation in the parenthetical, but none was provided.`,
      );
    }
    return [{ text: ` (${court} ${year})` }];
  }
  return [{ text: ` (${year})` }];
}
