import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.8rem] font-semibold tracking-wide text-ink uppercase">{label}</span>
      {hint ? <span className="mb-2 block text-sm text-muted">{hint}</span> : null}
      {children}
    </label>
  );
}

export function SelectField({
  label,
  hint,
  children,
  ...props
}: {
  label: string;
  hint?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} hint={hint}>
      <span className="relative block">
        <select
          {...props}
          className="min-h-14 w-full appearance-none rounded-2xl border border-line bg-sheet px-4 pr-11 text-base text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </span>
    </Field>
  );
}

export function YesNo({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-[0.8rem] font-semibold tracking-wide text-ink uppercase">{label}</legend>
      {hint ? <p className="mb-2 text-sm text-muted">{hint}</p> : null}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-paper p-1">
        {[
          { on: true, text: "Yes" },
          { on: false, text: "No" },
        ].map((option) => {
          const selected = value === option.on;
          return (
            <button
              key={option.text}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.on)}
              className={
                selected
                  ? "min-h-12 rounded-xl bg-field text-base font-semibold text-paper shadow-[inset_0_1px_0_rgba(214,184,112,0.4)]"
                  : "min-h-12 rounded-xl text-base font-semibold text-muted"
              }
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
