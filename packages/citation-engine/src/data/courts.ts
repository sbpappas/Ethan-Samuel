/**
 * Court name -> Bluebook abbreviation, for reporters whose
 * parentheticalRequirement is "court-required". Not an exhaustive Table 1
 * court list — scoped to the jurisdictions this MVP covers (federal courts,
 * plus Oklahoma, Texas, California, and New York).
 */
export const COURTS: Record<string, string> = {
  "1st-cir": "1st Cir.",
  "2d-cir": "2d Cir.",
  "3d-cir": "3d Cir.",
  "4th-cir": "4th Cir.",
  "5th-cir": "5th Cir.",
  "6th-cir": "6th Cir.",
  "7th-cir": "7th Cir.",
  "8th-cir": "8th Cir.",
  "9th-cir": "9th Cir.",
  "10th-cir": "10th Cir.",
  "11th-cir": "11th Cir.",
  "dc-cir": "D.C. Cir.",
  sdny: "S.D.N.Y.",
  ndny: "N.D.N.Y.",
  edny: "E.D.N.Y.",
  wdny: "W.D.N.Y.",
  "cal-ct-app": "Cal. Ct. App.",
  "ny-app-div": "App. Div.",
  "ny-sup-ct": "Sup. Ct.",
  tex: "Tex.",
  "tex-app": "Tex. App.",
  "tex-crim-app": "Tex. Crim. App.",
  okla: "Okla.",
  "okla-civ-app": "Okla. Civ. App.",
  "okla-crim-app": "Okla. Crim. App.",
};

export function getCourt(key: string): string {
  const court = COURTS[key];
  if (!court) {
    throw new Error(`Unknown court key: "${key}"`);
  }
  return court;
}
