/**
 * Simplified Chinese (Singapore) translation. Mirrors en-SG.ts key-for-key.
 *
 * Wording principles (see requirements §5 / §13):
 *  - Clear, respectful, senior-friendly Simplified Chinese for Singapore users.
 *  - Cautious, never a guarantee ("大约"、"估算"、"规划估算"、"并非保证"、"示意").
 *  - Official scheme / product names stay in Latin (Enough、CPF、CPF LIFE、SRS、
 *    Singpass、SGFinDex、Myinfo、HDB、MediSave、MediShield Life、CareShield Life、
 *    Enhanced Retirement Sum、CHAS、Silver Support、GST Voucher 等).
 *  - All i18next interpolation placeholders (e.g. {{value}}、{{central}}) are
 *    preserved exactly — only the surrounding word order changes for Chinese.
 */
const zhSG = {
  common: {
    brand: "Enough",
    tagline: "中立的新加坡退休支出规划",
    appTitle: "Enough — 我每月到底能花多少？",
    perMonth: "/月",
    perYear: "/年",
    forLife: "终身",
    buffer: "缓冲",
    rangeSeparator: "至",
    recommended: "建议",
    excluded: "未计入",
    connected: "已连接",
    onPlan: "在规划内",
    closes: "可弥合",
    ofTheGap: "的缺口",
    raisesSafer: "上调安全支出 {{delta}}",
    reversible: "可回退",
    hardToReverse: "难以逆转",
    gap: "缺口",
    residualGap: "剩余缺口",
    channel: "渠道",
    back: "← 返回",
    backToResults: "← 返回结果",
    seeMySaferSpend: "查看我的安全月支出 →",
    loading: "加载中…",
    yrs: "年",
    eq: "等同",
    selected: "已选：{{value}}",

    report: "家庭报告",

    resetPresentationDemo: "重置演示",
    resetPresentationDemoBody: "重置示例规划、支出记录和家庭访问设置？",
  },

  format: {
    confidence: "大约 {{pct}}% 的概率",
    perMonth: "/月",
    rangeSeparator: " 至 ",
    years: "{{n}} 年",
  },

  accessibility: {
    skipToContent: "跳到主内容",
    languageLabel: "语言",
    changeLanguage: "切换语言",
    menu: "菜单",
    closeMenu: "关闭菜单",
    openMenu: "打开菜单",
    primaryNav: "主导航",
    viewMode: "查看模式",
    mobileNav: "移动端导航",
    langChanged: "语言已切换为 {{name}}",
    chartUnavailable: "图表以视觉形式呈现。关键数字请见上方的文字摘要。",
  },

  navigation: {
    home: "首页",
    connect: "规划设置",
    results: "安全支出",
    spendMonitor: "支出监控",
    family: "家庭访问",
    parentView: "长辈视图",
    adultChildView: "成年子女视图",
    forPartners: "合作伙伴",
  },

  navigationShort: {
    home: "首页",
    plan: "规划",
    results: "安全支出",
    monitor: "监控",
    family: "家庭",
    parent: "长辈",
    child: "子女",
  },

  home: {
    badge: "新加坡中立的退休支出副驾驶",
    heroTitle: "我每月到底能花多少？",
    heroParent:
      "一个安心的数字——根据您的 CPF、储蓄和期望的生活方式，告诉您每月可能可以花多少。用平实的语言解释。中立的决策支持——绝不推销产品。",
    heroChild:
      "在父母选择与您分享时，查看他们的退休规划。访问为只读权限，父母始终完全掌握控制权。",
    ctaParent: "开始我的规划",
    ctaChild: "查看共享的父母规划",
    seeExample: "查看示例",
    pillarNeutralTitle: "中立、覆盖全资产",
    pillarNeutralBody:
      "不卖产品、不收佣金。我们将 CPF、SRS、银行存款和投资放在一个经您授权的统一视图中——并告诉您在全部资产中，每月可以稳妥花费多少。",
    pillarCpfTitle: "深入理解 CPF",
    pillarCpfBody:
      "以 CPF LIFE 作为您的保底终身收入，在 10 年窗口期内提取 SRS，跨账户进行具备税务与长寿意识的提取顺序规划。",
    pillarFamilyTitle: "面向全家",
    pillarFamilyBody:
      "家庭访问是可选且基于授权的。父母可将只读规划分享给配偶或成年子女，并可随时撤回访问。",
    permissionTitle: "可以花的底气",
    permissionBody:
      "CPF、银行和顾问都在帮新加坡人储蓄。但当服务方也销售产品时，要保持中立地看待支出就变得更难。Enough 专注于每月的支出决策。",
    wholeWealthLabel: "全资产 → 月支出",
    chipCpfLife: "CPF LIFE",
    chipSrs: "SRS",
    chipBank: "银行",
    chipInvestments: "投资",
    saferMonthlySpend: "→ 安全月支出",
    trustStrip:
      '中立理财规划建议 · 仅收固定费用，不收佣金 · 您的数据始终归您所有 · 每个数字背后都有通俗的"为什么"。',
  },

  connect: {
    kicker: "连接",
    title: "整合您的账户",
    subtitle:
      "用 Singpass 一次性连接，获得全资产视图——或者您也可以自行输入关键数字。",
    connectTitle: "用 Singpass 连接您的账户",
    connectBody:
      "通过 Singpass 一次授权拉取，即可经 SGFinDex 导入您的 CPF、银行、SRS 和投资——无需输入，始终最新。我们绝不会看到您的密码，而且我们保持产品中立——只给建议，不做销售。",
    connectButton: "用 Singpass 连接",
    chipCpfBoard: "CPF Board",
    chipBank: "银行 · SGFinDex",
    chipInvestments: "投资 · SGFinDex",
    chipSrs: "SRS",
    chipHdb: "HDB · Myinfo",
    protoNote:
      "仅为原型——这是模拟一次经授权的 Myinfo / SGFinDex 拉取。完整的 SGFinDex 接入需要持牌金融机构身份，是领牌后的工作；在 MVP 阶段采用 Myinfo + 人工录入。绝不会询问您的银行密码。",
    connectingTitle: "正在通过 Singpass 连接…",
    connectedTitle: "您的全资产图景",
    connectedBody:
      "通过 Singpass / SGFinDex 拉取。这是任何银行都无法中立的唯一视图——也是安全支出数字的基础。",
    spendableWealth: "可支配财富",
    spendableWealthNote: "现金 + 投资 + SRS（不含房产）",
    guaranteedFloor: "保底收入",
    guaranteedFloorNote: "CPF LIFE——终身不会用尽的收入",
    manualToggle: "想自己录入？▼",
    manualToggleHide: "隐藏手工录入 ▲",
    loadSample: "加载示例档案",
    presetHeading: "假设预设",
    group1: "1 · 退休人档案",
    group2: "2 · CPF LIFE",
    group3: "3 · 住房",
    group4: "4 · 现金与投资",
    group5: "5 · 生活方式支出",
    group6: "6 · 遗赠（可选）",
    group7: "7 · 假设",
    lifestylePickHint: "选一个起点，再行调整",
    startFromLifestyle: "从生活方式开始",
    lifestyleNote: "所列预算供您起步——请根据自身情况调整。",
    showAspirational: "显示向往型类目（旅行、爱好、其他）▼",
    hideAspirational: "隐藏向往型类目 ▲",
    summaryHeading: "规划摘要",
    runningSim: "正在运行模拟…",
    calculate: "计算安全支出",
    allocWarning100: "资产配置比例合计应为 100%。",
    allocWarning: "资产配置比例合计应为 100%（目前为 {{value}}%）。",
    planningAdviceNote: "规划建议——仅为估算，并非保证。",
    disclaimer:
      "中立理财规划建议——决策由您权衡。我们建议方向，绝不推销特定产品。Singpass / SGFinDex 连接为示意性原型。",
    // Account row source/labels (aggregation)
    acctCpfSource: "CPF Board",
    acctCpfLabel: "CPF LIFE 月领取额（Standard）",
    acctCpfNote: "终身保底收入",
    acctBankSource: "DBS · 经 SGFinDex",
    acctBankLabel: "储蓄与定期存款",
    acctBankNote: "用于市况不佳年份的现金缓冲",
    acctInvestSource: "Endowus · Poems · 经 SGFinDex",
    acctInvestLabel: "投资（单位信托、股票）",
    acctInvestNote: "债券 + 股票——增长引擎",
    acctSrsSource: "OCBC SRS · 经 SGFinDex",
    acctSrsLabel: "SRS 账户",
    acctSrsNote: "10 年窗口 · 提取时 50% 应纳税",
    acctPropSource: "HDB · 经 Myinfo",
    acctPropLabel: "4-room HDB 组屋（已还清）",
    acctPropNote: "默认不计入可支配基数——流动性低",
    // Form field labels
    fCurrentAge: "当前年龄",
    fPlanToAge: "规划至年龄",
    fPlanToAgeHelp: "寿命越长，安全月支出通常越低。",
    fGender: "性别",
    fGenderMale: "男",
    fGenderFemale: "女（寿命约 +2 年）",
    fSpouseAge: "配偶年龄（可选）",
    fSpouseAgeHelp: "如填写则进行联合规划。",
    fCpfPayout: "每月 CPF LIFE 领取额",
    fCpfPlan: "CPF LIFE 计划",
    fCpfPlanHelp: "是长寿保底，不是通胀对冲。",
    fHousingStatus: "住房状况",
    fHousingStatusHelp: "住房成本已计入支出。已还清意味着月成本为 S$0。",
    fMonthlyHousing: "每月住房成本",
    fMonthlyHousingHelp: "房贷、租金或其他——若已还清填 0。",
    fCash: "现金",
    fInvestments: "投资",
    fSrs: "SRS",
    fCashPct: "现金 %",
    fBondsPct: "债券 %",
    fEquityPct: "股票 %",
    fBequestTarget: "遗赠目标",
    fBequestTargetHelp: "到期末至少留下的金额。",
    fGeneralInflation: "一般 / 生活通胀",
    fHealthcareInflation: "医疗通胀",
    fHealthcareInflationHelp: "医疗成本通常比一般通胀上涨更快。",
    // Summary rows
    sumTotalAssets: "总资产",
    sumCpfPayout: "CPF LIFE 领取额",
    sumDesiredSpend: "理想支出",
    sumHousingCost: "住房成本",
    sumAlloc: "现金/债券/股票",
    // Singpass pull steps
    step0: "正在跳转至 Singpass…",
    step1: "正在获取 CPF LIFE 及 CPF 余额（CPF Board）",
    step2: "正在获取银行存款（SGFinDex）",
    step3: "正在获取投资及 SRS（SGFinDex）",
    step4: "正在获取 HDB 房产（Myinfo）",
    step5: "正在构建您的全资产图景",
    // Kind labels (tags on account rows)
    kindCpf: "CPF",
    kindBank: "银行",
    kindInvestment: "投资",
    kindSrs: "SRS",
    kindProperty: "房产",
    // Actual input label (Spend Monitor share)
    fActual: "实际",

    workflowStep1: "设置规划",
    workflowStep2: "查看安全支出",
    workflowStep3: "跟踪支出",
    workflowHintPlan: "第 1 步 / 共 3 步 — 收集您的假设。",
    workflowHintResult: "第 2 步 / 共 3 步 — 查看安全月支出。",
    workflowHintSpend: "第 3 步 / 共 3 步 — 将实际支出与安全区间对比。",

    privacyTitle: "仅使用示例信息",
    privacyBody: "请勿在本教学原型中输入真实账户号码、身份证件信息或密码。",
  },

  results: {
    openFamilyReport: "打开家庭报告",
    simulating: "正在模拟数千条退休路径…",
    noPlanTitle: "暂无规划",
    noPlanBody: "请先连接您的账户，或加载示例档案以体验 Enough。",
    connectAccounts: "连接账户",
    loadSample: "加载示例档案",
    // Oversight strip (adult-child)
    oversightTitle: "共享规划概览",
    oversightBody: "由爸爸授予只读访问权限。爸爸仍是规划的唯一拥有者和决策者。",
    goToFamily: "查看家庭访问设置 →",
    // Section title
    kickerParent: "您的结果",
    kickerChild: "您父母的结果",
    titleParent: "您的安全月支出区间",
    titleChild: "爸爸的安全月支出",
    subtitleDemo:
      "一个带估算概率的区间——并非保证。这是基于既定假设的示意性结果。",
    subtitleCustom: "一个带估算概率的区间——并非保证。基于您输入的假设。",
    kickerCustom: "您的结果 · 实时引擎",
    // Hero
    heroLabelParent: "您的安全月支出区间",
    heroLabelChild: "爸爸的安全月支出区间",
    suggestedToday: "今日建议：{{central}} · {{confidence}}",
    desiredLine: "理想 {{value}} ≈ {{pct}}% 概率",
    overYrs: "~{{pct}}，跨 {{yrs}} 年",
    // Custom hero
    centralLine: "中位：{{central}} · 大约 {{pct}} 概率",
    trialsLine: "{{trials}} 次模拟 · 回报 {{ret}} · 波动 {{vol}}",
    // Stat cards
    cpfFloorLabel: "CPF LIFE 保底",
    cpfFloorSub: "/月 · 终身收入",
    withdrawalLabel: "额外提取",
    withdrawalSub: "/月 · {{rate}} 比率",
    desiredLabel: "理想支出",
    gapLabel: "与理想的差距",
    gapLabelShort: "差距",
    // Warnings
    cpfFloorWarningDemo:
      "CPF LIFE 是长寿保底，不一定是通胀对冲。Standard 领取额为名义金额固定；支出会随时间通胀。结果仅为估算，并非保证。",
    cpfFloorWarningCustom:
      "CPF LIFE 是长寿保底，不是通胀对冲。安全区间取决于假设。结果仅为估算，并非保证。",
    aggressiveTitle: "您的理想支出偏进取",
    aggressiveBody:
      "理想 {{value}} 需要 {{rate}} 的提取率——明显高于历史上认为可持续的约 3.5–4%。",
    // Stress test section
    stressTitleParent: "压力测试您的规划",
    stressTitleChild: "压力测试爸爸的规划",
    stressIntro: "在人生事件发生前，先看看它们如何影响月支出数字。",
    riskTitleParent: "本规划最重要的风险",
    riskTitleChild: "爸爸规划最重要的风险",
    riskBody: "医疗和长寿对数字的影响，比退休旅行更大。",
    riskFooter:
      "Enough 不掩盖不确定性。它在家庭承诺每月支出之前，先展示哪些假设最重要。",
    suggestToggleShow: "我们的建议",
    suggestToggleHide: "隐藏建议",
    suggestTitle: "我们的建议",
    suggestNote:
      "我们对可权衡的行动给出建议——决策由您。我们对特定产品保持中立。",
    impactPrefix: "对安全支出的影响：",
    // Guardrail
    guardrailPill: "护栏 · 可上调",
    guardrailTitle: "市况上涨——模型显示有空间上调支出",
    guardrailBody:
      "{{reason}} 这是一份会转向的活规划——市况下跌时不恐慌，市况良好时也允许安心多花一些。",
    guardrailNow: "当前 → 建议",
    guardrailPerMonth: "/月",
    // Inflation card
    inflationTitle: "所用通胀假设",
    inflationGeneral: "一般 / 生活支出",
    inflationHealthcare: "医疗",
    inflationCpfStandard: "CPF LIFE Standard",
    inflationCpfStandardValue: "名义领取额固定",
    inflationCpfEscalating: "CPF LIFE Escalating",
    inflationCpfEscalatingOn: "已选——每年约增长 2%",
    inflationCpfEscalatingOff: "若选择，每年约增长 2%",
    inflationPerYear: "{{value}} / 年",
    inflationNote: "CPF LIFE 是长寿保底，不一定是通胀对冲。支出会随时间通胀。",
    // Lifestyle summary
    lifestyleTitle: "生活方式分层",
    // Next action
    nextTitleParent: "把结果带回家庭对话",
    nextTitleChild: "查看共享的家庭摘要",
    nextBodyParent: "打开一份从容、可打印的一页报告，在家分享。",
    nextBodyChild: "查看爸爸选择分享的信息。成年子女视图下不可进行任何修改。",
    nextCtaParent: "打开家庭报告 →",
    nextCtaChild: "打开共享的家庭报告 →",
    // Curve
    curveTitleDemo: "产品就是这条曲线",
    curveTitleCustom: "支出—概率曲线",
    curveSub: "每增加 S$100/月，今天的生活方式更好，却会降低明天的安全边际。",
    curveRefCpf: "CPF 保底",
    curveRefSafer: "安全",
    curveRefDesired: "理想",
    curveTooltipConf: "{{value}}% 概率",
    curveTooltipSpend: "月支出 {{value}}",
    // Sensitivity
    sensTitleDemo: "什么在影响这个数字？",
    sensTitleCustom: "什么在影响您的数字？",
    sensIntro: "Enough 不掩盖不确定性。它展示哪些假设最重要。",
    sensReduces: "降低安全支出",
    sensImproves: "提升可持续性",
    // Sequence
    seqTitle: "早期市况不佳伤害更大",
    seqIntroDemo:
      "两位退休人平均回报可能相同，但早期遭遇亏损的那位可能更早耗尽资产——因为提款发生在资产缩水时。",
    seqIntroCustom: "相同的平均回报以不同顺序出现，会产生截然不同的结果。",
    seqYear: "第 {{n}} 年",
    // Learning
    learnTitle: "规划会随时间学习",
    learnIntro:
      "这不是一张快照——而是决策的记录。您停留越久，这个数字就越能反映您真实的支出。这是任何竞争对手都无法在短期内复制的家庭切换成本。",
    // Crisis stress
    crisisTitle: "金融危机压力测试",
    crisisIntro:
      "这是情境测试，不是市场择时。看看市场下行如何影响安全支出，以及适用哪个护栏区间。",
    crisisBase: "基线安全支出",
    crisisAfter: "{{name}} 之后",
    crisisImpact: "估算影响",
    // Lifespan
    lifespanTitle: "寿命敏感度",
    lifespanIntro: "寿命越长，安全月支出通常越低，因为相同资产需要撑得更久。",
    lifespanPlanTo: "规划至 {{age}} 岁",
    // Empty / spinner
    spinnerSens: "正在测试什么影响您的数字…",
    // Sensitivity factor labels (constant figures embedded in the phrase)
    sensReduceHorizon: "规划期 +5 年",
    sensReduceBequest: "遗赠目标 +S$50,000",
    sensReduceHealth: "医疗通胀 +2%",
    sensReduceReturn: "投资回报 −1%",
    sensImproveReturn: "投资回报 +1%",
    sensImproveFlex: "支出弹性 15%（护栏）",
    sensImproveCpf: "假设更高的 CPF LIFE 保底",
    // Sequence-of-returns chart series labels
    seqSteady: "平稳市场",
    seqBadEarly: "早期市况不佳",
    seqBadLate: "晚期市况不佳",

    tabOverview: "概览",
    tabStress: "压力测试",
    tabAction: "行动计划",
    tabAnalytics: "分析",
    analyticsTitle: "数字是如何算出的",
    analyticsSub: "深入了解安全月支出估算背后的取舍与假设。",
    curveTitleOverview: "支出与概率",
    curveSubOverview:
      "更高的月支出改善今天的生活方式，但会降低规划维持的估算概率。",
    nextStepsTitle: "接下来您想做什么？",
    actionTrackSpending: "跟踪每月支出",
    actionTrackSpendingBody: "每月将实际支出与安全区间对比。",
    actionOpenReport: "打开家庭报告",
    actionOpenReportBody: "打开一份可打印或另存为 PDF 的从容一页摘要。",
    actionManageAccess: "管理家庭访问",
    actionManageAccessBody: "选择是否允许配偶或成年子女查看规划。",
    actionViewSpending: "查看共享支出",
    actionViewSpendingBody:
      "查看 Mr Tan 分享的信息。成年子女视图下不可进行任何修改。",
    actionOpenSharedReport: "打开共享的家庭报告",
    actionManageAccessChild: "查看家庭访问",
    illustrativeGuardrailPill: "示意性护栏情景",
    illustrativeGuardrailTitle: "示例：持续的投资组合增长可能支持更高的支出",
    illustrativeGuardrailBody:
      "本示例展示一个预先约定的护栏如何在持续投资组合增长后调整支出。并非基于实时市场数据。",
    tabBackOverview: "返回概览",
    tabViewActionPlan: "查看行动计划",
    tabBackStress: "返回压力测试",
    tabBackAnalytics: "返回概览",
    nextStepsPrimaryLabel: "主要",
    nextStepsSecondaryLabel: "次要",
    nextStepsTertiaryLabel: "可选",
    illustrativeWorkedExampleLabel: "示意性示例",
    illustrativeWorkedExampleNote:
      "以下数字为示意性演示示例，并非由实时引擎驱动。您自建的自定义规划由引擎计算。",
    optionsToExplore: "可探索的选项",
    optionsToExploreNote:
      "Enough 仅模拟影响。您决定是否与相关机构或持牌顾问进一步了解该选项。",
    providersHeading: "示意性持牌提供商",
    providersNote: "所列提供商名称仅为示例，并非已确认的合作伙伴或推荐。",
    workflowProgress: "第 2 步 / 共 3 步",
    workflowHintResult: "第 2 步 / 共 3 步 — 查看安全月支出。",

    closeSection: "关闭",

    engineBadge: "蒙特卡罗去累积引擎",
    scenarioBaseline: "您当前的规划",
    safeSpendHero: "约 S${{value}}/月",
    safeSpendRange:
      "估算区间 S${{lower}}–S${{upper}} · 约 {{confidence}}% 置信度",
    safeSpendPage: "您的安全月支出",
    explorePlan: "探索您的规划",
    testAScenario: "测试一个情景",
    seeWithdrawalPlan: "查看行动计划",
    trackMonthlySpending: "跟踪每月支出",
    manageFamilyAccess: "管理家庭访问",
    howWasThisCalculated: "这是如何计算的？",
    yourCalculatedResult: "您的计算结果",
    yourCalculatedNote: "根据您输入的假设计算。估算并非保证。",
    engineExplainer: "引擎原理",
    scenarioLabTitle: "情景实验室",
    scenarioLabSub:
      "改变一个假设，观察它如何影响安全月支出、置信度与资金缺口。",

    engineExplainerSub: "了解估算背后的假设、置信度曲线与风险。",
    scenarioBaselineReminder:
      "当前基线：约 S${{value}}/月，{{confidence}}% 置信度",
    scenarioLongerLife: "更长的寿命",
    scenarioLongerLifeSub: "为更长的退休期做准备，看同样的资产需要撑多久。",
    scenarioLongerLifeAge: "规划至年龄",
    scenarioLongerLifeQuick: "快速选择",
    scenarioHealthcare: "医疗与长期护理",
    scenarioHealthcareSub: "测试一次健康事件和持续护理费用的影响。",
    scenarioMarket: "市场时序风险",
    scenarioMarketSub: "比较退休早期与晚期发生的市场下跌。",
    scenarioTripLegacy: "旅行与遗产",
    scenarioTripLegacySub: "看一次性旅行和遗产目标如何影响安全月支出。",
    scenarioAfter: "情景后",
    scenarioImpact: "月度影响",
    scenarioConfidence: "置信度",
    scenarioReset: "重置情景",
    scenarioTripAsCash: "按今日从现金中预留资金建模。",
    scenarioLegacyCustom: "自定义遗产目标",
    scenarioAppliedLifespan: "已应用更长寿命情景",
    scenarioAppliedHealthcare: "已应用医疗情景",
    scenarioAppliedTrip: "已应用旅行情景",
    scenarioAppliedLegacy: "已应用遗产情景",
    sequenceRiskLabel: "示意性时序风险情景",
    sequenceRiskSteady: "稳定市场",
    sequenceRiskBadEarly: "早期市场下跌",
    sequenceRiskBadLate: "晚期市场下跌",
    sequenceRiskInsight:
      "相同的平均回报，在损失出现早或晚时可能产生截然不同的结果。",
    sequenceRiskEndingBalance: "期末余额：",
    sequenceRiskLastsToAge: "投资组合是否持续至 {{age}} 岁：",
    sequenceRiskYes: "是",
    sequenceRiskNo: "否",
    sequenceRiskDepletion: "耗尽：",
    sequenceRiskNotDepleted: "未耗尽",
    sequenceRiskDepletedAt: "第 {{year}} 年",
    sequenceRiskAvgReturn: "平均年回报率：",
    sequenceRiskConclusion:
      "早期出现亏损通常更具破坏性，因为提取迫使退休者在低价时卖出更多资产。",
  },

  guardrails: {
    raiseHeadline: "市况上涨——您可以安心多花一些",
    raiseRule: "投资组合持续高于规划线",
    raiseAction: "上调安全月支出（例如 S$2,140 → S$2,350）。",
    greenHeadline: "进展顺利——保持稳定",
    greenRule: "投资组合处于安全区间内",
    greenAction: "继续按当前安全金额支出。无需调整。",
    amberHeadline: "低于规划线——削减弹性支出",
    amberRule: "投资组合跌破下限护栏",
    amberAction: "削减约 10% 的弹性支出，直至恢复。",
    redHeadline: "持续下行——暂停上调，启用缓冲",
    redRule: "投资组合持续低于规划线",
    redAction: "用现金缓冲支付本年支出；暂停所有上调。",
    reason: "市场已连续三个季度高于规划线，因此安全月金额获得了一次上调。",
    zoneGreen: "绿色区间",
    zoneAmber: "琥珀色区间",
    zoneRed: "红色区间",
    zoneGreenHealth: "绿色区间——可控",
    zoneAmberHealth: "琥珀色区间——需要规划",
    zoneRedHealth: "红色区间——需要资金方案",
    zoneGuidanceGreen: "保持在安全区间内——无需调整。",
    zoneGuidanceAmber: "将弹性支出削减 5% 至 10%，直至概率回升。",
    zoneGuidanceRed: "暂停弹性支出的上调；启用现金缓冲；重新审视家庭支持。",
    learnYear1: "第 1 年",
    learnYear2: "第 2 年",
    learnYear3: "第 3 年",
    learnYear4: "第 4 年",
    learnEvent1: "基于经授权的 SGFinDex 数据作出的首次规划",
    learnEvent2: "了解到您的实际支出持续低于安全线",
    learnEvent3: "市场走强后的护栏上调",
    learnEvent4: "市场回调后的护栏下调",
    learnDriver1: "在规划学会您真实支出的过程中，先保守起步。",
    learnDriver2: "出于谨慎而少花 → 规划允许您多花一些。",
    learnDriver3: "持续高于规划线的增长 → 一次合理的、可回退的上调。",
    learnDriver4: "持续下行 → 此刻小幅下调，为后续保护规划。",
  },

  stressTests: {
    longevityLabel: "更长寿",
    longevityTitle: "更长寿",
    longevityDescription: "规划至 {{targetAge}} 岁而非 {{currentAge}} 岁。",
    longevityFooter: "长寿通常是最隐蔽的大风险。",
    healthcareLabel: "医疗冲击",
    healthcareTitle: "医疗冲击",
    healthcareDescription: "在 3 年内每月增加 S$1,500 的照护成本。",
    healthcareFooter:
      "照护成本可由现金缓冲、家庭支持、保险检视、或公共/社区援助承担——视资格而定。",
    bequestLabel: "遗赠目标",
    bequestTitle: "遗赠目标",
    bequestDescription: "在规划期末至少留下 S$50,000。",
    bequestFooter: "希望留下更多通常意味着今天花得更少。",
    suggest0: "暂时削减弹性支出",
    suggest1: "用现金缓冲应对短期冲击",
    suggest2: "重新审视家庭支持",
    suggest3: "考虑住房变现选项，例如出租房间或换小",
    suggest4: "弥补保险缺口——Enough 将您转介给保险公司、IFA 或您现有的顾问",
    suggest5: "了解公共或社区援助计划",
    crisisMildLabel: "温和下行",
    crisisMildBlurb: "首年投资组合下跌约 10%。",
    crisisSevereLabel: "严重下行",
    crisisSevereBlurb: "首年投资组合下跌约 25%。",
    crisisLostLabel: "失落的十年",
    crisisLostBlurb: "低回报持续约 10 年。",
  },

  lifestyle: {
    essentials: "必需支出",
    foodTransport: "餐饮与交通",
    utilities: "水电与家居",
    housing: "住房",
    healthcare: "医疗",
    discretionary: "弹性生活方式",
    familySupport: "家庭支持",
    travelHobbies: "旅行与爱好",
    other: "其他",
    layerEssentials: "必需",
    layerFlexible: "弹性",
    layerAspirational: "向往型",
    layerTotal: "合计 / 月",
    personaModest: "朴素",
    personaModestBlurb: "覆盖必需开支并略有富余——一个朴素、稳定的月份。",
    personaComfortable: "舒适",
    personaComfortableBlurb: "从容的生活方式，包含一些旅行和家庭支持——即示例。",
    personaGenerous: "宽裕",
    personaGenerousBlurb: "更多旅行、爱好和家庭支持——一个向往型的月份。",
  },

  presets: {
    conservative: "保守",
    conservativeBlurb:
      "较谨慎的回报假设、较高的通胀、更多现金。此处的安全支出最低。",
    base: "基准情景",
    baseBlurb: "合理的中段假设。是全应用使用的默认值。",
    optimistic: "乐观",
    optimisticBlurb: "偏增长、较低通胀。此处的安全支出最高——但仍非承诺。",
    custom: "自定义",
    cpfStandard: "Standard（名义金额固定）",
    cpfBasic: "Basic（名义金额固定）",
    cpfEscalating: "Escalating（起始较低，+2%/yr）",
    housingPaidOff: "已还清",
    housingMortgage: "仍在还贷",
    housingRenting: "租住",
    housingOther: "其他",
  },

  gapActions: {
    cpfFloorTitle: "假设更高的 CPF LIFE 保底",
    cpfFloorDetail:
      "本情景假设 CPF LIFE 月入增加约 S$400 的示意情况。更高的终身收入保底可减少对市场提取的依赖。实际所需补足金额与 CPF LIFE 发放额取决于会员年龄、退休户头余额、所选 CPF LIFE 计划及起领日期。",
    monetiseTitle: "出租 HDB 组屋的一个房间",
    monetiseDetail:
      "出租空房在 CPF LIFE 之外增加每月保底收入。提高收入保底是最大的杠杆，因为这笔钱永远不必从储蓄中支付。",
    trimTitle: "削减向往型分层",
    trimDetail:
      "向往型支出（旅行、爱好、额外项目）是最可调整的分层。在规划中削减它直接缩小缺口，且不影响必需保底。",
    guardrailsTitle: "约定在逆境年份启用护栏",
    guardrailsDetail:
      "约定在市场下行时削减弹性支出，让规划在其余时间能维持略高的平均安全支出——这是较小的杠杆，但却是抵御早期回报不佳的主要防线。",
    closingTitle: "弥合缺口",
    closingIntro:
      "您的理想支出比安全数字高 {{value}}。以下是我们建议用来弥合缺口的杠杆——每个数字都由引擎实际计算，并非固定承诺。我们建议方向，并对特定产品保持中立。",
    closingSpinner: "正在通过引擎模拟每条杠杆…",
    allFour: "若同时采取全部四项（合并建模）",
    allFourNote:
      "各杠杆之间存在重叠，因此合并效果小于简单相加——引擎会一并建模。",
    gapReducedBy: "缺口减少 {{value}}",
    amountRemains: "仍剩余 {{value}}",
    desiredFullyCovered: "理想支出已全部覆盖",
    estimatedSurplus: "估计盈余：{{value}}",
    gapRemaining: "剩余缺口",
    fromToday: "目前为 {{value}}",
    closingFooter:
      "以上为建模估算——请权衡后再决定；没有任何规划万无一失。Enough 建议方向，并对特定产品保持中立。",
  },

  fundingPlan: {
    title: "用哪个账户支出——以及支多少",
    intro:
      "跨现金、SRS、投资和 CPF 进行具备税务与长寿意识的提取顺序规划——金额根据您自己的余额计算。每月约 {{value}} 来自您在 CPF 保底之上的资产。这是任何单一产品提供商都无法中立地给出的建议。",
    residualTitle: "约 {{value}} 无法从您自有资产中安全支应",
    residualNote:
      "我们建议您了解的方向——决策由您，且以下均非资格承诺。这些是真实存在的新加坡计划，可能对您有帮助；请向相关机构核实每项。",
    residualBody:
      "对于无法从资产或这些计划支应的部分，多工作几年或调整生活方式会有所帮助。对于可以通过保险转移的风险——医疗、长期照护、长寿——请参阅下方的 {{protection}}，Enough 会将您转介给合适的保险公司或 IFA。",
    protectionLink: "保障缺口",
    addToReport: "加入家庭报告",
    stepCashTitle: "现金缓冲——优先使用，并在市况不佳年份使用",
    stepCashRationale:
      "将约两年的资产提取额以现金持有，这样您就不会在下行时被迫亏本卖出投资。",
    stepCashNuance: "在好年份补充——这是您抵御回报顺序风险的防线。",
    stepSrsTitle: "SRS——在 10 年税务窗口期内提取",
    stepSrsRationale:
      "在 10 年免罚金窗口期内分摊提取 SRS，让提款分散且税务高效。",
    stepSrsNuance: "每笔 SRS 提款只有 50% 应纳税——安排节奏以留在较低税阶。",
    stepInvestTitle: "投资——增长引擎，稳健提取",
    stepInvestRationale:
      "从投资支应每年提取额的余下部分（先债券后股票），并用护栏下调，以保持组合持续复利。",
    stepInvestNuance: "在提款时再平衡；好年份让股票奔跑，持续下行时再削减。",
    stepCpfTitle: "CPF LIFE——保底终身，保留至最后",
    stepCpfRationale:
      "CPF LIFE 已支付终身保底收入；规划将其保留为长寿后盾，您永远不会耗尽。",
    stepCpfNuance: "有意最后才动用——它是其他一切之下的根基。",
    schemeSilverName: "Silver Support 计划",
    schemeSilverDetail:
      "为较低收入年长者提供的季度现金补助——符合资格者自动发放（CPF Board）。",
    schemeGstName: "GST Voucher",
    schemeGstDetail:
      "为符合资格家庭提供的现金、MediSave 充值及 U-Save 水电回扣。",
    schemeChasName: "CHAS 与 MediSave / MediShield Life",
    schemeChasDetail: "补贴门诊、慢性病支持以及住院账单保障。",
    schemePioneerName: "Pioneer / Merdeka Generation",
    schemePioneerDetail: "为符合资格出生队列提供额外医疗和 MediSave 福利。",
    schemeComCareName: "ComCare",
    schemeComCareDetail: "为有需要者提供中短期财务援助（MSF）。",
  },

  healthcare: {
    title: "医疗与照护成本压力测试",
    badge: "所引为计划参数 · 单次事件成本为示意",
    intro:
      "选择一项健康事件和照护场景，看看真实成本——扣除有帮助的政府计划后——以及它如何影响安全月支出。",
    careSetting: "照护场景",
    acuteHeading: "一次性急性事件",
    acuteGrossLabel: "住院 / 治疗（总额）",
    acuteMedishield: "扣除 MediShield Life",
    acuteYouPay: "自付（一次性）",
    monthlyHeading: "每月，约 {{years}} 年",
    ongoingLabel: "持续医疗",
    careLabel: "照护场景",
    careshieldLess: "扣除 CareShield Life（{{value}}/月）",
    subsidyLess: "扣除 HCG / 资产审查 / CHAS",
    youFund: "您需承担（每月）",
    notSevere:
      "此情况可能未达 CareShield Life 的严重程度门槛（6 项日常活动中 ≥3 项无法自理），因此不假设有赔付。",
    baseSafer: "基线安全支出",
    afterCare: "加入此照护成本后",
    impact: "估算影响",
    fundingOptions:
      "资金选项：现金缓冲、上方的提取顺序、家庭支持，或转介给保险公司、IFA 或您现有的顾问。",
    figures:
      "计划参数（CareShield Life S$689/月、Home Caregiving Grant S$600/月、MediShield Life S$2,000 起付额 + 共同保险）及典型照护费用来自 2025–26 官方来源。一次性事件成本与资产审查补贴比率为示意——实际资产审查补贴视家庭收入而定（最高 75–80%）。请权衡后自行决定；此处任何成本均非保证，我们建议方向，不针对特定产品。",
    figuresLabel: "数据说明。",
    addToReport: "加入家庭报告",
    spinner: "正在用此照护成本重新运行引擎…",
    // Conditions
    strokeLabel: "中风",
    strokeBlurb: "突发事件，漫长的康复期，通常需要长期的日常活动协助。",
    dementiaLabel: "失智症",
    dementiaBlurb: "逐渐起病，多年间监督和照护需求逐步升级。",
    cancerLabel: "癌症",
    cancerBlurb: "急性治疗成本高，随后是持续的随访和用药。",
    frailtyLabel: "一般衰弱",
    frailtyBlurb: "随年龄缓慢衰退——最常见的照护历程，跨越最长的期限。",
    // Care options
    careHelperLabel: "居家帮佣",
    careHelperNote:
      "外籍家庭帮工：工资 + S$60 优惠人头税（长者照护）+ 维持费用。当照护需求严重时，Home Caregiving Grant 可部分抵消。",
    careDaycareLabel: "日间照护中心",
    careDaycareNote:
      "乐龄照护中心日间项目。AIC 资产审查补贴对较低收入家庭最高可达 80%。",
    careNursingLabel: "护理院",
    careNursingNote:
      "住宿式护理院。资产审查补贴最高 75%（1969 年或之前出生者 80%），严重情况下加上 CareShield Life。",
    // Sources
    srcCareShield: "CareShield Life — CPF Board",
    srcHcg: "Home Caregiving Grant — MOM/MSF",
    srcMedishield: "MediShield Life — MOH",
    srcAic: "住宿及日间照护费用/补贴 — AIC",
  },

  protection: {
    title: "保障缺口——以及该找谁",
    intro:
      "部分退休风险，投保比自留更划算。这里列出风险、覆盖该风险的保障，以及我们愿意为您介绍的持牌合作方。由您选择对象——Enough 评估缺口大小并安排介绍；产品由合作方处理。",
    protectionFits: "合适的保障",
    whoToSee: "该找谁",
    footer:
      "教育性退休规划原型。估算基于既定假设，并非保证，亦非个性化财务建议。",
    footerEmphasis: "示意性示例伙伴",
    addToReport: "加入家庭报告",
    // Referral map: risk → protection → partner. Illustrative example partners.
    r_longevity_gap: "长寿——资产先于您耗尽",
    r_longevity_nature:
      "您的投资资产支应 CPF LIFE 之上的支出。若活到 95 岁或以上，或遭遇一段市况不佳，这部分资产可能在您还在世时就用罄。",
    r_longevity_protection:
      "终身保底收入——将 CPF LIFE 补足至 Enhanced Retirement Sum（ERS），或加入一份私人终身年金。",
    r_longevity_why:
      "把有限的资产转换为终身收入——这是您无法安全自留的一种风险。",
    r_longevity_channel:
      "CPF Board（CPF LIFE 补足），或一位仅收费的 IFA 来比较私人年金。",
    r_longevity_ex0: "CPF LIFE（CPF Board）",
    r_longevity_ex1: "私人年金 — Income、Great Eastern、Singlife",
    r_longevity_ex2: "通过仅收费 IFA 比较 — Providend、GYC",
    r_hosp_gap: "住院——超出 MediShield Life",
    r_hosp_nature:
      "MediShield Life 覆盖补贴（B2/C 病房）账单。私家医院或 A-ward 护理，以及大额账单，会留下您需自付的差额。",
    r_hosp_protection:
      "一份附带 rider 的 Integrated Shield Plan（IP）——在 MediShield Life 之上提供私家/较高病房级别的保障。",
    r_hosp_why: "为大额住院账单封顶，避免一次入院就扰乱规划。",
    r_hosp_channel: "保险代理或一位 IFA。",
    r_hosp_ex0: "AIA、Great Eastern、Prudential、Income、Singlife、HSBC Life",
    r_ltc_gap: "长期照护——超出 CareShield Life",
    r_ltc_nature:
      "CareShield Life 仅在您严重失能（6 项日常活动中 3 项无法自理）时支付约 S$689/月。真实照护——帮工、日间照护、护理院——费用可能高得多。",
    r_ltc_protection:
      "一份 CareShield Life supplement——长期照护下每月领取更高金额。",
    r_ltc_why: "把退休中最大、最长尾的成本转换为可预测的月度给付。",
    r_ltc_channel: "保险代理。",
    r_ltc_ex0: "Singlife CareShield Standard / Plus",
    r_ltc_ex1: "Great Eastern",
    r_ltc_ex2: "Income Insurance",
    r_ci_gap: "重大疾病——癌症、中风、主要疾病",
    r_ci_nature:
      "一次严重诊断既带来沉重的治疗成本，也影响赚钱能力。MediShield Life 仅覆盖列明的癌症药物，且有额度限制。",
    r_ci_protection:
      "一份 Critical Illness（CI）计划——确诊时一次性给付，用于支应治疗和替代收入。",
    r_ci_why: "在最需要现金的时候提供现金，避免您在最差的时点抛售投资。",
    r_ci_channel: "IFA（跨保险公司比较）或保险代理。",
    r_ci_ex0: "AIA、Prudential、Great Eastern、Manulife",
    r_ci_ex1: "通过 IFA 比较 — Financial Alliance、IPP",
    r_legacy_gap: "传承——保护您留给家人的部分",
    r_legacy_nature:
      "您希望留下一个固定金额，但为支出而提取会侵蚀它——而市场让期末余额变得不确定。",
    r_legacy_protection:
      "终身寿险或传承规划，无论市况如何都为遗赠划定专属资金。",
    r_legacy_why: "让您今天更从容地支出，因为知道遗赠已被另行保护。",
    r_legacy_channel: "一位仅收费的 IFA。",
    r_legacy_ex0: "Providend、GYC（遗产与传承规划）",
  },

  spendMonitor: {
    kickerParent: "支出核对",
    kickerChild: "成年子女视图",
    title: "支出监控",
    subtitle:
      "将您的实际支出与安全月区间对比。手工录入——不连接银行、不自动分类。",
    heroLabelParent: "您的支出 vs 安全区间",
    heroLabelChild: "爸爸的支出 vs 安全区间",
    actualPerMonth: "实际 / 月",
    saferRange: "安全区间：{{value}}",
    overUpper: "{{value}} 高于安全区间上限。{{review}}",
    reviewFirst: " 请先核对 {{bucket}}。",
    zoneGreen: "在安全区间内",
    zoneAmber: "略高于区间",
    zoneRed: "高于安全区间",
    plannedVsActual: "按类目对比计划与实际",
    plannedActual: "计划 {{planned}} · 实际 {{actual}}",
    updateReport: "更新家庭报告",
    resetToPlanned: "重置为计划值",
    readOnlyNotice: "只读共享视图。只有长辈才能更新支出记录。",
    disclaimer:
      "支出监控是手工规划工具。Enough 不连接您的银行、不导入交易、不自动分类支出。",

    workflowProgress: "第 3 步 / 共 3 步",
    backToResults: "返回结果",
    openFamilyReport: "打开家庭报告",
    purposeSubtitle: "查看本月实际支出是否仍在安全区间内。",
    explanatoryNote:
      "支出监控不会自动重新计算整个退休规划。如有长期变化，请更新规划假设。",

    recalcTitle: "重新计算安全月支出",
    recalcBody: "您的规划已变更，之前的安区间已不再适用。",
    recalcCta: "重新计算结果",
  },

  family: {
    kicker: "家庭层级",
    title: "一份规划，全家共享",
    subtitle: "分享是可选的。父母始终保持控制权，并可随时撤回访问。",
    pillParent: "长辈视图",
    pillChild: "成年子女视图",
    parentTag: "放心而不被监视",
    childTag: "只读共享视图",
    parentBody:
      "分享是可选的。授予 Wei Ling 对您部分退休规划的只读访问权限。您可随时撤回访问。",
    childBody:
      "由 Mr Tan 授予只读访问权限。您可查看 Mr Tan 分享的信息。Mr Tan 仍是规划的唯一拥有者和决策者。",
    whoOnPlan: "参与规划的人",
    accessHeading: "成年子女访问",
    accessIntro:
      "分享是可选的。授予 Wei Ling 对您部分退休规划的只读访问权限。您可随时撤回访问。",
    accessGrantedBody:
      "Wei Ling 可查看共享规划，但不能编辑输入、连接账户、批准决策或更改安全支出数字。",
    accessChildBody:
      "您可查看 Mr Tan 分享的信息。Mr Tan 仍是规划的唯一拥有者和决策者。",
    accessNotShared: "未分享",
    accessGranted: "已授予访问",
    accessGrantedByParent: "由 Mr Tan 授予只读访问权限",
    accessReadOnlyBadge: "只读",
    grantButton: "授予只读访问权限",
    revokeButton: "撤回访问权限",
    permissionBullets: {
      canViewSafer: "可查看安全月支出结果",
      canViewAlerts: "可查看选定的提醒和家庭报告",
      cannotEdit: "不可编辑财务信息或支出",
      cannotApprove: "不可批准、确认或代父母行事",
      canRevoke: "父母可随时撤回访问",

      openFamilyReport: "打开家庭报告",
    },
    moatTitle: "家庭层级是不可争议的护城河",
    moatBody:
      "家庭访问基于授权，可随时撤回。只读共享视图在不放弃控制权的前提下维系家庭联系。",
    openReport: "打开家庭报告 →",
    backToResults: "返回结果",
    disclaimer:
      "家庭层级的示意性原型。分享是可选、基于授权且可撤回的——并非真实账户。",
    parentPermissionRequired: "需要长辈授权后才能启用成年子女访问。",
    gateOpenSettingsCta: "打开长辈访问设置",
    gateReturnHomeCta: "返回长辈首页",
    accessGrantedConfirmation: "已向 Wei Ling 授予只读访问权限。",
    accessGrantedHint: "成年子女视图现在可在导航栏中使用。",
    gateTitle: "需要长辈授权",
    gateBody:
      "此退休规划尚未与成年子女分享。长辈必须授予只读访问权限，才能查看任何规划信息。",
    gatePrivacyNote: "分享是可选的。父母始终保持控制权，并可随时撤回访问。",
    gateReturnCta: "返回长辈视图",
    lockedUntilGranted: "已锁定，等待长辈授权",
    // member labels
    m1Name: "Mr Tan",
    m1Relation: "退休人",
    m1Role: "拥有者 · 唯一决策者",
    m1p1: "拥有规划及所有数据授权",
    m1p2: "掌控谁能查看规划",
    m1p3: "可随时授予或撤回家庭访问",
    m2Name: "Mrs Tan",
    m2Relation: "配偶",
    m2Role: "基于授权的查看者",
    m2p1: "经授权后可查看规划及安全月支出区间",
    m2p2: "参与家庭对话",
    m2p3: "只读——不可编辑、批准或更改规划",
    m3Name: "Wei Ling",
    m3Relation: "成年女儿",
    m3Role: "可选的只读查看者",
    m3p1: "爸爸授权后可查看选定的规划信息",
    m3p2: "可接收选定的提醒",
    m3p3: "不可编辑、批准或代爸爸行事",

    familyAccessTitle: "家庭访问",
    familyAccessSubtitle: "选择谁可以查看规划。分享是可选、只读且由父母控制。",
  },

  familyPlane: {
    alert1Title: "爸爸的规划进展顺利",
    alert1Body: "至 95 岁仍有 90% 概率。无需行动。",
    alert2Title: "有一次安全上调可用",
    alert2Body: "市场已高于规划线——安全月支出可上调至 S$2,350。",
    alert3Title: "有一项 CPF 补足值得审视",
    alert3Body: "更高的保底会把概率提升约 3%。爸爸可以考虑这一选项。",
  },

  report: {
    kicker: "为家中餐桌而设",
    title: "家庭报告",
    subtitle:
      "一份从容、一页纸的摘要，便于在家中讨论。通俗语言，产品中立的建议。",
    print: "打印家庭报告",
    header: "Enough 家庭报告",
    headerSub: "Mr Tan，{{age}} 岁。规划至 {{horizon}} 岁。",
    headerAdvice: "规划建议 · 由您决定",
    saferLabel: "安全月支出区间",
    cpfFloorNote: "CPF LIFE 是长寿保底，不一定是通胀对冲。",
    centralEstimate: "中位估算：{{central}}，{{confidence}}",
    cpfFloorLabel: "CPF LIFE 保底",
    lifestyleLabel: "生活方式支出",
    lifestyleLine: "必需 {{e}} · 弹性 {{f}} · 向往型 {{a}} · 合计 {{t}}。",
    healthcareLabel: "医疗与照护冲击",
    healthcareBody:
      "一次照护冲击（例如数年内额外的照护成本）可能让安全支出下降约 {{value}}。应对方式：现金缓冲、家庭支持、公共或社区计划，或转介给保险公司、IFA 或您现有的顾问。",
    bequestLabel: "遗赠",
    bequestBody:
      "{{target}} 的遗赠目标可能让安全支出下降约 {{value}}。遗赠并非被否定——Enough 展示的是月度的取舍。",
    crisisLabel: "市场下行护栏",
    crisisBody:
      "严重下行可能把规划推到琥珀色区间——模型建议将弹性支出削减 5% 至 10%，直至概率回升。这是情境测试，不是市场择时。",
    currentLabel: "当前支出核对",
    currentBody: "实际 {{actual}} vs 安全区间 {{range}}。{{over}}",
    currentOver: " 约高出安全区间上限 {{value}}——请先核对弹性支出与旅行类目。",
    currentWithin: " 在安全区间内。",
    convoTitle: "对话开场",
    convoBody:
      "我们的 CPF LIFE 给我们终身 {{cpf}}。每月花约 {{central}} 看起来较安全。再高就意味着承担更多风险。",
    disclaimer:
      "中立理财规划建议（正在申请 MAS FA 牌照）。我们建议的是决策方向，不是特定产品。仅为估算，并非保证——基于既定假设的示意性结果。请仔细思量，再做出重大财务决策。",
    saveAsPdf: '使用浏览器的"打印"对话框，选择"另存为 PDF"即可分享本报告。',

    actionPrint: "打印或另存为 PDF",
    actionBackToResults: "返回结果",
    actionOpenSpendMonitor: "打开支出监控",
    actionManageFamilyAccess: "管理家庭访问",
    newSubtitle: "一页摘要：安全支出规划、关键风险与当前支出位置。",
    sharedByParent: "由父母分享（只读）。",

    recalcTitle: "重新计算您的规划",
    recalcBody:
      "您的规划假设已变更。请重新计算安全月支出结果后再打开家庭报告。",
    recalcCta: "返回规划设置",
    usingDemoData: "由 Enough 引擎根据示意性示例档案计算得出。",
    usingCustomData: "根据您当前的计算规划生成报告。",
  },

  partners: {
    kicker: "面向合作伙伴",
    title: "Enough 合作伙伴版",
    subtitle:
      "一台中立的新加坡 Decumulation 引擎——通过那些视中立性为资产（而非威胁）的合作伙伴分发。",
    wedgeTitle: "今天是切入点，明天是护城河",
    wedgeBody:
      "安全支出引擎是诚实、专注的基本功——真正的护城河，是它将演化为的、领牌门槛与家庭嵌入式的 system-of-record：经授权的全资产聚合、税务意识导向的提取顺序，以及任何产品销售方都无法在短期内拼凑出的多年家庭关系。",
    problemTitle: "问题所在",
    problemBody:
      "累积期已拥挤。Decumulation 服务不足。没有中立玩家占据月度支出决策——银行和顾问都靠销售产品获利。",
    whyNowTitle: "为何是现在",
    whyNow1: "新加坡正步入老龄化——到 2030 年每 4 人中就有 1 人超过 65 岁。",
    whyNow2: "CPF LIFE 只是保底，并非全资产支出的答案。",
    whyNow3: "公共中立的全资产规划工具（MyMoneySense）已退出。",
    whyNow4: "SGFinDex 使经授权的聚合成为可能。",
    threeTitle: "存活下来的三类",
    three1: "中立的全资产聚合。",
    three2: "原生 CPF LIFE / SRS / 新加坡税务深度。",
    three3: "家庭 / 成年子女层级（无争议）。",
    channelTitle: "渠道：以非银行 B2B2C 为先，家庭层级叠加其上",
    channelBody:
      "仅收固定费用——绝不收佣金或产品收入分成。Enough 在每一笔交易中都保持数据控制方身份。银行放在最后，且仅作为防火墙式中立通道。",
    channelWellnessName: "企业员工福利（主导）",
    channelWellness1: "支援有年长父母的夹心层员工",
    channelWellness2: "按员工按年（PEPY）计费，固定费用",
    channelWellness3: "中立性与数据方面最干净",
    channelWellness4: "直接触达成年子女买方",
    channelIfaName: "仅收费 IFA",
    channelIfa1: "一台可规模化的中立引擎 + 一份可交付客户的透明规划",
    channelIfa2: "按顾问席位 / 月计费",
    channelIfa3: "可联名；Enough 保留引擎与数据",
    channelInsurerName: "保险公司 + 家庭层级",
    channelInsurer1:
      "中立的需求规模评估作为合格的获客（固定费用 + 按线索计费）",
    channelInsurer2: "销售永不抽佣",
    channelInsurer3: "直接家庭层级：由成年子女付费",
    channelNote:
      "所有数字均为学术提案的示意性估算。在 commit 前请通过合作伙伴探索 + Van Westendorp 验证定价单位。",
    regTitle: "监管路径",
    reg1: "正在申请 MAS Financial Adviser 牌照，以提供中立的理财规划建议。",
    reg2: "产品中立：建议决策方向，绝不推销产品。",
    reg3: "仅收固定费用，不收佣金——以保持建议诚实。",
    reg4: "牌照是护城河的门槛——是 Wave-1 关键路径事项，不是事后补丁。",
    pilotTitle: "试点请求",
    pilot1: "一家企业福利或仅收费 IFA 合作伙伴。",
    pilot2: "有年长父母的夹心层员工。",
    pilot3: "衡量已连接规划数、安全支出采用率、家庭参与度。",
    pilot4: "目标：证明这个数字，构建家庭飞轮。",
    closerTitle: "在专注上胜过 MoneyOwl。在中立上胜过 DBS。占据家庭。",
    closerBody:
      "中立理财规划建议（正在申请 MAS FA 牌照）。我们建议决策方向，不针对特定产品。仅为估算，并非保证。不附属于 CPF Board 或 MAS。",
    disclaimer: "市场与单位经济效益数字均为学术提案的示意性估算。",
  },

  disclaimer: {
    footer:
      "教育性退休规划原型。估算基于既定假设，并非保证，亦非个性化财务建议。",
  },

  resultsTabs: {
    overview: "概览",
    stress: "压力测试",
    actions: "行动计划",
    analytics: "分析",
  },
} as const;

export default zhSG;
