import {
  assembleCaseCitation,
  formatShortFormCase,
  formatIdCitation,
  computeCitationForms,
  tokensToHtml,
  type CitationForm,
  type SequencedCitationEntry,
} from "@bluebook/citation-engine";

export interface CitationSequenceViewProps {
  entries: SequencedCitationEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function renderEntryHtml(entry: SequencedCitationEntry, form: CitationForm): string {
  const { source } = entry;
  if (source.kind !== "case") return "";
  if (form === "full") return tokensToHtml(assembleCaseCitation(source));
  if (form === "short") return tokensToHtml(formatShortFormCase(source));
  return tokensToHtml(formatIdCitation(source.pincite));
}

/**
 * Demonstrates Bluebook Rule 10.9 short-form/Id. sequencing (PLAN.md Phase 3):
 * each entry's rendered form depends on the ordered list as a whole, not on
 * the entry in isolation.
 */
export function CitationSequenceView({ entries, onRemove, onClear }: CitationSequenceViewProps) {
  const forms = computeCitationForms(entries);

  return (
    <div className="preview" style={{ marginTop: "1.5rem" }}>
      <div className="preview-label">
        Document citation sequence ({entries.length} {entries.length === 1 ? "entry" : "entries"})
      </div>
      {entries.length === 0 ? (
        <p style={{ color: "#777", margin: 0 }}>
          No citations added yet. Use "Add to sequence" above to build an ordered list and see
          full-form / short-form / "Id." resolved automatically.
        </p>
      ) : (
        <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
          {entries.map((entry) => {
            const form = forms.get(entry.id) ?? "full";
            return (
              <li key={entry.id} style={{ marginBottom: "0.6rem" }}>
                <span
                  className="preview-citation"
                  style={{ fontSize: "1rem" }}
                  dangerouslySetInnerHTML={{ __html: renderEntryHtml(entry, form) }}
                />
                <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
                  [{form}]
                </span>
                <button
                  onClick={() => onRemove(entry.id)}
                  style={{
                    marginLeft: "0.75rem",
                    marginTop: 0,
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.75rem",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #bbb",
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ol>
      )}
      {entries.length > 0 && (
        <button onClick={onClear} style={{ background: "#fff", color: "#333", border: "1px solid #bbb" }}>
          Clear sequence
        </button>
      )}
    </div>
  );
}
