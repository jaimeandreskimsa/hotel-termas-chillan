"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Settings, Key, Globe, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function ConfiguracionPage() {
  const [apiKey, setApiKey] = useState("");
  const [plan, setPlan] = useState("free");
  const [enabled, setEnabled] = useState(true);
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => {
        if (d.settings?.deepl_api_key) setSavedApiKey(d.settings.deepl_api_key);
        if (d.settings?.deepl_plan) setPlan(d.settings.deepl_plan);
        if (d.settings?.translation_enabled === "false") setEnabled(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const body: Record<string, string> = {
        deepl_plan: plan,
        translation_enabled: enabled ? "true" : "false",
      };
      if (apiKey.trim()) body.deepl_api_key = apiKey.trim();

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("success");
        if (apiKey.trim()) {
          setSavedApiKey("****" + apiKey.trim().slice(-4));
          setApiKey("");
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/settings/test", { method: "POST" });
      const d = await res.json();
      setTestResult(d.ok ? `✓ Conexión exitosa. Caracteres disponibles: ${d.character_count ?? "–"}` : `✗ Error: ${d.error ?? "No se pudo conectar"}`);
    } catch {
      setTestResult("✗ Error de red al conectar con DeepL");
    } finally {
      setTesting(false);
    }
  }

  return (
    <AdminShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#D8F3DC] rounded-xl flex items-center justify-center shrink-0">
            <Settings size={20} className="text-[#1B4332]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-500 text-[12px]">Traducciones automáticas y ajustes del sistema</p>
          </div>
        </div>

        {/* Translation card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Globe size={16} className="text-[#1B4332]" />
            <h2 className="font-semibold text-gray-800 text-[14px]">Traductor Automático (DeepL)</h2>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Enable toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-[14px]">Traducción automática</p>
                <p className="text-gray-400 text-[12px] mt-0.5">Al guardar contenido, se traduce automáticamente a inglés y portugués</p>
              </div>
              <button
                onClick={() => setEnabled(e => !e)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#1B4332]" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Plan DeepL</label>
              <div className="flex gap-2">
                {[
                  { value: "free", label: "Free", desc: "api-free.deepl.com" },
                  { value: "pro", label: "Pro", desc: "api.deepl.com" },
                ].map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPlan(p.value)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border text-[13px] font-medium transition-all text-left ${
                      plan === p.value
                        ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <p className="font-semibold">{p.label}</p>
                    <p className="text-[11px] opacity-60 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Key size={13} />
                API Key
              </label>
              {savedApiKey && (
                <p className="text-[12px] text-gray-500 mb-2">
                  Clave guardada: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{savedApiKey}</span>
                  <span className="ml-2 text-emerald-600 font-medium">● Activa</span>
                </p>
              )}
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={savedApiKey ? "Ingresa nueva clave para reemplazar..." : "Pega tu DeepL API key aquí"}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 font-mono"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Obtén tu clave gratuita en{" "}
                <a href="https://www.deepl.com/pro#developer" target="_blank" rel="noreferrer" className="text-[#1B4332] underline">
                  deepl.com/pro#developer
                </a>{" "}
                — 500k caracteres/mes gratis.
              </p>
            </div>

            {/* Test connection */}
            {savedApiKey && (
              <div>
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="text-[13px] font-medium text-[#1B4332] underline disabled:opacity-50"
                >
                  {testing ? "Probando conexión..." : "Probar conexión con DeepL"}
                </button>
                {testResult && (
                  <p className={`mt-2 text-[12px] font-medium ${testResult.startsWith("✓") ? "text-emerald-600" : "text-red-500"}`}>
                    {testResult}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#1B4332] text-white font-semibold rounded-xl text-[14px] disabled:opacity-60 transition-opacity"
        >
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-600 text-[13px] font-medium mt-3">
            <CheckCircle size={15} />
            Configuración guardada correctamente
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 text-[13px] font-medium mt-3">
            <AlertCircle size={15} />
            Error al guardar. Intenta nuevamente.
          </div>
        )}

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4 text-[12px] text-amber-800">
          <p className="font-semibold mb-1">¿Cómo funciona?</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Al crear o editar contenido desde el admin, se traduce automáticamente al inglés y portugués vía DeepL</li>
            <li>Las traducciones se guardan en la base de datos junto al contenido original</li>
            <li>Los huéspedes ven el contenido en el idioma que seleccionaron</li>
            <li>Puedes desactivar la traducción automática sin perder las claves guardadas</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
