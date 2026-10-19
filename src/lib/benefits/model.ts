export const STATUS_OPTIONS = [
  { id: "active", label: "Active duty" },
  { id: "guard", label: "National Guard, drilling (not on long orders)" },
  { id: "reserve", label: "Reserve, drilling (not on long orders)" },
  { id: "activated", label: "Guard or Reserve on orders of more than 30 days" },
  { id: "irr", label: "Individual Ready Reserve, not drilling" },
  { id: "retired", label: "Retired and receiving retired pay" },
  { id: "gray", label: "Gray-area retiree (reserve retirement, not yet drawing pay)" },
  { id: "veteran", label: "Veteran, separated, not retired" },
] as const;

export const SURVIVOR_OPTIONS = [
  { id: "died-active", label: "Died on active duty" },
  { id: "died-retiree", label: "Was retired and receiving retired pay" },
  { id: "died-veteran", label: "Was a veteran who was totally disabled, or died of a service-connected condition" },
] as const;

export const BRANCHES = [
  { id: "army", label: "Army" },
  { id: "navy", label: "Navy" },
  { id: "marines", label: "Marine Corps" },
  { id: "air-force", label: "Air Force" },
  { id: "space-force", label: "Space Force" },
  { id: "coast-guard", label: "Coast Guard" },
] as const;

export const AGES = [
  { id: "under-60", label: "Under 60" },
  { id: "60-64", label: "60 to 64" },
  { id: "65-plus", label: "65 or older" },
] as const;

export const RATINGS = [
  { id: "none", label: "No service-connected rating" },
  { id: "service-connected", label: "Service-connected, not 100% or unemployable" },
  { id: "total", label: "100%, permanent and total, or unemployable (IU)" },
] as const;

export const MEDICARE_OPTIONS = [
  { id: "none", label: "No one has Medicare" },
  { id: "sponsor", label: "Sponsor has Medicare Part A and Part B" },
  { id: "spouse", label: "Spouse has Medicare Part A and Part B" },
  { id: "both", label: "Sponsor and spouse both have Part A and Part B" },
  { id: "a-only", label: "Someone has Part A but not Part B" },
] as const;

export const ROLES = [
  { id: "sponsor", label: "The service member or veteran" },
  { id: "spouse", label: "A spouse" },
  { id: "child", label: "An adult child" },
  { id: "survivor", label: "A surviving family member" },
] as const;

export const PLACES = [
  { id: "AL", label: "Alabama" },
  { id: "AK", label: "Alaska" },
  { id: "AZ", label: "Arizona" },
  { id: "AR", label: "Arkansas" },
  { id: "CA", label: "California" },
  { id: "CO", label: "Colorado" },
  { id: "CT", label: "Connecticut" },
  { id: "DE", label: "Delaware" },
  { id: "DC", label: "District of Columbia" },
  { id: "FL", label: "Florida" },
  { id: "GA", label: "Georgia" },
  { id: "HI", label: "Hawaii" },
  { id: "ID", label: "Idaho" },
  { id: "IL", label: "Illinois" },
  { id: "IN", label: "Indiana" },
  { id: "IA", label: "Iowa" },
  { id: "KS", label: "Kansas" },
  { id: "KY", label: "Kentucky" },
  { id: "LA", label: "Louisiana" },
  { id: "ME", label: "Maine" },
  { id: "MD", label: "Maryland" },
  { id: "MA", label: "Massachusetts" },
  { id: "MI", label: "Michigan" },
  { id: "MN", label: "Minnesota" },
  { id: "MS", label: "Mississippi" },
  { id: "MO", label: "Missouri" },
  { id: "MT", label: "Montana" },
  { id: "NE", label: "Nebraska" },
  { id: "NV", label: "Nevada" },
  { id: "NH", label: "New Hampshire" },
  { id: "NJ", label: "New Jersey" },
  { id: "NM", label: "New Mexico" },
  { id: "NY", label: "New York" },
  { id: "NC", label: "North Carolina" },
  { id: "ND", label: "North Dakota" },
  { id: "OH", label: "Ohio" },
  { id: "OK", label: "Oklahoma" },
  { id: "OR", label: "Oregon" },
  { id: "PA", label: "Pennsylvania" },
  { id: "RI", label: "Rhode Island" },
  { id: "SC", label: "South Carolina" },
  { id: "SD", label: "South Dakota" },
  { id: "TN", label: "Tennessee" },
  { id: "TX", label: "Texas" },
  { id: "UT", label: "Utah" },
  { id: "VT", label: "Vermont" },
  { id: "VA", label: "Virginia" },
  { id: "WA", label: "Washington" },
  { id: "WV", label: "West Virginia" },
  { id: "WI", label: "Wisconsin" },
  { id: "WY", label: "Wyoming" },
  { id: "PR", label: "Puerto Rico" },
  { id: "GU", label: "Guam" },
  { id: "VI", label: "U.S. Virgin Islands" },
  { id: "AS", label: "American Samoa" },
  { id: "MP", label: "Northern Mariana Islands" },
  { id: "OVERSEAS", label: "Overseas, not a U.S. state or territory" },
] as const;

