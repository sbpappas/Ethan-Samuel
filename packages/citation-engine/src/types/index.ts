/**
 * A single styled fragment of a rendered citation. Formatters never produce
 * raw strings directly — they produce tokens, so italics (Bluebook Rule 10.2)
 * stay a rendering concern instead of being baked into template strings.
 */
export interface CitationToken {
  text: string;
  italic?: boolean;
}

export type CaseNameStyle =
  | { kind: "two-party"; plaintiff: string; defendant: string }
  | { kind: "in-re"; party: string }
  | { kind: "ex-parte"; party: string };

export interface ParallelCitation {
  volume: string;
  reporterAbbrev: string;
  firstPage: string;
}

export interface CaseCitationInput {
  kind: "case";
  caseName: CaseNameStyle;
  volume: string;
  /** Key into the reporters table, e.g. "U.S.", "F.3d", "S.W.3d". */
  reporterAbbrev: string;
  firstPage: string;
  pincite?: string;
  /**
   * Court abbreviation, e.g. "2d Cir.", "S.D.N.Y.", "Tex. App.".
   * Required when the reporter's parentheticalRequirement is "court-required".
   */
  court?: string;
  year: string;
  parallelCitations?: ParallelCitation[];
}

/**
 * Discriminated union of every source type the engine can format.
 * Only `case` is implemented for the MVP; future kinds (statute, book,
 * article, ...) are added here without touching existing formatters.
 */
export type CitationSource = CaseCitationInput;

export type CitationForm = "full" | "short" | "id";

export interface SequencedCitationEntry {
  /** Unique id of this entry within its document (e.g. the DocumentEntry id). */
  id: string;
  source: CitationSource;
}
