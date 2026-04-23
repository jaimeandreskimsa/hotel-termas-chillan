"use client";
import { useEffect, useState } from "react";

type Platform = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
    if (isStandalone) return;

    // Don't show if dismissed before
    if (sessionStorage.getItem("htch_install_dismissed")) return;

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    if (isIOS) {
      setPlatform("ios");
      setTimeout(() => setVisible(true), 2000);
    }

    if (isAndroid) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setPlatform("android");
        setTimeout(() => setVisible(true), 2000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("htch_install_dismissed", "1");
    setVisible(false);
  };

  if (!visible || !platform) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-6 pointer-events-none">
      <div className="bg-[#1B4332] text-white rounded-2xl shadow-2xl p-4 pointer-events-auto max-w-sm mx-auto">
        <div className="flex items-start gap-3">
          <img src="/icons/icon-192.png" alt="App" className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px] leading-tight">Hotel Termas de Chillán</p>
            <p className="text-white/70 text-[12px] mt-0.5">
              {platform === "ios"
                ? "Instala la app: toca el ícono compartir y luego \"Agregar a pantalla de inicio\""
                : "Instala la app en tu teléfono para acceso rápido"}
            </p>
          </div>
          <button onClick={handleDismiss} className="text-white/50 hover:text-white shrink-0 mt-0.5">
            <i className="fi-rs-cross" style={{ fontSize: 14 }} />
          </button>
        </div>

        {platform === "android" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2 rounded-xl border border-white/30 text-[13px] font-medium text-white/70"
            >
              Ahora no
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2 rounded-xl bg-white text-[#1B4332] text-[13px] font-semibold"
            >
              Instalar
            </button>
          </div>
        )}

        {platform === "ios" && (
          <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-xl px-3 py-2">
            <i className="fi-rs-share" style={{ fontSize: 14 }} />
            <span className="text-[12px] text-white/80">Compartir</span>
            <i className="fi-rs-arrow-right" style={{ fontSize: 10 }} />
            <span className="text-[12px] text-white/80">Agregar a inicio</span>
            <button onClick={handleDismiss} className="ml-auto text-white/50 text-[11px] underline">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