export type StatusId = (typeof STATUS_OPTIONS)[number]["id"];
export type Status = StatusId | "survivor";
export type SurvivorKind = (typeof SURVIVOR_OPTIONS)[number]["id"];
export type Branch = (typeof BRANCHES)[number]["id"];
export type AgeBand = (typeof AGES)[number]["id"];
export type Rating = (typeof RATINGS)[number]["id"];
export type Medicare = (typeof MEDICARE_OPTIONS)[number]["id"];
export type Role = (typeof ROLES)[number]["id"];
export type Place = (typeof PLACES)[number]["id"];
export type Transition = "still" | "within-180" | "within-18-months" | "longer";
export type Who = "sponsor" | "spouse" | "child" | "young";

export interface Profile {
  role: Role;
  status: Status;
  survivorKind: SurvivorKind;
  branch: Branch;
  place: Place | "";
  spouse: boolean;
  kidsUnder21: boolean;
  students21to23: boolean;
  youngAdults: boolean;
  incapacitatedChild: boolean;
  sponsorAge: AgeBand;
  spouseAge: AgeBand;
  rating: Rating;
  medicare: Medicare;
  transition: Transition;
  federalJob: boolean;
  sah: boolean;
}

export interface LinkItem {
  label: string;
  href: string;
}

export type Category = "medical" | "dental" | "vision" | "life" | "money" | "training";

export interface Card {
  id: string;
  category: Category;
  title: string;
  dek: string;
  who: Who[];
  why: string;
  cost: string;
  steps: string[];
  links: LinkItem[];
  warning?: string;
}

export interface ClosedDoor {
  title: string;
  reason: string;
}

export type RegionId = "east" | "west" | "split" | "overseas";

export interface RegionInfo {
  id: RegionId;
  title: string;
  detail: string;
  contacts: { name: string; phone?: string; href: string }[];
}

export const emptyProfile = (): Profile => ({
  role: "sponsor",
  status: "active",
  survivorKind: "died-veteran",
  branch: "army",
  place: "",
  spouse: false,
  kidsUnder21: false,
  students21to23: false,
  youngAdults: false,
  incapacitatedChild: false,
  sponsorAge: "under-60",
  spouseAge: "under-60",
  rating: "none",
  medicare: "none",
  transition: "still",
  federalJob: false,
  sah: false,
});

const base = (): Profile => ({
  ...emptyProfile(),
  spouse: true,
  kidsUnder21: true,
});

export const HOUSEHOLDS: { id: string; label: string; profile: Profile }[] = [
  {
    id: "navy-va",
    label: "Active duty Navy family in Virginia",
    profile: { ...base(), status: "active", branch: "navy", place: "VA" },
  },
  {
    id: "reserve-tx",
    label: "Drilling Army Reserve household in Texas",
    profile: { ...base(), status: "reserve", branch: "army", place: "TX" },
  },
  {
    id: "retired-fl",
    label: "Retired Air Force household in Florida",
    profile: {
      ...base(),
      status: "retired",
      branch: "air-force",
      place: "FL",
      kidsUnder21: false,
      rating: "total",
    },
  },
  {
    id: "vet-ca",
    label: "California veteran with a spouse and a child",
    profile: {
      ...base(),
      status: "veteran",
      branch: "marines",
      place: "CA",
      rating: "service-connected",
    },
  },
  {
    id: "guard-ga",
    label: "Georgia Guard member, for that state's loan only",
    profile: { ...base(), status: "guard", branch: "army", place: "GA" },
  },
];

