import type { Card, LinkItem, Profile, Who } from "@/lib/benefits/model";

interface StateProgram {
  id: string;
  place: Profile["place"];
  title: string;
  dek: string;
  who: Who[];
  why: string;
  cost: string;
  steps: string[];
  links: LinkItem[];
  warning?: string;
  deskNote: string;
  fits: (profile: Profile) => boolean;
}

const PROGRAMS: StateProgram[] = [
  {
    id: "gng-scl",
    place: "GA",
    title: "Georgia Guard Service Cancelable Loan",
    dek: "A Georgia loan for tuition at an eligible Georgia school. Two years in the Georgia Guard after the last term it paid can cancel it. It is not the GI Bill and not Army Tuition Assistance.",
    who: ["sponsor"],
    why: "You marked National Guard and Georgia. Only a member in good standing of the Georgia National Guard can use this. A drilling member of another state cannot.",
    cost: "At a University System or Technical College school, the 2026-2027 regulations pay that school's standard undergraduate tuition, up to 15 hours a term. At a private school the full-time rate is $2,174 a semester or $1,450 a quarter, and half-time is $1,087 or $726. You need at least 6 hours. The smallest loan is $300.",
    steps: [
      "If you are an undergraduate, file the FAFSA for this year.",
      "You complete Part A of the application and promissory note. The Georgia Guard completes Part B. The school financial aid office completes Part C and sends it to the Georgia Student Finance Authority.",
      "The school needs the packet by the last day of that term. You file again every year.",
      "After the last funded term, two more years in the Georgia Guard can cancel it. Time you already served does not count. If you leave, you repay what is left, plus interest, under the note.",
    ],
    links: [
      {
        label: "Application steps",
        href: "https://www.gafutures.org/hope-state-aid-programs/military/gng-scl/application-procedure/",
      },
      {
        label: "Service commitment",
        href: "https://www.gafutures.org/hope-state-aid-programs/military/gng-scl/service-commitment/",
      },
    ],
    warning: "This stays a loan until the state approves the cancellation. Interest on a repayment is not allowed to exceed 10 percent.",
    deskNote: "Georgia National Guard only. Part A you, Part B the Guard, Part C the school.",
    fits: (p) => p.status === "guard",
  },
  {
    id: "hazlewood",
    place: "TX",
    title: "Texas Hazlewood Act",
    dek: "Up to 150 hours of tuition and most fees at a Texas public college. It does not pay rent, books, or supply fees. The school, not VA, decides the file.",
    who: ["sponsor", "spouse", "child"],
    why: "The veteran path, the spouse path, and the child's path are different. A child does not automatically inherit hours. Legacy transfer and the disability category are separate rules.",
    cost: "The exemption is hours of tuition, not a check. The Texas Veterans Commission publishes the cap at 150 hours. The college is the final word on a student's file.",
    steps: [
      "Read the veteran rules first. The usual gate is Texas as home of record or place of entry, enough active duty, and a discharge that is honorable or under honorable conditions.",
      "A spouse or child uses a different category, often tied to a total disability or a death. Do not file the child's packet with the veteran's unused hours unless Legacy actually applies.",
      "Register with the Texas Veterans Commission and turn the packet in to the college. Use the school's form if they have one.",
    ],
    links: [{ label: "Hazlewood Act", href: "https://tvc.texas.gov/education/hazlewood/" }],
    warning: "Living in Texas now is not the same as having entered the service from Texas. Read the home-of-record rule before you count the hours.",
    deskNote: "Texas public colleges. Veterans, and some spouses and children, up to 150 hours.",
    fits: (p) => ["veteran", "retired", "gray", "survivor"].includes(p.status),
  },
  {
    id: "calvet-waiver",
    place: "CA",
    title: "CalVet College Fee Waiver",
    dek: "A waiver of mandatory systemwide tuition and fees at a California community college, a Cal State campus, or a UC campus. It is for certain dependents, not a tuition check for the veteran.",
    who: ["spouse", "child"],
    why: "The four plans are for a child or, in some cases, a spouse of a veteran with a service-connected disability or a service-connected death. The sponsor does not use this waiver as the student.",
    cost: "It waives mandatory systemwide tuition and fees. It does not pay books, parking, or room and board. Plan B has a student-income limit that CalVet resets. For 2026-2027 that published limit is $22,941. A spouse, and a child of a veteran who is totally disabled or who died of a service-connected condition, is not under that income cap.",
    steps: [
      "Use the College Fee Waiver calculator on CalVet before you assume a plan fits.",
      "The student needs the relationship papers and the school's residency decision.",
      "A child has age rules. Read the plan, not a summary from a school recruiter.",
    ],
    links: [
      { label: "College Fee Waiver", href: "https://www.calvet.ca.gov/VetServices/Pages/College-Fee-Waiver.aspx" },
      {
        label: "How to apply",
        href: "https://www.calvet.ca.gov/VetServices/Pages/What-do-I-need-to-do-to-apply-for-the-College-Fee-Waiver-Program.aspx",
      },
    ],
    warning: "A service-connected rating of any size can open a plan for a child. It does not open the waiver for the veteran.",
    deskNote: "Dependents of a California veteran. Not the veteran's own tuition.",
    fits: (p) => p.rating !== "none" || p.status === "survivor",
  },
  {
    id: "ivg",
    place: "IL",
    title: "Illinois Veteran Grant",
    dek: "Eligible tuition and mandatory fees at an Illinois public university or community college, for the veteran as the student.",
    who: ["sponsor"],
    why: "This is a state entitlement for the veteran who meets the Illinois residency and service rules. A spouse does not spend it.",
    cost: "The grant pays eligible tuition and mandatory fees, measured in eligibility units, for about four academic years of full-time study. It is not a housing stipend.",
    steps: [
      "Check the residency test on ISAC. Living in Illinois now is only one piece. Where you lived when you entered service matters.",
      "The usual service gate is one year of federal active duty, with shorter paths for a campaign medal, a medical discharge, or service before August 11, 1967.",
      "Apply in the ISAC student portal. You can sometimes use it in the same year as the Montgomery GI Bill. Read the Post-9/11 overlap rule before you stack them.",
    ],
    links: [
      {
        label: "Illinois Veteran Grant",
        href: "https://www.isac.org/isac-gift-assistance-programs/illinois-veteran-grant/",
      },
    ],
    deskNote: "The veteran as the student, at an Illinois public college.",
    fits: (p) => ["veteran", "retired", "gray"].includes(p.status),
  },
  {
    id: "ing-grant",
    place: "IL",
    title: "Illinois National Guard Grant",
    dek: "Tuition and fees at an Illinois public college for a member of the Illinois National Guard. Another state's Guard does not qualify.",
    who: ["sponsor"],
    why: "You marked National Guard and Illinois. This grant belongs to the member, not the family.",
    cost: "Eligibility units cover about four years of full-time study, or about six years after ten years of Illinois Guard service. The state budget reimburses the school. It is not a check to you.",
    steps: [
      "Apply for the year in the ISAC student portal while you are in the Illinois Guard.",
      "The school reports the hours. Ask the school veterans office which term deadline they use.",
    ],
    links: [
      {
        label: "Illinois National Guard Grant",
        href: "https://www.isac.org/isac-gift-assistance-programs/illinois-national-guard-grant/",
      },
    ],
    deskNote: "Illinois National Guard members at an Illinois public college.",
    fits: (p) => p.status === "guard",
  },
  {
    id: "ny-vta",
    place: "NY",
    title: "New York Veterans Tuition Award",
    dek: "Tuition at a SUNY, CUNY, or participating private or vocational school, capped at what a New York resident pays for undergraduate SUNY tuition.",
    who: ["sponsor"],
    why: "This is the veteran's own award. It is not a family transfer.",
    cost: "Full-time study can cover tuition up to the SUNY undergraduate rate, or the real tuition, whichever is less. Part-time is prorated. The cap is about four years, with shorter caps for graduate and vocational programs.",
    steps: [
      "You need to be a New York resident for the 12 months before the term, and not discharged dishonorably.",
      "The service gate is at least four years of active duty, or combat service. Guard time counts toward the four years only when it was active-duty deployment.",
      "File the FAFSA and New York TAP first if you are in a degree program, then the Veterans Tuition Award application. It stays open all year.",
    ],
    links: [{ label: "Veterans Tuition Award", href: "https://hesc.ny.gov/vta" }],
    deskNote: "New York veterans with four years of active duty, or combat service.",
    fits: (p) => ["veteran", "retired", "gray"].includes(p.status),
  },
  {
    id: "ny-merit",
    place: "NY",
    title: "New York MERIT scholarship",
    dek: "Aid for a child, a spouse, or a financial dependent of a service member who died or became severely and permanently disabled while performing military duties, if they were New York residents.",
    who: ["spouse", "child"],
    why: "This is a family benefit. The veteran does not use it as the student.",
    cost: "The amount and the school list are on the Higher Education Services Corporation page. Do not guess the check from a forum.",
    steps: [
      "Confirm the sponsor was a New York resident and that the death or the severe permanent disability happened in the line of duty.",
      "Apply from the military and veteran families page. File a FAFSA too.",
    ],
    links: [{ label: "Military and veteran families", href: "https://hesc.ny.gov/military-veteran-families" }],
    deskNote: "New York family of a member who died or was severely disabled on duty.",
    fits: (p) => p.status === "survivor" || p.rating === "total",
  },
  {
    id: "vmsdep",
    place: "VA",
    title: "Virginia Military Survivors and Dependents",
    dek: "A waiver of tuition and mandatory fees for up to eight semesters at a Virginia public college. It is for a spouse or a child, not for the veteran.",
    who: ["spouse", "child"],
    why: "The sponsor's rating has to be at least 90 percent permanent, or total, or the sponsor was killed, missing, or a prisoner. A lower rating does not open it.",
    cost: "Tier 1 and Tier 2 both waive tuition and mandatory fees. A stipend for room, board, and books exists only for Tier 2, and only when the state funds it.",
    steps: [
      "The student has to be admitted to a Virginia public college and meet Virginia domicile rules.",
      "A child has to be 16 through 29. A spouse has no age cap.",
      "The Department of Veterans Services certifies the student. Apply at the VMSDEP portal. The school applies the waiver.",
    ],
    links: [
      {
        label: "VMSDEP",
        href: "https://www.dvs.virginia.gov/benefits-services/education/virginia-military-survivors-dependents-education-program-vmsdep/",
      },
      { label: "VMSDEP application", href: "https://vmsdep.dvs.virginia.gov/user/login" },
    ],
    warning: "If the rating is service-connected but below 90 percent permanent, this waiver is not the benefit. Do not pay a consultant to file it.",
    deskNote: "Spouse or child in Virginia. The rating bar is 90 percent permanent, or total.",
    fits: (p) => p.rating !== "none" || p.status === "survivor",
  },
  {
    id: "oh-ongsp",
    place: "OH",
    title: "Ohio National Guard Scholarship",
    dek: "Tuition at a participating Ohio school for an enlisted member of the Ohio Army or Air Guard. It does not pay fees or books, and it is not federal Tuition Assistance.",
    who: ["sponsor"],
    why: "You marked National Guard and Ohio. The scholarship stays with the member. The family cannot use it.",
    cost: "Tuition only. Use federal Tuition Assistance first if you are eligible for it. Then this scholarship. You apply again every term.",
    steps: [
      "You have to be an enlisted member in good standing for the whole term. The Ohio page is where officers should look before assuming they are in.",
      "Open a student account at ongsp.ohio.gov. A CAC is not required. Use an email you actually read.",
      "Submit before the school's no-penalty add/drop date. Give the unit about 60 days when you can.",
    ],
    links: [
      { label: "Ohio Guard education", href: "https://www.ong.ohio.gov/members/ohng/education/index.html" },
      { label: "Scholarship portal", href: "https://www.ongsp.ohio.gov/" },
    ],
    deskNote: "Enlisted Ohio Army or Air Guard. Tuition only, one application a term.",
    fits: (p) => p.status === "guard",
  },
  {
    id: "fl-csddv",
    place: "FL",
    title: "Florida scholarship for children and spouses",
    dek: "Tuition help at an eligible Florida school for a child or a spouse of a veteran who is 100 percent permanent and total, or who died of a service-connected disability.",
    who: ["spouse", "child"],
    why: "The veteran is not the student. Florida certifies the veteran. The Department of Education runs the scholarship.",
    cost: "The award is set by the Florida Department of Education for that year. Do not budget a number from a blog.",
    steps: [
      "Confirm the veteran is 100 percent permanent and total, or died of a service-connected disability, and meets Florida residency.",
      "A child needs a birth certificate. A spouse needs the marriage certificate. The veteran needs two Florida residency documents.",
      "Start at the Florida veterans page, then the student financial aid site. Call 888-827-2004 if the portal fights you.",
    ],
    links: [
      {
        label: "Florida veterans scholarship page",
        href: "https://floridavets.org/benefits-services/scholarships-for-children-and-spouses-of-deceased-or-disabled-veterans-csddv/",
      },
      { label: "Florida student aid", href: "https://www.floridastudentfinancialaid.org/" },
    ],
    deskNote: "Child or spouse. The veteran is 100 percent permanent and total, or died of a service-connected disability.",
    fits: (p) => p.rating === "total" || p.status === "survivor",
  },
];

