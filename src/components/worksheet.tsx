import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SelectField, YesNo } from "@/components/fields";
import {
  AGES,
  BRANCHES,
  HOUSEHOLDS,
  MEDICARE_OPTIONS,
  PLACES,
  RATINGS,
  ROLES,
  STATUS_OPTIONS,
  SURVIVOR_OPTIONS,
  type Profile,
  type Transition,
  showTransition,
  transitionOptions,
} from "@/lib/benefits/model";

const STEPS = ["Who you are", "The service", "Where you live", "The household", "What changes the answer"];

export function Worksheet({
  draft,
  onChange,
  onSubmit,
  onSample,
}: {
  draft: Profile;
  onChange: (next: Profile) => void;
  onSubmit: () => void;
  onSample: (next: Profile) => void;
}) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [sampleId, setSampleId] = useState(HOUSEHOLDS[0].id);
  const status = draft.role === "survivor" ? "survivor" : draft.status;
  const transitions = transitionOptions(status === "survivor" ? "veteran" : status);

  function patch(partial: Partial<Profile>) {
    setError("");
    onChange({ ...draft, ...partial });
  }

  function next() {
    if (step === 2 && !draft.place) {
      setError("Pick a state, a territory, or overseas.");
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (!draft.place) {
      setError("Pick a state, a territory, or overseas.");
      setStep(2);
      return;
    }
    onSubmit();
  }

  return (
    <section className="panel p-4 pb-5">
      <p className="text-sm font-semibold tracking-[0.16em] text-brass uppercase">Route</p>
      <h2 className="mt-1 font-serif text-3xl text-ink">Household worksheet</h2>
      <p className="mt-2 text-pretty text-muted">
        Five stations. No Social Security number, no medical record, nothing leaves this browser.
      </p>
      <ol className="mt-5 flex gap-1.5" aria-label="Progress">
        {STEPS.map((label, index) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(index)}
              className="group min-h-11 w-full"
              aria-current={index === step ? "step" : undefined}
            >
              <span
                className={
                  index <= step ? "block h-1.5 rounded-full bg-field" : "block h-1.5 rounded-full bg-line"
                }
              />
              <span className={index === step ? "mt-2 block text-xs font-semibold text-field" : "mt-2 block text-xs text-muted"}>
                {index + 1}
                <span className="sr-only">{label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm font-semibold tracking-[0.16em] text-brass uppercase">
        Station {step + 1} of {STEPS.length}
      </p>
      <h3 className="font-serif text-2xl text-ink">{STEPS[step]}</h3>

      <div className="mt-4 grid gap-4">
        {step === 0 ? (
          <SelectField
            label="Who is filling this out?"
            hint="The brief uses this to label plans as yours, the sponsor's, or a child's."
            value={draft.role}
            onChange={(event) => patch({ role: event.target.value as Profile["role"] })}
          >
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </SelectField>
        ) : null}

        {step === 1 ? (
          <>
            {draft.role === "survivor" ? (
              <SelectField
                label="How did the sponsor's service end?"
                value={draft.survivorKind}
                onChange={(event) =>
                  patch({ survivorKind: event.target.value as Profile["survivorKind"] })
                }
              >
                {SURVIVOR_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
            ) : (
              <SelectField
                label="Sponsor status"
                hint="Long orders means more than 30 consecutive days. A drill weekend is not long orders."
                value={draft.status === "survivor" ? "veteran" : draft.status}
                onChange={(event) => {
                  const next = event.target.value as Profile["status"];
                  const options = transitionOptions(next);
                  const transition = options.some((option) => option.id === draft.transition)
                    ? draft.transition
                    : options[0].id;
                  patch({ status: next, transition });
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
            )}
            <SelectField
              label="Branch"
              value={draft.branch}
              onChange={(event) => patch({ branch: event.target.value as Profile["branch"] })}
            >
              {BRANCHES.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.label}
                </option>
              ))}
            </SelectField>
          </>
        ) : null}

        {step === 2 ? (
          <SelectField
            label="Where does the household live now?"
            hint="This picks the TRICARE contractor. Arkansas, Indiana, Missouri, and Wisconsin are split by ZIP. The brief will not guess those."
            value={draft.place}
            onChange={(event) => patch({ place: event.target.value as Profile["place"] })}
          >
            <option value="">Select a state or territory</option>
            {PLACES.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label}
              </option>
            ))}
          </SelectField>
        ) : null}

        {step === 3 ? (
          <>
            {draft.role === "spouse" ? (
              <p className="border border-line bg-tint p-3 text-sm text-ink">
                You are the spouse, so spouse coverage stays on.
              </p>
            ) : (
              <YesNo
                label="Is there a spouse who needs coverage?"
                value={draft.spouse}
                onChange={(spouse) => patch({ spouse })}
              />
            )}
            <YesNo
              label="Children under 21?"
              value={draft.kidsUnder21}
              onChange={(kidsUnder21) => patch({ kidsUnder21 })}
            />
            <YesNo
              label="Full-time students ages 21 to 23?"
              hint="They can sometimes stay on regular TRICARE if the sponsor supports them and DEERS is updated."
              value={draft.students21to23}
              onChange={(students21to23) => patch({ students21to23 })}
            />
            <YesNo
              label="Unmarried young adults, 21 to 26, who need their own plan?"
              value={draft.youngAdults}
              onChange={(youngAdults) => patch({ youngAdults })}
            />
            <YesNo
              label="A child who cannot support themselves because of a disability that started while they were eligible?"
              value={draft.incapacitatedChild}
              onChange={(incapacitatedChild) => patch({ incapacitatedChild })}
            />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <SelectField
              label="Sponsor's age"
              value={draft.sponsorAge}
              onChange={(event) => patch({ sponsorAge: event.target.value as Profile["sponsorAge"] })}
            >
              {AGES.map((age) => (
                <option key={age.id} value={age.id}>
                  {age.label}
                </option>
              ))}
            </SelectField>
            {draft.spouse || draft.role === "spouse" ? (
              <SelectField
                label={draft.role === "spouse" ? "Your age" : "Spouse's age"}
                value={draft.spouseAge}
                onChange={(event) => patch({ spouseAge: event.target.value as Profile["spouseAge"] })}
              >
                {AGES.map((age) => (
                  <option key={age.id} value={age.id}>
                    {age.label}
                  </option>
                ))}
              </SelectField>
            ) : null}
            {draft.role !== "survivor" ? (
              <SelectField
                label="VA disability rating"
                value={draft.rating}
                onChange={(event) => patch({ rating: event.target.value as Profile["rating"] })}
              >
                {RATINGS.map((rating) => (
                  <option key={rating.id} value={rating.id}>
                    {rating.label}
                  </option>
                ))}
              </SelectField>
            ) : null}
            <SelectField
              label="Medicare"
              value={draft.medicare}
              onChange={(event) => patch({ medicare: event.target.value as Profile["medicare"] })}
            >
              {MEDICARE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            {showTransition(status) ? (
              <SelectField
                label="How recent was the last active duty?"
                value={draft.transition}
                onChange={(event) => patch({ transition: event.target.value as Transition })}
              >
                {transitions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
            ) : null}
            <YesNo
              label="Can the sponsor get a federal employee health plan (FEHB)?"
              hint="Dual-status technicians usually can. That blocks TRICARE Reserve Select."
              value={draft.federalJob}
              onChange={(federalJob) => patch({ federalJob })}
            />
            <YesNo
              label="Has the sponsor received a VA Specially Adapted Housing grant?"
              hint="This is the grant for a seriously disabled veteran's home, not a regular VA mortgage."
              value={draft.sah}
              onChange={(sah) => patch({ sah })}
            />
          </>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 border border-line bg-warn-bg p-3 text-sm text-warn" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="ghost inline-flex min-h-12 flex-1 items-center justify-center gap-2 px-3 text-base font-semibold text-ink disabled:opacity-40"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={next}
          data-testid="build-brief"
          className="drive inline-flex flex-[2] items-center justify-center gap-2 px-3 text-base"
        >
          {step === STEPS.length - 1 ? "Build my brief" : "Continue"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6">
        <SelectField
          label="Or open a sample household"
          hint="Samples are not your record. They show how the same desk reads a different service, state, and family."
          value={sampleId}
          onChange={(event) => setSampleId(event.target.value)}
        >
          {HOUSEHOLDS.map((household) => (
            <option key={household.id} value={household.id}>
              {household.label}
            </option>
          ))}
        </SelectField>
        <button
          type="button"
          onClick={() => {
            const household = HOUSEHOLDS.find((item) => item.id === sampleId) ?? HOUSEHOLDS[0];
            onSample(household.profile);
          }}
          className="mt-3 min-h-12 w-full rounded-2xl px-3 text-base font-semibold text-field underline decoration-brass underline-offset-4"
        >
          Open this sample brief
        </button>
      </div>
    </section>
  );
}
