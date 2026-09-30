/**
 * Table 6-style word abbreviations applied when formatting case names.
 * Deliberately does NOT include "United States" — Bluebook practice keeps
 * "United States" spelled out when it is a party name (e.g. "United States
 * v. Nixon", never "U.S. v. Nixon"); see NEVER_ABBREVIATE_PARTY_NAMES below.
 */
export const CASE_NAME_WORD_ABBREVIATIONS: Record<string, string> = {
  Association: "Ass'n",
  Brothers: "Bros.",
  Company: "Co.",
  Corporation: "Corp.",
  Department: "Dep't",
  Government: "Gov't",
  Incorporated: "Inc.",
  Insurance: "Ins.",
  International: "Int'l",
  Limited: "Ltd.",
  Manufacturing: "Mfg.",
  Mutual: "Mut.",
  National: "Nat'l",
  Railroad: "R.R.",
  Railway: "Ry.",
  Savings: "Sav.",
  University: "Univ.",
};

/**
 * Party names that are never abbreviated/substituted even though they might
 * otherwise match a word-abbreviation rule.
 */
export const NEVER_ABBREVIATE_PARTY_NAMES = new Set<string>(["United States"]);
