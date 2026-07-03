import { useEffect, useState } from "react";
import type { Theme } from "../types";

const STORAGE_KEY = "facio:theme";

function isInsideIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getUrlTheme(): Theme | null {
  const param = new URLSearchParams(window.location.search).get("theme");
  if (param === "light" || param === "dark") return param;
  return null;
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const urlTheme = getUrlTheme();
  if (urlTheme) return urlTheme;
  if (isInsideIframe()) return getSystemTheme();
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    if (!isInsideIframe()) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  // dentro do iframe, acompanha mudanças de tema do sistema em tempo real
  useEffect(() => {
    if (!isInsideIframe()) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle };
}
