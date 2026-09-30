import type { CaseNameStyle, CitationToken } from "../../types/index.js";
import {
  CASE_NAME_WORD_ABBREVIATIONS,
  NEVER_ABBREVIATE_PARTY_NAMES,
} from "../../data/caseNameAbbreviations.js";

function abbreviatePartyName(name: string): string {
  if (NEVER_ABBREVIATE_PARTY_NAMES.has(name)) {
    return name;
  }
  return name
    .split(" ")
    .map((word) => CASE_NAME_WORD_ABBREVIATIONS[word] ?? word)
    .join(" ");
}

/**
 * Bluebook Rule 10.2: case names are italicized in citation sentences,
 * including the "v." between parties.
 */
export function formatCaseName(style: CaseNameStyle): CitationToken[] {
  switch (style.kind) {
    case "two-party":
      return [
        {
          text: `${abbreviatePartyName(style.plaintiff)} v. ${abbreviatePartyName(style.defendant)}`,
          italic: true,
        },
      ];
    case "in-re":
      return [{ text: `In re ${abbreviatePartyName(style.party)}`, italic: true }];
    case "ex-parte":
      return [{ text: `Ex parte ${abbreviatePartyName(style.party)}`, italic: true }];
  }
}

/**
 * The single party name used to identify a case in short-form citations
 * (Rule 10.9) — e.g. "Brown" from "Brown v. Board of Education".
 */
export function getShortFormPartyName(style: CaseNameStyle): string {
  switch (style.kind) {
    case "two-party":
      return abbreviatePartyName(style.plaintiff);
    case "in-re":
      return `In re ${abbreviatePartyName(style.party)}`;
    case "ex-parte":
      return `Ex parte ${abbreviatePartyName(style.party)}`;
  }
}
