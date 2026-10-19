import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { desks, type Desk } from "@/lib/benefits/library";

export function DesksView({ extras }: { extras: Desk[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const groups = ["All", ...Array.from(new Set([...extras, ...desks].map((desk) => desk.group)))];
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...extras, ...desks].filter((desk) => {
      if (group !== "All" && desk.group !== group) return false;
      if (!needle) return true;
      return `${desk.name} ${desk.note} ${desk.group}`.toLowerCase().includes(needle);
    });
  }, [extras, group, query]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <p className="text-sm font-semibold tracking-wide text-brass uppercase">Official desks</p>
      <h2 className="mt-1 font-serif text-3xl text-ink">Go to the counter that can actually enroll you</h2>
      <p className="mt-2 text-pretty text-muted">
        Home Station does not take enrollment. These are the sites that do. A state tuition desk shows up here only
        when the worksheet names a state and that program fits the household.
      </p>
      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-semibold">Search the desks</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Dental, SGLI, GI Bill"
          className="min-h-14 w-full rounded-2xl border border-line bg-sheet px-4 text-base text-ink"
        />
      </label>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {groups.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGroup(item)}
            className={
              group === item
                ? "min-h-11 shrink-0 rounded-full bg-field px-3 text-sm font-semibold text-cream"
                : "ghost shrink-0 px-3 text-sm font-semibold text-ink"
            }
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-2">
        {shown.map((desk) => (
          <li key={desk.href}>
            <a
              href={desk.href}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex min-h-11 items-start justify-between gap-3 p-4"
            >
              <span>
                <span className="block text-sm font-semibold text-brass">{desk.group}</span>
                <span className="mt-1 block font-semibold text-ink">{desk.name}</span>
                <span className="mt-1 block text-sm text-pretty text-muted">{desk.note}</span>
              </span>
              <ExternalLink className="mt-1 size-4 shrink-0 text-field" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      {shown.length === 0 ? <p className="mt-4 text-sm">No desk matches that search.</p> : null}
    </section>
  );
}
