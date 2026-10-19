import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SelectField } from "@/components/fields";
import { PLACES, placeLabel } from "@/lib/benefits/model";
import { stateDirectory } from "@/lib/benefits/states";

const FORCE = ["Army", "Navy", "Marine Corps", "Air Force", "Space Force", "Coast Guard"];

const COMPONENTS = [
  "Active duty",
  "National Guard, drilling",
  "Reserve, drilling",
  "Guard or Reserve on orders",
  "Retired",
  "Veteran",
  "Surviving family",
];

const FEDERAL: { name: string; who: string }[] = [
  { name: "TRICARE Prime or Select", who: "Member and family on DEERS, when the status allows it" },
  { name: "TRICARE Reserve Select", who: "Drilling member and family. A federal employee plan usually blocks it" },
  { name: "VA health care", who: "The veteran. The family is not automatically enrolled" },
  { name: "CHAMPVA", who: "Family only, and only when they are not TRICARE-eligible" },
  { name: "TRICARE Dental", who: "Active-duty family and Selected Reserve. A separate enrollment" },
  { name: "FEDVIP dental and vision", who: "Retirees, and some others. Not the drilling family dental plan" },
  { name: "SGLI", who: "The member" },
  { name: "Family SGLI", who: "Spouse and children" },
  { name: "VGLI", who: "The member, after leaving. It does not start by itself" },
  { name: "GI Bill", who: "The member. Family only if it was transferred while the member was still serving" },
  { name: "Chapter 35", who: "Spouse and children of a total rating, or certain deaths" },
  { name: "MyCAA", who: "A spouse, and only in certain pay grades" },
];

export function MapView() {
  const directory = useMemo(() => stateDirectory(), []);
  const places = useMemo(() => Array.from(new Set(directory.map((item) => item.place))), [directory]);
  const [place, setPlace] = useState("all");
  const shown = directory.filter((item) => place === "all" || item.place === place);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-2">
      <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">The map</p>
      <h1 className="mt-2 font-serif text-[2.65rem] leading-[1.05] text-ink">The whole force, and only the people the rule names.</h1>
      <p className="mt-3 max-w-xl text-pretty text-lg">
        One household at a time. A benefit for the member is not offered to a spouse. A waiver for a child is not
        offered to the member. State tuition is state law.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-serif text-2xl">Services</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {FORCE.map((name) => (
              <li key={name} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-semibold">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-pretty text-muted">
            Coast Guard is here because TRICARE and SGLI cover that service.
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-serif text-2xl">Components</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {COMPONENTS.map((name) => (
              <li key={name} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mt-8 font-serif text-3xl">Federal benefits, by person</h2>
      <ul className="mt-3 grid gap-2">
        {FEDERAL.map((item) => (
          <li key={item.name} className="panel p-4">
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-pretty text-muted">{item.who}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-serif text-3xl">State tuition this desk has read</h2>
      <p className="mt-2 text-pretty text-muted">
        Eight states so far. Every other state still has a veterans office. No row here is not a no.
      </p>
      <div className="mt-3">
        <SelectField label="State" value={place} onChange={(event) => setPlace(event.target.value)}>
          <option value="all">All named states</option>
          {places.map((id) => (
            <option key={id} value={id}>
              {placeLabel(id as (typeof PLACES)[number]["id"])}
            </option>
          ))}
        </SelectField>
      </div>
      <ul className="mt-3 grid gap-2">
        {shown.map((item) => (
          <li key={item.title} className="panel border-l-2 border-l-brass p-4">
            <p className="text-sm font-semibold text-brass">{placeLabel(item.place as (typeof PLACES)[number]["id"])}</p>
            <h3 className="mt-1 font-serif text-2xl">{item.title}</h3>
            <p className="mt-1 text-sm font-semibold text-field">{item.who}</p>
            <p className="mt-2 text-sm text-pretty text-muted">{item.note}</p>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-1 font-semibold text-field underline"
            >
              Official page
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-pretty text-muted">
        The other states start at the{" "}
        <a
          className="font-semibold text-field underline"
          href="https://department.va.gov/about/state-departments-of-veterans-affairs/"
        >
          state veterans affairs directory
        </a>
        . Do not use another state's rule.
      </p>
    </section>
  );
}
