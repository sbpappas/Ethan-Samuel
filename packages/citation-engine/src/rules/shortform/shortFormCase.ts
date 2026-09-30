import type { CaseCitationInput, CitationToken } from "../../types/index.js";
import { getReporter } from "../../data/reporters.js";
import { getShortFormPartyName } from "../case/formatCaseName.js";

/**
 * Bluebook Rule 10.9: short form uses a single identifying party name plus
 * "at" and the pincite. MVP simplification: uses the full (already
 * abbreviated) first party name rather than further truncating it to a
 * single distinctive word — see PLAN.md Phase 7.
 */
export function formatShortFormCase(input: CaseCitationInput): CitationToken[] {
  const reporter = getReporter(input.reporterAbbrev);
  const partyName = getShortFormPartyName(input.caseName);
  const pinpoint = input.pincite ?? input.firstPage;

  return [
    { text: partyName, italic: true },
    { text: `, ${input.volume} ${reporter.abbrev} at ${pinpoint}` },
  ];
}
