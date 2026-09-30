import type { CitationToken } from "../types/index.js";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function tokensToHtml(tokens: CitationToken[]): string {
  return tokens
    .map((token) => {
      const escaped = escapeHtml(token.text);
      return token.italic ? `<i>${escaped}</i>` : escaped;
    })
    .join("");
}
