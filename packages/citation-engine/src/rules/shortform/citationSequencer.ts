import type { CitationForm, SequencedCitationEntry } from "../../types/index.js";

/**
 * Same-source identity for sequencing purposes: normalized case name +
 * reporter + volume + first page, NOT database row identity. Two separate
 * Citation library rows that describe the same case must still be treated
 * as the same authority for Id./short-form purposes.
 */
function citationIdentityKey(entry: SequencedCitationEntry): string {
  const { source } = entry;
  return JSON.stringify([source.caseName, source.reporterAbbrev, source.volume, source.firstPage]);
}

export interface SequencerOptions {
  /** Entry ids the user has manually pinned to render in full form. */
  forceFullFormIds?: ReadonlySet<string>;
}

/**
 * Bluebook Rule 10.9: walks a document's ordered citation list and decides,
 * for each entry, whether it should render full, short, or "Id.".
 *
 * - First appearance of a source -> full.
 * - Repeat appearance, immediately following the same source -> id.
 * - Repeat appearance, with a different source cited in between -> short.
 * - A user override always forces full form.
 */
export function computeCitationForms(
  entries: readonly SequencedCitationEntry[],
  options: SequencerOptions = {},
): Map<string, CitationForm> {
  const forms = new Map<string, CitationForm>();
  const seenKeys = new Set<string>();
  let previousKey: string | null = null;

  for (const entry of entries) {
    const key = citationIdentityKey(entry);
    const isForcedFullForm = options.forceFullFormIds?.has(entry.id) ?? false;

    if (isForcedFullForm || !seenKeys.has(key)) {
      forms.set(entry.id, "full");
    } else if (previousKey === key) {
      forms.set(entry.id, "id");
    } else {
      forms.set(entry.id, "short");
    }

    seenKeys.add(key);
    previousKey = key;
  }

  return forms;
}