export function stateCards(profile: Profile): Card[] {
  if (!profile.place) return [];
  return PROGRAMS.filter((program) => program.place === profile.place && program.fits(profile)).map((program) => ({
    id: program.id,
    category: "training" as const,
    title: program.title,
    dek: program.dek,
    who: program.who,
    why: program.why,
    cost: program.cost,
    steps: program.steps,
    links: program.links,
    warning: program.warning,
  }));
}

export function stateDesks(profile: Profile): { group: string; name: string; note: string; href: string }[] {
  if (!profile.place) return [];
  return PROGRAMS.filter((program) => program.place === profile.place && program.fits(profile)).map((program) => ({
    group: "Your state",
    name: program.title,
    note: program.deskNote,
    href: program.links[0].href,
  }));
}

export function stateDirectory(): {
  place: string;
  title: string;
  who: string;
  note: string;
  href: string;
}[] {
  const word: Record<Who, string> = {
    sponsor: "Member",
    spouse: "Spouse",
    child: "Child",
    young: "Young adult",
  };
  return PROGRAMS.map((program) => ({
    place: program.place,
    title: program.title,
    who: program.who.map((person) => word[person]).join(" · "),
    note: program.deskNote,
    href: program.links[0].href,
  }));
}

export function hasStateProgram(place: Profile["place"]): boolean {
  return PROGRAMS.some((program) => program.place === place);
}
