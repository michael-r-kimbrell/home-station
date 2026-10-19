import {
  type Card,
  type ClosedDoor,
  type Profile,
  type Who,
  USFHP_NOTE,
  branchLabel,
  isServing,
  personOn,
  placeLabel,
  sponsorMedicare,
  spouseMedicare,
  tricareFamilyStatus,
} from "@/lib/benefits/model";
import { hasStateProgram, stateCards } from "@/lib/benefits/states";

export interface Brief {
  cards: Card[];
  closed: ClosedDoor[];
}

function card(partial: Card): Card {
  return partial;
}

function servingFamily(p: Profile): boolean {
  return p.status === "active" || p.status === "activated";
}

function retireeUnder65(p: Profile): boolean {
  return p.status === "retired" && p.sponsorAge !== "65-plus" && !sponsorMedicare(p);
}

function retireeLike(p: Profile): boolean {
  if (p.status === "retired") return true;
  if (p.status === "survivor" && (p.survivorKind === "died-retiree" || p.survivorKind === "died-active")) return true;
  return false;
}

function selectedReserve(p: Profile): boolean {
  return p.status === "guard" || p.status === "reserve";
}

function usfhpEligible(p: Profile): boolean {
  if (!p.place || !USFHP_NOTE[p.place]) return false;
  if (p.status === "retired") return true;
  if (p.status === "survivor" && p.survivorKind !== "died-veteran") return true;
  if (p.status === "activated") return true;
  if (selectedReserve(p) && p.transition === "within-180") return true;
  if (p.status === "active") return true;
  return false;
}

