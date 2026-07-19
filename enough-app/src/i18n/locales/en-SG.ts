/**
 * English (Singapore) — the canonical translation source.
 *
 * Every user-facing string in the app resolves to a key below. The other three
 * locales (zh-SG, ms-SG, ta-SG) MUST mirror this exact key structure; a missing
 * key in a locale falls back to this file (see i18next fallback in index.ts).
 *
 * Wording principles (see requirements §5 / §13):
 *  - Clear, respectful, senior-friendly Singapore English.
 *  - Cautious, never a guarantee ("about", "estimated", "planning estimate").
 *  - Official scheme / product names stay unchanged (CPF, CPF LIFE, SRS, HDB …).
 *
 * Single default namespace ("translation"); nested objects mirror the logical
 * namespaces from the spec (common, navigation, home, …). Typed keys are derived
 * from this object in types.ts.
 */
const enSG = {
  common: {
    brand: "Enough",
    tagline: "Neutral Singapore retirement spending",
    appTitle: "Enough — How much can I really spend?",
    perMonth: "/month",
    perYear: "/year",
    forLife: "for life",
    buffer: "buffer",
    rangeSeparator: "to",
    recommended: "recommended",
    excluded: "excluded",
    connected: "Connected",
    onPlan: "on plan",
    closes: "closes",
    ofTheGap: "of the gap",
    raisesSafer: "raises safer spend {{delta}}",
    reversible: "reversible",
    hardToReverse: "hard to reverse",
    gap: "gap",
    residualGap: "Residual gap",
    channel: "channel",
    back: "← Back",
    backToResults: "← Back to results",
    seeMySaferSpend: "See my safer monthly spend →",
    loading: "Loading…",
    yrs: "yrs",
    eq: "eq",
    selected: "Selected: {{value}}",
  },

  format: {
    confidence: "about {{pct}}% confidence",
    perMonth: "/month",
    rangeSeparator: " to ",
    years: "{{n}} yrs",
  },

  accessibility: {
    skipToContent: "Skip to main content",
    languageLabel: "Language",
    changeLanguage: "Change language",
    menu: "Menu",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    primaryNav: "Primary navigation",
    viewMode: "View mode",
    mobileNav: "Mobile navigation",
    langChanged: "Language changed to {{name}}",
    chartUnavailable:
      "Chart shown visually. See the text summary above for the key numbers.",
  },

  navigation: {
    home: "Home",
    connect: "Connect",
    results: "Results",
    spendMonitor: "Spend Monitor",
    family: "Family",
    parentView: "Parent view",
    adultChildView: "Adult-child view",
    forPartners: "For partners",
  },

  home: {
    badge: "Singapore's neutral retirement-spending co-pilot",
    heroTitle: "How much can I really spend?",
    heroParent:
      "One calm number — how much you can safely spend each month, from your CPF, savings and the lifestyle you want. Explained in plain words. Neutral advice — never a product pitch.",
    heroChild:
      "View your parent's retirement plan only when they choose to share it with you. Access is read-only, and your parent remains fully in control.",
    ctaParent: "Start my plan",
    ctaChild: "View shared parent plan",
    seeExample: "See a worked example",
    pillarNeutralTitle: "Neutral, whole-wealth",
    pillarNeutralBody:
      "Product-free and commission-free. We connect CPF, SRS, bank and investments in one consented view — and tell you how much of your total wealth you can safely spend.",
    pillarCpfTitle: "CPF-native depth",
    pillarCpfBody:
      "CPF LIFE as your guaranteed floor, SRS drawn inside its 10-year window, tax- and longevity-aware sequencing across every account.",
    pillarFamilyTitle: "For the whole family",
    pillarFamilyBody:
      "Family access is optional and permission-based. A parent may share a read-only plan with a spouse or adult child and revoke access at any time.",
    permissionTitle: "The permission to spend",
    permissionBody:
      "CPF, banks and advisers all help Singaporeans save. A neutral spending view is harder when providers also sell products. Enough focuses on the monthly spend decision.",
    wholeWealthLabel: "whole wealth → monthly spend",
    chipCpfLife: "CPF LIFE",
    chipSrs: "SRS",
    chipBank: "Bank",
    chipInvestments: "Investments",
    saferMonthlySpend: "→ safer monthly spend",
    trustStrip:
      'Neutral financial planning advice · Flat fees, never commission · Your data stays yours · Plain-English "why" behind every number.',
  },

  connect: {
    kicker: "Connect",
    title: "Bring your accounts together",
    subtitle:
      "Connect once with Singpass for a whole-wealth view — or type the key numbers in yourself.",
    connectTitle: "Connect your accounts with Singpass",
    connectBody:
      "One consented pull via Singpass brings in your CPF, bank, SRS and investments through SGFinDex — no typing, always current. We never see your password, and we're product-neutral — advice, never a sales pitch.",
    connectButton: "Connect with Singpass",
    chipCpfBoard: "CPF Board",
    chipBank: "Bank · SGFinDex",
    chipInvestments: "Investments · SGFinDex",
    chipSrs: "SRS",
    chipHdb: "HDB · Myinfo",
    protoNote:
      "Prototype only — this simulates a consented Myinfo / SGFinDex pull. Full SGFinDex access requires licensed-FI status and is a post-licence step; at MVP this is Myinfo + manual entry. Never asks for your banking password.",
    connectingTitle: "Connecting via Singpass…",
    connectedTitle: "Your whole-wealth picture",
    connectedBody:
      "Pulled via Singpass / SGFinDex. This is the single view no bank can be neutral about — and it's what the safe-spend number is built on.",
    spendableWealth: "Spendable wealth",
    spendableWealthNote: "Cash + investments + SRS (property excluded)",
    guaranteedFloor: "Guaranteed floor",
    guaranteedFloorNote: "CPF LIFE — income you can't outlive",
    manualToggle: "Prefer to type it in yourself? ▼",
    manualToggleHide: "Hide manual entry ▲",
    loadSample: "Load sample profile",
    presetHeading: "Assumption preset",
    group1: "1 · Retiree profile",
    group2: "2 · CPF LIFE",
    group3: "3 · Housing",
    group4: "4 · Cash and investments",
    group5: "5 · Lifestyle spending",
    group6: "6 · Bequest (optional)",
    group7: "7 · Assumptions",
    lifestylePickHint: "Pick a starting point, then adjust",
    startFromLifestyle: "Start from a lifestyle",
    lifestyleNote:
      "Suggested budgets to start from — adjust them to fit your life.",
    showAspirational: "Show aspirational buckets (travel, hobbies, other) ▼",
    hideAspirational: "Hide aspirational buckets ▲",
    summaryHeading: "Plan summary",
    runningSim: "Running simulation…",
    calculate: "Calculate safer spend",
    allocWarning100: "Asset mix should add to 100%.",
    allocWarning: "Asset mix should add to 100% (currently {{value}}%).",
    planningAdviceNote: "Planning advice — estimates, not guarantees.",
    disclaimer:
      "Neutral financial planning advice — the decisions are yours to weigh. We advise the move, never push a specific product. The Singpass / SGFinDex connection is an illustrative prototype.",
    // Account row source/labels (aggregation)
    acctCpfSource: "CPF Board",
    acctCpfLabel: "CPF LIFE payout (Standard)",
    acctCpfNote: "Guaranteed income floor for life",
    acctBankSource: "DBS · via SGFinDex",
    acctBankLabel: "Savings & fixed deposits",
    acctBankNote: "Cash buffer for bad-market years",
    acctInvestSource: "Endowus · Poems · via SGFinDex",
    acctInvestLabel: "Investments (unit trusts, shares)",
    acctInvestNote: "Bonds + equity — the growth engine",
    acctSrsSource: "OCBC SRS · via SGFinDex",
    acctSrsLabel: "SRS account",
    acctSrsNote: "10-year window · 50% taxable on withdrawal",
    acctPropSource: "HDB · via Myinfo",
    acctPropLabel: "4-room HDB flat (paid off)",
    acctPropNote: "Excluded from spendable base by default — illiquid",
    // Form field labels
    fCurrentAge: "Current age",
    fPlanToAge: "Plan to age",
    fPlanToAgeHelp: "Longer life usually lowers the safer monthly spend.",
    fGender: "Gender",
    fGenderMale: "Male",
    fGenderFemale: "Female (+2 yrs longevity)",
    fSpouseAge: "Spouse age (optional)",
    fSpouseAgeHelp: "Joint planning if included.",
    fCpfPayout: "Monthly CPF LIFE payout",
    fCpfPlan: "CPF LIFE plan",
    fCpfPlanHelp: "A longevity floor, not an inflation hedge.",
    fHousingStatus: "Housing status",
    fHousingStatusHelp:
      "Housing cost is included in spending. Paid off means S$0 monthly cost.",
    fMonthlyHousing: "Monthly housing cost",
    fMonthlyHousingHelp: "Mortgage, rent, or other — 0 if paid off.",
    fCash: "Cash",
    fInvestments: "Investments",
    fSrs: "SRS",
    fCashPct: "Cash %",
    fBondsPct: "Bonds %",
    fEquityPct: "Equity %",
    fBequestTarget: "Bequest target",
    fBequestTargetHelp: "Minimum to leave at the horizon.",
    fGeneralInflation: "General / lifestyle inflation",
    fHealthcareInflation: "Healthcare inflation",
    fHealthcareInflationHelp:
      "Healthcare costs usually rise faster than general inflation.",
    // Summary rows
    sumTotalAssets: "Total assets",
    sumCpfPayout: "CPF LIFE payout",
    sumDesiredSpend: "Desired spend",
    sumHousingCost: "Housing cost",
    sumAlloc: "Cash/Bonds/Equity",
    // Singpass pull steps
    step0: "Redirecting to Singpass…",
    step1: "Retrieving CPF LIFE & CPF balances (CPF Board)",
    step2: "Retrieving bank balances (SGFinDex)",
    step3: "Retrieving investments & SRS (SGFinDex)",
    step4: "Retrieving HDB property (Myinfo)",
    step5: "Building your whole-wealth picture",
    // Kind labels (uppercase tags on account rows)
    kindCpf: "CPF",
    kindBank: "BANK",
    kindInvestment: "INVESTMENT",
    kindSrs: "SRS",
    kindProperty: "PROPERTY",
    // Actual input label (Spend Monitor share)
    fActual: "Actual",
  },

  results: {
    simulating: "Simulating thousands of retirement paths…",
    noPlanTitle: "No plan yet",
    noPlanBody:
      "Connect your accounts first, or load a sample profile to see Enough in action.",
    connectAccounts: "Connect accounts",
    loadSample: "Load sample profile",
    // Oversight strip (adult-child)
    oversightTitle: "Shared plan overview",
    oversightBody:
      "Read-only access granted by Dad. Dad remains the sole plan owner and decision-maker.",
    goToFamily: "View family access settings →",
    // Section title
    kickerParent: "Your result",
    kickerChild: "Your parent's result",
    titleParent: "Your safer monthly spend range",
    titleChild: "Dad's safer monthly spend",
    subtitleDemo:
      "A range with an estimated confidence — never a guarantee. This is an illustrative result based on stated assumptions.",
    subtitleCustom:
      "A range with an estimated confidence — never a guarantee. Based on the assumptions you entered.",
    kickerCustom: "Your result · live engine",
    // Hero
    heroLabelParent: "Your safer monthly spend range",
    heroLabelChild: "Dad's safer monthly spend range",
    suggestedToday: "Suggested today: {{central}} · {{confidence}}",
    desiredLine: "Desired {{value}} ≈ {{pct}}% confidence",
    overYrs: "~{{pct}} over {{yrs}} yrs",
    // Custom hero
    centralLine: "Central: {{central}} · about {{pct}} confidence",
    trialsLine: "{{trials}} trials · return {{ret}} · vol {{vol}}",
    // Stat cards
    cpfFloorLabel: "CPF LIFE floor",
    cpfFloorSub: "/month · income for life",
    withdrawalLabel: "Extra withdrawal",
    withdrawalSub: "/month · {{rate}} rate",
    desiredLabel: "Desired spend",
    gapLabel: "Gap vs desired",
    gapLabelShort: "Gap",
    // Warnings
    cpfFloorWarningDemo:
      "CPF LIFE is a longevity floor, not necessarily an inflation hedge. Standard payouts are level nominal; spending is inflated over time. Results are estimates, not guarantees.",
    cpfFloorWarningCustom:
      "CPF LIFE is a longevity floor, not an inflation hedge. The safer range depends on assumptions. Results are estimates, not guarantees.",
    aggressiveTitle: "Your desired spend is aggressive",
    aggressiveBody:
      "Desired {{value}} needs a {{rate}} withdrawal rate — well above the ~3.5–4% historically considered sustainable.",
    // Stress test section
    stressTitleParent: "Stress-test the plan",
    stressTitleChild: "Stress-test Dad's plan",
    stressIntro:
      "See how life events move the monthly spend number before they happen.",
    riskTitleParent: "Most important risk for this plan",
    riskTitleChild: "Most important risk for Dad's plan",
    riskBody:
      "Healthcare and longevity move the number more than the retirement trip.",
    riskFooter:
      "Enough does not hide uncertainty. It shows which assumptions matter before the family commits to a monthly spend.",
    suggestToggleShow: "What we suggest",
    suggestToggleHide: "Hide suggestions",
    suggestTitle: "What we suggest",
    suggestNote:
      "Our advice on the moves to weigh — you decide. We stay neutral on the specific product.",
    impactPrefix: "Safer spend impact: ",
    // Guardrail
    guardrailPill: "Guardrail · raise available",
    guardrailTitle: "Markets are up — the model shows room to raise spend",
    guardrailBody:
      "{{reason}} A living plan with a steering wheel — no panic in downturns, and permission to safely spend more in good times.",
    guardrailNow: "now → suggested",
    guardrailPerMonth: "/month",
    // Inflation card
    inflationTitle: "Inflation assumptions used",
    inflationGeneral: "General / lifestyle spending",
    inflationHealthcare: "Healthcare",
    inflationCpfStandard: "CPF LIFE Standard",
    inflationCpfStandardValue: "level nominal payout",
    inflationCpfEscalating: "CPF LIFE Escalating",
    inflationCpfEscalatingOn: "selected — grows about 2% / year",
    inflationCpfEscalatingOff: "grows about 2% / year if selected",
    inflationPerYear: "{{value}} / year",
    inflationNote:
      "CPF LIFE is a longevity floor, not necessarily an inflation hedge. Spending is inflated over time.",
    // Lifestyle summary
    lifestyleTitle: "Lifestyle layers",
    // Next action
    nextTitleParent: "Turn this into a family conversation",
    nextTitleChild: "Review the shared family summary",
    nextBodyParent: "Open a calm, printable one-page report to share at home.",
    nextBodyChild:
      "View the information Dad has chosen to share. No changes can be made from adult-child view.",
    nextCtaParent: "Open family report →",
    nextCtaChild: "Open shared family report →",
    // Curve
    curveTitleDemo: "The product is the curve",
    curveTitleCustom: "Spend-confidence curve",
    curveSub:
      "Each extra S$100/month improves lifestyle today but reduces safety tomorrow.",
    curveRefCpf: "CPF floor",
    curveRefSafer: "Safer",
    curveRefDesired: "Desired",
    curveTooltipConf: "{{value}}% confidence",
    curveTooltipSpend: "Spend {{value}}/month",
    // Sensitivity
    sensTitleDemo: "What moves the number?",
    sensTitleCustom: "What moves your number?",
    sensIntro:
      "Enough does not hide uncertainty. It shows which assumptions matter.",
    sensReduces: "Reduces safer spend",
    sensImproves: "Improves sustainability",
    // Sequence
    seqTitle: "Bad markets early hurt more",
    seqIntroDemo:
      "Two retirees can earn the same average return, but the one hit by losses early may run out sooner — withdrawals happen when assets are depressed.",
    seqIntroCustom:
      "The same average return in a different order produces very different outcomes.",
    seqYear: "Year {{n}}",
    // Learning
    learnTitle: "The plan learns over time",
    learnIntro:
      "Not a snapshot — a record of decisions. The longer you stay, the more the number reflects your real spending. This is the household switching cost no competitor can copy in a sprint.",
    // Crisis stress
    crisisTitle: "Financial crisis stress test",
    crisisIntro:
      "A scenario test, not market timing. See how a downturn moves the safer spend and which guardrail zone applies.",
    crisisBase: "Base safer spend",
    crisisAfter: "After {{name}}",
    crisisImpact: "Estimated impact",
    // Lifespan
    lifespanTitle: "Lifespan sensitivity",
    lifespanIntro:
      "Longer life usually lowers the safer monthly spend because the same assets must last longer.",
    lifespanPlanTo: "Plan to age {{age}}",
    // Empty / spinner
    spinnerSens: "Testing what moves your number…",
    // Sensitivity factor labels (constant figures embedded in the phrase)
    sensReduceHorizon: "Planning horizon +5 years",
    sensReduceBequest: "Bequest target +S$50,000",
    sensReduceHealth: "Healthcare inflation +2%",
    sensReduceReturn: "Investment return −1%",
    sensImproveReturn: "Investment return +1%",
    sensImproveFlex: "Spending flexibility 15% (guardrails)",
    sensImproveCpf: "Model a higher CPF LIFE floor",
    // Sequence-of-returns chart series labels
    seqSteady: "Steady market",
    seqBadEarly: "Bad market EARLY",
    seqBadLate: "Bad market LATE",
  },

  guardrails: {
    raiseHeadline: "Markets are up — you can safely spend more",
    raiseRule: "Portfolio sustainably above the plan line",
    raiseAction: "Raise the safer monthly spend (e.g. S$2,140 → S$2,350).",
    greenHeadline: "On track — hold steady",
    greenRule: "Portfolio within the safer band",
    greenAction: "Keep spending the current safe amount. No change.",
    amberHeadline: "Below the line — trim discretionary",
    amberRule: "Portfolio drops below the lower guardrail",
    amberAction: "Trim discretionary spending ~10% until it recovers.",
    redHeadline: "Sustained drop — pause increases, use the buffer",
    redRule: "Portfolio well below the line for a sustained period",
    redAction: "Fund the year from the cash buffer; pause any raises.",
    reason:
      "Markets have run above the plan line for three quarters, so the safe monthly amount has earned a raise.",
    zoneGreen: "Green zone",
    zoneAmber: "Amber zone",
    zoneRed: "Red zone",
    zoneGreenHealth: "Green zone — manageable",
    zoneAmberHealth: "Amber zone — plan for it",
    zoneRedHealth: "Red zone — needs a funding plan",
    zoneGuidanceGreen: "Stay within the safer range — no change needed.",
    zoneGuidanceAmber:
      "Trim discretionary spending by 5% to 10% until confidence recovers.",
    zoneGuidanceRed:
      "Pause discretionary increases; use the cash buffer; review family support.",
    learnYear1: "Year 1",
    learnYear2: "Year 2",
    learnYear3: "Year 3",
    learnYear4: "Year 4",
    learnEvent1: "First plan from consented SGFinDex data",
    learnEvent2: "Learned you consistently spend below the safe line",
    learnEvent3: "Guardrail raise after a strong market",
    learnEvent4: "Guardrail trim after a market dip",
    learnDriver1:
      "Conservative start while the plan learns your real spending.",
    learnDriver2:
      "Underspending out of caution → the plan gives you permission to spend more.",
    learnDriver3:
      "Sustained growth above the plan line → an earned, reversible raise.",
    learnDriver4:
      "A sustained drop → a small trim now protects the plan for later.",
  },

  stressTests: {
    longevityLabel: "Longer life",
    longevityTitle: "Longer life",
    longevityDescription:
      "Plan to age {{targetAge}} instead of {{currentAge}}.",
    longevityFooter: "Longevity is usually the biggest silent risk.",
    healthcareLabel: "Healthcare shock",
    healthcareTitle: "Healthcare shock",
    healthcareDescription: "Add S$1,500/month of care cost for 3 years.",
    healthcareFooter:
      "Care cost can be funded by cash buffer, family support, insurance review, or public/community support — subject to eligibility.",
    bequestLabel: "Bequest target",
    bequestTitle: "Bequest target",
    bequestDescription: "Leave at least S$50,000 at the end of the plan.",
    bequestFooter: "Leaving more behind usually means spending less today.",
    suggest0: "Trim discretionary spending temporarily",
    suggest1: "Use cash buffer for short shocks",
    suggest2: "Review family support",
    suggest3:
      "Consider housing monetisation options such as room rental or downsizing",
    suggest4:
      "Close insurance gaps — Enough refers you to an insurer, IFA, or your existing adviser",
    suggest5: "Explore public or community support schemes",
    crisisMildLabel: "Mild downturn",
    crisisMildBlurb: "Portfolio falls about 10% in the first year.",
    crisisSevereLabel: "Severe downturn",
    crisisSevereBlurb: "Portfolio falls about 25% in the first year.",
    crisisLostLabel: "Lost decade",
    crisisLostBlurb: "Low returns persist for about 10 years.",
  },

  lifestyle: {
    essentials: "Essentials",
    foodTransport: "Food & transport",
    utilities: "Utilities & household",
    housing: "Housing",
    healthcare: "Healthcare",
    discretionary: "Discretionary lifestyle",
    familySupport: "Family support",
    travelHobbies: "Travel & hobbies",
    other: "Other",
    layerEssentials: "Essentials",
    layerFlexible: "Flexible",
    layerAspirational: "Aspirational",
    layerTotal: "Total / month",
    personaModest: "Modest",
    personaModestBlurb:
      "Covers the essentials with a little room — a frugal, steady month.",
    personaComfortable: "Comfortable",
    personaComfortableBlurb:
      "A relaxed lifestyle with some travel and family support — the worked example.",
    personaGenerous: "Generous",
    personaGenerousBlurb:
      "More travel, hobbies and family support — an aspirational month.",
  },

  presets: {
    conservative: "Conservative",
    conservativeBlurb:
      "Cautious returns, higher inflation, more cash. The safer spend is lowest here.",
    base: "Base case",
    baseBlurb:
      "Defensible mid-range assumptions. The default used throughout the app.",
    optimistic: "Optimistic",
    optimisticBlurb:
      "Growth-tilted, lower inflation. The safer spend is highest here — still not a promise.",
    custom: "Custom",
    cpfStandard: "Standard (level nominal)",
    cpfBasic: "Basic (level nominal)",
    cpfEscalating: "Escalating (starts lower, +2%/yr)",
    housingPaidOff: "Paid off",
    housingMortgage: "Still paying mortgage",
    housingRenting: "Renting",
    housingOther: "Other",
  },

  gapActions: {
    cpfFloorTitle: "Model a higher CPF LIFE floor",
    cpfFloorDetail:
      "A larger guaranteed floor (e.g. topping up towards the Enhanced Retirement Sum) means more of your essentials are covered for life, so less of your spending depends on markets.",
    monetiseTitle: "Rent out a room in the HDB flat",
    monetiseDetail:
      "Renting a spare room adds guaranteed monthly income on top of CPF LIFE. Raising the income floor is the biggest lever of all, because it is money you never have to fund from savings.",
    trimTitle: "Trim the aspirational layer",
    trimDetail:
      "Aspirational spending (travel, hobbies, extras) is the layer that flexes. Trimming it in the plan closes the gap directly, without touching the essentials floor.",
    guardrailsTitle: "Agree to guardrails in bad years",
    guardrailsDetail:
      "Agreeing to trim discretionary spending in down markets lets the plan sustain a slightly higher average safer spend the rest of the time — a smaller lever here, but the main defence against a bad run of early returns.",
    closingTitle: "Closing the gap",
    closingIntro:
      "Your desired spend is {{value}} above the safer number. These are the levers we'd advise to close it — each figure is what the engine actually computes, not a fixed promise. We advise the move and stay neutral on the specific product.",
    closingSpinner: "Modelling each lever through the engine…",
    allFour: "If you did all four (modelled together)",
    allFourNote:
      "The levers overlap, so the combined effect is less than the sum — the engine models them together.",
    gapRemaining: "gap remaining",
    fromToday: "from {{value}} today",
    closingFooter:
      "Modelled estimates — weigh them and decide; no plan is foolproof. Enough advises the move and stays neutral on the specific product.",
  },

  fundingPlan: {
    title: "Which account to spend — and how much",
    intro:
      "Tax- and longevity-aware sequencing across cash, SRS, investments and CPF — with the amounts worked out from your own balances. About {{value}} a month comes from your assets above the CPF floor. This is the advice no single product provider can give you neutrally.",
    residualTitle:
      "About {{value}} the plan can't safely fund from your own assets",
    residualNote:
      "What we'd suggest looking at — you decide, and none of these are eligibility promises. These are real Singapore schemes that may help; check each with the relevant agency.",
    residualBody:
      "For the part you can't fund from assets or these schemes, working a little longer or trimming the lifestyle helps. And for the risks you can insure against — health, long-term care, longevity — see {{protection}} below, where Enough refers you to the right insurer or IFA.",
    protectionLink: "Protection gaps",
    addToReport: "Add this to the family report",
    stepCashTitle: "Cash buffer — first, and in bad-market years",
    stepCashRationale:
      "Hold about two years of the asset draw in cash so you never sell investments at a loss in a downturn.",
    stepCashNuance:
      "Refill it in good years — this is your sequence-of-returns defence.",
    stepSrsTitle: "SRS — inside the 10-year tax window",
    stepSrsRationale:
      "Draw your SRS across the 10-year penalty-free window so withdrawals are spread and taxed efficiently.",
    stepSrsNuance:
      "Only 50% of each SRS withdrawal is taxable — pace it to stay in a low bracket.",
    stepInvestTitle: "Investments — the growth engine, drawn steadily",
    stepInvestRationale:
      "Fund the rest of each year's draw from investments (bonds first, then equity), trimming with guardrails so the portfolio keeps compounding.",
    stepInvestNuance:
      "Rebalance on withdrawal; let equity ride in good years, trim in sustained drops.",
    stepCpfTitle: "CPF LIFE — the guaranteed floor, kept for life",
    stepCpfRationale:
      "CPF LIFE already pays a guaranteed income floor for life; the plan preserves it as the longevity backstop you can never outlive.",
    stepCpfNuance:
      "Spend it down last, on purpose — it is the base under everything else.",
    schemeSilverName: "Silver Support Scheme",
    schemeSilverDetail:
      "Quarterly cash for lower-income seniors — paid automatically if eligible (CPF Board).",
    schemeGstName: "GST Voucher",
    schemeGstDetail:
      "Cash, MediSave top-ups and U-Save utilities rebates for eligible households.",
    schemeChasName: "CHAS & MediSave / MediShield Life",
    schemeChasDetail:
      "Subsidised outpatient care, chronic-condition support and hospital-bill coverage.",
    schemePioneerName: "Pioneer / Merdeka Generation",
    schemePioneerDetail:
      "Extra healthcare and MediSave benefits for eligible birth cohorts.",
    schemeComCareName: "ComCare",
    schemeComCareDetail:
      "Short-to-medium-term financial assistance for those who need it (MSF).",
  },

  healthcare: {
    title: "Healthcare & care-cost stress test",
    badge: "scheme figures cited · episode costs illustrative",
    intro:
      "Pick a health event and a care setting to see the real cost — net of the government schemes that help — and how it moves the safer monthly spend.",
    careSetting: "Care setting",
    acuteHeading: "One-off acute event",
    acuteGrossLabel: "Hospital / treatment (gross)",
    acuteMedishield: "Less MediShield Life",
    acuteYouPay: "You pay (one-off)",
    monthlyHeading: "Monthly, for ~{{years}} years",
    ongoingLabel: "Ongoing medical",
    careLabel: "Care setting",
    careshieldLess: "Less CareShield Life ({{value}}/mo)",
    subsidyLess: "Less HCG / means-tested / CHAS",
    youFund: "You fund (per month)",
    notSevere:
      "This condition may not reach the CareShield Life severity bar (≥3 of 6 daily activities), so no payout is assumed.",
    baseSafer: "Base safer spend",
    afterCare: "After this care cost",
    impact: "Estimated impact",
    fundingOptions:
      "Funding options: cash buffer, the withdrawal sequence above, family support, or a referral to an insurer, IFA, or your existing adviser.",
    figures:
      "Scheme parameters (CareShield Life S$689/mo, Home Caregiving Grant S$600/mo, MediShield Life S$2,000 deductible + co-insurance) and typical care fees are from 2025–26 official sources. One-off episode costs and the means-tested subsidy rate are illustrative — actual means-tested subsidies are household-income-dependent (up to 75–80%). You weigh it and decide; no cost here is a guarantee, and we advise the move, not a specific product.",
    figuresLabel: "Figures.",
    addToReport: "Add to the family report",
    spinner: "Re-running the engine with this care cost…",
    // Conditions
    strokeLabel: "Stroke",
    strokeBlurb:
      "A sudden event, long rehabilitation, and often ongoing help with daily activities.",
    dementiaLabel: "Dementia",
    dementiaBlurb:
      "Gradual onset with escalating supervision and care needs over years.",
    cancerLabel: "Cancer",
    cancerBlurb:
      "High acute treatment cost, then ongoing follow-up and medication.",
    frailtyLabel: "General frailty",
    frailtyBlurb:
      "Slow decline with age — the most common care journey, over the longest horizon.",
    // Care options
    careHelperLabel: "Helper at home",
    careHelperNote:
      "Foreign domestic worker: salary + S$60 concessionary levy (eldercare) + upkeep. Home Caregiving Grant may offset when care needs are severe.",
    careDaycareLabel: "Day-care centre",
    careDaycareNote:
      "Senior care centre day programme. AIC means-tested subsidy up to 80% for lower-income households.",
    careNursingLabel: "Nursing home",
    careNursingNote:
      "Residential nursing home. Means-tested subsidy up to 75% (80% if born 1969 or earlier), plus CareShield Life if severe.",
    // Sources
    srcCareShield: "CareShield Life — CPF Board",
    srcHcg: "Home Caregiving Grant — MOM/MSF",
    srcMedishield: "MediShield Life — MOH",
    srcAic: "Residential & day care fees/subsidies — AIC",
  },

  protection: {
    title: "Protection gaps — and who to see",
    intro:
      "Some retirement risks are cheaper to insure than to self-fund. Here's the risk, the protection that covers it, and the licensed partner we'd introduce you to. You choose who — Enough sizes the gap and makes the introduction; the partner handles the product.",
    protectionFits: "Protection that fits",
    whoToSee: "Who to see",
    footer:
      "Providers shown are illustrative example partners (real Singapore firms and schemes, 2025–26), not confirmed relationships. Enough refers as a permitted MAS introducer (FAA-N02); flat fees, never commission, so the referral stays neutral — you decide, and any product is arranged by the licensed partner.",
    footerEmphasis: "illustrative example partners",
    addToReport: "Add to the family report",
    // Referral map: risk → protection → partner. Illustrative example partners.
    r_longevity_gap: "Longevity — outliving your savings",
    r_longevity_nature:
      "Your invested assets fund the spending above CPF LIFE. Live to 95+ or hit a bad market run, and that pot can run dry while you are still here.",
    r_longevity_protection:
      "Guaranteed income for life — top up CPF LIFE to the Enhanced Retirement Sum (ERS), or add a private lifetime annuity.",
    r_longevity_why:
      "Converts a finite pot into lifelong income — the one risk you cannot safely self-insure.",
    r_longevity_channel:
      "CPF Board (CPF LIFE top-up), or a fee-only IFA to compare private annuities.",
    r_longevity_ex0: "CPF LIFE (CPF Board)",
    r_longevity_ex1: "Private annuities — Income, Great Eastern, Singlife",
    r_longevity_ex2: "Compare via a fee-only IFA — Providend, GYC",
    r_hosp_gap: "Hospitalisation — beyond MediShield Life",
    r_hosp_nature:
      "MediShield Life covers subsidised (B2/C ward) bills. Private-hospital or A-ward care, and large bills, leave a shortfall you pay out of pocket.",
    r_hosp_protection:
      "An Integrated Shield Plan (IP) with a rider — private / higher-ward cover on top of MediShield Life.",
    r_hosp_why:
      "Caps your exposure on a big hospital bill so a single admission doesn't derail the plan.",
    r_hosp_channel: "An insurance agency or an IFA.",
    r_hosp_ex0: "AIA, Great Eastern, Prudential, Income, Singlife, HSBC Life",
    r_ltc_gap: "Long-term care — beyond CareShield Life",
    r_ltc_nature:
      "CareShield Life pays ~S$689/mo only when you are severely disabled (3 of 6 daily activities). Real care — helper, day-care, nursing home — can cost far more.",
    r_ltc_protection:
      "A CareShield Life supplement — a higher monthly payout for long-term care.",
    r_ltc_why:
      "Turns the biggest, longest-tail retirement cost into a predictable monthly benefit.",
    r_ltc_channel: "An insurance agency.",
    r_ltc_ex0: "Singlife CareShield Standard / Plus",
    r_ltc_ex1: "Great Eastern",
    r_ltc_ex2: "Income Insurance",
    r_ci_gap: "Critical illness — cancer, stroke, major illness",
    r_ci_nature:
      "A serious diagnosis brings heavy treatment cost plus lost earning ability. MediShield Life covers only listed cancer drugs, with limits.",
    r_ci_protection:
      "A Critical Illness (CI) plan — a lump sum on diagnosis to fund treatment and replace income.",
    r_ci_why:
      "Gives you cash when you most need it, without selling down investments at the worst time.",
    r_ci_channel: "An IFA (to compare across insurers) or an insurance agency.",
    r_ci_ex0: "AIA, Prudential, Great Eastern, Manulife",
    r_ci_ex1: "Compare via an IFA — Financial Alliance, IPP",
    r_legacy_gap: "Legacy — protecting what you leave behind",
    r_legacy_nature:
      "You want to leave a set amount, but drawing down to spend erodes it — and markets make the ending balance uncertain.",
    r_legacy_protection:
      "Whole-life or legacy planning that ring-fences a bequest regardless of market outcomes.",
    r_legacy_why:
      "Lets you spend more freely today, knowing the bequest is protected separately.",
    r_legacy_channel: "A fee-only IFA.",
    r_legacy_ex0: "Providend, GYC (estate & legacy planning)",
  },

  spendMonitor: {
    kickerParent: "Spending check",
    kickerChild: "Adult-child view",
    title: "Spend Monitor",
    subtitle:
      "Compare what you actually spend against the safer monthly range. Manual entry — no bank feed, no auto-categorisation.",
    heroLabelParent: "Your spending vs safer range",
    heroLabelChild: "Dad's spending vs safer range",
    actualPerMonth: "actual / month",
    saferRange: "Safer range: {{value}}",
    overUpper: "{{value}} above the upper safer range.{{review}}",
    reviewFirst: " Review {{bucket}} first.",
    zoneGreen: "Within safer range",
    zoneAmber: "Slightly above range",
    zoneRed: "Above safe range",
    plannedVsActual: "Planned vs actual by bucket",
    plannedActual: "Planned {{planned}} · Actual {{actual}}",
    updateReport: "Update family report",
    resetToPlanned: "Reset to planned",
    readOnlyNotice:
      "Read-only shared view. Only the parent can update spending records.",
    disclaimer:
      "Spend Monitor is a manual planning tool. Enough does not connect to your bank, import transactions, or categorise spending automatically.",
  },

  family: {
    kicker: "Family tier",
    title: "One plan, the whole family",
    subtitle:
      "Sharing is optional. The parent remains in control and can revoke access at any time.",
    pillParent: "Parent view",
    pillChild: "Adult-child view",
    parentTag: "Confidence without surveillance",
    childTag: "Read-only shared view",
    parentBody:
      "Sharing is optional. Grant Wei Ling read-only access to selected parts of your retirement plan. You can revoke access at any time.",
    childBody:
      "Read-only access granted by Mr Tan. You can view the information Mr Tan has shared. Mr Tan remains the sole plan owner and decision-maker.",
    whoOnPlan: "Who's on the plan",
    accessHeading: "Adult-child access",
    accessIntro:
      "Sharing is optional. Grant Wei Ling read-only access to selected parts of your retirement plan. You can revoke access at any time.",
    accessGrantedBody:
      "Wei Ling can view the shared plan but cannot edit inputs, connect accounts, approve decisions or change the safer-spend number.",
    accessChildBody:
      "You can view the information Mr Tan has shared. Mr Tan remains the sole plan owner and decision-maker.",
    accessNotShared: "Not shared",
    accessGranted: "Access granted",
    accessGrantedByParent: "Read-only access granted by Mr Tan",
    accessReadOnlyBadge: "Read-only",
    grantButton: "Grant read-only access",
    revokeButton: "Revoke access",
    permissionBullets: {
      canViewSafer: "Can view the safer monthly spending result",
      canViewAlerts: "Can view selected alerts and the family report",
      cannotEdit: "Cannot edit financial information or spending",
      cannotApprove: "Cannot approve, confirm or act on the parent's behalf",
      canRevoke: "Access can be revoked by the parent at any time",
    },
    moatTitle: "The family layer is the uncontested ground",
    moatBody:
      "Family access is permission-based and revocable. A read-only shared view keeps the family loop without giving up control.",
    openReport: "Open the family report →",
    backToResults: "Back to results",
    disclaimer:
      "Illustrative prototype of the family tier. Sharing is optional, permission-based, and revocable — not a live account.",
    parentPermissionRequired:
      "Parent permission is required before adult-child access is available.",
    gateOpenSettingsCta: "Open Parent access settings",
    gateReturnHomeCta: "Return to Parent home",
    accessGrantedConfirmation: "Read-only access granted to Wei Ling.",
    accessGrantedHint: "The Adult-child view is now available in the navbar.",
    gateTitle: "Parent permission required",
    gateBody: "This retirement plan has not been shared with the adult child. The parent must grant read-only access before any plan information can be viewed.",
    gatePrivacyNote: "Sharing is optional. The parent remains in control and may revoke access at any time.",
    gateReturnCta: "Return to Parent view",
    lockedUntilGranted: "Locked until parent grants permission",
    // member labels
    m1Name: "Mr Tan",
    m1Relation: "Retiree",
    m1Role: "Owner · sole decision-maker",
    m1p1: "Owns the plan and all data consent",
    m1p2: "Controls who can view the plan",
    m1p3: "Can grant or revoke family access at any time",
    m2Name: "Mrs Tan",
    m2Relation: "Spouse",
    m2Role: "Permission-based viewer",
    m2p1: "Sees the plan and the safer monthly spend range when permission is granted",
    m2p2: "Joins family conversations",
    m2p3: "Read-only — cannot edit, approve or change the plan",
    m3Name: "Wei Ling",
    m3Relation: "Adult daughter",
    m3Role: "Optional read-only viewer",
    m3p1: "Can view selected plan information after Dad grants access",
    m3p2: "Can receive selected alerts",
    m3p3: "Cannot edit, approve or act on Dad's behalf",
  },

  familyPlane: {
    alert1Title: "Dad's plan is on track",
    alert1Body: "90% confidence to age 95. No action needed.",
    alert2Title: "A safe raise is available",
    alert2Body:
      "Markets ran above the plan line — the safer monthly spend can rise to S$2,350.",
    alert3Title: "CPF top-up decision worth reviewing",
    alert3Body:
      "A larger floor would lift confidence ~3%. Dad may want to review this option.",
  },

  report: {
    kicker: "For the kitchen table",
    title: "Family report",
    subtitle:
      "A calm, one-page summary to discuss at home. Plain language, product-neutral advice.",
    print: "Print family report",
    header: "Enough Family Report",
    headerSub: "Mr Tan, age {{age}}. Plan to age {{horizon}}.",
    headerAdvice: "Planning advice · you decide",
    saferLabel: "Safer monthly spend range",
    cpfFloorNote:
      "CPF LIFE is a longevity floor, not necessarily an inflation hedge.",
    centralEstimate: "Central estimate: {{central}} at {{confidence}}",
    cpfFloorLabel: "CPF LIFE floor",
    lifestyleLabel: "Lifestyle spending",
    lifestyleLine:
      "Essentials {{e}} · Flexible {{f}} · Aspirational {{a}} · Total {{t}}.",
    healthcareLabel: "Healthcare & care shock",
    healthcareBody:
      "A care shock (for example, extra care cost for a few years) may reduce safer spend by about {{value}}. Ways to cover it: cash buffer, family support, public or community schemes, or a referral to an insurer, IFA, or your existing adviser.",
    bequestLabel: "Bequest",
    bequestBody:
      "A {{target}} bequest target may reduce safer spend by about {{value}}. A bequest is not rejected — Enough shows the monthly trade-off.",
    crisisLabel: "Market downturn guardrail",
    crisisBody:
      "A severe downturn may move the plan to the Amber zone — the model suggests trimming discretionary spending by 5% to 10% until confidence recovers. This is a scenario test, not market timing.",
    currentLabel: "Current spending check",
    currentBody: "Actual {{actual}} vs safer range {{range}}.{{over}}",
    currentOver:
      " About {{value}} above the upper safer range — review discretionary and travel buckets first.",
    currentWithin: " Within the safer range.",
    convoTitle: "Conversation starter",
    convoBody:
      "Our CPF LIFE gives us {{cpf}} for life. Spending about {{central}} looks safer. Spending much higher means accepting more risk.",
    disclaimer:
      "Neutral financial planning advice (pursuing MAS FA licensing). We advise the decision, not a specific product. Estimates, not guarantees — illustrative result based on stated assumptions. Think it through and make your own call before major financial decisions.",
    saveAsPdf:
      'Use your browser\'s Print dialog and choose "Save as PDF" to share this report.',
  },

  partners: {
    kicker: "For partners",
    title: "Enough for partners",
    subtitle:
      "A neutral Singapore decumulation engine — distributed through partners for whom neutrality is an asset, never a threat.",
    wedgeTitle: "A wedge today, a built moat tomorrow",
    wedgeBody:
      "The safe-spend engine is honest, focused table stakes — the defensible moat is the licence-gated, family-embedded system-of-record it becomes: consented whole-wealth aggregation, tax-aware sequencing, and a multi-year household relationship no product-seller can assemble.",
    problemTitle: "The problem",
    problemBody:
      "Accumulation is crowded. Decumulation is under-served. No neutral player owns the monthly spend decision — banks and advisers earn on the products they sell.",
    whyNowTitle: "Why now",
    whyNow1: "Singapore is ageing — 1 in 4 over 65 by 2030.",
    whyNow2: "CPF LIFE is a floor, not a whole-wealth spending answer.",
    whyNow3: "The public neutral whole-wealth planner (MyMoneySense) exited.",
    whyNow4: "SGFinDex makes consented aggregation possible.",
    threeTitle: "The three that survive",
    three1: "Neutral, whole-wealth aggregation.",
    three2: "Native CPF-LIFE / SRS / SG-tax depth.",
    three3: "The family / adult-child layer (uncontested).",
    channelTitle: "Channel: non-bank B2B2C led, family tier on top",
    channelBody:
      "Flat fees only — never commission or product revenue-share. Enough stays the data controller in every deal. Banks last, and only as a firewalled neutral rail.",
    channelWellnessName: "Employer-wellness (lead)",
    channelWellness1: "Support sandwich-generation staff with ageing parents",
    channelWellness2: "Per-employee-per-year (PEPY), flat",
    channelWellness3: "Cleanest on neutrality + data",
    channelWellness4: "Reaches the adult-child buyer directly",
    channelIfaName: "Fee-only IFAs",
    channelIfa1: "A scalable neutral engine + a glass-box plan to hand clients",
    channelIfa2: "Per-adviser seat / month",
    channelIfa3: "Co-brandable; Enough keeps engine + data",
    channelInsurerName: "Insurers + family tier",
    channelInsurer1:
      "Neutral need-sizing as qualified lead-gen (flat + per-lead)",
    channelInsurer2: "Never commission on sales",
    channelInsurer3: "Direct family tier: the adult child pays",
    channelNote:
      "All figures illustrative estimates for an academic proposal. Validate pricing units with partner discovery + Van Westendorp before committing.",
    regTitle: "Regulatory path",
    reg1: "Pursuing the MAS Financial Adviser licence to give neutral financial planning advice.",
    reg2: "Product-neutral: advise the decision, never push a product.",
    reg3: "Flat fees, never commission — so the advice stays honest.",
    reg4: "The licence gates the moat — a Wave-1 critical-path item, not an afterthought.",
    pilotTitle: "Pilot ask",
    pilot1: "One employer-wellness or fee-only IFA partner.",
    pilot2: "Sandwich-generation staff with ageing parents.",
    pilot3: "Measure connected plans, safe-spend adoption, family engagement.",
    pilot4: "Goal: prove the number, build the family flywheel.",
    closerTitle: "Out-focus MoneyOwl. Out-neutral DBS. Own the family.",
    closerBody:
      "Neutral financial planning advice (pursuing MAS FA licensing). We advise the decision, not a specific product. Estimates, not guarantees. Not affiliated with CPF Board or MAS.",
    disclaimer:
      "Market and unit-economics figures are illustrative estimates for an academic proposal.",
  },

  disclaimer: {
    footer:
      "Neutral financial planning advice — you make the final call. We advise the decision, not a specific product (flat fees, never commission). Estimates, not guarantees. Not affiliated with CPF Board or MAS.",
  },
} as const;

export default enSG;
