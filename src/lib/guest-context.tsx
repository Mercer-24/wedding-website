"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface GuestContextType {
  guestId: string | null;
  guestName: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  submitName: (name: string) => Promise<void>;
  isReady: boolean;
}

const GuestContext = createContext<GuestContextType | null>(null);

const STORAGE_KEY_ID = "wedding_guest_id";
const STORAGE_KEY_NAME = "wedding_guest_name";

export class GuestRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuestRegistrationError";
  }
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // On mount, check localStorage for existing guest
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_ID);
      const storedName = localStorage.getItem(STORAGE_KEY_NAME);
      if (storedId && storedName) {
        setGuestId(storedId);
        setGuestName(storedName);
      }
    } catch {
      // localStorage not available (SSR, privacy mode, etc.)
    }
    setIsReady(true);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const submitName = useCallback(async (name: string) => {
    const res = await fetch("/api/photos/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new GuestRegistrationError(
        data.error || "Registration failed. Please try again."
      );
    }

    if (!data.id) {
      throw new GuestRegistrationError("Unexpected response from server.");
    }

    const id = data.id as string;
    setGuestId(id);
    setGuestName(name);
    localStorage.setItem(STORAGE_KEY_ID, id);
    localStorage.setItem(STORAGE_KEY_NAME, name);
    setIsModalOpen(false);
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