"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface HeaderProps {
  transparent?: boolean;
}

const NAV_ITEMS = [
  { href: "/home",         label: "Inicio",                  iconClass: "fi-ts-house-blank" },
  { href: "/habitacion",  label: "Mi habitación",           iconClass: "fi-ts-bed-alt" },
  { href: "/restaurantes",label: "Comer y Beber",           iconClass: "fi-ts-utensils" },
  { href: "/actividades", label: "Experiencias",            iconClass: "fi-ts-mountain" },
  { href: "/wellness",    label: "Wellness & Spa",          iconClass: "fi-ts-hot-tub" },
  { href: "/familia",     label: "Familia y Niños",         iconClass: "fi-ts-family" },
  { href: "/emergencia",  label: "Contacto de Emergencia",  iconClass: "fi-rs-phone-call" },
];

export default function Header({ transparent = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center justify-between px-4 py-3 ${
          transparent ? "bg-transparent" : "bg-[#1B4332]"
        }`}
        style={{ boxShadow: transparent ? "none" : "0 2px 8px rgba(0,0,0,0.18)" }}
      >
        <Link href="/home">
          <Image src="/images/logo.png" alt="Hotel Termas de Chillán" width={120} height={40} className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🇨🇱</span>
            <span className="text-white text-xs font-semibold tracking-wide">ESP</span>
          </div>
          <button onClick={() => setMenuOpen(true)} className="text-white p-1" aria-label="Abrir menú">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="18" height="1.8" rx="0.9" fill="white"/>
              <rect x="2" y="10.1" width="18" height="1.8" rx="0.9" fill="white"/>
              <rect x="2" y="15.2" width="18" height="1.8" rx="0.9" fill="white"/>
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#1B4332] flex flex-col rounded-b-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <Image src="/images/logo.png" alt="Hotel Termas de Chillán" width={120} height={40} className="h-10 w-auto object-contain" />
              <button onClick={() => setMenuOpen(false)} className="text-white p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <nav>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-5 px-6 py-[18px] border-b border-white/15 active:bg-white/10"
                >
                  <i className={`${item.iconClass} text-white shrink-0`} style={{ fontSize: 22 }} />
                  <span className="text-white font-playfair text-[20px]">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}