export const sampleProfile = (): Profile => HOUSEHOLDS[0].profile;

const WEST = new Set<Place>([
  "AK", "AZ", "CA", "CO", "HI", "ID", "IL", "IA", "KS", "LA", "MN", "MT", "NE", "NV", "NM",
  "ND", "OK", "OR", "SD", "TX", "UT", "WA", "WY",
]);

const SPLIT = new Set<Place>(["AR", "IN", "MO", "WI"]);

const OVERSEAS = new Set<Place>(["PR", "GU", "VI", "AS", "MP", "OVERSEAS"]);

export const USFHP_NOTE: Partial<Record<Place, string>> = {
  CA: "Pacific Medical Centers covers most of California, not every county.",
  CT: "Northern Connecticut is Brighton Marine. Western Connecticut, including the Hartford and New London areas, is St. Vincent. Confirm the ZIP.",
  DE: "Johns Hopkins covers parts of Delaware.",
  DC: "Johns Hopkins covers Washington, D.C.",
  ID: "Pacific Medical Centers covers northern Idaho only.",
  LA: "CHRISTUS covers central Louisiana, not the whole state.",
  ME: "Martin's Point covers Maine.",
  MD: "Johns Hopkins covers Maryland.",
  MA: "Brighton Marine covers Massachusetts.",
  NH: "Martin's Point covers New Hampshire.",
  NJ: "St. Vincent covers New Jersey.",
  NY: "Martin's Point covers upstate and western New York. St. Vincent covers New York City, Long Island, and the lower Hudson Valley.",
  OH: "Martin's Point covers northeastern and central Ohio, not the whole state.",
  OR: "Pacific Medical Centers covers western Oregon.",
  PA: "Parts of Pennsylvania are Johns Hopkins, Martin's Point, or St. Vincent. The ZIP decides.",
  RI: "Brighton Marine covers Rhode Island.",
  TX: "CHRISTUS covers regions of Texas (central, Coastal Bend, northeast, and southeast), not every county.",
  VT: "Martin's Point covers Vermont.",
  VA: "Johns Hopkins covers parts of Virginia.",
  WA: "Pacific Medical Centers covers most of Washington.",
  WV: "Johns Hopkins covers parts of West Virginia.",
};

export function placeLabel(id: Place | ""): string {
  return PLACES.find((p) => p.id === id)?.label ?? "an unselected place";
}

export function statusLabel(status: Status): string {
  if (status === "survivor") return "Surviving family";
  return STATUS_OPTIONS.find((s) => s.id === status)?.label ?? status;
}

export function branchLabel(branch: Branch): string {
  return BRANCHES.find((b) => b.id === branch)?.label ?? branch;
}

export function normalize(p: Profile): Profile {
  const role = p.role;
  const status: Status = role === "survivor" ? "survivor" : p.status === "survivor" ? "veteran" : p.status;
  const spouse = role === "spouse" ? true : p.spouse;
  const transition: Transition =
    status === "active" || status === "activated" || status === "survivor" ? "still" : p.transition;
  return { ...p, role, status, spouse, transition };
}

