import type { Category, LinkItem } from "@/lib/benefits/model";

export interface Lesson {
  id: string;
  category: string;
  title: string;
  minutes: string;
  beats: string[];
  doThis: string;
  videoId?: string;
  videoTitle?: string;
  link: LinkItem;
}

export interface Faq {
  id: string;
  category: string;
  q: string;
  a: string;
  link: LinkItem;
}

export interface Desk {
  group: string;
  name: string;
  note: string;
  href: string;
}

export const lessons: Lesson[] = [
  {
    id: "two-doors",
    category: "Medical",
    title: "TRICARE and VA are not the same door",
    minutes: "4 min",
    beats: [
      "TRICARE is armed-forces coverage. You use a contractor, a military hospital, or both, and your family can be on it. The Coast Guard is included.",
      "VA health care is a health system for veterans. It is not an insurance card you hand to any civilian doctor. Community care has to be arranged.",
      "You can have both. A retiree often has TRICARE for the family and VA for themselves. Tell each system about the other.",
    ],
    doThis: "If you are a veteran, apply for VA care even if TRICARE is already in the house. If you are only drilling, do not assume VA replaced TRICARE Reserve Select.",
    videoId: "nn_rAe8MbaY",
    videoTitle: "VA: overview of VA health care and how to apply",
    link: { label: "VA health care eligibility", href: "https://www.va.gov/health-care/eligibility/" },
  },
  {
    id: "prime-select",
    category: "Medical",
    title: "Prime or Select, in plain words",
    minutes: "5 min",
    beats: [
      "Prime means a primary care manager, referrals for most specialty care, and military hospitals when they have room to enroll you. Active duty members are on Prime. They do not pick Select.",
      "Select means you pick civilian TRICARE-authorized doctors without a referral for most care. You pay a deductible and a cost-share. Retirees also pay an enrollment fee on either plan.",
      "The US Family Health Plan is a Prime option in parts of some states only. You use that plan's doctors and pharmacy, not the military hospital and not Express Scripts.",
    ],
    doThis: "Change between Prime and Select during TRICARE Open Season or after a qualifying life event such as a move, a birth, or a loss of other coverage. The 2026 Open Season is November 9 through December 8. Confirm the dates each fall.",
    videoId: "vvpyJEb9Ksw",
    videoTitle: "TRICARE: Prime vs Select",
    link: { label: "TRICARE plan finder pages", href: "https://tricare.mil/Plans/HealthPlans" },
  },
  {
    id: "new",
    category: "Medical",
    title: "New to TRICARE: the first week",
    minutes: "6 min",
    beats: [
      "DEERS is the list. If you are not in it, you are not covered, no matter what a recruiter or a spouse remembers.",
      "Enrollment for family members is a second step. Being eligible is not the same as being enrolled.",
      "Your region follows the ZIP in DEERS. East is Humana Military. West is TriWest. Overseas is International SOS.",
    ],
    doThis: "Log into milConnect, check every family member, then enroll the family with the regional contractor or on milConnect's Beneficiary Web Enrollment.",
    videoId: "UAZnFA_VM8c",
    videoTitle: "TRICARE: how to navigate as a new enrollee",
    link: { label: "DEERS", href: "https://www.tricare.mil/Plans/Eligibility/DEERS" },
  },
  {
    id: "baby",
    category: "Family",
    title: "A baby is not automatically enrolled",
    minutes: "4 min",
    beats: [
      "TRICARE will cover a newborn as a courtesy only for a short time. In the United States that window is commonly 90 days, and overseas commonly 120. Confirm the current number when the baby arrives.",
      "The child has to be added in DEERS, usually with the birth certificate and the sponsor's presence or a power of attorney.",
      "After DEERS, enroll the child in the same plan as the rest of the family, and add dental if you carry the TRICARE Dental Program.",
    ],
    doThis: "Put the DEERS appointment on the calendar before you leave the hospital. Reserve families use the same rule, with their own newborn briefing.",
    videoId: "pjwhh4hB62E",
    videoTitle: "TRICARE: enrolling newborns, active duty stateside",
    link: { label: "milConnect", href: "https://milconnect.dmdc.osd.mil/" },
  },
  {
    id: "teeth",
    category: "Dental and vision",
    title: "Teeth and glasses are a second enrollment",
    minutes: "4 min",
    beats: [
      "Prime, Select, Reserve Select, and Retired Reserve do not pay for routine adult dental.",
      "Active duty families and Selected Reserve members buy the TRICARE Dental Program from United Concordia. Retirees and gray-area retirees use FEDVIP dental through BENEFEDS instead.",
      "Routine glasses and contacts for most adults are FEDVIP vision, and only if you are enrolled in a TRICARE health plan. Medically necessary eye care is different, and TRICARE can cover that.",
    ],
    doThis: "Decide dental on purpose. People lose a year of cleanings because they thought Prime included them.",
    videoId: "QLfWXE1sqm0",
    videoTitle: "TRICARE: FEDVIP dental and vision at Open Season",
    link: { label: "BENEFEDS", href: "https://www.benefeds.gov/" },
  },
  {
    id: "life",
    category: "Life insurance",
    title: "The 120-day life insurance cliff",
    minutes: "5 min",
    beats: [
      "SGLI covers up to $500,000. The premium does not depend on age or health. As of the July 1, 2025 rate still posted by VA, $500,000 costs $25 plus $1 for traumatic injury protection, $26 a month.",
      "When you leave a period of SGLI, coverage continues at no cost for 120 days. On day 121 it is gone unless you replaced it.",
      "VGLI can continue up to the same amount. Apply within 1 year and 120 days. The first 240 days do not ask health questions. After that, they do. VALife is a small whole-life policy for veterans with any service-connected rating, up to $40,000, and it is not a substitute for a $500,000 term policy.",
    ],
    doThis: "If you are separating, apply for VGLI before you shop civilian term, or shop both. Do not let day 240 pass while you compare.",
    videoId: "z1KJoj-8SQ0",
    videoTitle: "VA: life insurance for service members and veterans",
    link: { label: "SGLI rates and rules", href: "https://www.va.gov/life-insurance/options-eligibility/sgli/" },
  },
  {
    id: "money",
    category: "Money",
    title: "The protections that follow the orders",
    minutes: "4 min",
    beats: [
      "The Servicemembers Civil Relief Act can cap interest at 6% on debts you took on before active duty, including a Guard or Reserve activation. You have to request it. The bank does not do it from the news.",
      "The Military Lending Act caps the cost of many new consumer loans to active duty and their dependents. It does not cap mortgages or auto loans you buy from a dealer.",
      "A military bank is optional. Navy Federal, USAA, PenFed, and the credit union on the installation are convenient. Your SCRA rights exist at the bank you already use.",
    ],
    doThis: "If you were just activated, send your orders to every creditor on a pre-service debt and keep the reply. If you deploy to a combat zone, ask finance about the Savings Deposit Program.",
    link: { label: "CFPB military money tools", href: "https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/" },
  },
  {
    id: "school",
    category: "Training",
    title: "Tuition assistance, a credential, and the GI Bill are three pots",
    minutes: "5 min",
    beats: [
      "Tuition Assistance pays for classes while you serve. Each service has its own portal and its own cap.",
      "Credentialing programs pay for licenses and exams tied to your branch rules. Army Credentialing Assistance is not open to commissioned officers for new goals after March 19, 2026. The family cannot use it.",
      "The GI Bill is the veteran's benefit, and in some cases a transferred benefit. Using it on active duty usually means you give up most of the housing allowance. Many people wait, or transfer it, on purpose.",
    ],
    doThis: "Do not pay a vendor until the portal says the request is approved. An invoice from a test company is not an approval.",
    videoId: "1DYm8vRWwFk",
    videoTitle: "VA: disability compensation, a different benefit from the GI Bill",
    link: { label: "Post-9/11 GI Bill", href: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/" },
  },
];

export const faqs: Faq[] = [
  {
    id: "va-insurance",
    category: "Medical",
    q: "Is VA health care insurance?",
    a: "No. It is care delivered by VA, and sometimes by community providers VA approves. You generally cannot take a VA card to any doctor and expect VA to pay. Apply anyway if you served. Other insurance does not disqualify you.",
    link: { label: "About VA health benefits", href: "https://www.va.gov/health-care/about-va-health-benefits/" },
  },
  {
    id: "both",
    category: "Medical",
    q: "Can our household have TRICARE and VA at the same time?",
    a: "Yes. Retirees do it constantly. VA may bill your other insurance. TRICARE remains the family plan. Keep DEERS and your VA enrollment address current so the two systems do not fight over a claim.",
    link: { label: "VA health care and other insurance", href: "https://www.va.gov/health-care/about-va-health-benefits/va-health-care-and-other-insurance/" },
  },
  {
    id: "trs-dental",
    category: "Dental and vision",
    q: "Does TRICARE Reserve Select include dental?",
    a: "No. Medical and prescriptions are in Reserve Select. Teeth are the TRICARE Dental Program, a separate premium with United Concordia. Vision hardware, meaning frames and contacts, is usually FEDVIP, also separate.",
    link: { label: "TRICARE Dental Program", href: "https://tricare.mil/CoveredServices/Dental/TDP" },
  },
  {
    id: "when",
    category: "Medical",
    q: "When can we change plans?",
    a: "Prime and Select move during TRICARE Open Season or a qualifying life event. For 2026, Open Season is November 9 through December 8. Reserve Select, Retired Reserve, Young Adult, and the Continued Health Care Benefit Program can be joined when you qualify, not only in that window.",
    link: { label: "TRICARE Open Season", href: "https://tricare.mil/Plans/Enroll/OpenSeason" },
  },
  {
    id: "age",
    category: "Family",
    q: "Do children stay on TRICARE until 26?",
    a: "Not for free. Regular eligibility generally ends at 21, or 23 if they are a full-time student and the sponsor provides more than half their support. After that, TRICARE Young Adult can continue coverage to age 26 for an unmarried child who is not eligible for an employer plan. The sponsor has to be TRICARE-eligible. A separated veteran who is not retired usually cannot sponsor Young Adult.",
    link: { label: "TRICARE Young Adult", href: "https://tricare.mil/Plans/HealthPlans/TYA" },
  },
  {
    id: "fehb",
    category: "Medical",
    q: "I am a Guard technician with federal employee health benefits. Can I buy Reserve Select?",
    a: "Usually no. If you are eligible for the Federal Employees Health Benefits program, you are not eligible for TRICARE Reserve Select, even if you decline the federal plan. This catches dual-status technicians every year.",
    link: { label: "TRICARE Reserve Select", href: "https://tricare.mil/Plans/HealthPlans/TRS" },
  },
  {
    id: "region",
    category: "Medical",
    q: "Who do I call, Humana or TriWest?",
    a: "East, including Georgia and most of the Atlantic states, is Humana Military at 800-444-5445. West, including Texas, California, and Illinois, is TriWest at 888-874-9378. Arkansas, Indiana, Missouri, and Wisconsin are split by ZIP. Overseas, including U.S. territories, is International SOS. Atlanta and Tampa Prime Demo areas may be CareSource instead.",
    link: { label: "How do I know my region?", href: "https://tricare.mil/FAQs/General/GEN_Regions" },
  },
  {
    id: "champva",
    category: "Medical",
    q: "We have a 100% rating. Does the family get CHAMPVA?",
    a: "Only if they are not eligible for TRICARE. A retiree's family is TRICARE-eligible, so CHAMPVA is closed. A veteran who is not a retiree, and who is permanent and total or rated unemployable, can usually sponsor CHAMPVA for a spouse and children. CHAMPVA is not for the veteran.",
    link: { label: "CHAMPVA", href: "https://www.va.gov/health-care/family-caregiver-benefits/champva/" },
  },
  {
    id: "sgli",
    category: "Life insurance",
    q: "What happens to SGLI when I separate or retire?",
    a: "You keep it free for 120 days. Then it ends. VGLI will take up to the same amount if you apply within 1 year and 120 days. Apply in the first 240 days if you do not want health questions. Spouse coverage under Family SGLI does not automatically become a veteran policy.",
    link: { label: "VGLI", href: "https://www.va.gov/life-insurance/options-eligibility/vgli/" },
  },
  {
    id: "fedvip",
    category: "Dental and vision",
    q: "I retired. Why can't I keep the TRICARE Dental Program?",
    a: "Retirees and gray-area retirees are not eligible for the TRICARE Dental Program. Dental, and vision if you want it, is FEDVIP. You enroll at BENEFEDS. Compare that with VADIP only if you also have VA or CHAMPVA eligibility. FEDVIP is often the retiree door.",
    link: { label: "FEDVIP eligibility", href: "https://www.opm.gov/healthcare-insurance/dental-vision/eligibility/" },
  },
  {
    id: "bank",
    category: "Money",
    q: "Do I have to bank on base or with a military credit union?",
    a: "No. SCRA and the Military Lending Act apply to your debts no matter where you bank. Military institutions can be easier about allotments, deployment, and overseas moves. Read the membership rules. USAA in particular does not open every product to every veteran.",
    link: { label: "Servicemembers Civil Relief Act", href: "https://www.justice.gov/servicemembers/servicemembers-civil-relief-act-scra" },
  },
  {
    id: "ca",
    category: "Training",
    q: "Can my spouse use Credentialing Assistance, or can I as an officer?",
    a: "No to the spouse. Army Credentialing Assistance is the soldier's benefit. As of March 19, 2026, commissioned officers cannot open new Army CA goals. Warrant officers and enlisted soldiers still can, including many in the Reserve Component. A spouse in pay grades tied to E-1 through E-5, W-1 through W-2, or O-1 through O-2 may qualify for MyCAA instead, which is a different $4,000 program.",
    link: { label: "MyCAA", href: "https://mycaa.militaryonesource.mil/mycaa/" },
  },
  {
    id: "scam",
    category: "Money",
    q: "Someone offered to enroll me for a fee. Is that official?",
    a: "No. TRICARE enrollment, VA health care, VA disability claims, and SGLI do not require a paid representative. Official sites end in .mil or .gov, or they are the named contractors: Humana Military, TriWest, International SOS, United Concordia, Express Scripts, and BENEFEDS. Anyone else asking for your CAC, your DS Logon, or a cut of your back pay is not the desk.",
    link: { label: "VA.gov", href: "https://www.va.gov/" },
  },
];

export const desks: Desk[] = [
  { group: "Records", name: "milConnect and DEERS", note: "Address, enrollment, ID card, SGLI through SOES", href: "https://milconnect.dmdc.osd.mil/" },
  { group: "Records", name: "VA.gov", note: "Health care, disability, education, housing, insurance", href: "https://www.va.gov/" },
  { group: "Records", name: "Login.gov and ID.me", note: "The sign-in VA actually uses. Do not make an account on a look-alike.", href: "https://www.va.gov/resources/signing-in-to-vagov/" },
  { group: "Health", name: "TRICARE.mil", note: "Plans, costs, and the region ZIP tool", href: "https://tricare.mil/" },
  { group: "Health", name: "Humana Military", note: "East Region contractor, 800-444-5445", href: "https://www.humanamilitary.com/" },
  { group: "Health", name: "TriWest", note: "West Region contractor, 888-874-9378", href: "https://tricare.triwest.com/" },
  { group: "Health", name: "TRICARE Overseas", note: "International SOS, for territories and overseas", href: "https://www.tricare-overseas.com/" },
  { group: "Health", name: "US Family Health Plan", note: "Prime option in designated areas only", href: "https://www.tricare.mil/Plans/HealthPlans/USFHP" },
  { group: "Health", name: "Express Scripts", note: "TRICARE pharmacy, home delivery, and retail", href: "https://militaryrx.express-scripts.com/" },
  { group: "Health", name: "Apply for VA health care", note: "Form 10-10EZ. No premium to enroll.", href: "https://www.va.gov/health-care/apply-for-health-care-form-10-10ez/introduction" },
  { group: "Health", name: "CHAMPVA", note: "For families who are not TRICARE-eligible", href: "https://www.va.gov/health-care/family-caregiver-benefits/champva/" },
  { group: "Dental and vision", name: "TRICARE Dental Program", note: "United Concordia, for active-duty families and Selected Reserve", href: "https://www.uccitdp.com/" },
  { group: "Dental and vision", name: "Active Duty Dental Program", note: "For the service member when a military clinic is not available", href: "https://www.addp-ucci.com/" },
  { group: "Dental and vision", name: "BENEFEDS", note: "FEDVIP dental and vision enrollment", href: "https://www.benefeds.gov/" },
  { group: "Dental and vision", name: "FEDVIP eligibility", note: "OPM rules for retirees and federal employees", href: "https://www.opm.gov/healthcare-insurance/dental-vision/eligibility/" },
  { group: "Dental and vision", name: "VA dental care", note: "Who actually qualifies for VA dentistry", href: "https://www.va.gov/health-care/about-va-health-benefits/dental-care/" },
  { group: "Dental and vision", name: "VADIP", note: "A dental plan you can buy if you are VA-enrolled or on CHAMPVA", href: "https://www.va.gov/health-care/about-va-health-benefits/dental-care/va-dental-insurance-program/" },
  { group: "Life insurance", name: "SGLI", note: "Rates, beneficiaries, and the 120-day tail", href: "https://www.va.gov/life-insurance/options-eligibility/sgli/" },
  { group: "Life insurance", name: "Family SGLI", note: "Spouse coverage up to $100,000, children at $10,000", href: "https://www.va.gov/life-insurance/options-eligibility/fsgli/" },
  { group: "Life insurance", name: "VGLI", note: "The conversion after you leave", href: "https://www.va.gov/life-insurance/options-eligibility/vgli/" },
  { group: "Life insurance", name: "VALife", note: "Whole life for a service-connected rating, up to $40,000", href: "https://www.va.gov/life-insurance/options-eligibility/valife/" },
  { group: "Life insurance", name: "VMLI", note: "Mortgage coverage after a Specially Adapted Housing grant", href: "https://www.va.gov/life-insurance/options-eligibility/vmli/" },
  { group: "Life insurance", name: "Survivor Benefit Plan", note: "DFAS. An annuity, not a life insurance policy.", href: "https://www.dfas.mil/RetiredMilitary/provide/sbp/" },
  { group: "Money", name: "myPay", note: "Pay, allotments, tax forms, retiree account", href: "https://mypay.dfas.mil/" },
  { group: "Money", name: "TSP", note: "The uniformed services retirement account", href: "https://www.tsp.gov/uniformed-services/" },
  { group: "Money", name: "Savings Deposit Program", note: "10% savings while deployed to a designated area", href: "https://www.dfas.mil/MilitaryMembers/payentitlements/sdp/" },
  { group: "Money", name: "Navy Federal", note: "Membership rules for the defense community", href: "https://www.navyfederal.org/membership/become-a-member.html" },
  { group: "Money", name: "USAA membership", note: "Who can open which products", href: "https://www.usaa.com/inet/wc/why_choose_usaa_eligibility" },
  { group: "Money", name: "PenFed", note: "A defense-rooted credit union with a wide membership path", href: "https://www.penfed.org/accounts/membership" },
  { group: "Money", name: "Service Credit Union", note: "Built around military members and their families", href: "https://servicecu.org/membership/" },
  { group: "Money", name: "VA home loans", note: "Certificate of eligibility and lenders", href: "https://www.va.gov/housing-assistance/home-loans/" },
  { group: "Money", name: "CFPB military hub", note: "SCRA, MLA, and how to complain", href: "https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/" },
  { group: "School and credentials", name: "GI Bill comparison", note: "Post-9/11, Montgomery, and Selected Reserve", href: "https://www.va.gov/education/about-gi-bill-benefits/" },
  { group: "School and credentials", name: "VR&E", note: "Chapter 31, for a service-connected employment handicap", href: "https://www.va.gov/careers-employment/vocational-rehabilitation/" },
  { group: "School and credentials", name: "Chapter 35 and Fry", note: "Education for dependents and survivors", href: "https://www.va.gov/education/survivor-dependent-benefits/" },
  { group: "School and credentials", name: "ArmyIgnitED", note: "Army tuition assistance and Credentialing Assistance", href: "https://www.armyignited.army.mil/student/public/welcome" },
  { group: "School and credentials", name: "Credentialing Opportunities Online", note: "Army, Navy, Marine Corps, Air Force, Coast Guard", href: "https://www.cool.osd.mil/" },
  { group: "School and credentials", name: "AFVEC", note: "Air Force and Space Force voluntary education", href: "https://afvec.us.af.mil/" },
  { group: "School and credentials", name: "SkillBridge", note: "Civilian training in the last months of active duty", href: "https://skillbridge.osd.mil/" },
  { group: "School and credentials", name: "MyCAA", note: "Spouse credential scholarship, rank-limited", href: "https://mycaa.militaryonesource.mil/mycaa/" },
  { group: "School and credentials", name: "State veterans affairs offices", note: "State tuition, tax, and license benefits live here, not at VA.gov. The program for your state shows on your brief.", href: "https://department.va.gov/about/state-departments-of-veterans-affairs/" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  medical: "Medical",
  dental: "Dental",
  vision: "Vision",
  life: "Life insurance",
  money: "Banking and pay",
  training: "School and credentials",
};
