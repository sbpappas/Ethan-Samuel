import type { CitationToken, ParallelCitation } from "../../types/index.js";

export function formatReporterCite(
  volume: string,
  reporterAbbrev: string,
  firstPage: string,
): CitationToken[] {
  return [{ text: `${volume} ${reporterAbbrev} ${firstPage}` }];
}

/**
 * MVP simplification: parallel citations are appended after the primary
 * pincite without their own interleaved pincites (full Bluebook Rule 10.3.2
 * parallel-citation-with-multiple-pincites support is deferred to a later
 * phase — see PLAN.md Phase 7).
 */
export function formatParallelCitations(parallels?: ParallelCitation[]): CitationToken[] {
  if (!parallels || parallels.length === 0) {
    return [];
  }
  return parallels.map((p) => ({
    text: `, ${p.volume} ${p.reporterAbbrev} ${p.firstPage}`,
  }));
}