export function regionFor(place: Place | ""): RegionInfo {
  if (!place) {
    return {
      id: "east",
      title: "Pick a state to see the contractor",
      detail: "TRICARE is run in three regions. The address in DEERS, not the state on your driver's license from years ago, is the one that counts.",
      contacts: [{ name: "TRICARE region tool", href: "https://tricare.mil/Regions" }],
    };
  }
  if (OVERSEAS.has(place)) {
    return {
      id: "overseas",
      title: "TRICARE Overseas",
      detail:
        "U.S. territories and every other overseas location are the Overseas Region. International SOS is the contractor, split into three areas. Use the phone number TRICARE lists for the country you are in. Do not call Humana Military or TriWest for overseas care.",
      contacts: [
        { name: "TRICARE regions and overseas numbers", href: "https://tricare.mil/Regions" },
        { name: "International SOS beneficiary site", href: "https://www.tricare-overseas.com/" },
      ],
    };
  }
  if (SPLIT.has(place)) {
    return {
      id: "split",
      title: `${placeLabel(place)} is a split state`,
      detail:
        "Some ZIP codes here are TRICARE East (Humana Military). Some are TRICARE West (TriWest). Home Station will not guess. Run the ZIP code tool before you call, because the wrong contractor cannot see your referral.",
      contacts: [
        { name: "Humana Military, East", phone: "800-444-5445", href: "https://www.humanamilitary.com/" },
        { name: "TriWest, West", phone: "888-874-9378", href: "https://tricare.triwest.com/" },
        { name: "Official ZIP tool", href: "https://tricare.mil/Regions" },
      ],
    };
  }
  if (WEST.has(place)) {
    return {
      id: "west",
      title: "TRICARE West",
      detail: `${placeLabel(place)} is in the West Region. TriWest Healthcare Alliance handles enrollment support, referrals, and claims for Prime, Select, Reserve Select, Retired Reserve, and Young Adult.`,
      contacts: [
        { name: "TriWest Healthcare Alliance", phone: "888-874-9378", href: "https://tricare.triwest.com/" },
        { name: "Confirm on TRICARE", href: "https://tricare.mil/Regions" },
      ],
    };
  }
  return {
    id: "east",
    title: "TRICARE East",
    detail: `${placeLabel(place)} is in the East Region. Humana Military handles enrollment support, referrals, and claims for Prime, Select, Reserve Select, Retired Reserve, and Young Adult.`,
    contacts: [
      { name: "Humana Military", phone: "800-444-5445", href: "https://www.humanamilitary.com/" },
      { name: "Confirm on TRICARE", href: "https://tricare.mil/Regions" },
    ],
  };
}

export function demoNote(place: Place | ""): string | null {
  if (place === "GA") {
    return "Atlanta exception: if you live in the TRICARE Prime Demo area, CareSource Military and Veterans at 833-230-2080 may run Prime instead of Humana Military. Confirm before you call.";
  }
  if (place === "FL") {
    return "Tampa exception: if you live in the TRICARE Prime Demo area, CareSource Military and Veterans at 833-230-2080 may run Prime instead of Humana Military. Confirm before you call.";
  }
  return null;
}

export function personOn(p: Profile, who: Who): boolean {
  if (who === "sponsor") return true;
  if (who === "spouse") return p.spouse || p.role === "spouse";
  if (who === "child") return p.kidsUnder21 || p.students21to23 || p.incapacitatedChild || p.role === "child";
  return p.youngAdults || p.role === "child";
}

export function peopleLabels(role: Role): Record<Who, string> {
  if (role === "spouse") {
    return { sponsor: "Sponsor", spouse: "You", child: "Children", young: "Young adults" };
  }
  if (role === "child") {
    return { sponsor: "Sponsor", spouse: "Sponsor's spouse", child: "Children", young: "You" };
  }
  if (role === "survivor") {
    return { sponsor: "The sponsor", spouse: "Surviving spouse", child: "Children", young: "Young adults" };
  }
  return { sponsor: "You", spouse: "Spouse", child: "Children", young: "Young adults" };
}

const SERVING = new Set<Status>(["active", "guard", "reserve", "activated"]);

export function isServing(status: Status): boolean {
  return SERVING.has(status);
}

export function tricareFamilyStatus(status: Status, survivorKind: SurvivorKind): boolean {
  if (status === "survivor") return survivorKind !== "died-veteran";
  return ["active", "activated", "retired", "gray", "guard", "reserve"].includes(status);
}

export function sponsorMedicare(p: Profile): boolean {
  return p.medicare === "sponsor" || p.medicare === "both";
}

export function spouseMedicare(p: Profile): boolean {
  return p.medicare === "spouse" || p.medicare === "both";
}

