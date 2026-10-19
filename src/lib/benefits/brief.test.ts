import assert from "node:assert/strict";
import test from "node:test";
import { buildBrief } from "./brief.ts";
import { HOUSEHOLDS, type Profile } from "./model.ts";

function household(id: string): Profile {
  const found = HOUSEHOLDS.find((item) => item.id === id);
  if (!found) throw new Error(id);
  return found.profile;
}

function ids(profile: Profile): string[] {
  return buildBrief(profile).cards.map((item) => item.id);
}

test("the Georgia Guard loan is for that member, not a Navy family", () => {
  assert.ok(ids(household("guard-ga")).includes("gng-scl"));
  assert.equal(ids(household("navy-va")).includes("gng-scl"), false);
});

test("CalVet is a family waiver, and it does not appear for an active Navy household", () => {
  assert.ok(ids(household("vet-ca")).includes("calvet-waiver"));
  assert.equal(ids(household("navy-va")).includes("calvet-waiver"), false);
});

test("a drilling Texas Reserve household does not get Hazlewood", () => {
  const idsForTexas = ids(household("reserve-tx"));
  assert.equal(idsForTexas.includes("hazlewood"), false);
  assert.ok(idsForTexas.includes("trs"));
});

test("a federal employee health plan closes Reserve Select", () => {
  const brief = buildBrief({ ...household("reserve-tx"), federalJob: true });
  assert.equal(
    brief.cards.some((item) => item.id === "trs"),
    false,
  );
  assert.ok(brief.closed.some((door) => /Reserve Select/i.test(door.title)));
});

test("TRICARE For Life waits for Medicare or age 65", () => {
  assert.equal(ids(household("retired-fl")).includes("tfl"), false);
  assert.ok(ids({ ...household("retired-fl"), sponsorAge: "65-plus", medicare: "both" }).includes("tfl"));
});