export function allCards(p: Profile): Card[] {
  const cards: Card[] = [];
  const where = p.place ? placeLabel(p.place) : "your address";

  cards.push(
    card({
      id: "deers",
      category: "medical",
      title: "DEERS comes before every plan",
      dek: "Defense Enrollment Eligibility Reporting System is the list TRICARE, the ID card office, and the regional contractor all trust.",
      who: ["sponsor", "spouse", "child", "young"],
      why: "Nothing in this brief pays a claim for a person who is missing or listed at the wrong address.",
      cost: "Free. The cost of skipping it is denied claims.",
      steps: [
        "Sign in to milConnect with a CAC, DS Logon, or the current approved sign-in.",
        "Check the sponsor and every dependent. Read the residential address out loud.",
        "Add a marriage, a birth, or a divorce with the document the office asks for. A hospital bracelet is not the enrollment.",
        p.kidsUnder21
          ? "For a newborn, plan on a short window, commonly 90 days in the United States and 120 overseas. Confirm the number on TRICARE when the child is born."
          : "If the household changes, update DEERS before you change plans.",
      ],
      links: [
        { label: "milConnect", href: "https://milconnect.dmdc.osd.mil/" },
        { label: "DEERS on TRICARE", href: "https://www.tricare.mil/Plans/Eligibility/DEERS" },
      ],
    }),
  );

  if (p.status === "active" || p.status === "activated") {
    cards.push(
      card({
        id: "prime-member",
        category: "medical",
        title: "TRICARE Prime for the service member",
        dek: "Active duty, and Guard or Reserve on orders of more than 30 days, are covered under Prime. Select is not a choice for the member.",
        who: ["sponsor"],
        why: p.status === "activated"
          ? "Your orders are long enough to turn on active-duty TRICARE. Prime starts from the orders, not from a drill weekend."
          : "You are on active duty. Prime is the plan, including Prime Remote if you live and work far from a military hospital.",
        cost: "No premium. You get care at a military hospital or clinic, or in the civilian network when Prime Remote or a referral says so.",
        steps: [
          "Keep the address in DEERS current so Prime Remote triggers if you are far from a military treatment facility.",
          "Use your primary care manager for referrals unless the rule for that visit says otherwise.",
          "If you are in the Atlanta or Tampa Prime Demo footprint, call CareSource Military and Veterans at 833-230-2080 only after TRICARE confirms you are in the demo.",
        ],
        links: [
          { label: "TRICARE Prime", href: "https://tricare.mil/Plans/HealthPlans/Prime" },
          { label: "Your region", href: "https://tricare.mil/Regions" },
        ],
      }),
    );
  }

  if (servingFamily(p) || retireeUnder65(p) || (p.status === "survivor" && p.survivorKind !== "died-veteran" && p.sponsorAge !== "65-plus")) {
    const familyWho: Who[] = servingFamily(p) ? ["spouse", "child"] : ["sponsor", "spouse", "child"];
    cards.push(
      card({
        id: "prime-select",
        category: "medical",
        title: servingFamily(p) ? "Prime or Select for the family" : "TRICARE Prime or TRICARE Select",
        dek: "Prime is a primary care manager and referrals. Select is a wider choice of civilian doctors, with a deductible and a cost-share.",
        who: familyWho,
        why: servingFamily(p)
          ? "The service member is already on Prime. Everyone else in DEERS has to be enrolled in a plan. Eligible is not the same as enrolled."
          : "Retired pay, or survivor status from a retiree or an active-duty death, opens Prime and Select while Medicare is not yet required.",
        cost: servingFamily(p)
          ? "Active-duty families do not pay an enrollment fee. You still follow Prime referral rules, or Select cost-shares."
          : "Most retiree households pay an annual enrollment fee for Prime or Select, then copays or cost-shares. Group A and Group B fees differ. Read the current cost sheet before you pick.",
        steps: [
          "Enroll on milConnect (Beneficiary Web Enrollment) or by phone with the regional contractor.",
          "Prime and Select changes happen at TRICARE Open Season (November 9 through December 8, 2026) or after a qualifying life event.",
          p.place && ["PR", "GU", "VI", "AS", "MP", "OVERSEAS"].includes(p.place)
            ? "Overseas, the pair is Prime Overseas and Select Overseas. International SOS is the contractor, not Humana or TriWest."
            : `You are using the contractor for ${where}. The region banner at the top of this brief has the phone number.`,
        ],
        links: [
          { label: "Prime", href: "https://tricare.mil/Plans/HealthPlans/Prime" },
          { label: "Select", href: "https://tricare.mil/Plans/HealthPlans/TS" },
          { label: "Costs", href: "https://tricare.mil/Costs" },
        ],
      }),
    );
  }

  if (usfhpEligible(p)) {
    const note = p.place ? USFHP_NOTE[p.place] : undefined;
    cards.push(
      card({
        id: "usfhp",
        category: "medical",
        title: "US Family Health Plan, if the ZIP is inside the map",
        dek: "A civilian Prime option run by one of six designated health systems. It replaces Prime. It does not sit on top of it.",
        who: p.status === "active" || p.status === "activated" ? ["spouse", "child"] : ["sponsor", "spouse", "child"],
        why: note ?? "Your state touches a US Family Health Plan area.",
        cost: "Enrollment fees match TRICARE Prime. You use that plan's doctors and pharmacy.",
        steps: [
          "Confirm the ZIP with the designated provider. Most of these areas are not statewide.",
          "The service member on active duty cannot enroll. Family members can.",
          "You will not use military hospitals, except a true emergency, and you will not use the TRICARE mail-order pharmacy.",
        ],
        links: [
          { label: "US Family Health Plan", href: "https://www.tricare.mil/Plans/HealthPlans/USFHP" },
          { label: "Enroll on milConnect", href: "https://milconnect.dmdc.osd.mil/" },
        ],
        warning: "Do not cancel Prime until the US Family Health Plan confirms the address is in its service area.",
      }),
    );
  }

  if (selectedReserve(p)) {
    cards.push(
      card({
        id: "trs",
        category: "medical",
        title: "TRICARE Reserve Select",
        dek: "The premium plan for Selected Reserve members and their families when nobody in the qualifying seat can get a federal employee health plan.",
        who: ["sponsor", "spouse", "child"],
        why: p.federalJob
          ? "You are drilling, but you also marked federal employee health benefits. That usually closes this door."
          : "Drill status does not include Prime. Reserve Select is the TRICARE plan you can buy the month you qualify.",
        cost: "A monthly premium that depends on whether you cover the member only or the member and family. It is not free, and it is usually cheaper than Retired Reserve. Look up this year's rate before you compare it with a civilian job plan.",
        steps: [
          "Confirm you are in the Selected Reserve, not the IRR, and that you are not eligible for FEHB.",
          "Enroll any month. Open Season does not apply. Coverage generally starts the first of the next month, or the month after, depending on when you submit.",
          "Dental is not included. Budget the TRICARE Dental Program separately.",
          p.transition === "within-180"
            ? "If you are still inside TAMP, do not pay for Reserve Select yet. TAMP is premium-free. Buy Reserve Select when TAMP ends if you are still drilling."
            : "If you are about to start orders of more than 30 days, Prime will replace Reserve Select for that period. Tell the contractor.",
        ],
        links: [
          { label: "TRICARE Reserve Select", href: "https://tricare.mil/Plans/HealthPlans/TRS" },
          { label: "Enroll", href: "https://tricare.mil/Plans/Enroll" },
        ],
        warning: p.federalJob
          ? "Eligibility for the Federal Employees Health Benefits program blocks TRICARE Reserve Select even if you decline the federal plan. Dual-status technicians hit this rule often."
          : undefined,
      }),
    );
    cards.push(
      card({
        id: "lod",
        category: "medical",
        title: "Line of duty care for a drill injury",
        dek: "If you are hurt or become ill in a duty status, that condition can be treated even when you do not carry Reserve Select.",
        who: ["sponsor"],
        why: "Guard and Reserve medical readiness is not the same benefit as family health insurance.",
        cost: "No premium for an approved line-of-duty condition. It does not cover your family's ordinary care.",
        steps: [
          "Report the injury or illness to the unit the day it happens, not after a civilian claim is denied.",
          "Ask for a line-of-duty determination and follow the service's medical office, not a random urgent care, for the paperwork.",
          "Keep civilian insurance in place for everything that is not the duty injury.",
        ],
        links: [
          { label: "TRICARE Reserve Select, and what it is not", href: "https://tricare.mil/Plans/HealthPlans/TRS" },
          { label: "Medical readiness via milConnect", href: "https://milconnect.dmdc.osd.mil/" },
        ],
      }),
    );
  }

  if (p.status === "gray") {
    cards.push(
      card({
        id: "trr",
        category: "medical",
        title: "TRICARE Retired Reserve",
        dek: "The premium plan for a reserve retiree who is not yet entitled to retired pay, and for the family on the same record.",
        who: ["sponsor", "spouse", "child"],
        why: "A 20-year letter does not turn on retiree Prime or Select. Those start when retired pay starts, which can be earlier than 60 if you had qualifying active service.",
        cost: "A substantial monthly premium, higher than Reserve Select. Price it against a civilian plan before you enroll.",
        steps: [
          "Confirm you are a retired reserve member awaiting pay, often called gray area.",
          "You may enroll any month you qualify.",
          "When retired pay starts, stop Retired Reserve and move to Prime, Select, or the US Family Health Plan.",
        ],
        links: [
          { label: "TRICARE Retired Reserve", href: "https://tricare.mil/Plans/HealthPlans/TRR" },
          { label: "Costs", href: "https://tricare.mil/Costs" },
        ],
      }),
    );
  }

  if (p.transition === "within-180" && ["veteran", "guard", "reserve", "irr", "retired"].includes(p.status)) {
    cards.push(
      card({
        id: "tamp",
        category: "medical",
        title: "Transitional Assistance Management Program",
        dek: "180 days of premium-free TRICARE after some separations and after some reserve activations of more than 30 days.",
        who: ["sponsor", "spouse", "child"],
        why: "You marked a separation or end of orders inside 180 days. TAMP is the first thing to confirm, because it is free if you qualify and easy to miss.",
        cost: "No premium for 180 days. You use Prime or Select rules during that window.",
        steps: [
          "TAMP is not automatic for every discharge. Contingency orders and certain involuntary separations are the usual fits. Read your orders against the TAMP page.",
          "Stay enrolled in DEERS. When the 180 days end, Reserve Select, Retired Reserve, CHCBP, VA care, or a civilian plan has to already be chosen.",
          "Do not buy Reserve Select during TAMP.",
        ],
        links: [{ label: "TAMP rules", href: "https://tricare.mil/Plans/SpecialPrograms/TAMP" }],
        warning: "If your orders were not in support of a contingency, or the separation was a routine ETS, you may not have TAMP. Do not assume the 180 days exist.",
      }),
    );
  }

  if (
    ["veteran", "irr"].includes(p.status) ||
    (selectedReserve(p) && p.transition !== "still")
  ) {
    const windowOpen = p.transition === "within-180" || p.transition === "within-18-months";
    cards.push(
      card({
        id: "chcbp",
        category: "medical",
        title: "Continued Health Care Benefit Program",
        dek: "The plan you can buy after TRICARE ends, including after TAMP. It works like COBRA. It is not a cheap version of Prime.",
        who: ["sponsor", "spouse", "child"],
        why: windowOpen
          ? "You are inside roughly 18 months of a loss of TRICARE. CHCBP is time-limited."
          : "If TRICARE ended more than 18 months ago, this window is usually closed. It is listed so you can check the date instead of guessing.",
        cost: "You pay the full premium, quarterly. It is often the most expensive bridge on this page. Coverage can last 18 months, longer in some former-spouse cases.",
        steps: [
          "Apply within the window TRICARE states, generally 60 days from the loss of eligibility. Missing it closes the plan.",
          "Compare one quarter of premium with a marketplace plan and with VA care before you pay.",
          "CHCBP does not make you a retiree and does not open FEDVIP by itself.",
        ],
        links: [{ label: "CHCBP", href: "https://tricare.mil/Plans/SpecialPrograms/CHCBP" }],
        warning: windowOpen ? undefined : "This is probably closed. Open the official page only to confirm the date TRICARE ended.",
      }),
    );
  }

  const tflPerson =
    (p.status === "retired" || (p.status === "survivor" && p.survivorKind !== "died-veteran")) &&
    (p.sponsorAge === "65-plus" || p.spouseAge === "65-plus" || p.medicare !== "none");
  if (tflPerson) {
    cards.push(
      card({
        id: "tfl",
        category: "medical",
        title: "TRICARE For Life",
        dek: "Medicare pays first in the United States. TRICARE For Life wraps what Medicare does not. There is no enrollment form for TFL itself.",
        who: [
          ...(p.sponsorAge === "65-plus" || sponsorMedicare(p) || p.medicare === "a-only"
            ? (["sponsor"] as Who[])
            : []),
          ...(p.spouseAge === "65-plus" || spouseMedicare(p) || p.medicare === "a-only"
            ? (["spouse"] as Who[])
            : []),
        ],
        why: "Someone in this household is 65 or on Medicare, and the sponsor's status still carries TRICARE.",
        cost: "No TRICARE enrollment fee. You do pay the Medicare Part B premium. Overseas, Medicare usually pays nothing, and TRICARE For Life becomes the first payer with TRICARE cost-shares.",
        steps: [
          "If you are entitled to premium-free Medicare Part A, enroll in Part B. Without Part B, TRICARE stops for most retirees.",
          "DEERS has to show both Medicare parts. Coverage then wraps automatically.",
          "WPS is the claims processor for TRICARE For Life in the United States and territories, not Humana or TriWest.",
        ],
        links: [
          { label: "TRICARE For Life", href: "https://tricare.mil/Plans/HealthPlans/TFL" },
          { label: "Medicare and TRICARE", href: "https://tricare.mil/Plans/Eligibility/Medicare" },
        ],
        warning:
          p.medicare === "a-only"
            ? "Part A without Part B is the mistake that drops TRICARE at 65. Fix Part B before you need a hospital."
            : undefined,
      }),
    );
  }

  if (p.youngAdults || p.role === "child" || p.students21to23) {
    if (tricareFamilyStatus(p.status, p.survivorKind) && p.status !== "veteran") {
      cards.push(
        card({
          id: "tya",
          category: "medical",
          title: "TRICARE Young Adult, ages 21 to 26",
          dek: "A premium plan for an unmarried child who aged out of regular TRICARE and cannot get an employer plan.",
          who: ["young"],
          why: p.students21to23
            ? "A full-time student age 21 to 23 may stay on regular TRICARE if the sponsor provides more than half their support and DEERS says so. Young Adult is the plan after that, or if the student rule does not fit."
            : "Regular TRICARE for a child ends at 21, or 23 for a qualifying student. It does not run to 26 by itself.",
          cost: "A monthly premium. You pick a Prime option or a Select option where those exist. The sponsor does not have to be enrolled, but the sponsor does have to be TRICARE-eligible.",
          steps: [
            "Confirm the child is unmarried, at least 21, under 26, and not eligible for an employer-sponsored plan.",
            "A separated veteran who is not retired usually cannot sponsor this plan.",
            "Enroll any month. It is not limited to Open Season.",
          ],
          links: [{ label: "TRICARE Young Adult", href: "https://tricare.mil/Plans/HealthPlans/TYA" }],
        }),
      );
    }
  }

  if (p.incapacitatedChild && tricareFamilyStatus(p.status, p.survivorKind)) {
    cards.push(
      card({
        id: "incapacitated",
        category: "medical",
        title: "A child who cannot support themselves",
        dek: "TRICARE can continue past the age cap for a child whose disability began while they were still eligible, if DEERS approves it.",
        who: ["child"],
        why: "You marked a child who is incapable of self-support. This is a paperwork status, not an automatic extension.",
        cost: "If approved, they stay on the family's TRICARE plan. If the sponsor is not TRICARE-eligible, look at CHAMPVA instead.",
        steps: [
          "Start the request before the child ages out. A late packet is harder.",
          "The service medical or DEERS office will want medical evidence that the condition started during eligibility.",
          "Approval has to be renewed the way DEERS instructs. Keep the letters.",
        ],
        links: [{ label: "DEERS eligibility", href: "https://www.tricare.mil/Plans/Eligibility/DEERS" }],
      }),
    );
  }

  if (["veteran", "retired", "gray", "guard", "reserve", "irr"].includes(p.status)) {
    cards.push(
      card({
        id: "va-health",
        category: "medical",
        title: "VA health care for the veteran",
        dek: "A health system, not an insurance card. Enrollment has no monthly premium. Copays depend on your priority group, income, and whether the condition is service-connected.",
        who: ["sponsor"],
        why:
          p.status === "guard" || p.status === "reserve"
            ? "Many drilling members qualify because of earlier active service, a rating, or toxic-exposure rules under the PACT Act. It does not replace Reserve Select for your family."
            : "You have a discharge that can open VA care. Apply even if TRICARE or a job plan already covers you.",
        cost: "No premium to be enrolled. Some veterans owe copays for care or prescriptions. A service-connected condition is generally treated without a copay.",
        steps: [
          "Apply online with the 10-10EZ, or call 877-222-8387.",
          "If you separated recently, ask about enhanced eligibility. If you served in a place the PACT Act lists, say so.",
          "VA community care is not automatic. Ask the VA facility before you go to a civilian specialist expecting VA to pay.",
        ],
        links: [
          { label: "Apply for VA health care", href: "https://www.va.gov/health-care/apply-for-health-care-form-10-10ez/introduction" },
          { label: "Eligibility", href: "https://www.va.gov/health-care/eligibility/" },
          { label: "Watch: how to apply", href: "https://www.youtube.com/watch?v=nn_rAe8MbaY" },
        ],
      }),
    );
  }

  const champva =
    (p.status === "veteran" && p.rating === "total") ||
    (p.status === "gray" && p.rating === "total") ||
    (p.status === "survivor" && p.survivorKind === "died-veteran");
  if (champva) {
    cards.push(
      card({
        id: "champva",
        category: "medical",
        title: "CHAMPVA for the family",
        dek: "Civilian coverage for a spouse and children of a veteran who is permanently and totally disabled, or who died of a service-connected condition, when those dependents are not TRICARE-eligible.",
        who: ["spouse", "child", "young"],
        why:
          p.status === "gray"
            ? "A total rating can open CHAMPVA while you are not yet on retiree TRICARE. The day the family becomes TRICARE-eligible, CHAMPVA stops."
            : "The family is not a retiree TRICARE household, and the rating or the cause of death is the kind CHAMPVA was built for.",
        cost: "No premium. There is a cost-share and a deductible, with a catastrophic cap. CHAMPVA is secondary if the dependent has other insurance.",
        steps: [
          "The veteran does not use CHAMPVA. The veteran uses VA health care.",
          "Apply with the CHAMPVA application and the rating or death documentation VA asks for.",
          "If you buy TRICARE Retired Reserve, you become TRICARE-eligible and you should expect CHAMPVA to end.",
        ],
        links: [{ label: "CHAMPVA", href: "https://www.va.gov/health-care/family-caregiver-benefits/champva/" }],
        warning:
          p.status === "retired"
            ? "Retiree families use TRICARE, not CHAMPVA."
            : "If anyone in the family can get TRICARE, they cannot have CHAMPVA.",
      }),
    );
  }

  if (tricareFamilyStatus(p.status, p.survivorKind) && p.status !== "irr") {
    cards.push(
      card({
        id: "pharmacy",
        category: "medical",
        title: "TRICARE pharmacy",
        dek: "Prime, Select, Reserve Select, Retired Reserve, Young Adult, and TRICARE For Life use the TRICARE pharmacy program. Express Scripts runs home delivery and the retail network.",
        who: ["sponsor", "spouse", "child"],
        why: "A medical enrollment does not explain the pharmacy. People pay retail prices because nobody showed them military pharmacy or home delivery.",
        cost: "A military pharmacy is the lowest cost, often nothing. Home delivery is next for medicines you take all the time. Retail costs more. Copay amounts change. Read the current cost sheet.",
        steps: [
          "Create an Express Scripts account once DEERS shows the enrollment.",
          "Move maintenance drugs to home delivery or a military pharmacy.",
          "If you enroll in the US Family Health Plan, stop. That plan uses its own pharmacy, not Express Scripts.",
        ],
        links: [
          { label: "Express Scripts military", href: "https://militaryrx.express-scripts.com/" },
          { label: "Pharmacy costs", href: "https://tricare.mil/Costs/Pharmacy" },
        ],
      }),
    );
  }

  if (p.status === "active" || p.status === "activated") {
    cards.push(
      card({
        id: "addp",
        category: "dental",
        title: "Active Duty Dental Program",
        dek: "The service member's dental care. Military dental clinics come first. United Concordia runs the civilian side when you are far from a clinic or on long orders away from one.",
        who: ["sponsor"],
        why: "You are in an active-duty dental status. Do not buy the family dental plan for yourself.",
        cost: "No premium. You need an appointment control number for civilian care before you sit in the chair.",
        steps: [
          "If you are on orders, make sure the contractor knows the orders started so reserve dental coverage suspends for you.",
          "Get care at a military clinic if one is available.",
          "Family members do not use this program. They use the TRICARE Dental Program.",
        ],
        links: [
          { label: "Active Duty Dental Program", href: "https://www.addp-ucci.com/" },
          { label: "Handbook", href: "https://tricare.mil/Publications/Handbooks/active_duty_dental" },
        ],
      }),
    );
  }

  if (servingFamily(p) || selectedReserve(p) || p.status === "irr") {
    const who: Who[] = p.status === "active" || p.status === "activated" ? ["spouse", "child"] : ["sponsor", "spouse", "child"];
    cards.push(
      card({
        id: "tdp",
        category: "dental",
        title: "TRICARE Dental Program",
        dek: "The voluntary dental plan for active-duty family members and for Selected Reserve and IRR members and their families. United Concordia runs it.",
        who,
        why:
          p.status === "irr"
            ? "IRR members can often enroll themselves and their families. This is separate from health coverage you do not have."
            : "Medical TRICARE does not include routine dental. This is the buy-in plan while you are not a retiree.",
        cost: "Monthly premiums depend on the sponsor's status and, for active-duty families, on pay grade. The plan year runs March through February. Read the current premium table. Retirees are not eligible.",
        steps: [
          "Enroll the sponsor and the family on the rules United Concordia posts. Selected Reserve sponsors enroll separately from their families.",
          "A family plan generally has to include all eligible family members, with a special rule for infants.",
          "If you are activated for more than 30 days, the service member moves to the Active Duty Dental Program.",
        ],
        links: [
          { label: "United Concordia TDP", href: "https://www.uccitdp.com/" },
          { label: "TRICARE dental page", href: "https://tricare.mil/CoveredServices/Dental/TDP" },
        ],
      }),
    );
  }

  if (["retired", "gray"].includes(p.status) || (p.status === "survivor" && p.survivorKind === "died-retiree")) {
    cards.push(
      card({
        id: "fedvip-dental",
        category: "dental",
        title: "FEDVIP dental",
        dek: "The retiree dental benefit. Several carriers, one enrollment site: BENEFEDS. Gray-area retirees can enroll too.",
        who: ["sponsor", "spouse", "child"],
        why: "You cannot keep the TRICARE Dental Program once you are a retiree or a gray-area retiree.",
        cost: "Premiums depend on the carrier, the plan level, and whether you cover one person or a family. There is no government 'free dental' in FEDVIP.",
        steps: [
          "Enroll during the federal benefits open season or after a qualifying life event.",
          "Compare at least two carriers on the annual maximum, not just the premium.",
          "If you are also a VA-enrolled veteran at a total rating, VA dental may already cover you. FEDVIP is still what covers the family.",
        ],
        links: [
          { label: "BENEFEDS", href: "https://www.benefeds.gov/" },
          { label: "Who can enroll", href: "https://www.opm.gov/healthcare-insurance/dental-vision/eligibility/" },
        ],
      }),
    );
  }

  if (["veteran", "retired", "gray", "guard", "reserve", "irr"].includes(p.status)) {
    cards.push(
      card({
        id: "va-dental",
        category: "dental",
        title: "VA dental care",
        dek: "Not everyone enrolled in VA health care gets dentistry. The class of eligibility is the whole question.",
        who: ["sponsor"],
        why: "You may be a veteran with a path into VA dental, or you may need to buy a plan. The difference is the rating, a recent discharge, or a rehab plan.",
        cost: p.rating === "total"
          ? "A total rating, or unemployability, is the path to comprehensive VA dental. Ask the VA dental clinic to confirm Class IV before you buy a private plan."
          : "If you are not in a qualifying class, VA will not do routine cleanings. VADIP is the plan you can buy.",
        steps: [
          p.transition === "within-180"
            ? "If you recently separated, ask about one-time dental (often called Class II) before the 180-day window closes."
            : "Ask the enrollment office which dental class you are, instead of assuming a rating under 100% includes teeth.",
          p.rating === "total"
            ? "With 100%, permanent and total, or IU, request comprehensive dental."
            : "A compensable dental condition can be treated. That is not the same as a cleaning every six months.",
          "If you are in Veteran Readiness and Employment, dental can be authorized when the rehab plan needs it.",
        ],
        links: [{ label: "VA dental eligibility", href: "https://www.va.gov/health-care/about-va-health-benefits/dental-care/" }],
      }),
    );
    cards.push(
      card({
        id: "vadip",
        category: "dental",
        title: "VA Dental Insurance Program",
        dek: "A discounted private dental plan for veterans enrolled in VA health care, and for people on CHAMPVA.",
        who: p.rating === "total" && p.status === "veteran" ? ["spouse", "child"] : ["sponsor", "spouse", "child"],
        why:
          champva
            ? "CHAMPVA does not include routine dental. VADIP is the add-on those dependents can buy."
            : "If VA dental will not cover you, VADIP is the buy-in. Retirees should price it against FEDVIP before they pick.",
        cost: "You pay the premium. Compare the annual maximum with FEDVIP if you have both doors.",
        steps: [
          "Confirm VA health care enrollment, or CHAMPVA, first. VADIP is not a stand-alone public benefit.",
          "Enroll through the VADIP carriers VA lists, not through BENEFEDS.",
        ],
        links: [
          {
            label: "VADIP",
            href: "https://www.va.gov/health-care/about-va-health-benefits/dental-care/va-dental-insurance-program/",
          },
        ],
      }),
    );
  }

  cards.push(
    card({
      id: "eyes",
      category: "vision",
      title: "What TRICARE actually pays for eyes",
      dek: "Medically necessary eye care is part of the health plan. Routine glasses and contacts for most adults are not.",
      who: ["sponsor", "spouse", "child"],
      why: "People buy a second pair of glasses on Prime and then learn the claim was never going to pay.",
      cost: "Active duty eye exams and military-issued glasses are part of readiness. Family and retiree routine hardware is FEDVIP vision if you are enrolled in a TRICARE health plan.",
      steps: [
        "Use the health plan for an eye injury, a disease, or a covered exam.",
        "Well-child vision screening follows the health plan rules and is not the same as a designer frame benefit.",
        "If you want frames, lenses, or contacts, price FEDVIP vision.",
      ],
      links: [{ label: "TRICARE vision", href: "https://tricare.mil/CoveredServices/Vision" }],
    }),
  );

  if (tricareFamilyStatus(p.status, p.survivorKind)) {
    cards.push(
      card({
        id: "fedvip-vision",
        category: "vision",
        title: "FEDVIP vision",
        dek: "The add-on for glasses and contacts. You generally have to be enrolled in a TRICARE health plan, including Reserve Select, Retired Reserve, Young Adult, or TRICARE For Life.",
        who: p.status === "active" || p.status === "activated" ? ["spouse", "child"] : ["sponsor", "spouse", "child"],
        why: "The health plan on this brief does not buy most adult glasses.",
        cost: "A separate premium through BENEFEDS. Open season or a qualifying life event.",
        steps: [
          "Enroll at BENEFEDS, not at the eye clinic's front desk.",
          "Active duty members get their glasses through the service, not through FEDVIP.",
        ],
        links: [
          { label: "BENEFEDS", href: "https://www.benefeds.gov/" },
          { label: "FEDVIP vision rules", href: "https://www.opm.gov/healthcare-insurance/dental-vision/" },
        ],
      }),
    );
  }

  if (["veteran", "retired", "gray", "guard", "reserve", "irr"].includes(p.status)) {
    cards.push(
      card({
        id: "va-vision",
        category: "vision",
        title: "VA eye care and eyeglasses",
        dek: "Enrolled veterans can get eye exams through VA. Glasses are provided on a schedule if you qualify, which is broader than TRICARE's hardware rule.",
        who: ["sponsor"],
        why: "If you use VA for care, ask that clinic for eye care before you buy a vision plan you may not need.",
        cost: "No separate vision premium inside VA. Eligibility for glasses follows VA's rules, not FEDVIP's.",
        steps: [
          "Enroll in VA health care first.",
          "Request an eye appointment at your VA facility or through the community care process they give you.",
        ],
        links: [{ label: "VA vision care", href: "https://www.va.gov/health-care/about-va-health-benefits/vision-care/" }],
      }),
    );
  }

  if (isServing(p.status)) {
    cards.push(
      card({
        id: "sgli",
        category: "life",
        title: "SGLI, up to $500,000",
        dek: "Servicemembers' Group Life Insurance. Term coverage that does not care about your age or your health. It ends 120 days after you leave the period of coverage.",
        who: ["sponsor"],
        why: "You are in a status that carries SGLI, either automatically or because you are in the Ready Reserve and still eligible. Confirm it. Do not recite it from memory.",
        cost: "5 cents per $1,000, plus $1 for traumatic injury protection. $500,000 is $26 a month. Rates were cut July 1, 2025 and were still the figures on VA.gov in October 2026.",
        steps: [
          "Open SOES from milConnect. Read the amount and the beneficiary.",
          "You can reduce coverage in $50,000 steps. If you are married, reducing or declining coverage notifies your spouse.",
          "Before you separate or retire, decide on VGLI. Nobody converts it for you. The free tail is 120 days. The no-health-questions VGLI window is 240 days.",
        ],
        links: [
          { label: "SGLI", href: "https://www.va.gov/life-insurance/options-eligibility/sgli/" },
          { label: "milConnect / SOES", href: "https://milconnect.dmdc.osd.mil/" },
        ],
      }),
    );
    cards.push(
      card({
        id: "tsgli",
        category: "life",
        title: "TSGLI, if you are badly injured",
        dek: "A one-time payment for specific traumatic injuries. It is not life insurance and it is not disability compensation.",
        who: ["sponsor"],
        why: "The $1 inside your SGLI premium is this benefit. You do not enroll a second time.",
        cost: "Included. Payments depend on the injury and can be large. They are tax-free.",
        steps: [
          "The service starts the claim with medical records. Tell the medical officer or the personnel office. Do not wait for a website to guess.",
          "A TSGLI payment does not reduce the SGLI death benefit.",
        ],
        links: [{ label: "SGLI page, including TSGLI", href: "https://www.va.gov/life-insurance/options-eligibility/sgli/" }],
      }),
    );
  }

  if (isServing(p.status) && (p.spouse || p.kidsUnder21 || p.students21to23 || p.incapacitatedChild || p.youngAdults)) {
    cards.push(
      card({
        id: "fsgli",
        category: "life",
        title: "Family SGLI",
        dek: "Coverage for a spouse, up to $100,000 and never more than the member's own SGLI, and $10,000 for each child.",
        who: ["spouse", "child"],
        why: "Your SGLI does not automatically insure your spouse for $100,000. Spouse coverage is a premium. Child coverage is automatic and free while you have SGLI.",
        cost: "A spouse under 35 pays $4 a month for $100,000, on the VA table current in October 2026. The premium rises with the spouse's age. Each child is $10,000 at no cost.",
        steps: [
          "Set the spouse amount in SOES. It cannot exceed your SGLI.",
          "Children are covered while they qualify as dependents. You do not pick a beneficiary for the child coverage. It pays to the member.",
          "Family SGLI ends when your SGLI ends. It does not convert into VGLI. A spouse can convert to a commercial policy in the window VA describes.",
        ],
        links: [{ label: "Family SGLI", href: "https://www.va.gov/life-insurance/options-eligibility/fsgli/" }],
      }),
    );
  }

  if (["veteran", "retired", "gray", "irr"].includes(p.status)) {
    cards.push(
      card({
        id: "vgli",
        category: "life",
        title: "VGLI, the SGLI replacement",
        dek: "Veterans' Group Life Insurance. Renewable term, from $10,000 up to the SGLI amount you had, and not above $500,000.",
        who: ["sponsor"],
        why:
          p.transition === "within-180" || p.transition === "within-18-months"
            ? "You are close enough to separation that the application window may still be open. It closes for good at 1 year and 120 days."
            : "If you did not apply in time, this door is shut. Check the date before you assume you can still get it.",
        cost: "Premiums rise every five years of age and get expensive later in life. VA publishes the table. The first 240 days do not ask health questions. After that, and until the window closes, you have to show good health.",
        steps: [
          "Apply online with the Office of Servicemembers' Group Life Insurance.",
          "If you are healthy, also price a civilian level term. Keep VGLI if the civilian policy is declined or costs more.",
          "You can increase VGLI by $25,000 on a schedule until age 60, up to $500,000, without a new medical exam.",
        ],
        links: [
          { label: "VGLI", href: "https://www.va.gov/life-insurance/options-eligibility/vgli/" },
          { label: "Watch: VA life insurance", href: "https://www.youtube.com/watch?v=z1KJoj-8SQ0" },
        ],
        warning:
          p.transition === "longer"
            ? "If separation was more than 1 year and 120 days ago, VGLI is closed. Do not send money to a site that says otherwise."
            : "Day 240 is the health-question line. Day 485, roughly, is the closed door. Count from your actual separation date.",
      }),
    );
  }

  if (p.rating !== "none" && p.status !== "survivor") {
    cards.push(
      card({
        id: "valife",
        category: "life",
        title: "VALife, up to $40,000",
        dek: "Guaranteed whole life for veterans age 80 or younger with any service-connected rating. No medical exam. No deadline tied to your separation date.",
        who: ["sponsor"],
        why: "You have a service-connected rating, so this door is open. It is a small policy. It does not replace a $500,000 SGLI.",
        cost: "The premium is based on age at enrollment and the amount, and it stays level. There is a two-year waiting period before the full death benefit is in force, with a return of premiums plus interest if death happens during those two years.",
        steps: [
          "Apply on VA.gov. Service-Disabled Veterans Insurance stopped taking new people. Do not hunt S-DVI.",
          "If you still have time for VGLI and you need more than $40,000, do VGLI first.",
        ],
        links: [{ label: "VALife", href: "https://www.va.gov/life-insurance/options-eligibility/valife/" }],
      }),
    );
  }

  if (p.sah) {
    cards.push(
      card({
        id: "vmli",
        category: "life",
        title: "Veterans' Mortgage Life Insurance",
        dek: "Up to $200,000 that pays down a mortgage if you die, after VA has given you a Specially Adapted Housing grant.",
        who: ["sponsor"],
        why: "You marked a Specially Adapted Housing grant. This is the policy that matches that grant. It is not available just because you have a VA loan.",
        cost: "A premium based on age and the mortgage amount. Coverage cannot exceed the mortgage, and it cannot exceed $200,000.",
        steps: [
          "You generally have to be under 70 to get it.",
          "Apply through the VA life insurance center with the grant paperwork.",
        ],
        links: [{ label: "VMLI", href: "https://www.va.gov/life-insurance/options-eligibility/vmli/" }],
      }),
    );
  }

  if (["retired", "gray", "survivor"].includes(p.status) || selectedReserve(p)) {
    cards.push(
      card({
        id: "sbp",
        category: "life",
        title: "Survivor Benefit Plan",
        dek: "A monthly annuity for a survivor, paid for out of retired pay. It is not SGLI, and a life insurance policy does not replace the election you failed to make.",
        who: ["spouse", "child"],
        why:
          p.status === "gray" || selectedReserve(p)
            ? "Reserve members face this decision when the 20-year letter arrives. That election is the Reserve Component SBP. Ignoring the packet can elect a default."
            : "Retirement is when SBP is elected. Survivors need to know whether it was chosen, because the payment is not automatic from SGLI.",
        cost: "A premium from retired pay, and a cost-of-living adjustment that tracks retired pay. Declining it when you have a spouse requires the spouse's concurrence.",
        steps: [
          selectedReserve(p) || p.status === "gray"
            ? "Find the 20-year letter and the RCSBP election. If you cannot find it, ask your personnel office what was recorded."
            : "Read the DFAS SBP page before you retire, and again if you marry or divorce after retirement.",
          "DIC from VA and SBP can interact. Do not let a forum tell you to decline SBP. Run the numbers on the DFAS page.",
        ],
        links: [{ label: "DFAS Survivor Benefit Plan", href: "https://www.dfas.mil/RetiredMilitary/provide/sbp/" }],
      }),
    );
  }

  cards.push(
    card({
      id: "banks",
      category: "money",
      title: "Banks and credit unions that know the ID card",
      dek: "You do not have to move your checking account. These institutions exist for this community, and each one has its own membership rule.",
      who: ["sponsor", "spouse", "child"],
      why: `The household is tied to the ${branchLabel(p.branch)}. Membership is usually open to service members, retirees, veterans, and often their families. Read the current rule before you apply.`,
      cost: "Account fees depend on the institution. None of these are a government benefit, and none are required.",
      steps: [
        "Navy Federal is the largest. Eligibility runs through DoD, the Coast Guard, and many veterans and family members.",
        "USAA serves the military community, but not every product is open to every veteran. The eligibility page is the only honest answer.",
        "PenFed and Service Credit Union are the other two desks people actually use nationwide. On-base banks under the Military Banking Program are a convenience if you live at an installation, not a better interest rate by law.",
      ],
      links: [
        { label: "Navy Federal membership", href: "https://www.navyfederal.org/membership/become-a-member.html" },
        { label: "USAA eligibility", href: "https://www.usaa.com/inet/wc/why_choose_usaa_eligibility" },
        { label: "PenFed", href: "https://www.penfed.org/accounts/membership" },
        { label: "Service Credit Union", href: "https://servicecu.org/membership/" },
      ],
    }),
  );

  if (isServing(p.status) || p.status === "retired" || p.status === "gray") {
    cards.push(
      card({
        id: "scra",
        category: "money",
        title: "A 6% cap on pre-service debt",
        dek: "The Servicemembers Civil Relief Act. Interest above 6% on debts you took before active duty has to be forgiven, not deferred, once you request it.",
        who: ["sponsor", "spouse"],
        why:
          p.status === "guard" || p.status === "reserve"
            ? "The cap applies when you are ordered to active duty, not on a drill weekend. Keep the orders."
            : "If you are on active duty, or you were, and a debt predates the orders, the request is what turns the law on.",
        cost: "Free to request. The creditor has to forgive interest above 6% for the period of active duty, and for some mortgages a year after.",
        steps: [
          "Write each creditor and attach the orders. Keep a copy.",
          "This is not the Military Lending Act. MLA covers many new loans. SCRA covers old ones.",
          "Guard and Reserve members use the same law when the orders start.",
        ],
        links: [
          { label: "Justice Department SCRA", href: "https://www.justice.gov/servicemembers/servicemembers-civil-relief-act-scra" },
          { label: "CFPB military tools", href: "https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/" },
        ],
      }),
    );
  }

  if (isServing(p.status) || p.role === "spouse") {
    cards.push(
      card({
        id: "mla",
        category: "money",
        title: "Military Lending Act",
        dek: "A cap on the cost of many consumer loans made to active duty and their covered dependents. Payday loans, vehicle title loans, and many installment loans sit under it.",
        who: ["sponsor", "spouse", "child"],
        why: "New debt while you are serving is a different rule from the 6% cap on old debt.",
        cost: "The military annual percentage rate on covered loans cannot exceed 36%, and that rate includes fees. Mortgages and loans to buy a vehicle that are secured by the vehicle are generally outside it.",
        steps: [
          "If a lender says the rule does not apply, ask them to put that in writing and check the CFPB page before you sign.",
          "A 36% cap is still a very expensive loan. It is a ceiling, not a suggestion that the loan is a good idea.",
        ],
        links: [{ label: "CFPB: Military Lending Act", href: "https://www.consumerfinance.gov/ask-cfpb/what-are-the-requirements-of-the-military-lending-act-en-1785/" }],
      }),
    );
  }

  if (p.status === "active" || p.status === "activated") {
    cards.push(
      card({
        id: "sdp",
        category: "money",
        title: "Savings Deposit Program",
        dek: "Up to $10,000 deposited while you serve in a designated combat zone, earning 10% a year.",
        who: ["sponsor"],
        why: "You are in a status that deploys. This account exists only for that deployment. It is not a regular savings account.",
        cost: "You put in your own money, up to $10,000. The 10% is the point. It stops after you leave the area, on the timeline DFAS publishes.",
        steps: [
          "Ask your finance office on arrival in the designated area. Do not wait until redeployment week.",
          "The deposit is limited. It is not an investment account and it is not the TSP.",
        ],
        links: [{ label: "DFAS Savings Deposit Program", href: "https://www.dfas.mil/MilitaryMembers/payentitlements/sdp/" }],
      }),
    );
  }

  if (isServing(p.status) || p.status === "retired" || p.status === "gray") {
    cards.push(
      card({
        id: "tsp",
        category: "money",
        title: "Thrift Savings Plan",
        dek: "The retirement account that comes out of uniformed pay. Matching depends on whether you are in the Blended Retirement System.",
        who: ["sponsor"],
        why: "If you are serving, this is the cheapest serious retirement account you have. If you already left, the account stays yours. VA disability pay cannot be contributed.",
        cost: "No premium. Expense ratios are low. The match, if you are BRS, is part of your pay only if you contribute enough to earn it.",
        steps: [
          "Log in at TSP.gov, not a commercial site using the same initials.",
          "BRS members: confirm you are contributing at least enough to get the full match.",
          "After you leave, you can leave the money, roll it, or both. Do not cash it out on separation day without reading the tax line.",
        ],
        links: [{ label: "TSP for uniformed services", href: "https://www.tsp.gov/uniformed-services/" }],
      }),
    );
  }

  cards.push(
    card({
      id: "pay-systems",
      category: "money",
      title: "Where the money actually moves",
      dek: "myPay is DFAS. VA pays VA benefits on a different deposit. They do not update each other.",
      who: ["sponsor", "spouse"],
      why: "Allotments, tax forms, and a retiree account live in myPay. Compensation, pension, and education payments live in the VA direct-deposit profile.",
      cost: "Free. A wrong account number is the expensive version.",
      steps: [
        isServing(p.status) || p.status === "retired" || p.status === "gray"
          ? "Use myPay for LES, allotments, and, if you are retired, the retiree account."
          : "If you no longer have a myPay account, your VA and civilian bank are the two that matter.",
        "Set VA direct deposit inside VA.gov after you can sign in with Login.gov or ID.me.",
        "The Military Star card is a store card for the exchange. It is not a benefit. The interest is high. Do not confuse it with a military bank.",
      ],
      links: [
        { label: "myPay", href: "https://mypay.dfas.mil/" },
        { label: "VA.gov", href: "https://www.va.gov/" },
      ],
    }),
  );

  cards.push(
    card({
      id: "va-loan",
      category: "money",
      title: "VA home loan",
      dek: "A guaranty that lets a private lender make a mortgage with no down payment, if you have enough entitlement and you qualify for the loan.",
      who: ["sponsor", "spouse"],
      why: "Most people who served a qualifying period, including many in the Guard and Reserve, can get a Certificate of Eligibility. The lender still has to approve your credit and income.",
      cost: "No monthly premium to VA. Most borrowers pay a funding fee unless they have a qualifying disability compensation exemption. The interest rate is the lender's rate, not a special VA rate.",
      steps: [
        "Get the Certificate of Eligibility on VA.gov before you shop, or let the lender pull it.",
        "Compare at least two VA-approved lenders. VA does not set one rate.",
        "A surviving spouse may have entitlement of their own. Read the survivor rules rather than assuming the certificate died with the sponsor.",
      ],
      links: [{ label: "VA home loans", href: "https://www.va.gov/housing-assistance/home-loans/" }],
    }),
  );

  const tuition = stateCards(p);
  cards.push(...tuition);

  if (p.place && p.place !== "OVERSEAS") {
    cards.push(
      card({
        id: "state-office",
        category: "money",
        title: `${placeLabel(p.place)} veterans office`,
        dek: "Property tax relief, state tuition, burial, license plates, and hunting licenses are state law. VA.gov does not run them.",
        who: ["sponsor", "spouse", "child"],
        why: `You live in ${placeLabel(p.place)}. The state office is the regional layer under the federal benefits on this page.`,
        cost: "Depends on the state. Some are worth more than a year of TRICARE premiums. Some are a license plate.",
        steps: [
          tuition.length
            ? "The state tuition card in School and credentials is the one that matched this household. Ask the office what else exists. Tax breaks are not on that card."
            : hasStateProgram(p.place)
              ? "This state has a tuition program on this desk, and it did not match the people you marked. Often the spouse or the child is the student, not the member."
              : "This desk has not read a specific tuition program for this state. That is not a no. Start here. Do not borrow another state's rule.",
          p.status === "guard"
            ? "Ask the state Guard education office about state tuition assistance. That money is not the GI Bill and not federal Tuition Assistance."
            : "Ask what the state offers a veteran, a drilling member, a spouse, and a survivor. The lists are different.",
          "Use the national directory if you are not sure you have the real state site. Look for a .gov address.",
        ],
        links: [
          {
            label: "State departments of veterans affairs",
            href: "https://department.va.gov/about/state-departments-of-veterans-affairs/",
          },
        ],
      }),
    );
  }

  if (selectedReserve(p)) {
    cards.push(
      card({
        id: "userra",
        category: "money",
        title: "Your civilian job when orders start",
        dek: "USERRA protects reemployment after qualifying military service. It is not a paycheck while you are gone. It is the right to come back.",
        who: ["sponsor"],
        why: "You are in the Guard or Reserve. The financial hit of orders is often the civilian job, not the health plan.",
        cost: "Free to assert. Employer health coverage has continuation rules of its own during service.",
        steps: [
          "Give the employer notice when you can, keep the orders, and read the return-to-work deadlines before you take extra leave at the end.",
          "Pension and seniority rules are part of USERRA. HR's first answer is not always the rule.",
        ],
        links: [{ label: "Department of Labor USERRA", href: "https://www.dol.gov/agencies/vets/programs/userra" }],
      }),
    );
  }

  if (isServing(p.status)) {
    const portal = credentialPortal(p);
    cards.push(
      card({
        id: "ta",
        category: "training",
        title: "Tuition Assistance",
        dek: `Classes while you serve, paid by the ${branchLabel(p.branch)}, inside a cap and a portal that will reject a late request.`,
        who: ["sponsor"],
        why: "You are serving, so this pot exists. It is not the GI Bill. Using both in the same term has rules, and the housing allowance on the GI Bill is limited while you are on active duty.",
        cost: "Tuition Assistance has an annual cap by service. You may still owe fees the cap does not cover. Army TA and Credentialing Assistance share a combined ceiling. Confirm the dollar figure in the portal for this fiscal year.",
        steps: [
          portal.step,
          "Get the approval before you start class or pay a school. A verbal yes from a counselor is not the approval.",
          "Guard and Reserve Tuition Assistance has extra duty-status rules. Ask the unit education office, not a civilian school recruiter.",
        ],
        links: portal.links,
      }),
    );
    cards.push(credentialCard(p));
  }

  if (p.status === "active") {
    cards.push(
      card({
        id: "skillbridge",
        category: "training",
        title: "SkillBridge",
        dek: "A civilian internship or training in the last stretch of active duty, if the command says the mission can spare you.",
        who: ["sponsor"],
        why: "You are active duty. This is not a benefit you download. It is a command decision, usually inside 180 days of separation.",
        cost: "You keep military pay and benefits during an approved program. The company is not supposed to pay you a wage that replaces that. Read the current DoD rule.",
        steps: [
          "Pick a program on the official SkillBridge site, then route the request through your command.",
          "The Navy uses MyNavy Education and rank tiers. Other services have their own caps. None of them make it an entitlement.",
        ],
        links: [{ label: "SkillBridge", href: "https://skillbridge.osd.mil/" }],
      }),
    );
  }

  cards.push(
    card({
      id: "gibill",
      category: "training",
      title: "The GI Bill",
      dek: "Post-9/11 is the one most people who served after September 10, 2001 are asking about. Montgomery and Selected Reserve chapters still exist for people who elected them.",
      who: ["sponsor", "spouse", "child"],
      why: giWhy(p),
      cost: "Post-9/11 can pay tuition, a housing allowance, and a book stipend, based on how much qualifying active service you have and whether you study in person. It is not a cash bonus.",
      steps: [
        "Pull your statement of benefits on VA.gov before a school certifies you.",
        "Compare Post-9/11 with Montgomery only if you actually paid into Montgomery. The comparison tool is on VA.gov. Do not let a school pick for you.",
        "Licensing tests, certification tests, and apprenticeships can be reimbursed under the GI Bill. That is a different request from a degree.",
        isServing(p.status)
          ? "Transferring Post-9/11 to a spouse or child has to happen while you are still in, with a service obligation. You cannot transfer it after you separate."
          : "If the sponsor did not transfer the benefit while serving, the family cannot use the sponsor's Post-9/11 months. Chapter 35 is a different benefit.",
      ],
      links: [
        { label: "GI Bill benefits", href: "https://www.va.gov/education/about-gi-bill-benefits/" },
        { label: "Post-9/11", href: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/" },
        { label: "Compare and apply", href: "https://www.va.gov/education/how-to-apply/" },
      ],
    }),
  );

  if (selectedReserve(p)) {
    cards.push(
      card({
        id: "1606",
        category: "training",
        title: "Montgomery GI Bill for the Selected Reserve",
        dek: "Chapter 1606. A monthly payment for drill-status members who meet the Reserve education criteria. It is smaller than a full Post-9/11 benefit.",
        who: ["sponsor"],
        why: "You are in the Selected Reserve. If you also have qualifying active service, you may have Post-9/11 as well. You generally cannot be paid both for the same class.",
        cost: "A monthly rate set by VA, not a tuition check to the school. Confirm you have a six-year obligation and a high-school diploma, which are the usual gates.",
        steps: [
          "Ask your unit to certify eligibility, then apply on VA.gov.",
          "Leaving the Selected Reserve usually stops 1606. Post-9/11 from earlier active service does not stop just because you stopped drilling.",
        ],
        links: [
          {
            label: "Montgomery Selected Reserve",
            href: "https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/",
          },
        ],
      }),
    );
  }

  if (p.rating !== "none" && p.status !== "survivor" && p.status !== "active") {
    cards.push(
      card({
        id: "vre",
        category: "training",
        title: "Veteran Readiness and Employment",
        dek: "Chapter 31. A counselor builds a plan so a service-connected condition does not keep you from working. It can pay training, books, and sometimes subsistence.",
        who: ["sponsor"],
        why: "You have a service-connected rating. VR&E is not the GI Bill, and using it can be the better door if you need a plan and not just a semester.",
        cost: "No tuition from you if the plan approves the program. You need an employment handicap. A 10% rating can be enough with a serious employment handicap. Otherwise 20% with an employment handicap is the usual gate.",
        steps: [
          "Apply on VA.gov. A counselor decides. A rating letter alone is not an approval.",
          "Most veterans who left service on or after January 1, 2013 are not stuck with the old 12-year clock. Confirm that on the VR&E page.",
          "Dental and other supportive services can be added if the plan requires them.",
        ],
        links: [{ label: "VR&E", href: "https://www.va.gov/careers-employment/vocational-rehabilitation/" }],
      }),
    );
  }

  if ((p.rating === "total" && p.status !== "active") || p.status === "survivor") {
    cards.push(
      card({
        id: "dea",
        category: "training",
        title: "Dependents' Educational Assistance",
        dek: "Chapter 35. A monthly education benefit for a spouse and children of a veteran who is permanent and total, or who died of a service-connected condition.",
        who: ["spouse", "child", "young"],
        why:
          p.status === "survivor"
            ? "Survivor education benefits are Chapter 35 and, in some line-of-duty deaths, the Fry Scholarship. They are not the same check."
            : "A total rating can open Chapter 35 for the family. It does not spend the veteran's own GI Bill months.",
        cost: "A monthly rate while the dependent is in school. It rarely covers a private university by itself. Pair it with state tuition waivers.",
        steps: [
          "Apply on VA.gov. Children generally have an age window. Spouses have a different window. Read both.",
          "If the sponsor died in the line of duty after September 10, 2001, also read the Fry Scholarship. You cannot be paid both for the same time.",
        ],
        links: [
          { label: "Chapter 35", href: "https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/" },
          { label: "Fry Scholarship", href: "https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/" },
        ],
      }),
    );
  }

  if ((p.status === "active" || p.status === "activated") && (p.spouse || p.role === "spouse")) {
    cards.push(
      card({
        id: "mycaa",
        category: "training",
        title: "MyCAA for a spouse",
        dek: "Up to $4,000 for a license, certification, or associate degree for spouses of early-career service members.",
        who: ["spouse"],
        why: "A spouse cannot use the member's Credentialing Assistance. MyCAA is the spouse program, and only in certain pay grades.",
        cost: "The cap is $4,000. It pays the school or the test, not a stipend to the spouse.",
        steps: [
          "The sponsor generally has to be active duty in grades E-1 through E-5, W-1 through W-2, or O-1 through O-2. Coast Guard is included. Guard and Reserve spouses qualify when the sponsor is on qualifying Title 10 orders.",
          "Apply on the MyCAA site before you start the class. A spouse of a higher grade is not eligible.",
        ],
        links: [{ label: "MyCAA", href: "https://mycaa.militaryonesource.mil/mycaa/" }],
      }),
    );
  }

  if (["veteran", "retired"].includes(p.status)) {
    cards.push(
      card({
        id: "vettec",
        category: "training",
        title: "VET TEC 2.0",
        dek: "High-tech training that reopened for applications on June 15, 2026. It is not a second GI Bill, and providers now have an employment or refund rule.",
        who: ["sponsor"],
        why: "You are separated or retired, so you are in the population this program was written for. You still have to meet the service and age rules.",
        cost: "Training is paid if you are approved. If you still have GI Bill entitlement, VA charges a month of that entitlement for a month of full-time training. If the GI Bill is exhausted, the charge does not apply.",
        steps: [
          "Confirm on VA.gov that you have at least 36 months of active duty, an other-than-dishonorable discharge, and that you are under 62.",
          "Pick a provider VA has approved. The reauthorization requires a 70% employment outcome or a tuition refund. Get that in the enrollment paperwork.",
          "Do not pay a deposit to a boot camp that is not on the VA list.",
        ],
        links: [{ label: "VA education benefits", href: "https://www.va.gov/education/" }],
        warning: "Rules for VET TEC have changed more than once. If the VA page disagrees with this card, the VA page wins.",
      }),
    );
  }

  return cards.filter((item) => item.who.length > 0);
}

function giWhy(p: Profile): string {
  if (p.status === "survivor" || p.role === "child" || p.role === "spouse") {
    return "Family members use a GI Bill only if it was transferred while the sponsor was still serving, or they use Chapter 35 or the Fry Scholarship instead.";
  }
  if (isServing(p.status)) {
    return "You can sometimes use it while you serve, but the housing allowance is limited on active duty. Transferring it to the family has to happen before you leave.";
  }
  return "This is the education benefit tied to your own service. Pull the months you have left before a school tells you what you have left.";
}

function credentialPortal(p: Profile): { step: string; links: Card["links"] } {
  switch (p.branch) {
    case "army":
      return {
        step: "Army requests go through ArmyIgnitED. Put the request in 45 to 90 days before the class. Inside 45 days it will not take the request.",
        links: [
          { label: "ArmyIgnitED", href: "https://www.armyignited.army.mil/student/public/welcome" },
          { label: "Army COOL", href: "https://www.cool.osd.mil/army/" },
        ],
      };
    case "navy":
      return {
        step: "Navy tuition assistance and funded credentials go through Navy COOL and MyNavy Education. Your command education office has to touch it.",
        links: [
          { label: "Navy COOL", href: "https://www.cool.osd.mil/navy/" },
          { label: "MyNavy Education", href: "https://myeducation.netc.navy.mil/" },
        ],
      };
    case "marines":
      return {
        step: "Marine Corps tuition assistance starts at your education center. Use Marine COOL to see which credentials match the MOS before you pay an exam fee.",
        links: [
          { label: "Marine COOL", href: "https://www.cool.osd.mil/usmc/" },
          { label: "MCCS voluntary education", href: "https://www.usmc-mccs.org/services/education" },
        ],
      };
    case "air-force":
    case "space-force":
      return {
        step: "Air Force and Space Force use AFVEC. Do not use ArmyIgnitED. Space Force follows the Air Force education systems.",
        links: [
          { label: "AFVEC", href: "https://afvec.us.af.mil/" },
          { label: "Air Force COOL", href: "https://www.cool.osd.mil/usaf/" },
        ],
      };
    case "coast-guard":
      return {
        step: "Coast Guard tuition assistance is requested through your Education Services Officer. COOL shows the credentials. Do not open an Army or Navy portal and hope.",
        links: [{ label: "Coast Guard COOL", href: "https://www.cool.osd.mil/uscg/" }],
      };
    default:
      return {
        step: "Use your service education portal.",
        links: [{ label: "COOL", href: "https://www.cool.osd.mil/" }],
      };
  }
}

function credentialCard(p: Profile): Card {
  if (p.branch === "army") {
    return card({
      id: "credential",
      category: "training",
      title: "Army Credentialing Assistance",
      dek: "Pays for approved credentials for enlisted soldiers and warrant officers. Commissioned officers cannot open a new goal after March 19, 2026.",
      who: ["sponsor"],
      why: "You are in the Army, including the Reserve Component. This is the credential pot. Your family cannot use it.",
      cost: "$2,000 in a fiscal year is the cap Army has published, with $1,000 for some aviation credentials, inside a combined Tuition Assistance and CA ceiling. One credential a year, and three in ten years. Confirm the cap in ArmyIgnitED. Fiscal year 2027 started October 1, 2026.",
      steps: [
        "First-time users complete the Army decision support tool and load it into ArmyIgnitED.",
        "Pick a credential that Army COOL lists, from a vendor ArmyIgnitED already has.",
        "Submit 45 to 90 days before the course or exam. Officers with a goal already underway before March 19, 2026 may still finish that goal. They cannot start a new one.",
      ],
      links: [
        { label: "Army COOL", href: "https://www.cool.osd.mil/army/" },
        { label: "ArmyIgnitED", href: "https://www.armyignited.army.mil/student/public/welcome" },
      ],
    });
  }
  if (p.branch === "air-force" || p.branch === "space-force") {
    return card({
      id: "credential",
      category: "training",
      title: p.branch === "space-force" ? "Space Force credentials through AF COOL" : "Air Force COOL",
      dek: "Funds credentials tied to your AFSC, with skill-level and conduct rules. The Air Force has used a lifetime cap. Read the current one in AFVEC.",
      who: ["sponsor"],
      why: "Enlisted airmen, and guardians using the same system, request this in AFVEC. A five-skill level in the primary AFSC is a common gate. Guard and Reserve on active-duty orders have a path. A spouse does not.",
      cost: "There is a lifetime dollar cap and a limit on credentials outside your AFSC. Do not memorize an old number. AFVEC is the record.",
      steps: [
        "Look the credential up on AF COOL, then request it in AFVEC with supervisor approval.",
        "Give the supervisor time. A request that sits can drop.",
      ],
      links: [
        { label: "AF COOL", href: "https://www.cool.osd.mil/usaf/" },
        { label: "AFVEC", href: "https://afvec.us.af.mil/" },
      ],
    });
  }
  const portal = credentialPortal(p);
  return card({
    id: "credential",
    category: "training",
    title: `${branchLabel(p.branch)} credentials`,
    dek: "Exam fees and some training for credentials your service has tied to the job. The family cannot use this pot.",
    who: ["sponsor"],
    why: `You are serving in the ${branchLabel(p.branch)}. The credential site is not the same as Tuition Assistance, even when one portal holds both.`,
    cost: "Each service caps the dollars and the number of credentials. The COOL page for your branch is the list. The funding request is a separate approval.",
    steps: [
      "Find the credential on your service COOL page before you pay a vendor.",
      portal.step,
    ],
    links: portal.links,
  });
}

export function closedDoors(p: Profile): ClosedDoor[] {
  const doors: ClosedDoor[] = [];
  if (selectedReserve(p) && p.transition !== "within-180") {
    doors.push({
      title: "TRICARE Prime is not your drilling plan",
      reason: "Prime for the member turns on with active duty or with orders of more than 30 days. A drill weekend does not enroll the family.",
    });
  }
  if (p.status === "irr") {
    doors.push({
      title: "TRICARE Reserve Select is closed",
      reason: "That plan is for the Selected Reserve. The IRR does not buy it. Look at TAMP, CHCBP, VA care, or a civilian plan.",
    });
  }
  if (p.status === "veteran") {
    doors.push({
      title: "Retiree TRICARE is closed",
      reason: "Separation without retired pay does not bring Prime or Select. TAMP and CHCBP are the only TRICARE bridges, and both are time-limited.",
    });
  }
  if (["retired", "gray"].includes(p.status)) {
    doors.push({
      title: "The TRICARE Dental Program is closed",
      reason: "Retirees and gray-area retirees use FEDVIP dental through BENEFEDS.",
    });
  }
  if (p.status === "retired" || (p.status === "survivor" && p.survivorKind !== "died-veteran")) {
    doors.push({
      title: "CHAMPVA is closed",
      reason: "A family that can get TRICARE cannot have CHAMPVA. Use Prime, Select, or TRICARE For Life.",
    });
  }
  if (p.status === "active") {
    doors.push({
      title: "The service member cannot enroll in Select or the US Family Health Plan",
      reason: "Those are family and retiree choices. Your plan is Prime.",
    });
  }
  if (!isServing(p.status) && p.status !== "survivor") {
    doors.push({
      title: "SGLI is not a veteran policy",
      reason: "It lasts 120 days after the period of coverage ends. The replacement you apply for is VGLI, or a commercial policy, or VALife if you only need a small amount and you have a rating.",
    });
  }
  if (p.federalJob && selectedReserve(p)) {
    doors.push({
      title: "Reserve Select is probably closed",
      reason: "Eligibility for a federal employee health plan blocks it. Declining FEHB does not fix that.",
    });
  }
  return doors;
}

export function buildBrief(p: Profile): Brief {
  const cards = allCards(p).filter((item) => item.who.some((who) => personOn(p, who)));
  return { cards, closed: closedDoors(p) };
}

export const COMPARE: { id: string; title: string; lines: string[] }[] = [
  {
    id: "prime-member",
    title: "Prime, service member",
    lines: ["No premium", "Military clinic first", "Not optional while you are on active duty"],
  },
  {
    id: "prime-select",
    title: "Prime or Select",
    lines: [
      "Prime: a primary care manager and referrals",
      "Select: choose civilian doctors, pay a cost-share",
      "Retirees pay an enrollment fee on both",
    ],
  },
  {
    id: "usfhp",
    title: "US Family Health Plan",
    lines: ["Prime fees, civilian network", "No military hospital, no Express Scripts", "Only if the ZIP is in the plan"],
  },
  {
    id: "trs",
    title: "Reserve Select",
    lines: ["Monthly premium", "Works like Select", "Buy it any month you qualify"],
  },
  {
    id: "trr",
    title: "Retired Reserve",
    lines: ["Higher premium than Reserve Select", "Until retired pay starts", "Then move to retiree TRICARE"],
  },
  {
    id: "tfl",
    title: "TRICARE For Life",
    lines: ["Medicare first, in the United States", "Part B is required", "No extra TRICARE enrollment form"],
  },
  {
    id: "tamp",
    title: "TAMP",
    lines: ["Premium-free, 180 days", "Only some separations and activations", "Do not pay for Reserve Select during it"],
  },
];