export function showTransition(status: Status): boolean {
  return !["active", "activated", "survivor"].includes(status);
}

export function transitionOptions(status: Status): { id: Transition; label: string }[] {
  if (status === "veteran") {
    return [
      { id: "within-180", label: "Separated from active duty within the last 180 days" },
      { id: "within-18-months", label: "Separated within the last 18 months, but not the last 180 days" },
      { id: "longer", label: "Separated more than 18 months ago" },
    ];
  }
  if (status === "retired" || status === "gray") {
    return [
      { id: "within-180", label: "Retirement or separation within the last 180 days" },
      { id: "within-18-months", label: "Within the last 18 months, but not the last 180 days" },
      { id: "longer", label: "More than 18 months ago" },
      { id: "still", label: "Not sure / it has been a while" },
    ];
  }
  return [
    { id: "still", label: "Still in this status, no recent end of long orders" },
    { id: "within-180", label: "Came off active-duty orders within the last 180 days" },
    { id: "within-18-months", label: "Orders ended within 18 months, but not the last 180 days" },
    { id: "longer", label: "Long orders ended more than 18 months ago" },
  ];
}

export function lede(p: Profile): string {
  switch (p.status) {
    case "active":
      return "Active duty medical care is Prime, not a menu. The choices that matter are your family's plan, dental, the life insurance that ends when you take the uniform off, and the school benefits you can use now or transfer.";
    case "activated":
      return "Orders of more than 30 days turn on active-duty TRICARE for you and a Prime or Select choice for your family. Dental moves with the orders. When the orders end, the plan changes again.";
    case "guard":
    case "reserve":
      return "A drill status does not come with free family health insurance. TRICARE Reserve Select is a plan you buy, unless a federal employee health plan blocks it. Teeth, eyes, SGLI, and state education money are separate doors.";
    case "irr":
      return "The Individual Ready Reserve does not get TRICARE Reserve Select. What you can still use depends on how recently you left active duty, whether you qualify for VA care, and whether SGLI is actually still in force.";
    case "retired":
      return "Retired pay brings TRICARE back, with an enrollment fee for most people under 65. At 65, Medicare Part B is what keeps TRICARE alive. Dental and glasses move to FEDVIP. SGLI does not follow you unless you replaced it.";
    case "gray":
      return "A reserve retirement letter is not the same as a retiree ID card with TRICARE. Until retired pay starts, the health plan you can buy is TRICARE Retired Reserve, and dental is FEDVIP, not the TRICARE Dental Program.";
    case "veteran":
      return "Separation ends TRICARE except for a short transitional window some people get. VA health care is the system that can replace it, and it is not an insurance card. Life insurance has a deadline. School benefits do not file themselves.";
    case "survivor":
      return p.survivorKind === "died-veteran"
        ? "This household is not a TRICARE household. The doors that may be open are CHAMPVA, Dependent's Educational Assistance, and VA life or indemnity benefits tied to the veteran's record."
        : "Survivors of a retiree, or of a member who died on active duty, usually keep TRICARE if DEERS is updated. That is a different door from CHAMPVA, which is for families who are not TRICARE-eligible.";
    default:
      return "Answer the worksheet and this desk will drop the plans that do not apply.";
  }
}

export function checklist(p: Profile): string[] {
  const items = [
    "Confirm every person in DEERS, with the address where you live now. A wrong address sends you to the wrong contractor.",
  ];
  if (isServing(p.status)) {
    items.push("Open SOES from milConnect and read the SGLI amount and the beneficiary. Reducing coverage notifies a spouse. It does not ask if you meant to.");
  }
  if ((p.status === "guard" || p.status === "reserve") && p.federalJob) {
    items.push("You marked a federal employee health plan. That usually blocks TRICARE Reserve Select. Verify before you pay a premium you cannot use.");
  } else if (p.status === "guard" || p.status === "reserve") {
    items.push("If anyone in the household can get federal employee health benefits, stop and check. That eligibility usually blocks TRICARE Reserve Select.");
  }
  if (p.place && SPLIT.has(p.place)) {
    items.push("This state is split between East and West. Use the ZIP tool on TRICARE.mil before you book care.");
  }
  if (p.transition === "within-180" || p.transition === "within-18-months") {
    items.push("Put the separation date on a calendar. SGLI's free tail is 120 days. VGLI stays open for 1 year and 120 days, and the no-questions window is only the first 240 days.");
  }
  if (p.rating === "total" && (p.status === "veteran" || p.status === "gray")) {
    items.push("At a total rating, ask about VA dental and ask the family about CHAMPVA if they are not TRICARE-eligible. Those are the two benefits most often left unused.");
  }
  if (p.kidsUnder21) {
    items.push("A newborn is not in DEERS just because the hospital knows you are military. Add the child or the claims stop after a short window.");
  }
  return items.slice(0, 5);
}

