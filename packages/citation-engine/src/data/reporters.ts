/**
 * Table 1-style reporter reference data. Independently compiled facts about
 * which reporters exist and what a citation to them requires — not text
 * copied from the Bluebook itself.
 *
 * MVP scope: federal reporters, plus Oklahoma, Texas, California, and New York.
 * Expanding this table (Phase 7) never requires touching the formatter logic
 * in ../rules — that's the point of keeping data and logic separate.
 */
export interface ReporterInfo {
  abbrev: string;
  fullName: string;
  jurisdiction: string;
  /**
   * "none": the reporter itself unambiguously identifies the court, so the
   *   court/date parenthetical only needs a year (e.g. "(1954)" for U.S.).
   * "court-required": the reporter covers multiple courts, so the
   *   parenthetical must also name the court (e.g. "(2d Cir. 2009)").
   */
  parentheticalRequirement: "none" | "court-required";
}

export const REPORTERS: Record<string, ReporterInfo> = {
  "U.S.": {
    abbrev: "U.S.",
    fullName: "United States Reports",
    jurisdiction: "U.S.",
    parentheticalRequirement: "none",
  },
  "S. Ct.": {
    abbrev: "S. Ct.",
    fullName: "Supreme Court Reporter",
    jurisdiction: "U.S.",
    parentheticalRequirement: "none",
  },
  "F.": {
    abbrev: "F.",
    fullName: "Federal Reporter",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "F.2d": {
    abbrev: "F.2d",
    fullName: "Federal Reporter, Second Series",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "F.3d": {
    abbrev: "F.3d",
    fullName: "Federal Reporter, Third Series",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "F. Supp.": {
    abbrev: "F. Supp.",
    fullName: "Federal Supplement",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "F. Supp. 2d": {
    abbrev: "F. Supp. 2d",
    fullName: "Federal Supplement, Second Series",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "F. Supp. 3d": {
    abbrev: "F. Supp. 3d",
    fullName: "Federal Supplement, Third Series",
    jurisdiction: "U.S.",
    parentheticalRequirement: "court-required",
  },
  "Cal.": {
    abbrev: "Cal.",
    fullName: "California Reports",
    jurisdiction: "Cal.",
    parentheticalRequirement: "none",
  },
  "Cal. 2d": {
    abbrev: "Cal. 2d",
    fullName: "California Reports, Second Series",
    jurisdiction: "Cal.",
    parentheticalRequirement: "none",
  },
  "Cal. 3d": {
    abbrev: "Cal. 3d",
    fullName: "California Reports, Third Series",
    jurisdiction: "Cal.",
    parentheticalRequirement: "none",
  },
  "Cal. 4th": {
    abbrev: "Cal. 4th",
    fullName: "California Reports, Fourth Series",
    jurisdiction: "Cal.",
    parentheticalRequirement: "none",
  },
  "Cal. App. 4th": {
    abbrev: "Cal. App. 4th",
    fullName: "California Appellate Reports, Fourth Series",
    jurisdiction: "Cal.",
    parentheticalRequirement: "court-required",
  },
  "N.Y.2d": {
    abbrev: "N.Y.2d",
    fullName: "New York Reports, Second Series",
    jurisdiction: "N.Y.",
    parentheticalRequirement: "none",
  },
  "N.Y.3d": {
    abbrev: "N.Y.3d",
    fullName: "New York Reports, Third Series",
    jurisdiction: "N.Y.",
    parentheticalRequirement: "none",
  },
  "N.Y.S.2d": {
    abbrev: "N.Y.S.2d",
    fullName: "New York Supplement, Second Series",
    jurisdiction: "N.Y.",
    parentheticalRequirement: "court-required",
  },
  "N.Y.S.3d": {
    abbrev: "N.Y.S.3d",
    fullName: "New York Supplement, Third Series",
    jurisdiction: "N.Y.",
    parentheticalRequirement: "court-required",
  },
  "S.W.2d": {
    abbrev: "S.W.2d",
    fullName: "South Western Reporter, Second Series",
    jurisdiction: "Tex.",
    parentheticalRequirement: "court-required",
  },
  "S.W.3d": {
    abbrev: "S.W.3d",
    fullName: "South Western Reporter, Third Series",
    jurisdiction: "Tex.",
    parentheticalRequirement: "court-required",
  },
  "P.2d": {
    abbrev: "P.2d",
    fullName: "Pacific Reporter, Second Series",
    jurisdiction: "Okla.",
    parentheticalRequirement: "court-required",
  },
  "P.3d": {
    abbrev: "P.3d",
    fullName: "Pacific Reporter, Third Series",
    jurisdiction: "Okla.",
    parentheticalRequirement: "court-required",
  },
};

export function getReporter(abbrev: string): ReporterInfo {
  const reporter = REPORTERS[abbrev];
  if (!reporter) {
    throw new Error(`Unknown reporter abbreviation: "${abbrev}"`);
  }
  return reporter;
}
