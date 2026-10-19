import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Landmark, Map, ScrollText } from "lucide-react";
import { BriefView } from "@/components/brief-view";
import { DeskShots } from "@/components/desk-shots";
import { DesksView } from "@/components/desks-view";
import { LearnView } from "@/components/learn-view";
import { MapView } from "@/components/map-view";
import { Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Worksheet } from "@/components/worksheet";
import {
  type Profile,
  HOUSEHOLDS,
  emptyProfile,
  normalize,
} from "@/lib/benefits/model";
import { CHECKED } from "@/lib/benefits/product";
import { clearProfile, loadProfile, saveProfile } from "@/lib/benefits/storage";
import { stateDesks } from "@/lib/benefits/states";

type Tab = "worksheet" | "brief" | "learn" | "desks";

const TABS: { id: Tab; label: string; icon: typeof Map }[] = [
  { id: "worksheet", label: "Map", icon: Map },
  { id: "brief", label: "Brief", icon: ScrollText },
  { id: "learn", label: "Lessons", icon: BookOpen },
  { id: "desks", label: "Desks", icon: Landmark },
];

export function HomeStation({ sampleId = "" }: { sampleId?: string }) {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("worksheet");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile>(emptyProfile());

  useEffect(() => {
    const sample = HOUSEHOLDS.find((item) => item.id === sampleId);
    if (sample) {
      const normalized = normalize(sample.profile);
      saveProfile(normalized);
      setProfile(normalized);
      setDraft(normalized);
      setTab("brief");
      setReady(true);
      return;
    }
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      setDraft(saved);
      setTab("brief");
    }
    setReady(true);
  }, [sampleId]);

  function commit(next: Profile) {
    const normalized = normalize(next);
    if (!normalized.place) return;
    saveProfile(normalized);
    setProfile(normalized);
    setDraft(normalized);
    setTab("brief");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function useSample(next: Profile) {
    commit(next);
  }

  function wipe() {
    clearProfile();
    setProfile(null);
    setDraft(emptyProfile());
    setTab("worksheet");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#desk"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-field focus:px-3 focus:py-2 focus:text-cream"
      >
        Skip to the desk
      </a>
      <header className="bg-field text-cream">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl border border-brass/70 bg-field-deep shadow-[inset_0_1px_0_rgba(214,184,112,0.35)]">
            <span className="font-serif text-lg leading-none">HS</span>
          </div>
          <div>
            <Link to="/" className="font-serif text-[1.7rem] leading-none tracking-tight">
              Home Station
            </Link>
            <p className="mt-1 text-sm text-cream/75">The benefits desk for the force and the family</p>
          </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/?install=1&platform=ios"
              className="inline-flex min-h-11 items-center gap-1 rounded-full bg-cream px-3 text-sm font-semibold text-field"
            >
              <Smartphone className="size-4" aria-hidden="true" />
              Add to iPhone
            </a>
            <ThemeToggle onDark />
          </div>
        </div>
        <div className="h-px bg-brass/80" />
        <nav className="mx-auto hidden w-full max-w-3xl gap-1 px-3 py-2 md:flex" aria-label="Sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? "min-h-11 rounded-xl bg-cream px-4 text-sm font-semibold text-field"
                  : "min-h-11 rounded-xl px-4 text-sm font-semibold text-cream/80"
              }
              aria-current={tab === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <p className="mx-auto w-full max-w-3xl px-4 py-2 text-xs text-pretty text-cream/70">
          Study guide only. Not TRICARE, VA, or a bank. Confirm the official page before you enroll, decline, or pay.
        </p>
      </header>

      <main id="desk" className="pt-6">
        {!ready ? <p className="px-4 py-8 text-muted">Opening the desk.</p> : null}
        {ready && tab === "worksheet" ? (
          <>
            <div id="worksheet" className="mx-auto w-full max-w-3xl scroll-mt-6 px-4">
              <Worksheet draft={draft} onChange={setDraft} onSubmit={() => commit(draft)} onSample={useSample} />
            </div>
            <div className="mt-10">
              <MapView />
            </div>
            <div className="mx-auto mt-8 w-full max-w-3xl px-4">
              <DeskShots />
            </div>
          </>
        ) : null}
        {ready && tab === "brief" ? (
          profile ? (
            <BriefView
              profile={profile}
              onEdit={() => {
                setDraft(profile);
                setTab("worksheet");
              }}
              onClear={wipe}
            />
          ) : (
            <section className="mx-auto w-full max-w-3xl px-4 pb-8">
              <h2 className="font-serif text-3xl">No brief yet</h2>
              <p className="mt-2 text-pretty text-muted">Finish the worksheet and the plans that fit this household will land here.</p>
              <button
                type="button"
                onClick={() => setTab("worksheet")}
                className="mt-4 drive px-5"
              >
                Start the worksheet
              </button>
            </section>
          )
        ) : null}
        {ready && tab === "learn" ? <LearnView /> : null}
        {ready && tab === "desks" ? <DesksView extras={profile ? stateDesks(profile) : []} /> : null}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pt-6 pb-36 text-sm text-pretty text-muted md:pb-12">
        Notes checked against TRICARE.mil and VA.gov in {CHECKED}. When a dollar figure is shown, it is the one
        those pages were publishing, and the link is on the card. The worksheet stays in this browser.
      </footer>

      <nav
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 grid grid-cols-4 rounded-2xl border border-line bg-sheet/95 p-1 shadow-[0_18px_40px_-22px_rgba(16,38,28,0.65)] backdrop-blur-md md:hidden"
        aria-label="Sections"
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const on = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                on
                  ? "min-h-14 rounded-xl bg-field text-cream shadow-[inset_0_1px_0_rgba(214,184,112,0.4)]"
                  : "min-h-14 rounded-xl text-muted"
              }
              aria-current={on ? "page" : undefined}
            >
              <Icon className="mx-auto size-5" aria-hidden="true" />
              <span className="mt-0.5 block text-[11px] font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
