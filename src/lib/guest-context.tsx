"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useI18n } from "@/lib/i18n-context";

interface GuestContextType {
  guestId: string | null;
  guestName: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  submitName: (name: string) => Promise<void>;
  isReady: boolean; // true once we've checked localStorage
}

const GuestContext = createContext<GuestContextType | null>(null);

const STORAGE_KEY_ID = "wedding_guest_id";
const STORAGE_KEY_NAME = "wedding_guest_name";

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { locale } = useI18n();

  // On mount, check localStorage for existing guest
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY_ID);
    const storedName = localStorage.getItem(STORAGE_KEY_NAME);
    if (storedId && storedName) {
      setGuestId(storedId);
      setGuestName(storedName);
    }
    setIsReady(true);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const submitName = useCallback(async (name: string) => {
    try {
      const res = await fetch("/api/photos/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (data.id) {
        setGuestId(data.id);
        setGuestName(name.trim());
        localStorage.setItem(STORAGE_KEY_ID, data.id);
        localStorage.setItem(STORAGE_KEY_NAME, name.trim());
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to register guest:", err);
    }
  }, []);

  return (
    <GuestContext.Provider
      value={{ guestId, guestName, isModalOpen, openModal, submitName, isReady }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}