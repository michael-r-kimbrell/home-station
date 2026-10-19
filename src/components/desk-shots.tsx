import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const DESK_SHOTS = [
  {
    src: "/guide/worksheet.jpg",
    alt: "The Home Station worksheet on a phone, asking who is filling it out.",
    caption: "Worksheet",
    detail: "Five menus. Nothing leaves the phone.",
  },
  {
    src: "/guide/brief.jpg",
    alt: "A brief naming the TRICARE region for the household on the worksheet.",
    caption: "Brief",
    detail: "Your contractor, then the doors that fit.",
  },
  {
    src: "/guide/lessons.jpg",
    alt: "The lessons list, with a DEERS briefing ready to open.",
    caption: "Lessons",
    detail: "A short briefing, then the official film.",
  },
  {
    src: "/guide/desks.jpg",
    alt: "The list of official desks, starting with milConnect and VA.gov.",
    caption: "Desks",
    detail: "Enrollment stays on the official site.",
  },
] as const;

export function DeskShots() {
  const [open, setOpen] = useState<(typeof DESK_SHOTS)[number] | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">The four rooms</p>
      <ul className="mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {DESK_SHOTS.map((shot) => (
          <li key={shot.src} className="w-40 shrink-0 snap-start">
            <button
              type="button"
              onClick={() => setOpen(shot)}
              className="panel block w-full overflow-hidden text-left"
            >
              <img src={shot.src} alt={shot.alt} className="h-52 w-full object-cover object-top" />
              <span className="block px-2 pt-2 text-sm font-semibold text-ink">{shot.caption}</span>
              <span className="block px-2 pb-2 text-sm text-pretty text-muted">{shot.detail}</span>
            </button>
          </li>
        ))}
      </ul>
      {open ? (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/70 p-3 sm:items-center" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
            className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-24px_rgba(16,38,28,0.7)]"
          >
            <div className="flex items-center justify-between gap-3 px-3 py-2">
              <p className="font-semibold">{open.caption}</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
                aria-label="Close screenshot"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <img src={open.src} alt={open.alt} className="min-h-0 w-full flex-1 object-contain object-top" />
            <p className="px-3 py-3 text-sm text-muted">{open.detail}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
