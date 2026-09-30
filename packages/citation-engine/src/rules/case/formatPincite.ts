import type { CitationToken } from "../../types/index.js";

export function formatPincite(pincite?: string): CitationToken[] {
  if (!pincite) {
    return [];
  }
  return [{ text: `, ${pincite}` }];
}
