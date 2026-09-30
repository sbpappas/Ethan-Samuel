import { useState } from "react";
import type { CaseCitationInput, SequencedCitationEntry } from "@bluebook/citation-engine";
import { CaseForm } from "./features/citations/CaseForm.js";
import { CitationSequenceView } from "./features/documents/CitationSequenceView.js";

export function App() {
  const [sequence, setSequence] = useState<SequencedCitationEntry[]>([]);

  function handleAddToSequence(input: CaseCitationInput) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSequence((prev) => [...prev, { id, source: input }]);
  }

  function handleRemove(id: string) {
    setSequence((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <div className="page">
      <h1>Bluebook Case Citation Generator</h1>
      <p className="subtitle">
        Fill in the fields below to get a correctly formatted Bluebook Rule 10 case citation.
        Always verify before filing.
      </p>
      <CaseForm onAddToSequence={handleAddToSequence} />
      <CitationSequenceView entries={sequence} onRemove={handleRemove} onClear={() => setSequence([])} />
    </div>
  );
}
