import type { CitationToken } from "../types/index.js";

/**
 * Plain-text/clipboard rendering drops italics entirely (typewriter
 * convention would use underscores, but for MVP copy-to-clipboard we keep it
 * plain — see PLAN.md export scope).
 */
export function tokensToPlainText(tokens: CitationToken[]): string {
  return tokens.map((token) => token.text).join("");
}
