"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface Guest {
  name: string;
  email: string;
}

interface GuestContextType {
  guest: Guest | null;
  setGuest: (g: Guest) => void;
  clearGuest: () => void;
}

const GuestContext = createContext<GuestContextType>({
  guest: null,
  setGuest: () => {},
  clearGuest: () => {},
});

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuestState] = useState<Guest | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("htch_guest");
    if (stored) setGuestState(JSON.parse(stored));
  }, []);

  const setGuest = (g: Guest) => {
    localStorage.setItem("htch_guest", JSON.stringify(g));
    setGuestState(g);
  };

  const clearGuest = () => {
    localStorage.removeItem("htch_guest");
    setGuestState(null);
  };

  return (
    <GuestContext.Provider value={{ guest, setGuest, clearGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);
