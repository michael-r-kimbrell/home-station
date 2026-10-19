import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { lessons } from "@/lib/benefits/library";
import { CHECKED } from "@/lib/benefits/product";
import { loadProfile } from "@/lib/benefits/storage";

const SERVICES = ["Army", "Navy", "Marine Corps", "Air Force", "Space Force", "Coast Guard"];

const COVERS: { name: string; detail: string }[] = [
  { name: "Health", detail: "TRICARE or VA care, by the status you actually hold." },
  { name: "Dental and vision", detail: "Separate enrollments. They are not included because medical is." },
  { name: "Life insurance", detail: "SGLI for the member, family coverage, and what replaces it after you leave." },
  { name: "Money", detail: "myPay, TSP, and the VA home loan. Not a bank, and not a rate quote." },
  { name: "School", detail: "The GI Bill, a benefit that was transferred, and the state rule where you live." },
];

const INTRO = lessons.find((lesson) => lesson.id === "new");

export function LandingPage() {
  const [hasBrief, setHasBrief] = useState(false);

  useEffect(() => {
    setHasBrief(Boolean(loadProfile()));
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="bg-field text-cream">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl border border-brass/70 bg-field-deep shadow-[inset_0_1px_0_rgba(214,184,112,0.35)]">
              <span className="font-serif text-lg leading-none">HS</span>
            </div>
            <p className="font-serif text-2xl leading-none tracking-tight">Home Station</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/desk" className="text-sm font-semibold text-cream/80 underline decoration-brass underline-offset-4">
              The desk
            </Link>
            <ThemeToggle onDark />
          </div>
        </div>
        <div className="h-px bg-brass/80" />
        <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-10">
          <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">For the force and the family</p>
          <h1 className="mt-3 max-w-xl font-serif text-[2.75rem] leading-[1.02]">
            The benefits that fit this household. Nothing else.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-pretty text-cream/80">
            Five questions. A brief that names the member, the spouse, and the children. Then the official desk that
            actually enrolls them.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/desk" className="drive inline-flex items-center justify-center px-5 text-base">
              Start
            </Link>
            <Link
              to="/desk"
              search={{ sample: "navy-va" }}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-cream/25 px-5 text-base font-semibold text-cream"
            >
              Try the Navy family
            </Link>
          </div>
          {hasBrief ? (
            <Link to="/desk" className="mt-3 inline-flex text-sm font-semibold text-cream underline decoration-brass underline-offset-4">
              Open your brief
            </Link>
          ) : null}
          <p className="mt-4 text-sm text-pretty text-cream/65">
            Checked {CHECKED}. Answers stay on this phone. This does not enroll you.
          </p>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-3xl px-4 pt-8">
          <h2 className="font-serif text-3xl">Start with the rule that trips people</h2>
          <p className="mt-2 max-w-xl text-pretty text-muted">
            {INTRO?.videoTitle ?? "A short TRICARE video"}. Home Station does not host it. TRICARE does.
          </p>
          <div className="panel mt-4 overflow-hidden">
            <div className="aspect-video bg-ink">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${INTRO?.videoId ?? "UAZnFA_VM8c"}?rel=0`}
                title={INTRO?.videoTitle ?? "TRICARE: how to navigate as a new enrollee"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-3xl px-4 py-8">
          <h2 className="font-serif text-3xl">Who it is for</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SERVICES.map((name) => (
              <li key={name} className="rounded-full border border-line bg-sheet px-3 py-1 text-sm font-semibold">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-xl text-pretty text-muted">
            Active duty, National Guard, Reserve, retirees, veterans, and surviving family. A benefit for the member is
            not offered to a spouse. A waiver for a child is not offered to the member.
          </p>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 pb-4">
          <h2 className="font-serif text-3xl">What you leave with</h2>
          <ol className="mt-4 grid gap-2">
            <li className="panel p-4">
              <p className="font-serif text-2xl">A brief for this household</p>
              <p className="mt-1 text-sm text-pretty text-muted">
                Open plans stay. Closed doors are named, with the reason, so you do not apply for something that was
                never yours.
              </p>
            </li>
            <li className="panel p-4">
              <p className="font-serif text-2xl">The person each benefit covers</p>
              <p className="mt-1 text-sm text-pretty text-muted">
                Member, spouse, child, or young adult. The label is on the card.
              </p>
            </li>
            <li className="panel p-4">
              <p className="font-serif text-2xl">The desk that does the work</p>
              <p className="mt-1 text-sm text-pretty text-muted">
                milConnect, TRICARE, VA.gov, and the state page. Home Station stops at the door.
              </p>
            </li>
          </ol>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 py-6">
          <h2 className="font-serif text-3xl">What the brief can cover</h2>
          <ul className="mt-4 grid gap-2">
            {COVERS.map((item) => (
              <li key={item.name} className="panel p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-pretty text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 pb-8">
          <div className="overflow-hidden rounded-2xl bg-field text-cream shadow-[0_22px_40px_-28px_rgba(16,38,28,0.9)]">
            <div className="h-px bg-brass" />
            <div className="p-5">
              <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">State tuition</p>
              <h2 className="mt-2 font-serif text-3xl">Your state is not the next state's.</h2>
              <p className="mt-2 text-pretty text-cream/80">
                A few states have a program this desk has read, and each one says who may use it. Every other state
                starts at that state's veterans office. No row is not a no.
              </p>
              <Link
                to="/desk"
                className="mt-5 inline-flex min-h-12 items-center font-semibold text-cream underline decoration-brass underline-offset-4"
              >
                {hasBrief ? "Open your brief" : "Start"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pt-2 pb-10 text-sm text-pretty text-muted">
        Study guide only. Not TRICARE, VA, or a bank. Rules and premiums move. Confirm the official page before you
        enroll, decline coverage, or pay.
      </footer>
    </div>
  );
}
