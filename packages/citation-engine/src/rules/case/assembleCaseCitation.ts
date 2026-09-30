import type { CaseCitationInput, CitationToken } from "../../types/index.js";
import { getReporter } from "../../data/reporters.js";
import { formatCaseName } from "./formatCaseName.js";
import { formatReporterCite, formatParallelCitations } from "./formatReporter.js";
import { formatPincite } from "./formatPincite.js";
import { formatCourtDateParenthetical } from "./formatCourtDateParenthetical.js";

/**
 * Composes the individual Rule 10 formatters into a full case citation:
 * Case Name, Vol Reporter Page, Parallel..., Pincite (Court Year)
 */
export function assembleCaseCitation(input: CaseCitationInput): CitationToken[] {
  const reporter = getReporter(input.reporterAbbrev);

  return [
    ...formatCaseName(input.caseName),
    { text: ", " },
    ...formatReporterCite(input.volume, reporter.abbrev, input.firstPage),
    ...formatParallelCitations(input.parallelCitations),
    ...formatPincite(input.pincite),
    ...formatCourtDateParenthetical(reporter, input.court, input.year),
  ];
}
