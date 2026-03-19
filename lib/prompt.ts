// lib/prompt.ts
// Single source of truth for the diagnostic AI prompt.
// Import buildPrompt() in your API route.

export type PromptParams = {
  symptoms: string;
  age: string;
  gender: string;
  duration?: string;
  severity?: string;
  locale?: string;
  country?: string;
  isChild?: boolean;
};

// Locale → language instruction
const LOCALE_MAP: Record<string, string> = {
  en: "Respond entirely in English.",
  fr: "Répondez entièrement en français.",
  sw: "Jibu kwa Kiswahili kamili.",
  ha: "Amsa gaba ɗaya da Hausa.",
  am: "ሙሉ በሙሉ በአማርኛ ይመልሱ።",
};

// Country → endemic disease context
const COUNTRY_CONTEXT: Record<string, string> = {
  Nigeria:        "Nigeria (West Africa). High risk: malaria, typhoid, cholera, Lassa fever, meningococcal meningitis, monkeypox.",
  Ghana:          "Ghana (West Africa). High risk: malaria, typhoid, cholera, yellow fever.",
  Kenya:          "Kenya (East Africa). High risk: malaria (highlands lower risk), typhoid, cholera, dengue, Rift Valley fever.",
  Tanzania:       "Tanzania (East Africa). High risk: malaria, typhoid, cholera, schistosomiasis, dengue.",
  Ethiopia:       "Ethiopia (East Africa). High risk: malaria (lowlands), typhoid, TB, leishmaniasis, relapsing fever.",
  Uganda:         "Uganda (East Africa). High risk: malaria, typhoid, cholera, sleeping sickness, Ebola (border regions).",
  "South Africa": "South Africa (Southern Africa). High risk: TB, HIV-related infections, typhoid (lower malaria risk in most regions).",
  Zimbabwe:       "Zimbabwe (Southern Africa). High risk: malaria (north), typhoid, cholera.",
  Mozambique:     "Mozambique (Southern Africa). High risk: malaria, cholera, typhoid, schistosomiasis.",
  Cameroon:       "Cameroon (Central Africa). High risk: malaria, typhoid, cholera, sleeping sickness.",
  "Côte d'Ivoire":"Côte d'Ivoire (West Africa). High risk: malaria, typhoid, yellow fever, cholera.",
  Senegal:        "Senegal (West Africa). High risk: malaria, typhoid, cholera, dengue.",
  Mali:           "Mali (West Africa). High risk: malaria, typhoid, meningitis (meningitis belt), cholera.",
  Niger:          "Niger (West Africa/Sahel). High risk: malaria, meningococcal meningitis, typhoid, cholera.",
  Chad:           "Chad (Central Africa/Sahel). High risk: malaria, meningitis, typhoid, cholera.",
  Sudan:          "Sudan (East Africa). High risk: malaria, typhoid, leishmaniasis, cholera.",
  Angola:         "Angola (Southern Africa). High risk: malaria, yellow fever, typhoid, cholera.",
  Zambia:         "Zambia (Southern Africa). High risk: malaria, typhoid, cholera, schistosomiasis.",
  Rwanda:         "Rwanda (East Africa). High risk: malaria (lower altitude), typhoid, cholera.",
  DRC:            "Democratic Republic of Congo (Central Africa). High risk: malaria, Ebola (eastern regions), typhoid, cholera, sleeping sickness.",
  Somalia:        "Somalia (East Africa). High risk: malaria, cholera, typhoid, measles outbreaks.",
  Madagascar:     "Madagascar (Indian Ocean). High risk: malaria, plague, typhoid, cholera.",
  Malawi:         "Malawi (Southern Africa). High risk: malaria, typhoid, cholera, schistosomiasis.",
};

const DEFAULT_REGION_CONTEXT =
  "Sub-Saharan Africa. Consider: malaria, typhoid, cholera, dengue, schistosomiasis, meningococcal meningitis, yellow fever, sleeping sickness.";

