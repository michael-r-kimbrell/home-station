import { useMemo, useState } from "react";
import { Copy, ExternalLink, Printer } from "lucide-react";
import { SelectField } from "@/components/fields";
import { COMPARE, buildBrief } from "@/lib/benefits/brief";
import { CATEGORY_LABEL } from "@/lib/benefits/library";
import {
  type Category,
  type Profile,
  type Who,
  checklist,
  demoNote,
  lede,
  peopleLabels,
  personOn,
  placeLabel,
  regionFor,
  statusLabel,
  thisWeek,
} from "@/lib/benefits/model";

const CATEGORIES: Category[] = ["medical", "dental", "vision", "life", "money", "training"];

export function BriefView({
  profile,
  onEdit,
  onClear,
}: {
  profile: Profile;
  onEdit: () => void;
  onClear: () => void;
}) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [person, setPerson] = useState<Who | "all">("all");
  const [copied, setCopied] = useState(false);
  const brief = useMemo(() => buildBrief(profile), [profile]);
  const labels = peopleLabels(profile.role);
  const region = regionFor(profile.place);
  const demo = demoNote(profile.place);
  const people = (Object.keys(labels) as Who[]).filter((who) => personOn(profile, who));
  const visible = brief.cards.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (person !== "all" && !item.who.includes(person)) return false;
    if (person !== "all" && !personOn(profile, person)) return false;
    return true;
  });
  const week = thisWeek(profile);
  const compare = COMPARE.filter((row) => brief.cards.some((item) => item.id === row.id));

  function copyWeek() {
    const text = [
      "Home Station, this week",
      statusLabel(profile.status) + (profile.place ? ` · ${placeLabel(profile.place)}` : ""),
      "",
      ...week.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Study guide only. Confirm on the official site before you enroll or pay.",
    ].join("\n");
    void navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false),
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">Your brief</p>
      <h2 className="mt-1 font-serif text-4xl text-ink">
        {profile.role === "sponsor" ? "Read this as the sponsor" : "Read this for your household"}
      </h2>
      <p className="mt-2 text-pretty text-ink">{lede(profile)}</p>
      <p className="mt-2 text-sm text-muted">
        {statusLabel(profile.status)}
        {profile.place ? ` · ${placeLabel(profile.place)}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="no-print ghost px-4 text-sm font-semibold text-ink"
        >
          Edit answers
        </button>
        <button
          type="button"
          onClick={onClear}
          className="no-print min-h-11 px-4 text-sm font-semibold text-muted underline"
        >
          Clear worksheet
        </button>
        <button
          type="button"
          onClick={copyWeek}
          className="no-print ghost inline-flex items-center gap-2 px-4 text-sm font-semibold text-ink"
        >
          <Copy className="size-4" aria-hidden="true" />
          {copied ? "Copied" : "Copy this week"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print ghost inline-flex items-center gap-2 px-4 text-sm font-semibold text-ink"
        >
          <Printer className="size-4" aria-hidden="true" />
          Print
        </button>
      </div>

      <article className="mt-6 overflow-hidden rounded-2xl bg-field text-paper shadow-[0_22px_40px_-28px_rgba(16,38,28,0.9)]">
        <div className="h-px bg-brass" />
        <div className="p-5">
        <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">Region</p>
        <h3 className="mt-1 font-serif text-3xl">{region.title}</h3>
        <p className="mt-2 text-pretty text-paper">{region.detail}</p>
        <ul className="mt-3 grid gap-2">
          {region.contacts.map((contact) => (
            <li key={contact.name} className="flex flex-wrap items-baseline justify-between gap-2 border-t border-field-deep pt-2">
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                {contact.name}
              </a>
              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/[^\d]/g, "")}`} className="tabular-nums underline">
                  {contact.phone}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        {demo ? <p className="mt-3 rounded-xl bg-field-deep p-3 text-sm text-pretty">{demo}</p> : null}
        </div>
      </article>

      <div className="mt-6">
        <h3 className="font-serif text-2xl text-ink">This week</h3>
        <ol className="mt-3 grid gap-2">
          {week.map((item, index) => (
            <li key={item} className="panel flex gap-3 p-4">
              <span className="font-serif text-2xl text-brass tabular-nums">{index + 1}</span>
              <p className="text-pretty">{item}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel mt-6 bg-tint p-4">
        <h3 className="font-serif text-xl text-ink">Before you call anyone</h3>
        <ul className="mt-2 grid gap-2">
          {checklist(profile).map((item) => (
            <li key={item} className="text-pretty text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {compare.length > 1 ? (
        <div className="mt-6">
          <h3 className="font-serif text-2xl text-ink">How the medical plans differ</h3>
          <p className="mt-1 text-sm text-muted">None of these include routine adult dental.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {compare.map((row) => (
              <li key={row.id} className="panel p-4">
                <p className="font-semibold text-field">{row.title}</p>
                <ul className="mt-2 grid gap-1 text-sm">
                  {row.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SelectField
          label="Show"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category | "all")}
        >
          <option value="all">Every door ({brief.cards.length})</option>
          {CATEGORIES.map((id) => {
            const count = brief.cards.filter((item) => item.category === id).length;
            if (!count) return null;
            return (
              <option key={id} value={id}>
                {CATEGORY_LABEL[id]} ({count})
              </option>
            );
          })}
        </SelectField>
        <SelectField
          label="For whom"
          value={person}
          onChange={(event) => setPerson(event.target.value as Who | "all")}
        >
          <option value="all">Whole household</option>
          {people.map((who) => (
            <option key={who} value={who}>
              {labels[who]}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {people.map((who) => {
          const count = brief.cards.filter((item) => item.who.includes(who)).length;
          return (
            <button
              key={who}
              type="button"
              onClick={() => setPerson(who)}
              className={
                person === who
                  ? "min-h-11 rounded-full bg-field px-3 text-sm font-semibold text-paper"
                  : "ghost px-3 text-sm font-semibold text-ink"
              }
            >
              {labels[who]} · {count}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        {visible.length === 0 ? (
          <p className="panel p-4 text-pretty">
            Nothing in this filter. Switch back to the whole household.
          </p>
        ) : null}
        {CATEGORIES.map((id) => {
          const group = visible.filter((item) => item.category === id);
          if (!group.length) return null;
          return (
            <div key={id}>
              <h3 className="font-serif text-2xl text-ink">{CATEGORY_LABEL[id]}</h3>
              <div className="mt-3 grid gap-3">
                {group.map((item) => (
                  <article key={item.id} className="panel border-l-2 border-l-brass p-4">
                    <div className="flex flex-wrap gap-2">
                      {item.who
                        .filter((who) => personOn(profile, who))
                        .map((who) => (
                          <span key={who} className="rounded-full bg-tint px-2.5 py-1 text-sm font-semibold text-field">
                            {labels[who]}
                          </span>
                        ))}
                    </div>
                    <h4 className="mt-3 font-serif text-2xl text-ink">{item.title}</h4>
                    <p className="mt-2 text-pretty">{item.dek}</p>
                    <p className="mt-3 text-sm text-pretty text-muted">
                      <span className="font-semibold text-ink">Why it is here. </span>
                      {item.why}
                    </p>
                    <p className="mt-2 text-sm text-pretty">
                      <span className="font-semibold">Cost. </span>
                      {item.cost}
                    </p>
                    {item.warning ? (
                      <p className="mt-3 rounded-xl border border-line bg-warn-bg p-3 text-sm text-pretty text-warn">
                        {item.warning}
                      </p>
                    ) : null}
                    <ol className="mt-3 grid gap-2">
                      {item.steps.map((step, index) => (
                        <li key={step} className="flex gap-2 text-sm text-pretty">
                          <span className="font-semibold text-brass tabular-nums">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <ul className="mt-3 flex flex-col gap-1">
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-1 font-semibold text-field underline"
                          >
                            {link.label}
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {brief.closed.length ? (
        <div className="mt-8">
          <h3 className="font-serif text-2xl text-ink">Closed doors</h3>
          <p className="mt-1 text-sm text-muted">These are listed so you do not spend a month chasing them.</p>
          <ul className="mt-3 grid gap-2">
            {brief.closed.map((door) => (
              <li key={door.title} className="panel p-4">
                <p className="font-semibold">{door.title}</p>
                <p className="mt-1 text-sm text-pretty text-muted">{door.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
