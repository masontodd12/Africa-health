export type ValidationError = string | null;

const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?instructions/i,
  /system\s*prompt/i,
  /you\s+are\s+(now\s+)?a/i,
  /forget\s+(everything|all)/i,
  /new\s+persona/i,
  /<script/i,
  /javascript:/i,
];

export function validateAge(age: string): ValidationError {
  const n = Number(age);
  if (!age || isNaN(n)) return "Age is required";
  if (n < 0 || n > 120) return "Enter a valid age (0–120)";
  return null;
}

export function validateSymptoms(selected: string[], custom: string): ValidationError {
  if (selected.length === 0 && !custom.trim()) return "Select at least one symptom";
  if (custom.length > 500) return "Custom symptoms must be under 500 characters";
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(custom)) return "Invalid input — please describe symptoms only";
  }
  return null;
}

export function sanitizeCustomSymptoms(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")           // strip HTML
    .replace(/[{}[\]\\]/g, "")          // strip braces/brackets
    .trim()
    .slice(0, 500);
}

export function validateRequest(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") return { valid: false, error: "Invalid request" };
  const b = body as Record<string, unknown>;

  if (typeof b.symptoms !== "string" || b.symptoms.trim().length === 0)
    return { valid: false, error: "Symptoms are required" };
  if (b.symptoms.length > 1000)
    return { valid: false, error: "Symptoms too long" };
  if (typeof b.age !== "string" || isNaN(Number(b.age)) || Number(b.age) < 0 || Number(b.age) > 120)
    return { valid: false, error: "Invalid age" };
  if (typeof b.gender !== "string" || !["Male","Female","Other"].includes(b.gender))
    return { valid: false, error: "Invalid gender" };

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(b.symptoms as string))
      return { valid: false, error: "Invalid symptoms input" };
  }

  return { valid: true };
}