export function buildPrompt(params: PromptParams): string {
  const {
    symptoms, age, gender,
    duration = "not specified",
    severity = "not specified",
    locale = "en",
    country,
    isChild = false,
  } = params;

  const langInstruction = LOCALE_MAP[locale] ?? LOCALE_MAP.en;
  const regionContext   = country ? COUNTRY_CONTEXT[country] ?? DEFAULT_REGION_CONTEXT : DEFAULT_REGION_CONTEXT;
  const pediatricNote   = isChild
    ? `IMPORTANT: This is a child patient. Use pediatric symptom interpretation. Flag childhood-specific diseases (measles, malnutrition, neonatal conditions, malaria in under-5s). Adjust ORS and medication guidance by weight where relevant. Err strongly toward recommending clinical evaluation.`
    : "";

  return `You are a health education assistant supporting patients in Sub-Saharan Africa. Your role is health education only — not diagnosis or prescribing.

${langInstruction}

PATIENT
Age: ${age} | Gender: ${gender} | Region: ${regionContext}
Symptoms: ${symptoms}
Duration: ${duration} | Severity: ${severity}
${pediatricNote}

INSTRUCTIONS
- Prioritise endemic regional diseases in your differential
- Give practical, actionable advice suited to limited-resource settings
- If symptom profile is ambiguous or could match multiple serious conditions, say so clearly — never project false confidence
- For EMERGENCY urgency: stress that the patient must reach a health facility immediately
- Do not recommend specific prescription drug doses
- Keep language simple and accessible

Respond ONLY in this exact format. Keep section headers in English (they are parsed by code). All content must be in the language specified above.

URGENCY: [EMERGENCY|HIGH|MODERATE|LOW]
CONFIDENCE: [HIGH|MEDIUM|LOW]

POSSIBLE CONDITIONS:
[3–5 conditions ordered by likelihood. For each: condition name, 1–2 sentence explanation of why it fits this patient's profile.]

IMMEDIATE STEPS:
[2–4 specific actions to take right now, suitable for a low-resource setting.]

HOME CARE:
[Practical home treatment. Include ORS for diarrhoea/fever where relevant. No prescription drugs.]

SEEK CARE IF:
[4–6 specific warning signs that mean they must go to a clinic or hospital urgently, even at night.]

PREVENTION:
[2–3 actionable prevention tips relevant to this patient's region and symptoms.]`;
}

// Export country list for the UI country selector
export const COUNTRIES = Object.keys(COUNTRY_CONTEXT).sort();

// Per-country emergency numbers
export const EMERGENCY_NUMBERS: Record<string, string> = {
  Nigeria:          "112",
  Ghana:            "112",
  Kenya:            "112",
  Tanzania:         "112",
  Ethiopia:         "911",
  Uganda:           "112",
  "South Africa":   "112",
  Zimbabwe:         "112",
  Mozambique:       "112",
  Cameroon:         "112",
  "Côte d'Ivoire":  "110",
  Senegal:          "15",
  Mali:             "15",
  Niger:            "15",
  Chad:             "2251",
  Sudan:            "999",
  Angola:           "112",
  Zambia:           "112",
  Rwanda:           "912",
  DRC:              "112",
  Somalia:          "888",
  Madagascar:       "117",
  Malawi:           "998",
};

export function getEmergencyNumber(country?: string): string {
  if (!country) return "112";
  return EMERGENCY_NUMBERS[country] ?? "112";
}

// Country → flag emoji
export const COUNTRY_FLAGS: Record<string, string> = {
  Nigeria:          "🇳🇬",
  Ghana:            "🇬🇭",
  Kenya:            "🇰🇪",
  Tanzania:         "🇹🇿",
  Ethiopia:         "🇪🇹",
  Uganda:           "🇺🇬",
  "South Africa":   "🇿🇦",
  Zimbabwe:         "🇿🇼",
  Mozambique:       "🇲🇿",
  Cameroon:         "🇨🇲",
  "Côte d'Ivoire":  "🇨🇮",
  Senegal:          "🇸🇳",
  Mali:             "🇲🇱",
  Niger:            "🇳🇪",
  Chad:             "🇹🇩",
  Sudan:            "🇸🇩",
  Angola:           "🇦🇴",
  Zambia:           "🇿🇲",
  Rwanda:           "🇷🇼",
  DRC:              "🇨🇩",
  Somalia:          "🇸🇴",
  Madagascar:       "🇲🇬",
  Malawi:           "🇲🇼",
};