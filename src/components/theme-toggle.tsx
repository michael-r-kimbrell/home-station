import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "hs-theme";

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    applyTheme(next);
    localStorage.setItem(KEY, next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className={
        onDark
          ? "inline-flex min-h-11 items-center gap-2 rounded-full border border-cream/30 px-3 text-sm font-semibold text-cream"
          : "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink"
      }
    >
      {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}
