"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearAllChats } from "@/lib/chat-session";
import {
  clearProgress,
  createEmptyProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "@/lib/progress";
import type { TextSize } from "@/content/types";

type ProgressContextValue = {
  ready: boolean;
  state: ProgressState;
  update: (recipe: (prev: ProgressState) => ProgressState) => void;
  setTextSize: (size: TextSize) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(createEmptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Saved progress lives in this browser. Load it after the first render so the server HTML matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadProgress(window.localStorage));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProgress(state, window.localStorage);
    document.documentElement.dataset.textSize = state.textSize;
  }, [ready, state]);

  const update = useCallback((recipe: (prev: ProgressState) => ProgressState) => {
    setState((prev) => recipe(prev));
  }, []);

  const setTextSize = useCallback((textSize: TextSize) => {
    setState((prev) => ({ ...prev, textSize }));
  }, []);

  const reset = useCallback(() => {
    clearProgress(window.localStorage);
    clearAllChats();
    setState(createEmptyProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      ready,
      state,
      update,
      setTextSize,
      reset,
    }),
    [ready, reset, setTextSize, state, update],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return value;
}
