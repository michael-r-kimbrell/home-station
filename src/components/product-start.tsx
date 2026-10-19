import { CHECKED } from "@/lib/benefits/product";

export function ProductStart({ onStart, onSample }: { onStart: () => void; onSample: () => void }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4">
      <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">Home Station</p>
      <h1 className="mt-2 font-serif text-[2.65rem] leading-[1.02] text-ink">
        The benefits that fit this household. Nothing else.
      </h1>
      <p className="mt-3 max-w-xl text-lg text-pretty">
        Five questions. You get a brief that names the member, the spouse, and the children, and the official desk that
        actually enrolls them.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onStart} className="drive px-5 text-base">
          Build my brief
        </button>
        <button type="button" onClick={onSample} className="ghost px-5 text-base font-semibold text-ink">
          Try the Navy family
        </button>
      </div>
      <ol className="mt-6 grid gap-2 sm:grid-cols-3">
        <li className="panel p-4">
          <p className="font-serif text-2xl">1. Name the household</p>
          <p className="mt-1 text-sm text-pretty text-muted">Service, component, state, and who is on the record.</p>
        </li>
        <li className="panel p-4">
          <p className="font-serif text-2xl">2. Read the brief</p>
          <p className="mt-1 text-sm text-pretty text-muted">Open plans stay. Closed doors are named, not buried.</p>
        </li>
        <li className="panel p-4">
          <p className="font-serif text-2xl">3. Use the real desk</p>
          <p className="mt-1 text-sm text-pretty text-muted">milConnect, VA.gov, and the state page. This app does not enroll you.</p>
        </li>
      </ol>
      <p className="mt-4 text-sm text-pretty text-muted">
        Checked {CHECKED}. Answers stay on this phone. Confirm the official page before you enroll, decline, or pay.
      </p>
    </section>
  );
}
