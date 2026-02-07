import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface EncryptedPersistOptions {
  name: string;
  partialize?: (state: unknown) => unknown;
  version?: number;
}

/**
 * Wraps Zustand persist middleware with a simple obfuscation layer.
 * In production, replace with AES-GCM encryption via Web Crypto API.
 */
export function createEncryptedPersist<T>(options: EncryptedPersistOptions) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return persist<T>(
    ((set: unknown, get: unknown, api: unknown) => ({})) as StateCreator<T>,
    {
      name: options.name,
      version: options.version ?? 1,
      storage: createJSONStorage(() => ({
        getItem: (name: string): string | null => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            const decoded = atob(raw);
            return decoded;
          } catch {
            return raw;
          }
        },
        setItem: (name: string, value: string): void => {
          const encoded = btoa(value);
          localStorage.setItem(name, encoded);
        },
        removeItem: (name: string): void => {
          localStorage.removeItem(name);
        },
      })),
    },
  );
}
