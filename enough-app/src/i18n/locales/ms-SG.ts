/**
 * Bahasa Melayu (Singapore) translation. Mirrors en-SG.ts key-for-key.
 *
 * Prinsip perkataan (lihat keperluan §5 / §13):
 *  - Bahasa Melayu standard yang jelas, hormat dan mesra untuk pengguna Singapura.
 *  - Berhati-hati, bukan jaminan ("kira-kira", "anggaran", "anggaran perancangan").
 *  - Nama skim / produk rasmi kekal tidak berubah (CPF, CPF LIFE, SRS, HDB …).
 *
 * Single default namespace ("translation"); objek bersarang mencerminkan
 * namespace logikal dari spec (common, navigation, home, …).
 */
const msSG = {
  common: {
    brand: "Enough",
    tagline: "Perbelanjaan persaraan Singapura yang neutral",
    appTitle: "Enough — Berapa banyak saya boleh belanjakan?",
    perMonth: "/bulan",
    perYear: "/tahun",
    forLife: "seumur hidup",
    buffer: "penimbal",
    rangeSeparator: "hingga",
    recommended: "disyorkan",
    excluded: "tidak termasuk",
    connected: "Disambung",
    onPlan: "mengikut pelan",
    closes: "menampung",
    ofTheGap: "daripada jurang",
    raisesSafer: "menaikkan perbelanjaan lebih selamat {{delta}}",
    reversible: "boleh dibalikkan",
    hardToReverse: "sukar dibalikkan",
    gap: "jurang",
    residualGap: "Baki jurang",
    channel: "saluran",
    back: "← Kembali",
    backToResults: "← Kembali ke keputusan",
    seeMySaferSpend: "Lihat perbelanjaan bulanan lebih selamat saya →",
    loading: "Memuatkan…",
    yrs: "thn",
    eq: "sama",
    selected: "Dipilih: {{value}}",
  },

  format: {
    confidence: "kira-kira {{pct}}% keyakinan",
    perMonth: "/bulan",
    rangeSeparator: " hingga ",
    years: "{{n}} thn",
  },

  accessibility: {
    skipToContent: "Langkau ke kandungan utama",
    languageLabel: "Bahasa",
    changeLanguage: "Tukar bahasa",
    menu: "Menu",
    closeMenu: "Tutup menu",
    openMenu: "Buka menu",
    primaryNav: "Navigasi utama",
    viewMode: "Mod paparan",
    mobileNav: "Navigasi mudah alih",
    langChanged: "Bahasa ditukar ke {{name}}",
    chartUnavailable:
      "Carta dipaparkan secara visual. Lihat ringkasan teks di atas untuk nombor utama.",
  },

  navigation: {
    home: "Laman utama",
    connect: "Sambung",
    results: "Keputusan",
    spendMonitor: "Monitor Perbelanjaan",
    family: "Keluarga",
    parentView: "Paparan ibu bapa",
    adultChildView: "Paparan anak dewasa",
    forPartners: "Untuk rakan kongsi",
  },

  home: {
    badge: "Pembantu bersama perbelanjaan persaraan neutral Singapura",
    heroTitle: "Berapa banyak saya benar-benar boleh belanjakan?",
    heroParent:
      "Satu nombor yang tenang — berapa banyak anda boleh belanjakan dengan selamat setiap bulan, daripada CPF, simpanan dan gaya hidup yang anda inginkan. Diterangkan dalam bahasa mudah. Nasihat neutral — bukan promosi produk.",
    heroChild:
      "Bantu ibu bapa anda membelanjakan persaraan mereka dengan yakin. Sambung akaun mereka sekali, pantau dengan amaran, dan tandatangani bersama perubahan besar — sementara mereka kekal mengawal nombor itu.",
    ctaParent: "Mulakan pelan saya",
    ctaChild: "Sediakan untuk ibu bapa saya",
    seeExample: "Lihat contoh kerja",
    pillarNeutralTitle: "Neutral, seluruh kekayaan",
    pillarNeutralBody:
      "Bebas produk dan bebas komisen. Kami sambungkan CPF, SRS, bank dan pelaburan dalam satu paparan yang disahkan — dan memberitahu anda berapa banyak daripada jumlah kekayaan anda yang boleh dibelanjakan dengan selamat.",
    pillarCpfTitle: "Kedalaman natif CPF",
    pillarCpfBody:
      "CPF LIFE sebagai lantai yang dijamin, SRS dikeluarkan dalam tetingkap 10-tahunnya, penjujukan yang sedar akan cukai dan jangka hayat merentas setiap akaun.",
    pillarFamilyTitle: "Untuk seluruh keluarga",
    pillarFamilyBody:
      "Pelan yang dikebenarkan untuk pesara, pasangan, dan anak dewasa — anak membantu menyediakannya, tetapi ibu bapa sentiasa mengesahkan nombor itu.",
    permissionTitle: "Kebenaran untuk membelanjakan",
    permissionBody:
      "CPF, bank dan penasihat semuanya membantu rakyat Singapura menabung. Pandangan perbelanjaan neutral lebih sukar apabila penyedia juga menjual produk. Enough memberi tumpuan kepada keputusan perbelanjaan bulanan.",
    wholeWealthLabel: "seluruh kekayaan → perbelanjaan bulanan",
    chipCpfLife: "CPF LIFE",
    chipSrs: "SRS",
    chipBank: "Bank",
    chipInvestments: "Pelaburan",
    saferMonthlySpend: "→ perbelanjaan bulanan lebih selamat",
    trustStrip:
      "Nasihat perancangan kewangan neutral · Yuran rata, bukan komisen · Data anda kekal milik anda · Sebab dalam bahasa mudah di sebalik setiap nombor.",
  },

  connect: {
    kicker: "Sambung",
    title: "Kumpulkan akaun anda",
    subtitle:
      "Sambung sekali dengan Singpass untuk paparan seluruh kekayaan — atau taip nombor utama sendiri.",
    connectTitle: "Sambung akaun anda dengan Singpass",
    connectBody:
      "Satu tarikan yang disahkan melalui Singpass membawa masuk CPF, bank, SRS dan pelaburan anda melalui SGFinDex — tanpa menaip, sentiasa terkini. Kami tidak pernah melihat kata laluan anda, dan kami neutral produk — nasihat, bukan jualan.",
    connectButton: "Sambung dengan Singpass",
    chipCpfBoard: "CPF Board",
    chipBank: "Bank · SGFinDex",
    chipInvestments: "Pelaburan · SGFinDex",
    chipSrs: "SRS",
    chipHdb: "HDB · Myinfo",
    protoNote:
      "Hanya prototaip — ini mensimulasikan tarikan Myinfo / SGFinDex yang disahkan. Akses SGFinDex penuh memerlukan status FI berlesen dan merupakan langkah selepas lesen; pada MVP ini adalah Myinfo + kemasukan manual. Tidak pernah meminta kata laluan perbankan anda.",
    connectingTitle: "Menyambung melalui Singpass…",
    connectedTitle: "Gambar seluruh kekayaan anda",
    connectedBody:
      "Ditarik melalui Singpass / SGFinDex. Ini adalah paparan tunggal yang tiada bank boleh neutral mengenainya — dan ia adalah asas kepada nombor perbelanjaan selamat.",
    spendableWealth: "Kekayaan yang boleh dibelanjakan",
    spendableWealthNote: "Tunai + pelaburan + SRS (harta tidak termasuk)",
    guaranteedFloor: "Lantai dijamin",
    guaranteedFloorNote: "CPF LIFE — pendapatan yang tidak akan kehabisan",
    manualToggle: "Lebih suka taip sendiri? ▼",
    manualToggleHide: "Sembunyikan kemasukan manual ▲",
    loadSample: "Muat profil sampel",
    presetHeading: "Praset anggapan",
    group1: "1 · Profil pesara",
    group2: "2 · CPF LIFE",
    group3: "3 · Perumahan",
    group4: "4 · Tunai dan pelaburan",
    group5: "5 · Perbelanjaan gaya hidup",
    group6: "6 · Pusaka (pilihan)",
    group7: "7 · Anggapan",
    lifestylePickHint: "Pilih titik mula, kemudian laraskan",
    startFromLifestyle: "Mula daripada gaya hidup",
    lifestyleNote:
      "Belanjawan dicadangkan untuk bermula — laraskan mengikut hidup anda.",
    showAspirational:
      "Tunjukkan baldi bercita-cita tinggi (perjalanan, hobi, lain-lain) ▼",
    hideAspirational: "Sembunyikan baldi bercita-cita tinggi ▲",
    summaryHeading: "Ringkasan pelan",
    runningSim: "Menjalankan simulasi…",
    calculate: "Kira perbelanjaan lebih selamat",
    allocWarning100: "Campuran aset sepatutnya berjumlah 100%.",
    allocWarning:
      "Campuran aset sepatutnya berjumlah 100% (semasa ini {{value}}%).",
    planningAdviceNote: "Nasihat perancangan — anggaran, bukan jaminan.",
    disclaimer:
      "Nasihat perancangan kewangan neutral — keputusan adalah untuk anda timbang. Kami menasihati langkah itu, tidak pernah mempromosikan produk tertentu. Sambungan Singpass / SGFinDex adalah prototaip ilustrasi.",
    acctCpfSource: "CPF Board",
    acctCpfLabel: "Bayaran CPF LIFE (Standard)",
    acctCpfNote: "Lantai pendapatan dijamin seumur hidup",
    acctBankSource: "DBS · via SGFinDex",
    acctBankLabel: "Simpanan & deposit tetap",
    acctBankNote: "Penimbal tunai untuk tahun pasaran buruk",
    acctInvestSource: "Endowus · Poems · via SGFinDex",
    acctInvestLabel: "Pelaburan (dana unit saham, saham)",
    acctInvestNote: "Bon + ekuiti — enjin pertumbuhan",
    acctSrsSource: "OCBC SRS · via SGFinDex",
    acctSrsLabel: "Akaun SRS",
    acctSrsNote: "Tetingkap 10-tahun · 50% dikenakan cukai semasa pengeluaran",
    acctPropSource: "HDB · via Myinfo",
    acctPropLabel: "Pangsapuri HDB 4-bilik (telah dilunaskan)",
    acctPropNote:
      "Tidak termasuk dalam asas boleh belanja secara lalai — tidak cair",
    fCurrentAge: "Umur semasa",
    fPlanToAge: "Rancang ke umur",
    fPlanToAgeHelp:
      "Hidup lebih lama biasanya menurunkan perbelanjaan bulanan lebih selamat.",
    fGender: "Jantina",
    fGenderMale: "Lelaki",
    fGenderFemale: "Perempuan (+2 thn jangka hayat)",
    fSpouseAge: "Umur pasangan (pilihan)",
    fSpouseAgeHelp: "Perancangan bersama jika dimasukkan.",
    fCpfPayout: "Bayaran CPF LIFE bulanan",
    fCpfPlan: "Pelan CPF LIFE",
    fCpfPlanHelp: "Lantai jangka hayat, bukan lindung nilai inflasi.",
    fHousingStatus: "Status perumahan",
    fHousingStatusHelp:
      "Kos perumahan termasuk dalam perbelanjaan. Dilunaskan bermaksud kos bulanan S$0.",
    fMonthlyHousing: "Kos perumahan bulanan",
    fMonthlyHousingHelp: "Hipotek, sewa, atau lain-lain — 0 jika dilunaskan.",
    fCash: "Tunai",
    fInvestments: "Pelaburan",
    fSrs: "SRS",
    fCashPct: "Tunai %",
    fBondsPct: "Bon %",
    fEquityPct: "Ekuiti %",
    fBequestTarget: "Sasaran pusaka",
    fBequestTargetHelp: "Minimum untuk ditinggalkan pada horizon.",
    fGeneralInflation: "Inflasi umum / gaya hidup",
    fHealthcareInflation: "Inflasi penjagaan kesihatan",
    fHealthcareInflationHelp:
      "Kos penjagaan kesihatan biasanya naik lebih cepat daripada inflasi umum.",
    sumTotalAssets: "Jumlah aset",
    sumCpfPayout: "Bayaran CPF LIFE",
    sumDesiredSpend: "Perbelanjaan diingini",
    sumHousingCost: "Kos perumahan",
    sumAlloc: "Tunai/Bon/Ekuiti",
    step0: "Mengalihkan ke Singpass…",
    step1: "Mendapatkan baki CPF LIFE & CPF (CPF Board)",
    step2: "Mendapatkan baki bank (SGFinDex)",
    step3: "Mendapatkan pelaburan & SRS (SGFinDex)",
    step4: "Mendapatkan harta HDB (Myinfo)",
    step5: "Membina gambar seluruh kekayaan anda",
    kindCpf: "CPF",
    kindBank: "BANK",
    kindInvestment: "PELABURAN",
    kindSrs: "SRS",
    kindProperty: "HARTA",
    fActual: "Sebenar",
  },

  results: {
    simulating: "Mensimulasikan ribuan laluan persaraan…",
    noPlanTitle: "Belum ada pelan",
    noPlanBody:
      "Sambung akaun anda dahulu, atau muat profil sampel untuk melihat Enough dalam tindakan.",
    connectAccounts: "Sambung akaun",
    loadSample: "Muat profil sampel",
    oversightTitle:
      "Pengawasan tanpa gangguan — Ayah masih mengesahkan setiap nombor",
    goToFamily: "Pergi ke pelan keluarga untuk tandatangan bersama →",
    kickerParent: "Keputusan anda",
    kickerChild: "Keputusan ibu bapa anda",
    titleParent: "Julat perbelanjaan bulanan lebih selamat anda",
    titleChild: "Perbelanjaan bulanan lebih selamat Ayah",
    subtitleDemo:
      "Julat dengan keyakinan anggaran — bukan jaminan. Ini adalah keputusan ilustrasi berdasarkan anggapan yang dinyatakan.",
    subtitleCustom:
      "Julat dengan keyakinan anggaran — bukan jaminan. Berdasarkan anggapan yang anda masukkan.",
    kickerCustom: "Keputusan anda · enjin langsung",
    heroLabelParent: "Julat perbelanjaan bulanan lebih selamat anda",
    heroLabelChild: "Julat perbelanjaan bulanan lebih selamat Ayah",
    suggestedToday: "Dicadang hari ini: {{central}} · {{confidence}}",
    desiredLine: "Diingini {{value}} ≈ {{pct}}% keyakinan",
    overYrs: "~{{pct}} selama {{yrs}} thn",
    centralLine: "Tengah: {{central}} · kira-kira {{pct}} keyakinan",
    trialsLine: "{{trials}} percubaan · pulangan {{ret}} · vol {{vol}}",
    cpfFloorLabel: "Lantai CPF LIFE",
    cpfFloorSub: "/bulan · pendapatan seumur hidup",
    withdrawalLabel: "Pengeluaran tambahan",
    withdrawalSub: "/bulan · kadar {{rate}}",
    desiredLabel: "Perbelanjaan diingini",
    gapLabel: "Jurang vs diingini",
    gapLabelShort: "Jurang",
    cpfFloorWarningDemo:
      "CPF LIFE adalah lantai jangka hayat, belum tentu lindung nilai inflasi. Bayaran Standard adalah nominal tetap; perbelanjaan dinaikkan dari semasa ke semasa. Keputusan adalah anggaran, bukan jaminan.",
    cpfFloorWarningCustom:
      "CPF LIFE adalah lantai jangka hayat, bukan lindung nilai inflasi. Julat lebih selamat bergantung pada anggapan. Keputusan adalah anggaran, bukan jaminan.",
    aggressiveTitle: "Perbelanjaan diingini anda adalah agresif",
    aggressiveBody:
      "Diingini {{value}} memerlukan kadar pengeluaran {{rate}} — jauh lebih tinggi daripada ~3.5–4% yang dianggap berkekalan dari segi sejarah.",
    stressTitleParent: "Ujian tekanan pelan",
    stressTitleChild: "Ujian tekanan pelan Ayah",
    stressIntro:
      "Lihat bagaimana peristiwa kehidupan menggerakkan nombor perbelanjaan bulanan sebelum ia berlaku.",
    riskTitleParent: "Risiko paling penting bagi pelan ini",
    riskTitleChild: "Risiko paling penting bagi pelan Ayah",
    riskBody:
      "Penjagaan kesihatan dan jangka hayat menggerakkan nombor lebih daripada perjalanan persaraan.",
    riskFooter:
      "Enough tidak menyembunyikan ketidakpastian. Ia menunjukkan anggapan yang penting sebelum keluarga komit kepada perbelanjaan bulanan.",
    suggestToggleShow: "Apa yang kami cadangkan",
    suggestToggleHide: "Sembunyikan cadangan",
    suggestTitle: "Apa yang kami cadangkan",
    suggestNote:
      "Nasihat kami tentang langkah untuk ditimbang — anda putuskan. Kami kekal neutral tentang produk tertentu.",
    impactPrefix: "Impak perbelanjaan lebih selamat: ",
    guardrailPill: "Pelindung · naikkan yang tersedia",
    guardrailTitle:
      "Pasaran naik — model menunjukkan ruang untuk menaikkan perbelanjaan",
    guardrailBody:
      "{{reason}} Pelan hidup dengan roda kemudi — tiada panik dalam kemerosotan, dan kebenaran untuk membelanjakan lebih dengan selamat dalam masa baik.",
    guardrailNow: "sekarang → dicadangkan",
    guardrailPerMonth: "/bulan",
    inflationTitle: "Anggapan inflasi yang digunakan",
    inflationGeneral: "Perbelanjaan umum / gaya hidup",
    inflationHealthcare: "Penjagaan kesihatan",
    inflationCpfStandard: "CPF LIFE Standard",
    inflationCpfStandardValue: "bayaran nominal tetap",
    inflationCpfEscalating: "CPF LIFE Escalating",
    inflationCpfEscalatingOn: "dipilih — tumbuh kira-kira 2% / tahun",
    inflationCpfEscalatingOff: "tumbuh kira-kira 2% / tahun jika dipilih",
    inflationPerYear: "{{value}} / tahun",
    inflationNote:
      "CPF LIFE adalah lantai jangka hayat, belum tentu lindung nilai inflasi. Perbelanjaan dinaikkan dari semasa ke semasa.",
    lifestyleTitle: "Lapisan gaya hidup",
    nextTitleParent: "Jadikan ini perbualan keluarga",
    nextTitleChild: "Libatkan keluarga untuk tandatangan bersama",
    nextBodyParent:
      "Buka laporan satu halaman yang tenang dan boleh dicetak untuk dikongsi di rumah.",
    nextBodyChild:
      "Semak dan tandatangani bersama kenaikan selamat pada pelan keluarga — Ayah mengesahkan.",
    nextCtaParent: "Buka laporan keluarga →",
    nextCtaChild: "Buka pelan keluarga →",
    curveTitleDemo: "Produk itu adalah lengkung",
    curveTitleCustom: "Lengkung perbelanjaan-keyakinan",
    curveSub:
      "Setiap S$100/bulan tambahan menambah baik gaya hidup hari ini tetapi mengurangkan keselamatan esok.",
    curveRefCpf: "Lantai CPF",
    curveRefSafer: "Lebih selamat",
    curveRefDesired: "Diingini",
    curveTooltipConf: "{{value}}% keyakinan",
    curveTooltipSpend: "Belanjakan {{value}}/bulan",
    sensTitleDemo: "Apa yang menggerakkan nombor?",
    sensTitleCustom: "Apa yang menggerakkan nombor anda?",
    sensIntro:
      "Enough tidak menyembunyikan ketidakpastian. Ia menunjukkan anggapan yang penting.",
    sensReduces: "Mengurangkan perbelanjaan lebih selamat",
    sensImproves: "Menambah baik kelestarian",
    seqTitle: "Pasaran buruk awal lebih merosakkan",
    seqIntroDemo:
      "Dua pesara boleh mendapat pulangan purata yang sama, tetapi yang terkena kerugian awal mungkin kehabisan lebih awal — pengeluaran berlaku apabila aset rendah.",
    seqIntroCustom:
      "Pulangan purata yang sama dalam susunan berbeza menghasilkan keputusan yang sangat berbeza.",
    seqYear: "Tahun {{n}}",
    learnTitle: "Pelan belajar dari semasa ke semasa",
    learnIntro:
      "Bukan gambaran seketika — rekod keputusan. Semakin lama anda kekal, semakin nombor mencerminkan perbelanjaan sebenar anda. Ini adalah kos pertukaran isi rumah yang tiada pesaing boleh salin dalam masa singkat.",
    crisisTitle: "Ujian tekanan krisis kewangan",
    crisisIntro:
      "Ujian senario, bukan masa pasaran. Lihat bagaimana kemerosotan menggerakkan perbelanjaan lebih selamat dan zon pelindung mana yang berkenaan.",
    crisisBase: "Perbelanjaan lebih selamat asas",
    crisisAfter: "Selepas {{name}}",
    crisisImpact: "Anggaran impak",
    lifespanTitle: "Kepekaan jangka hayat",
    lifespanIntro:
      "Hidup lebih lama biasanya menurunkan perbelanjaan bulanan lebih selamat kerana aset yang sama mesti bertahan lebih lama.",
    lifespanPlanTo: "Rancang ke umur {{age}}",
    spinnerSens: "Menguji apa yang menggerakkan nombor anda…",
    sensReduceHorizon: "Horizon perancangan +5 tahun",
    sensReduceBequest: "Sasaran pusaka +S$50,000",
    sensReduceHealth: "Inflasi penjagaan kesihatan +2%",
    sensReduceReturn: "Pulangan pelaburan −1%",
    sensImproveReturn: "Pulangan pelaburan +1%",
    sensImproveFlex: "Fleksibiliti perbelanjaan 15% (pelindung)",
    sensImproveCpf: "Modelkan lantai CPF LIFE yang lebih tinggi",
    seqSteady: "Pasaran stabil",
    seqBadEarly: "Pasaran buruk AWAL",
    seqBadLate: "Pasaran buruk AKHIR",
  },

  guardrails: {
    raiseHeadline: "Pasaran naik — anda boleh belanjakan lebih dengan selamat",
    raiseRule: "Portfolio secara berkekalan di atas garis pelan",
    raiseAction:
      "Naikkan perbelanjaan bulanan lebih selamat (cth. S$2,140 → S$2,350).",
    greenHeadline: "Di landasan — kekal stabil",
    greenRule: "Portfolio dalam jalur lebih selamat",
    greenAction: "Teruskan belanjakan jumlah selamat semasa. Tiada perubahan.",
    amberHeadline: "Di bawah garis — potong budi bicara",
    amberRule: "Portfolio turun di bawah pelindung bawah",
    amberAction: "Potong perbelanjaan budi bicara ~10% sehingga ia pulih.",
    redHeadline: "Penurunan berterusan — jeda kenaikan, gunakan penimbal",
    redRule: "Portfolio jauh di bawah garis untuk tempoh berterusan",
    redAction:
      "Biayai tahun itu daripada penimbal tunai; jeda sebarang kenaikan.",
    reason:
      "Pasaran telah berjalan di atas garis pelan selama tiga suku tahun, jadi jumlah bulanan selamat telah mendapat kenaikan.",
    zoneGreen: "Zon hijau",
    zoneAmber: "Zon ambar",
    zoneRed: "Zon merah",
    zoneGreenHealth: "Zon hijau — boleh diuruskan",
    zoneAmberHealth: "Zon ambar — rancang untuknya",
    zoneRedHealth: "Zon merah — memerlukan pelan pembiayaan",
    zoneGuidanceGreen:
      "Kekal dalam julat lebih selamat — tiada perubahan diperlukan.",
    zoneGuidanceAmber:
      "Potong perbelanjaan budi bicara sebanyak 5% hingga 10% sehingga keyakinan pulih.",
    zoneGuidanceRed:
      "Jeda kenaikan budi bicara; gunakan penimbal tunai; semak sokongan keluarga.",
    learnYear1: "Tahun 1",
    learnYear2: "Tahun 2",
    learnYear3: "Tahun 3",
    learnYear4: "Tahun 4",
    learnEvent1: "Pelan pertama daripada data SGFinDex yang disahkan",
    learnEvent2:
      "Telah mempelajari anda secara konsisten belanjakan di bawah garis selamat",
    learnEvent3: "Kenaikan pelindung selepas pasaran kukuh",
    learnEvent4: "Pengurangan pelindung selepas pasaran menurun",
    learnDriver1:
      "Permulaan konservatif sementara pelan mempelajari perbelanjaan sebenar anda.",
    learnDriver2:
      "Berbelanja kurang kerana berhati-hati → pelan memberi anda kebenaran untuk belanjakan lebih.",
    learnDriver3:
      "Pertumbuhan berterusan di atas garis pelan → kenaikan yang berusaha, boleh dibalikkan.",
    learnDriver4:
      "Penurunan berterusan → potongan kecil sekarang melindungi pelan untuk kemudian.",
  },

  stressTests: {
    longevityLabel: "Hidup lebih lama",
    longevityTitle: "Hidup lebih lama",
    longevityDescription:
      "Rancang ke umur {{targetAge}} bukannya {{currentAge}}.",
    longevityFooter: "Jangka hayat biasanya risiko senyap paling besar.",
    healthcareLabel: "Kejutan penjagaan kesihatan",
    healthcareTitle: "Kejutan penjagaan kesihatan",
    healthcareDescription: "Tambah kos penjagaan S$1,500/bulan selama 3 tahun.",
    healthcareFooter:
      "Kos penjagaan boleh dibiayai oleh penimbal tunai, sokongan keluarga, semakan insurans, atau sokongan awam/komuniti — tertakluk kepada kelayakan.",
    bequestLabel: "Sasaran pusaka",
    bequestTitle: "Sasaran pusaka",
    bequestDescription:
      "Tinggalkan sekurang-kurangnya S$50,000 pada akhir pelan.",
    bequestFooter:
      "Meninggalkan lebih banyak biasanya bermaksud belanjakan lebih kurang hari ini.",
    suggest0: "Potong perbelanjaan budi bicara buat sementara",
    suggest1: "Gunakan penimbal tunai untuk kejutan jangka pendek",
    suggest2: "Semak sokongan keluarga",
    suggest3:
      "Pertimbangkan pilihan monetisasi perumahan seperti penyewaan bil atau memilih saiz lebih kecil",
    suggest4:
      "Tutup jurang insurans — Enough merujuk anda kepada insurer, IFA, atau penasihat sedia ada anda",
    suggest5: "Terokai skim sokongan awam atau komuniti",
    crisisMildLabel: "Kemerosotan ringan",
    crisisMildBlurb: "Portfolio jatuh kira-kira 10% pada tahun pertama.",
    crisisSevereLabel: "Kemerosotan teruk",
    crisisSevereBlurb: "Portfolio jatuh kira-kira 25% pada tahun pertama.",
    crisisLostLabel: "Dekad hilang",
    crisisLostBlurb: "Pulangan rendah berterusan selama kira-kira 10 tahun.",
  },

  lifestyle: {
    essentials: "Keperluan",
    foodTransport: "Makanan & pengangkutan",
    utilities: "Utiliti & isi rumah",
    housing: "Perumahan",
    healthcare: "Penjagaan kesihatan",
    discretionary: "Gaya hidup budi bicara",
    familySupport: "Sokongan keluarga",
    travelHobbies: "Perjalanan & hobi",
    other: "Lain-lain",
    layerEssentials: "Keperluan",
    layerFlexible: "Fleksibel",
    layerAspirational: "Bercita-cita tinggi",
    layerTotal: "Jumlah / bulan",
    personaModest: "Sederhana",
    personaModestBlurb:
      "Meliputi keperluan dengan sedikit ruang — bulan yang cermat dan stabil.",
    personaComfortable: "Selesa",
    personaComfortableBlurb:
      "Gaya hidup yang santai dengan sedikit perjalanan dan sokongan keluarga — contoh kerja.",
    personaGenerous: "Pemurah",
    personaGenerousBlurb:
      "Lebih perjalanan, hobi dan sokongan keluarga — bulan bercita-cita tinggi.",
  },

  presets: {
    conservative: "Konservatif",
    conservativeBlurb:
      "Pulangan berhati-hati, inflasi lebih tinggi, lebih tunai. Perbelanjaan lebih selamat paling rendah di sini.",
    base: "Kes asas",
    baseBlurb:
      "Anggapan pertengahan yang boleh dipertahankan. Lalai yang digunakan di seluruh aplikasi.",
    optimistic: "Optimistik",
    optimisticBlurb:
      "Condong pertumbuhan, inflasi lebih rendah. Perbelanjaan lebih selamat paling tinggi di sini — masih bukan janji.",
    custom: "Tersuai",
    cpfStandard: "Standard (nominal tetap)",
    cpfBasic: "Asas (nominal tetap)",
    cpfEscalating: "Escalating (bermula lebih rendah, +2%/thn)",
    housingPaidOff: "Dilunaskan",
    housingMortgage: "Masih membayar hipotek",
    housingRenting: "Menyewa",
    housingOther: "Lain-lain",
  },

  gapActions: {
    cpfFloorTitle: "Modelkan lantai CPF LIFE yang lebih tinggi",
    cpfFloorDetail:
      "Lantai dijamin yang lebih besar (cth. tambah nilai ke arah Enhanced Retirement Sum) bermaksud lebih banyak keperluan anda diliputi seumur hidup, jadi kurang perbelanjaan anda bergantung pada pasaran.",
    monetiseTitle: "Sewakan bil di pangsapuri HDB",
    monetiseDetail:
      "Menyewakan bil lebihan menambah pendapatan bulanan dijamin di atas CPF LIFE. Menaikkan lantai pendapatan adalah tuas terbesar, kerana ia adalah wang yang anda tidak pernah perlu dibiayai daripada simpanan.",
    trimTitle: "Potong lapisan bercita-cita tinggi",
    trimDetail:
      "Perbelanjaan bercita-cita tinggi (perjalanan, hobi, tambahan) adalah lapisan yang fleksibel. Memotongnya dalam pelan menutup jurang secara langsung, tanpa menyentuh lantai keperluan.",
    guardrailsTitle: "Bersetuju dengan pelindung dalam tahun buruk",
    guardrailsDetail:
      "Bersetuju memotong perbelanjaan budi bicara dalam pasaran turun membolehkan pelan menampung perbelanjaan lebih selamat purata yang sedikit lebih tinggi selebih masa — tuas lebih kecil di sini, tetapi pertahanan utama terhadap urusan pulangan awal yang buruk.",
    closingTitle: "Menutup jurang",
    closingIntro:
      "Perbelanjaan diingini anda adalah {{value}} di atas nombor lebih selamat. Ini adalah tuas yang kami nasihatkan untuk menutupnya — setiap angka adalah apa yang enjin benar-benar kira, bukan janji tetap. Kami menasihati langkah itu dan kekal neutral tentang produk tertentu.",
    closingSpinner: "Memodelkan setiap tuas melalui enjin…",
    allFour: "Jika anda lakukan keempat-empat (dimodelkan bersama)",
    allFourNote:
      "Tuas bertindih, jadi kesan gabungan kurang daripada jumlah — enjin memodelkannya bersama.",
    gapRemaining: "baki jurang",
    fromToday: "daripada {{value}} hari ini",
    closingFooter:
      "Anggaran termodel — timbang dan putuskan; tiada pelan yang mudah kalah. Enough menasihati langkah dan kekal neutral tentang produk tertentu.",
  },

  fundingPlan: {
    title: "Akaun mana untuk dibelanjakan — dan berapa banyak",
    intro:
      "Penjujukan sedar akan cukai dan jangka hayat merentas tunai, SRS, pelaburan dan CPF — dengan jumlah dikira daripada baki anda sendiri. Kira-kira {{value}} sebulan datang daripada aset anda di atas lantai CPF. Ini nasihat yang tiada penyedia produk tunggal boleh beri secara neutral.",
    residualTitle:
      "Kira-kira {{value}} pelan tidak dapat membiayai dengan selamat daripada aset anda sendiri",
    residualNote:
      "Apa yang kami cadangkan untuk dilihat — anda putuskan, dan tiada satupun adalah janji kelayakan. Ini adalah skim Singapura sebenar yang mungkin membantu; semak setiap satu dengan agensi yang berkaitan.",
    residualBody:
      "Untuk bahagian yang anda tidak boleh biayai daripada aset atau skim ini, bekerja lebih lama sedikit atau memotong gaya hidup membantu. Dan untuk risiko yang boleh anda insuranskan — kesihatan, penjagaan jangka panjang, jangka hayat — lihat {{protection}} di bawah, di mana Enough merujuk anda kepada insurer atau IFA yang betul.",
    protectionLink: "Jurang perlindungan",
    addToReport: "Tambah ini ke laporan keluarga",
    stepCashTitle: "Penimbal tunai — pertama, dan dalam tahun pasaran buruk",
    stepCashRationale:
      "Simpan kira-kira dua tahun tarikan aset dalam tunai supaya anda tidak pernah menjual pelaburan dengan kerugian dalam kemerosotan.",
    stepCashNuance:
      "Isi semula dalam tahun baik — ini adalah pertahanan turutan-pulangan anda.",
    stepSrsTitle: "SRS — dalam tetingkap cukai 10-tahun",
    stepSrsRationale:
      "Keluarkan SRS anda merentas tetingkap tanpa penalti 10-tahun supaya pengeluaran disebarkan dan dikenakan cukai dengan cekap.",
    stepSrsNuance:
      "Hanya 50% daripada setiap pengeluaran SRS dikenakan cukai — lajukan untuk kekal dalam bracket rendah.",
    stepInvestTitle: "Pelaburan — enjin pertumbuhan, dikeluarkan secara stabil",
    stepInvestRationale:
      "Biayai baki tarikan setiap tahun daripada pelaburan (bon dahulu, kemudian ekuiti), memotong dengan pelindung supaya portfolio terus mengkompaun.",
    stepInvestNuance:
      "Imbang semula pada pengeluaran; biarkan ekuiti berjalan dalam tahun baik, potong dalam penurunan berterusan.",
    stepCpfTitle: "CPF LIFE — lantai dijamin, disimpan seumur hidup",
    stepCpfRationale:
      "CPF LIFE sudah membayar lantai pendapatan dijamin seumur hidup; pelan memeliharanya sebagai sandaran jangka hayat yang tidak akan anda tempoh.",
    stepCpfNuance:
      "Belanjakan terakhir, dengan sengaja — ia adalah asas di bawah semua yang lain.",
    schemeSilverName: "Silver Support Scheme",
    schemeSilverDetail:
      "Tunai suku tahunan untuk warga emas berpendapatan rendah — dibayar secara automatik jika layak (CPF Board).",
    schemeGstName: "GST Voucher",
    schemeGstDetail:
      "Tunai, tambahan nilai MediSave dan rebat utiliti U-Save untuk isi rumah yang layak.",
    schemeChasName: "CHAS & MediSave / MediShield Life",
    schemeChasDetail:
      "Penjagaan pesakit luar yang disubsidi, sokongan keadaan kronik dan liputan bil hospital.",
    schemePioneerName: "Pioneer / Merdeka Generation",
    schemePioneerDetail:
      "Manfaat penjagaan kesihatan dan MediSave tambahan untuk kumpulan kelahiran yang layak.",
    schemeComCareName: "ComCare",
    schemeComCareDetail:
      "Bantuan kewangan jangka pendek-ke-sederhana untuk mereka yang memerlukan (MSF).",
  },

  healthcare: {
    title: "Ujian tekanan penjagaan kesihatan & kos penjagaan",
    badge: "angka skim disebut · kos episod ilustrasi",
    intro:
      "Pilih peristiwa kesihatan dan tetapan penjagaan untuk melihat kos sebenar — bersih daripada skim kerajaan yang membantu — dan bagaimana ia menggerakkan perbelanjaan bulanan lebih selamat.",
    careSetting: "Tetapan penjagaan",
    acuteHeading: "Peristiwa akut sekali",
    acuteGrossLabel: "Hospital / rawatan (kasar)",
    acuteMedishield: "Tolak MediShield Life",
    acuteYouPay: "Anda bayar (sekali)",
    monthlyHeading: "Bulanan, selama ~{{years}} tahun",
    ongoingLabel: "Perubatan berterusan",
    careLabel: "Tetapan penjagaan",
    careshieldLess: "Tolak CareShield Life ({{value}}/bln)",
    subsidyLess: "Tolak HCG / diuji-maks / CHAS",
    youFund: "Anda biayai (sebulan)",
    notSevere:
      "Keadaan ini mungkin tidak mencapai tahap keterukan CareShield Life (≥3 daripada 6 aktiviti harian), jadi tiada bayaran diandaikan.",
    baseSafer: "Perbelanjaan lebih selamat asas",
    afterCare: "Selepas kos penjagaan ini",
    impact: "Anggaran impak",
    fundingOptions:
      "Pilihan pembiayaan: penimbal tunai, turutan pengeluaran di atas, sokongan keluarga, atau rujukan kepada insurer, IFA, atau penasihat sedia ada anda.",
    figures:
      "Parameter skim (CareShield Life S$689/bln, Home Caregiving Grant S$600/bln, MediShield Life S$2,000 deduktibel + ko-insurans) dan yuran penjagaan tipikal adalah daripada sumber rasmi 2025–26. Kos episod sekali dan kadar subsidi diuji-maks adalah ilustrasi — subsidi diuji-maks sebenar bergantung pada pendapatan isi rumah (sehingga 75–80%). Anda timbang dan putuskan; tiada kos di sini adalah jaminan, dan kami menasihati langkah, bukan produk tertentu.",
    figuresLabel: "Angka.",
    addToReport: "Tambah ke laporan keluarga",
    spinner: "Menjalankan semula enjin dengan kos penjagaan ini…",
    strokeLabel: "Strok",
    strokeBlurb:
      "Peristiwa mengejut, pemulihan panjang, dan sering bantuan berterusan dengan aktiviti harian.",
    dementiaLabel: "Demensia",
    dementiaBlurb:
      "Permulaan beransur-ansur dengan pengawasan dan keperluan penjagaan yang meningkat sepanjang tahun.",
    cancerLabel: "Kanser",
    cancerBlurb:
      "Kos rawatan akut tinggi, kemudian susulan berterusan dan ubat.",
    frailtyLabel: "Kelemahan umum",
    frailtyBlurb:
      "Penurunan perlahan dengan usia — perjalanan penjagaan paling biasa, merentasi horizon paling panjang.",
    careHelperLabel: "Pembantu di rumah",
    careHelperNote:
      "Pekerja domestik asing: gaji + lev konsesi S$60 (penjagaan warga emas) + penyelenggaraan. Home Caregiving Grant mungkin mengimbangi apabila keperluan penjagaan teruk.",
    careDaycareLabel: "Pusat penjagaan harian",
    careDaycareNote:
      "Program harian pusat penjagaan warga emas. Subsidi diuji-maks AIC sehingga 80% untuk isi rumah berpendapatan lebih rendah.",
    careNursingLabel: "Rumah kejururawatan",
    careNursingNote:
      "Rumah kejururawatan kediaman. Subsidi diuji-maks sehingga 75% (80% jika dilahirkan 1969 atau lebih awal), ditambah CareShield Life jika teruk.",
    srcCareShield: "CareShield Life — CPF Board",
    srcHcg: "Home Caregiving Grant — MOM/MSF",
    srcMedishield: "MediShield Life — MOH",
    srcAic: "Yuran/subsidi penjagaan kediaman & harian — AIC",
  },

  protection: {
    title: "Jurang perlindungan — dan siapa untuk berjumpa",
    intro:
      "Sesetengah risiko persaraan lebih murah untuk diinsuranskan daripada membiayai sendiri. Inilah risikonya, perlindungan yang meliputinya, dan rakan kongsi berlesen yang kami perkenalkan. Anda pilih siapa — Enough mengukur jurang dan membuat perkenalan; rakan kongsi mengendalikan produk.",
    protectionFits: "Perlindungan yang sesuai",
    whoToSee: "Siapa untuk berjumpa",
    footer:
      "Penyedia yang ditunjukkan adalah rakan kongsi contoh ilustrasi (firma dan skim sebenar Singapura, 2025–26), bukan hubungan yang disahkan. Enough merujuk sebagai perkenalan MAS yang dibenarkan (FAA-N02); yuran rata, bukan komisen, jadi rujukan kekal neutral — anda putuskan, dan sebarang produk diatur oleh rakan kongsi berlesen.",
    footerEmphasis: "rakan kongsi contoh ilustrasi",
    addToReport: "Tambah ke laporan keluarga",
    r_longevity_gap: "Jangka hayat — hidup melebihi simpanan anda",
    r_longevity_nature:
      "Aset pelaburan anda membiayai perbelanjaan di atas CPF LIFE. Hidup sehingga 95+ atau terkena tempoh pasaran buruk, dan tabung itu boleh kering sementara anda masih di sini.",
    r_longevity_protection:
      "Pendapatan dijamin seumur hidup — tambah nilai CPF LIFE ke Enhanced Retirement Sum (ERS), atau tambah anuiti seumur hidup persendirian.",
    r_longevity_why:
      "Menukar tabung terhad kepada pendapatan seumur hidup — satu risiko yang anda tidak boleh self-insurans dengan selamat.",
    r_longevity_channel:
      "CPF Board (tambah nilai CPF LIFE), atau IFA yuran-sahaja untuk membandingkan anuiti persendirian.",
    r_longevity_ex0: "CPF LIFE (CPF Board)",
    r_longevity_ex1: "Anuiti persendirian — Income, Great Eastern, Singlife",
    r_longevity_ex2: "Bandingkan melalui IFA yuran-sahaja — Providend, GYC",
    r_hosp_gap: "Kemasukan hospital — melebihi MediShield Life",
    r_hosp_nature:
      "MediShield Life meliputi bil bersubsidi (wad B2/C). Penjagaan hospital swasta atau wad-A, dan bil besar, meninggalkan kekurangan yang anda bayar daripada poket.",
    r_hosp_protection:
      "Pelan Perisai Bersepadu (IP) dengan rider — liputan hospital swasta / wad lebih tinggi di atas MediShield Life.",
    r_hosp_why:
      "Hadkan pendedahan anda pada bil hospital besar supaya satu kemasukan tidak menggagalkan pelan.",
    r_hosp_channel: "Agensi insurans atau IFA.",
    r_hosp_ex0: "AIA, Great Eastern, Prudential, Income, Singlife, HSBC Life",
    r_ltc_gap: "Penjagaan jangka panjang — melebihi CareShield Life",
    r_ltc_nature:
      "CareShield Life membayar ~S$689/bln hanya apabila anda kurang upaya teruk (3 daripada 6 aktiviti harian). Penjagaan sebenar — pembantu, pusat harian, rumah kejururawatan — boleh kos jauh lebih mahal.",
    r_ltc_protection:
      "Suplemen CareShield Life — bayaran bulanan lebih tinggi untuk penjagaan jangka panjang.",
    r_ltc_why:
      "Menukar kos persaraan terbesar dan ekor-paling-panjang kepada manfaat bulanan yang boleh diramal.",
    r_ltc_channel: "Agensi insurans.",
    r_ltc_ex0: "Singlife CareShield Standard / Plus",
    r_ltc_ex1: "Great Eastern",
    r_ltc_ex2: "Income Insurance",
    r_ci_gap: "Penyakit kritikal — kanser, strok, penyakit utama",
    r_ci_nature:
      "Diagnosis serius membawa kos rawatan berat ditambah kehilangan keupayaan pendapatan. MediShield Life hanya meliputi ubat kanser yang disenaraikan, dengan had.",
    r_ci_protection:
      "Pelan Penyakit Kritikal (CI) — jumlah sekaligus pada diagnosis untuk membiayai rawatan dan menggantikan pendapatan.",
    r_ci_why:
      "Memberi anda tunai apabila paling memerlukan, tanpa menjual pelaburan pada masa paling teruk.",
    r_ci_channel:
      "IFA (untuk membandingkan merentasi insurer) atau agensi insurans.",
    r_ci_ex0: "AIA, Prudential, Great Eastern, Manulife",
    r_ci_ex1: "Bandingkan melalui IFA — Financial Alliance, IPP",
    r_legacy_gap: "Legasi — melindungi apa yang anda tinggalkan",
    r_legacy_nature:
      "Anda ingin meninggalkan jumlah tertentu, tetapi pengeluaran untuk perbelanjaan menghakisinya — dan pasaran membuat baki akhir tidak menentu.",
    r_legacy_protection:
      "Perancangan seumur hidup atau legasi yang memagari pusaka tanpa mengira keputusan pasaran.",
    r_legacy_why:
      "Membolehkan anda belanjakan lebih bebas hari ini, mengetahui pusaka dilindungi secara berasingan.",
    r_legacy_channel: "IFA yuran-sahaja.",
    r_legacy_ex0: "Providend, GYC (perancangan estet & legasi)",
  },

  spendMonitor: {
    kickerParent: "Semakan perbelanjaan",
    kickerChild: "Paparan anak dewasa",
    title: "Monitor Perbelanjaan",
    subtitle:
      "Bandingkan apa yang anda benar-benar belanjakan dengan julat bulanan lebih selamat. Kemasukan manual — tiada suapan bank, tiada pengkategorian automatik.",
    heroLabelParent: "Perbelanjaan anda vs julat lebih selamat",
    heroLabelChild: "Perbelanjaan Ayah vs julat lebih selamat",
    actualPerMonth: "sebenar / bulan",
    saferRange: "Julat lebih selamat: {{value}}",
    overUpper: "{{value}} di atas julat lebih selamat atas.{{review}}",
    reviewFirst: " Semak {{bucket}} dahulu.",
    zoneGreen: "Dalam julat lebih selamat",
    zoneAmber: "Sedikit di atas julat",
    zoneRed: "Di atas julat selamat",
    plannedVsActual: "Dirancang vs sebenar mengikut baldi",
    plannedActual: "Dirancang {{planned}} · Sebenar {{actual}}",
    updateReport: "Kemas kini laporan keluarga",
    resetToPlanned: "Set semula kepada dirancang",
    disclaimer:
      "Monitor Perbelanjaan adalah alat perancangan manual. Enough tidak menyambung ke bank anda, mengimport transaksi, atau mengkategorikan perbelanjaan secara automatik.",
  },

  family: {
    kicker: "Tingkat keluarga",
    title: "Satu pelan, seluruh keluarga",
    subtitle:
      "Pelan yang dikebenarkan untuk pesara, pasangan, dan anak dewasa — anak membantu menyediakannya, tetapi ibu bapa sentiasa mengesahkan nombor itu.",
    pillParent: "Paparan ibu bapa",
    pillChild: "Paparan anak dewasa",
    parentTag: "Keyakinan tanpa pemantauan",
    childTag: "Pengawasan tanpa gangguan",
    parentBody:
      "Anak-anak anda boleh membantu anda menyediakan sesuatu dan memantau, tetapi mereka tidak pernah boleh menggerakkan wang anda atau menukar nombor anda tanpa anda. Anda lihat dan sahkan segalanya. Pelan sentiasa di pihak anda.",
    childBody:
      "Anda sediakan dan sambung akaun, dapat amaran apabila pelan perlu dilihat, dan tandatangani bersama perubahan besar — tetapi nombor akhir sentiasa untuk Ayah sahkan. Peraturan berpusat-ibu bapa itu yang mengekalkan Enough boleh dipercayai.",
    whoOnPlan: "Siada dalam pelan",
    coSignerHeading: "Aliran tandatangan bersama",
    coSignerIntro:
      "Perubahan besar — kenaikan perbelanjaan, tambah nilai CPF, menyambung akaun — dihalakan melalui kelulusan berkongsi. Pengendali boleh naikkan dan semak; pemilik mengesahkan.",
    moatTitle: "Lapisan keluarga adalah tanah yang tidak dicabar",
    moatBody:
      "Tiada pesaing Singapura atau global yang dikaji menawarkan ini. Ia menyelesaikan masalah kemasukan data warga emas (anak mengendalikan), membetulkan kesanggupan membayar (anak yang bimbang membayar), dan mewujudkan ikatan dalam isi rumah yang kalkulator tidak boleh salin.",
    openReport: "Buka laporan keluarga →",
    backToResults: "Kembali ke keputusan",
    disclaimer:
      "Prototaip ilustrasi tingkat keluarga. Peranan, kebenaran dan aliran tandatangan bersama ditunjukkan dengan data sampel — bukan akaun langsung.",
    m1Name: "Mr Tan",
    m1Relation: "Pesara",
    m1Role: "Pemilik · pembuat keputusan",
    m1p1: "Lihat dan sahkan nombor perbelanjaan selamat",
    m1p2: "Memiliki pelan dan semua persetujuan data",
    m1p3: "Mesti meluluskan sebarang perubahan kepada perbelanjaan atau akaun",
    m2Name: "Mrs Tan",
    m2Relation: "Pasangan",
    m2Role: "Penonton",
    m2p1: "Lihat pelan dan julat perbelanjaan bulanan lebih selamat",
    m2p2: "Sertai perbualan keluarga",
    m2p3: "Tidak boleh menukar akaun atau perbelanjaan",
    m3Name: "Wei Ling",
    m3Relation: "Anak perempuan dewasa",
    m3Role: "Pengendali · pembantu bersama",
    m3p1: "Sediakan & sambung akaun bagi pihak Ayah (dengan persetujuan)",
    m3p2: "Dapat amaran apabila pelan perlu dilihat",
    m3p3: "Tandatangani bersama perubahan besar — tetapi Ayah mengesahkan nombor akhir",
    csAwaitingParent: "Menunggu pengesahan Ayah",
    csAwaitingChild: "Menunggu semakan + pengesahan",
    csApproved: "Diluluskan",
    csRaisedBy: "Dinaikkan oleh",
    csNeeds: "Memerlukan",
    csParentCentric: "Berpusat-ibu bapa:",
    csConfirmAsDad: "Sahkan (sebagai Ayah)",
    csReviewConfirm: "Semak & sahkan",
    csNotNow: "Bukan sekarang",
  },

  familyPlane: {
    cs1Title: "Naikkan perbelanjaan bulanan lebih selamat ke S$2,350",
    cs1Detail:
      "Pelindung mendapat kenaikan selepas pasaran kukuh. Wei Ling telah menyemaknya; Ayah mengesahkan sebelum ia berkuat kuasa.",
    cs1RaisedBy: "Wei Ling (pengendali)",
    cs1Needs: "Mr Tan mesti sahkan",
    cs1Note:
      "Enough sentiasa mengoptimumkan kesejahteraan ibu bapa — kenaikan adalah selamat, jadi pelan menonjolkannya kepada Ayah, bukan menjauhkannya.",
    cs2Title: "Modelkan lantai CPF LIFE yang lebih tinggi",
    cs2Detail:
      "Lantai dijamin yang lebih besar menaikkan keyakinan. Kami menasihati langkah itu; produk tertentu adalah keputusan Ayah — dan Ayah memutuskan.",
    cs2RaisedBy: "Enough (enjin pelindung)",
    cs2Needs: "Mr Tan + Wei Ling",
    cs3Title: "Sambung akaun OCBC SRS melalui SGFinDex",
    cs3Detail:
      "Wei Ling telah menyambung akaun SRS supaya penjujukan pengeluaran boleh menggunakan tetingkap 10-tahun.",
    cs3RaisedBy: "Wei Ling (pengendali)",
    cs3Needs: "Disahkan oleh Mr Tan",
    alert1Title: "Pelan Ayah di landasan",
    alert1Body: "90% keyakinan ke umur 95. Tiada tindakan diperlukan.",
    alert2Title: "Kenaikan selamat menunggu Ayah untuk disahkan",
    alert2Body:
      "Pasaran berjalan di atas garis pelan — perbelanjaan bulanan lebih selamat boleh naik ke S$2,350.",
    alert3Title: "Keputusan tambah nilai CPF untuk disemak bersama",
    alert3Body:
      "Lantai yang lebih besar akan meningkatkan keyakinan ~3%. Kami menasihati langkah, bukan produk tertentu.",
  },

  report: {
    kicker: "Untuk meja dapur",
    title: "Laporan keluarga",
    subtitle:
      "Ringkasan satu halaman yang tenang untuk dibincangkan di rumah. Bahasa mudah, nasihat neutral-produk.",
    print: "Cetak laporan keluarga",
    header: "Laporan Keluarga Enough",
    headerSub: "Mr Tan, umur {{age}}. Rancang ke umur {{horizon}}.",
    headerAdvice: "Nasihat perancangan · anda putuskan",
    saferLabel: "Julat perbelanjaan bulanan lebih selamat",
    cpfFloorNote:
      "CPF LIFE adalah lantai jangka hayat, belum tentu lindung nilai inflasi.",
    centralEstimate: "Anggaran tengah: {{central}} pada {{confidence}}",
    cpfFloorLabel: "Lantai CPF LIFE",
    lifestyleLabel: "Perbelanjaan gaya hidup",
    lifestyleLine:
      "Keperluan {{e}} · Fleksibel {{f}} · Bercita-cita tinggi {{a}} · Jumlah {{t}}.",
    healthcareLabel: "Penjagaan kesihatan & kejutan penjagaan",
    healthcareBody:
      "Kejutan penjagaan (sebagai contoh, kos penjagaan tambahan selama beberapa tahun) mungkin mengurangkan perbelanjaan lebih selamat kira-kira {{value}}. Cara untuk menampungnya: penimbal tunai, sokongan keluarga, skim awam atau komuniti, atau rujukan kepada insurer, IFA, atau penasihat sedia ada anda.",
    bequestLabel: "Pusaka",
    bequestBody:
      "Sasaran pusaka {{target}} mungkin mengurangkan perbelanjaan lebih selamat kira-kira {{value}}. Pusaka tidak ditolak — Enough menunjukkan pertukaran bulanan.",
    crisisLabel: "Pelindung kemerosotan pasaran",
    crisisBody:
      "Kemerosotan teruk mungkin menggerakkan pelan ke Zon Ambar — model mencadangkan memotong perbelanjaan budi bicara sebanyak 5% hingga 10% sehingga keyakinan pulih. Ini adalah ujian senario, bukan masa pasaran.",
    currentLabel: "Semakan perbelanjaan semasa",
    currentBody: "Sebenar {{actual}} vs julat lebih selamat {{range}}.{{over}}",
    currentOver:
      " Kira-kira {{value}} di atas julat lebih selamat atas — semak baldi budi bicara dan perjalanan dahulu.",
    currentWithin: " Dalam julat lebih selamat.",
    convoTitle: "Pemula perbualan",
    convoBody:
      "CPF LIFE kami memberikan kami {{cpf}} seumur hidup. Berbelanja kira-kira {{central}} kelihatan lebih selamat. Berbelanja jauh lebih tinggi bermakna menerima lebih banyak risiko.",
    disclaimer:
      "Nasihat perancangan kewangan neutral (sedang mendapatkan lesen MAS FA). Kami menasihati keputusan, bukan produk tertentu. Anggaran, bukan jaminan — keputusan ilustrasi berdasarkan anggapan yang dinyatakan. Fikirkan dan buat keputusan sendiri sebelum keputusan kewangan utama.",
    saveAsPdf:
      'Gunakan dialog Cetak pelayar anda dan pilih "Save as PDF" untuk berkongsi laporan ini.',
  },

  partners: {
    kicker: "Untuk rakan kongsi",
    title: "Enough untuk rakan kongsi",
    subtitle:
      "Enjin dekumulasi neutral Singapura — diedarkan melalui rakan kongsi yang mana neutraliti adalah aset, bukan ancaman.",
    wedgeTitle: "Baji hari ini, parit terbina esok",
    wedgeBody:
      "Enjin perbelanjaan selamat adalah taruhan meja yang jujur dan fokus — parit yang boleh dipertahankan adalah sistem-of-rekod berlesen-berpagar dan tertanam-keluarga yang ia menjadi: pengagregatan seluruh kekayaan yang disahkan, penjujukan sedar-cukai, dan hubungan isi rumah pelbagai-tahun yang tiada penjual produk boleh himpunkan.",
    problemTitle: "Masalah",
    problemBody:
      "Pengumpulan sesak. Dekumulasi kurang dilayan. Tiada pemain neutral yang memiliki keputusan perbelanjaan bulanan — bank dan penasihat memperoleh pada produk yang mereka jual.",
    whyNowTitle: "Kenapa sekarang",
    whyNow1:
      "Singapura semakin menua — 1 daripada 4 berumur 65+ menjelang 2030.",
    whyNow2:
      "CPF LIFE adalah lantai, bukan jawapan perbelanjaan seluruh kekayaan.",
    whyNow3:
      "Penganjur seluruh kekayaan neutral awam (MyMoneySense) telah keluar.",
    whyNow4: "SGFinDex membolehkan pengagregatan yang disahkan.",
    threeTitle: "Tiga yang terselamat",
    three1: "Pengagregatan seluruh kekayaan neutral.",
    three2: "Kedalaman natif CPF-LIFE / SRS / cukai-SG.",
    three3: "Lapisan keluarga / anak-dewasa (tidak dicabar).",
    channelTitle:
      "Saluran: bukan-bank B2B2C dipimpin, tingkat keluarga di atas",
    channelBody:
      "Yuran rata sahaja — bukan komisen atau perkongsian hasil produk. Enough kekal sebagai pengawal data dalam setiap perjanjian. Bank akhir, dan hanya sebagai rel neutral berfirewall.",
    channelWellnessName: "Kesejahteraan-majikan (utama)",
    channelWellness1:
      "Sokong kakitangan generasi-sandwich dengan ibu bapa yang menua",
    channelWellness2: "Per-pekerja-per-tahun (PEPY), rata",
    channelWellness3: "Paling bersih pada neutraliti + data",
    channelWellness4: "Mencapai pembeli anak-dewasa secara langsung",
    channelIfaName: "IFA yuran-sahaja",
    channelIfa1:
      "Enjin neutral berskala + pelan kotak-kaca untuk diserahkan kepada pelanggan",
    channelIfa2: "Per-kursi-penasihat / bulan",
    channelIfa3: "Boleh ditanda-bersama; Enough kekal enjin + data",
    channelInsurerName: "Insurer + tingkat keluarga",
    channelInsurer1:
      "Saiz-keperluan neutral sebagai lead-gen yang layak (rata + per-lead)",
    channelInsurer2: "Tidak pernah komisen pada jualan",
    channelInsurer3: "Tingkat keluarga langsung: anak dewasa membayar",
    channelNote:
      "Semua angka adalah anggaran ilustrasi untuk cadangan akademik. Sahkan unit harga dengan penemuan rakan kongsi + Van Westendorp sebelum komitmen.",
    regTitle: "Laluan kawal selia",
    reg1: "Sedang mendapatkan lesen Penasihat Kewangan MAS untuk memberi nasihat perancangan kewangan neutral.",
    reg2: "Neutral-produk: nasihatkan keputusan, tidak pernah mempromosikan produk.",
    reg3: "Yuran rata, bukan komisen — jadi nasihat kekal jujur.",
    reg4: "Lesen memagari parit — item laluan-kritikal Gelombang-1, bukan selepas-fikir.",
    pilotTitle: "Permintaan rintis",
    pilot1: "Satu rakan kongsi kesejahteraan-majikan atau IFA yuran-sahaja.",
    pilot2: "Kakitangan generasi-sandwich dengan ibu bapa yang menua.",
    pilot3:
      "Ukur pelan yang disambung, penggunaan perbelanjaan-selamat, penglibatan keluarga.",
    pilot4: "Matlamat: buktikan nombor, bina roda layang keluarga.",
    closerTitle: "Tumpahkan MoneyOwl. Lebih-neutral-kan DBS. Miliki keluarga.",
    closerBody:
      "Nasihat perancangan kewangan neutral (sedang mendapatkan lesen MAS FA). Kami menasihati keputusan, bukan produk tertentu. Anggaran, bukan jaminan. Tidak bersekutu dengan CPF Board atau MAS.",
    disclaimer:
      "Angka pasaran dan ekonomi-unit adalah anggaran ilustrasi untuk cadangan akademik.",
  },

  disclaimer: {
    footer:
      "Nasihat perancangan kewangan neutral — anda buat keputusan muktamad. Kami menasihati keputusan, bukan produk tertentu (yuran rata, bukan komisen). Anggaran, bukan jaminan. Tidak bersekutu dengan CPF Board atau MAS.",
  },
} as const;

export default msSG;