export function thisWeek(p: Profile): string[] {
  if (p.status === "active" || p.status === "activated") {
    return [
      "Make sure the family is in DEERS and enrolled in Prime or Select, or in the US Family Health Plan if your ZIP is inside a designated area.",
      "Enroll family members in the TRICARE Dental Program if you want coverage. Your own dental as the service member goes through the military clinic or the Active Duty Dental Program.",
      "Confirm SGLI at the amount you actually want, up to $500,000, and Family SGLI for a spouse.",
      "If you are inside 180 days of leaving service, ask the command about SkillBridge and start the VGLI decision before the 120-day free tail.",
    ];
  }
  if (p.status === "guard" || p.status === "reserve") {
    const week = [
      "Price TRICARE Reserve Select only after you know FEHB is not available. Compare it with a civilian employer plan, not with active-duty Prime.",
      "Enroll dental separately in the TRICARE Dental Program. Reserve Select does not include teeth.",
      "Check SGLI and Family SGLI in SOES. Part-time coverage is real coverage only if it is actually on your record.",
      p.branch === "army"
        ? "If you want a credential this year, start in ArmyIgnitED 45 to 90 days before the course. Inside 45 days the request will not go."
        : "Ask your unit education office which portal pays for tuition assistance and credentials in your component. It is not the same website for every branch.",
    ];
    if (p.place === "GA" && p.status === "guard") {
      week.push(
        "If you are in the Georgia National Guard and in school in Georgia, start the Service Cancelable Loan on GAfutures: Part A yourself, Part B at the Guard, Part C at the financial aid office before the term ends. File it every year. It is not Tuition Assistance.",
      );
    }
    return week;
  }
  if (p.status === "veteran" || p.status === "irr") {
    return [
      "Apply for VA health care even if you already have another plan. Enrollment is free. Copays, if any, depend on your priority group.",
      "If you left service with SGLI, check whether VGLI is still open. It does not start unless you apply.",
      "If you have any service-connected rating, read VALife. If the rating is total, ask about dental and about CHAMPVA for the family.",
      "Pull your GI Bill statement of benefits before a school asks you to sign an enrollment certificate.",
    ];
  }
  if (p.status === "retired" || p.status === "gray") {
    return [
      p.status === "gray"
        ? "Decide whether TRICARE Retired Reserve is worth the premium until retired pay starts. Then enroll dental through FEDVIP, not the TRICARE Dental Program."
        : "If you are under 65, choose Prime, Select, or the US Family Health Plan if your ZIP qualifies. If you are 65, Medicare Part A and Part B have to be in place for TRICARE For Life.",
      "Enroll dental and, if you want frames and contacts, vision through BENEFEDS during a federal open season or a qualifying life event.",
      "Replace SGLI if you have not. The free coverage is already over if you retired more than 120 days ago.",
      "Update DEERS and the retiree account on DFAS so the address, the SBP election, and the allotments match the household you have now.",
    ];
  }
  return [
    "Update DEERS so the survivor record matches the people who still need coverage.",
    "If TRICARE is the right door, enroll through the regional contractor. If the sponsor was not a retiree and not active duty, read CHAMPVA instead.",
    "Ask VA about Dependents' Educational Assistance or the Fry Scholarship before paying a school.",
    "Watch for anyone charging a fee to 'file your survivor claim.' VA does not charge for that.",
  ];
}
