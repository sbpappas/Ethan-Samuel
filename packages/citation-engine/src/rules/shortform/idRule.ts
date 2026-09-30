import type { CitationToken } from "../../types/index.js";

/**
 * Bluebook Rule 10.9(a): "Id." refers to the immediately preceding cited
 * authority. Only valid when nothing else was cited in between (enforced by
 * the CitationSequencer, not by this formatter).
 */
export function formatIdCitation(pincite?: string): CitationToken[] {
  if (!pincite) {
    return [{ text: "Id.", italic: true }];
  }
  return [
    { text: "Id.", italic: true },
    { text: ` at ${pincite}` },
  ];
}
