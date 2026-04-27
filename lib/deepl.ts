import { db } from "@/lib/db";
import { systemSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type TranslationFields = {
  name?: string;
  description?: string;
  title?: string;
  content?: string;
  message?: string;
};

type TranslationResult = {
  en: TranslationFields;
  pt: TranslationFields;
};

async function translateText(
  text: string,
  targetLang: string,
  apiUrl: string,
  apiKey: string,
): Promise<string> {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        source_lang: "ES",
        target_lang: targetLang,
      }).toString(),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return (data.translations?.[0]?.text as string) ?? text;
  } catch {
    return text;
  }
}

export async function autoTranslate(
  fields: TranslationFields,
): Promise<TranslationResult> {
  // Prefer DB-stored key over env variable
  let apiKey = process.env.DEEPL_API_KEY;
  let plan = process.env.DEEPL_FREE_API !== "false" ? "free" : "pro";

  try {
    const [keyRow] = await db.select().from(systemSettings).where(eq(systemSettings.key, "deepl_api_key")).limit(1);
    const [planRow] = await db.select().from(systemSettings).where(eq(systemSettings.key, "deepl_plan")).limit(1);
    const [enabledRow] = await db.select().from(systemSettings).where(eq(systemSettings.key, "translation_enabled")).limit(1);
    if (keyRow?.value) apiKey = keyRow.value;
    if (planRow?.value) plan = planRow.value;
    if (enabledRow?.value === "false") return { en: {}, pt: {} };
  } catch {
    // fall through to env vars
  }

  if (!apiKey) return { en: {}, pt: {} };

  const apiUrl = plan === "free"
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const entries = Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim());

  const results = await Promise.all(
    entries.flatMap(([key, value]) => [
      translateText(value as string, "EN", apiUrl, apiKey).then((t) => ({
        lang: "en" as const,
        key,
        value: t,
      })),
      translateText(value as string, "PT", apiUrl, apiKey).then((t) => ({
        lang: "pt" as const,
        key,
        value: t,
      })),
    ]),
  );

  const en: TranslationFields = {};
  const pt: TranslationFields = {};

  for (const r of results) {
    if (r.lang === "en") (en as Record<string, string>)[r.key] = r.value;
    else (pt as Record<string, string>)[r.key] = r.value;
  }

  return { en, pt };
}
