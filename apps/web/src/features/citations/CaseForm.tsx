import { useMemo, useState } from "react";
import {
  REPORTERS,
  COURTS,
  getReporter,
  assembleCaseCitation,
  tokensToHtml,
  tokensToPlainText,
  type CaseCitationInput,
  type CaseNameStyle,
} from "@bluebook/citation-engine";

type CaseNameKind = CaseNameStyle["kind"];

const reporterOptions = Object.values(REPORTERS).sort((a, b) =>
  a.abbrev.localeCompare(b.abbrev),
);

const courtOptions = Object.entries(COURTS).sort((a, b) => a[1].localeCompare(b[1]));

export interface CaseFormProps {
  /** Called with the current, successfully-formatted citation input. */
  onAddToSequence?: (input: CaseCitationInput) => void;
}

export function CaseForm({ onAddToSequence }: CaseFormProps) {
  const [caseNameKind, setCaseNameKind] = useState<CaseNameKind>("two-party");
  const [plaintiff, setPlaintiff] = useState("Brown");
  const [defendant, setDefendant] = useState("Board of Education");
  const [singleParty, setSingleParty] = useState("Gault");
  const [volume, setVolume] = useState("347");
  const [reporterAbbrev, setReporterAbbrev] = useState("U.S.");
  const [firstPage, setFirstPage] = useState("483");
  const [pincite, setPincite] = useState("");
  const [court, setCourt] = useState("");
  const [year, setYear] = useState("1954");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const reporter = useMemo(() => {
    try {
      return getReporter(reporterAbbrev);
    } catch {
      return undefined;
    }
  }, [reporterAbbrev]);

  const courtRequired = reporter?.parentheticalRequirement === "court-required";

  const caseName: CaseNameStyle = useMemo(() => {
    if (caseNameKind === "two-party") {
      return { kind: "two-party", plaintiff, defendant };
    }
    return { kind: caseNameKind, party: singleParty };
  }, [caseNameKind, plaintiff, defendant, singleParty]);

  const input: CaseCitationInput = useMemo(
    () => ({
      kind: "case",
      caseName,
      volume,
      reporterAbbrev,
      firstPage,
      pincite: pincite || undefined,
      court: courtRequired ? court || undefined : undefined,
      year,
    }),
    [caseName, volume, reporterAbbrev, firstPage, pincite, court, courtRequired, year],
  );

  const result = useMemo(() => {
    try {
      return { tokens: assembleCaseCitation(input), error: null as string | null };
    } catch (err) {
      return { tokens: null, error: err instanceof Error ? err.message : String(err) };
    }
  }, [input]);

  async function handleCopy() {
    if (!result.tokens) return;
    const text = tokensToPlainText(result.tokens);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch {
      // Clipboard access can be denied by the browser; the citation is still
      // visible on-screen for manual copy.
    }
  }

  return (
    <div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="caseNameKind">Case name style</label>
          <select
            id="caseNameKind"
            value={caseNameKind}
            onChange={(e) => setCaseNameKind(e.target.value as CaseNameKind)}
          >
            <option value="two-party">Two parties (v.)</option>
            <option value="in-re">In re (single party)</option>
            <option value="ex-parte">Ex parte (single party)</option>
          </select>
        </div>

        <div className="field" />

        {caseNameKind === "two-party" ? (
          <>
            <div className="field">
              <label htmlFor="plaintiff">Plaintiff / first party</label>
              <input id="plaintiff" value={plaintiff} onChange={(e) => setPlaintiff(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="defendant">Defendant / second party</label>
              <input id="defendant" value={defendant} onChange={(e) => setDefendant(e.target.value)} />
            </div>
          </>
        ) : (
          <div className="field span-2">
            <label htmlFor="singleParty">Party</label>
            <input id="singleParty" value={singleParty} onChange={(e) => setSingleParty(e.target.value)} />
          </div>
        )}

        <div className="field">
          <label htmlFor="volume">Volume</label>
          <input id="volume" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="reporter">Reporter</label>
          <select id="reporter" value={reporterAbbrev} onChange={(e) => setReporterAbbrev(e.target.value)}>
            {reporterOptions.map((r) => (
              <option key={r.abbrev} value={r.abbrev}>
                {r.abbrev} ({r.jurisdiction})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="firstPage">First page</label>
          <input id="firstPage" value={firstPage} onChange={(e) => setFirstPage(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="pincite">Pincite (optional)</label>
          <input id="pincite" value={pincite} onChange={(e) => setPincite(e.target.value)} />
        </div>

        {courtRequired && (
          <div className="field">
            <label htmlFor="court">Court</label>
            <select id="court" value={court} onChange={(e) => setCourt(e.target.value)}>
              <option value="">Select a court…</option>
              {courtOptions.map(([key, label]) => (
                <option key={key} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="year">Year</label>
          <input id="year" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
      </div>

      <div className="preview">
        <div className="preview-label">Citation preview</div>
        {result.tokens ? (
          <div
            className="preview-citation"
            dangerouslySetInnerHTML={{ __html: tokensToHtml(result.tokens) }}
          />
        ) : (
          <div className="preview-citation preview-error">{result.error}</div>
        )}
        <div>
          <button onClick={handleCopy} disabled={!result.tokens}>
            Copy citation
          </button>
          {onAddToSequence && (
            <button
              onClick={() => result.tokens && onAddToSequence(input)}
              disabled={!result.tokens}
              style={{ marginLeft: "0.6rem" }}
            >
              Add to sequence
            </button>
          )}
          {copyFeedback && <span className="copy-feedback">Copied!</span>}
        </div>
      </div>
    </div>
  );
}
