export type Language = "en" | "fr" | "sw" | "ha" | "am";

export const LANGUAGE_META: Record<Language, { label: string; nativeLabel: string; flag: string; rtl: boolean }> = {
  en: { label: "English",  nativeLabel: "English",  flag: "🇬🇧", rtl: false },
  fr: { label: "French",   nativeLabel: "Français",  flag: "🇫🇷", rtl: false },
  sw: { label: "Swahili",  nativeLabel: "Kiswahili", flag: "🇰🇪", rtl: false },
  ha: { label: "Hausa",    nativeLabel: "Hausa",     flag: "🇳🇬", rtl: false },
  am: { label: "Amharic",  nativeLabel: "አማርኛ",      flag: "🇪🇹", rtl: false },
};

export type Translations = {
  // Home screen
  brand: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  statAssessments: string;
  statCountries: string;
  statFree: string;
  startAssessment: string;
  recentLabel: string;
  viewBtn: string;
  disclaimer: string;

  // Symptom screen
  symptomTitle: string;
  symptomSubtitle: string;
  backBtn: string;
  sectionPatient: string;
  agePlaceholder: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  sectionSymptoms: string;
  selectedCount: string;
  otherSymptomsPlaceholder: string;
  sectionDuration: string;
  sectionSeverity: string;
  submitBtn: string;
  analyzing: string;
  formDisclaimer: string;

  // Symptoms list
  symptoms: string[];

  // Duration options
  durations: string[];

  // Severity options
  severityMild: string;
  severityModerate: string;
  severitySevere: string;

  // Result screen
  resultTitle: string;
  urgencyLabel: string;
  urgencyEmergency: string;
  urgencyHigh: string;
  urgencyModerate: string;
  urgencyLow: string;
  sectionConditions: string;
  sectionImmediate: string;
  sectionHomeCare: string;
  sectionSeekCare: string;
  sectionPrevention: string;
  newAssessmentBtn: string;
  resultDisclaimer: string;
  emergencyCTA: string;
  emergencyNumber: string;

  // Language picker
  chooseLanguage: string;
  continueBtn: string;

  // AI prompt instruction
  aiPromptLocale: string;
};

const en: Translations = {
  brand: "Africa Health",
  tagline: "AI-powered symptom assessment",
  heroTitle: "Health guidance",
  heroHighlight: "for everyone.",
  heroSubtitle: "AI-powered symptom assessment built for Sub-Saharan Africa. Free, private, and available in your language.",
  statAssessments: "Assessments",
  statCountries: "Countries",
  statFree: "Free",
  startAssessment: "Start Assessment",
  recentLabel: "Recent",
  viewBtn: "View →",
  disclaimer: "Health education only — not a substitute for professional medical care. In an emergency, call local emergency services immediately.",

  symptomTitle: "Symptom Assessment",
  symptomSubtitle: "Complete all sections for best results",
  backBtn: "← Back",
  sectionPatient: "01 — Patient Info",
  agePlaceholder: "Age",
  genderMale: "Male",
  genderFemale: "Female",
  genderOther: "Other",
  sectionSymptoms: "02 — Symptoms",
  selectedCount: "selected",
  otherSymptomsPlaceholder: "Describe other symptoms...",
  sectionDuration: "03 — Duration",
  sectionSeverity: "04 — Severity",
  submitBtn: "Get Assessment →",
  analyzing: "Analyzing",
  formDisclaimer: "Health education only — not a medical diagnosis. Always consult a healthcare provider.",

  symptoms: ["Fever","Headache","Chills","Fatigue","Nausea","Vomiting","Diarrhea","Stomach pain","Cough","Difficulty breathing","Chest pain","Sore throat","Body aches","Joint pain","Rash","Yellowing skin","Dark urine","Sweating","Loss of appetite","Weight loss","Swollen lymph nodes","Blurred vision","Stiff neck","Confusion"],
  durations: ["Less than 1 day","1–3 days","4–7 days","1–2 weeks","More than 2 weeks"],
  severityMild: "Mild",
  severityModerate: "Moderate",
  severitySevere: "Severe",

  resultTitle: "Assessment Results",
  urgencyLabel: "Urgency Level",
  urgencyEmergency: "Seek immediate medical care",
  urgencyHigh: "See a doctor within 24 hours",
  urgencyModerate: "Monitor closely",
  urgencyLow: "Home care likely sufficient",
  sectionConditions: "Possible Conditions",
  sectionImmediate: "Immediate Steps",
  sectionHomeCare: "Home Care",
  sectionSeekCare: "Seek Care If",
  sectionPrevention: "Prevention",
  newAssessmentBtn: "New Assessment",
  resultDisclaimer: "This assessment is for health education purposes only and does not constitute medical advice or diagnosis. Please consult a qualified healthcare provider. In an emergency, contact local emergency services immediately.",
  emergencyCTA: "Call Emergency Services",
  emergencyNumber: "112",

  chooseLanguage: "Choose your language",
  continueBtn: "Continue",

  aiPromptLocale: "Respond entirely in English.",
};

const fr: Translations = {
  brand: "Africa Health",
  tagline: "Évaluation des symptômes par IA",
  heroTitle: "Des conseils de santé",
  heroHighlight: "pour tous.",
  heroSubtitle: "Évaluation des symptômes alimentée par l'IA, conçue pour l'Afrique subsaharienne. Gratuite, privée et disponible dans votre langue.",
  statAssessments: "Évaluations",
  statCountries: "Pays",
  statFree: "Gratuit",
  startAssessment: "Commencer l'évaluation",
  recentLabel: "Récent",
  viewBtn: "Voir →",
  disclaimer: "Éducation sanitaire uniquement — ne remplace pas les soins médicaux professionnels. En cas d'urgence, appelez immédiatement les services d'urgence locaux.",

  symptomTitle: "Évaluation des symptômes",
  symptomSubtitle: "Complétez toutes les sections pour de meilleurs résultats",
  backBtn: "← Retour",
  sectionPatient: "01 — Informations patient",
  agePlaceholder: "Âge",
  genderMale: "Homme",
  genderFemale: "Femme",
  genderOther: "Autre",
  sectionSymptoms: "02 — Symptômes",
  selectedCount: "sélectionné(s)",
  otherSymptomsPlaceholder: "Décrivez d'autres symptômes...",
  sectionDuration: "03 — Durée",
  sectionSeverity: "04 — Sévérité",
  submitBtn: "Obtenir l'évaluation →",
  analyzing: "Analyse en cours",
  formDisclaimer: "Éducation sanitaire uniquement — pas un diagnostic médical. Consultez toujours un professionnel de santé.",

  symptoms: ["Fièvre","Maux de tête","Frissons","Fatigue","Nausées","Vomissements","Diarrhée","Douleur abdominale","Toux","Difficulté à respirer","Douleur thoracique","Maux de gorge","Douleurs corporelles","Douleurs articulaires","Éruption cutanée","Jaunissement de la peau","Urine foncée","Transpiration","Perte d'appétit","Perte de poids","Ganglions enflés","Vision floue","Raideur de la nuque","Confusion"],
  durations: ["Moins d'1 jour","1–3 jours","4–7 jours","1–2 semaines","Plus de 2 semaines"],
  severityMild: "Légère",
  severityModerate: "Modérée",
  severitySevere: "Sévère",

  resultTitle: "Résultats de l'évaluation",
  urgencyLabel: "Niveau d'urgence",
  urgencyEmergency: "Consultez immédiatement un médecin",
  urgencyHigh: "Consultez un médecin dans les 24 heures",
  urgencyModerate: "Surveiller attentivement",
  urgencyLow: "Soins à domicile probablement suffisants",
  sectionConditions: "Conditions possibles",
  sectionImmediate: "Mesures immédiates",
  sectionHomeCare: "Soins à domicile",
  sectionSeekCare: "Consulter si",
  sectionPrevention: "Prévention",
  newAssessmentBtn: "Nouvelle évaluation",
  resultDisclaimer: "Cette évaluation est uniquement à des fins d'éducation sanitaire et ne constitue pas un avis ou diagnostic médical. Veuillez consulter un professionnel de santé qualifié. En cas d'urgence, contactez immédiatement les services d'urgence locaux.",
  emergencyCTA: "Appeler les secours",
  emergencyNumber: "112",

  chooseLanguage: "Choisissez votre langue",
  continueBtn: "Continuer",

  aiPromptLocale: "Répondez entièrement en français.",
};

const sw: Translations = {
  brand: "Africa Health",
  tagline: "Tathmini ya dalili kwa AI",
  heroTitle: "Mwongozo wa afya",
  heroHighlight: "kwa kila mtu.",
  heroSubtitle: "Tathmini ya dalili inayoendeshwa na AI, iliyoundwa kwa Afrika Kusini mwa Sahara. Bure, ya siri, na inapatikana katika lugha yako.",
  statAssessments: "Tathmini",
  statCountries: "Nchi",
  statFree: "Bure",
  startAssessment: "Anza Tathmini",
  recentLabel: "Za hivi karibuni",
  viewBtn: "Tazama →",
  disclaimer: "Elimu ya afya tu — si mbadala wa huduma ya matibabu ya kitaalamu. Katika dharura, piga simu huduma za dharura za eneo hilo mara moja.",

  symptomTitle: "Tathmini ya Dalili",
  symptomSubtitle: "Kamilisha sehemu zote kwa matokeo bora",
  backBtn: "← Rudi",
  sectionPatient: "01 — Taarifa za Mgonjwa",
  agePlaceholder: "Umri",
  genderMale: "Mwanaume",
  genderFemale: "Mwanamke",
  genderOther: "Nyingine",
  sectionSymptoms: "02 — Dalili",
  selectedCount: "zimechaguliwa",
  otherSymptomsPlaceholder: "Elezea dalili nyingine...",
  sectionDuration: "03 — Muda",
  sectionSeverity: "04 — Ukali",
  submitBtn: "Pata Tathmini →",
  analyzing: "Inachambua",
  formDisclaimer: "Elimu ya afya tu — si uchunguzi wa kimatibabu. Daima shauriana na mtoa huduma wa afya.",

  symptoms: ["Homa","Maumivu ya kichwa","Baridi","Uchovu","Kichefuchefu","Kutapika","Kuhara","Maumivu ya tumbo","Kikohozi","Ugumu wa kupumua","Maumivu ya kifua","Maumivu ya koo","Maumivu ya mwili","Maumivu ya viungo","Upele","Ngozi ya njano","Mkojo mweusi","Kutoka jasho","Kukosa hamu ya kula","Kupoteza uzito","Tezi zilizovimba","Uoni hafifu","Shingo ngumu","Mkanganyiko"],
  durations: ["Chini ya siku 1","Siku 1–3","Siku 4–7","Wiki 1–2","Zaidi ya wiki 2"],
  severityMild: "Kidogo",
  severityModerate: "Wastani",
  severitySevere: "Kali",

  resultTitle: "Matokeo ya Tathmini",
  urgencyLabel: "Kiwango cha Dharura",
  urgencyEmergency: "Tafuta huduma ya matibabu mara moja",
  urgencyHigh: "Ona daktari ndani ya masaa 24",
  urgencyModerate: "Fuatilia kwa makini",
  urgencyLow: "Huduma ya nyumbani inaweza kutosha",
  sectionConditions: "Hali Zinazowezekana",
  sectionImmediate: "Hatua za Haraka",
  sectionHomeCare: "Huduma ya Nyumbani",
  sectionSeekCare: "Tafuta Huduma Kama",
  sectionPrevention: "Kinga",
  newAssessmentBtn: "Tathmini Mpya",
  resultDisclaimer: "Tathmini hii ni kwa madhumuni ya elimu ya afya tu na haijumuishi ushauri au uchunguzi wa kimatibabu. Tafadhali shauriana na mtoa huduma wa afya aliyehitimu. Katika dharura, wasiliana na huduma za dharura za eneo hilo mara moja.",
  emergencyCTA: "Piga Simu Huduma za Dharura",
  emergencyNumber: "112",

  chooseLanguage: "Chagua lugha yako",
  continueBtn: "Endelea",

  aiPromptLocale: "Jibu kwa Kiswahili kamili.",
};

const ha: Translations = {
  brand: "Africa Health",
  tagline: "Kimanta alamomin ciwo da AI",
  heroTitle: "Jagoran lafiya",
  heroHighlight: "ga kowa.",
  heroSubtitle: "Kimanta alamomin ciwo ta hanyar AI, wanda aka gina don Afirka ta Kudu da Sahara. Kyauta, mai zaman kansa, kuma yana samuwa cikin yaranka.",
  statAssessments: "Kimantawa",
  statCountries: "Ƙasashe",
  statFree: "Kyauta",
  startAssessment: "Fara Kimantawa",
  recentLabel: "Kwanan nan",
  viewBtn: "Duba →",
  disclaimer: "Ilimin lafiya kawai — ba maye gurbin kulawa ta likita ba. A gaggauta, kira sabis na gaggawa na gida nan take.",

  symptomTitle: "Kimanta Alamomin Ciwo",
  symptomSubtitle: "Cika dukkan sassan don mafi kyawun sakamako",
  backBtn: "← Koma",
  sectionPatient: "01 — Bayanan Majinyaci",
  agePlaceholder: "Shekaru",
  genderMale: "Namiji",
  genderFemale: "Mace",
  genderOther: "Wani",
  sectionSymptoms: "02 — Alamomin Ciwo",
  selectedCount: "an zaɓa",
  otherSymptomsPlaceholder: "Kwatanta sauran alamomin ciwo...",
  sectionDuration: "03 — Tsawon Lokaci",
  sectionSeverity: "04 — Tsanani",
  submitBtn: "Sami Kimantawa →",
  analyzing: "Ana bincike",
  formDisclaimer: "Ilimin lafiya kawai — ba ganewar asali na likita ba. Koyaushe tuntuɓi mai ba da lafiya.",

  symptoms: ["Zazzaɓi","Ciwon kai","Rawar sanyi","Gajiya","Tashin zuciya","Amai","Gudawa","Ciwon ciki","Tari","Wahalar numfashi","Ciwon kirji","Ciwon makogwaro","Ciwon jiki","Ciwon gabbai","Kurji","Rawanin fata","Bakar fitsari","Zufa","Rashin ci","Rasa nauyi","Kumburen glandar","Ruwan gani","Tsauraran wuya","Rikicewa"],
  durations: ["Ƙasa da rana 1","Kwana 1–3","Kwana 4–7","Mako 1–2","Fiye da makonni 2"],
  severityMild: "Sauƙi",
  severityModerate: "Matsakaici",
  severitySevere: "Mai tsanani",

  resultTitle: "Sakamakon Kimantawa",
  urgencyLabel: "Matsayin Gaggawa",
  urgencyEmergency: "Nemi kula da lafiya nan take",
  urgencyHigh: "Ga likita cikin awanni 24",
  urgencyModerate: "Lura da kyau",
  urgencyLow: "Kulawa a gida mai yiyuwa ya isa",
  sectionConditions: "Yuwuwar Yanayi",
  sectionImmediate: "Matakai na Nan Take",
  sectionHomeCare: "Kulawa a Gida",
  sectionSeekCare: "Nemi Kulawa Idan",
  sectionPrevention: "Rigakafi",
  newAssessmentBtn: "Sabuwar Kimantawa",
  resultDisclaimer: "Wannan kimantawar na ilimin lafiya kawai kuma ba ta nuna shawara ko ganewar asali na likita ba. Don Allah tuntuɓi mai ba da lafiya mai cancanta. A gaggauta, tuntuɓi sabis na gaggawa na gida nan take.",
  emergencyCTA: "Kira Sabis na Gaggawa",
  emergencyNumber: "112",

  chooseLanguage: "Zaɓi yarenka",
  continueBtn: "Ci gaba",

  aiPromptLocale: "Amsa gaba ɗaya da Hausa.",
};

const am: Translations = {
  brand: "Africa Health",
  tagline: "በ AI የምልክት ምዘና",
  heroTitle: "የጤና መመሪያ",
  heroHighlight: "ለሁሉም።",
  heroSubtitle: "ለሰሃራ በረሃ በስተደቡብ አፍሪካ የተገነባ AI-ብቃት ምልክት ምዘና። ነፃ፣ ግላዊ፣ እና በቋንቋዎ ይገኛል።",
  statAssessments: "ምዘናዎች",
  statCountries: "አገሮች",
  statFree: "ነፃ",
  startAssessment: "ምዘና ጀምር",
  recentLabel: "የቅርብ ጊዜ",
  viewBtn: "ይመልከቱ →",
  disclaimer: "የጤና ትምህርት ብቻ — ለሙያዊ የሕክምና ክብካቤ ምትክ አይደለም። አደጋ ሲፈጠር፣ ወዲያው የአካባቢ የአደጋ አገልግሎቶችን ይደውሉ።",

  symptomTitle: "የምልክት ምዘና",
  symptomSubtitle: "ምርጥ ውጤቶችን ለማግኘት ሁሉንም ክፍሎች ይሙሉ",
  backBtn: "← ተመለስ",
  sectionPatient: "01 — የታካሚ መረጃ",
  agePlaceholder: "እድሜ",
  genderMale: "ወንድ",
  genderFemale: "ሴት",
  genderOther: "ሌላ",
  sectionSymptoms: "02 — ምልክቶች",
  selectedCount: "ተመርጠዋል",
  otherSymptomsPlaceholder: "ሌሎች ምልክቶችን ይግለጹ...",
  sectionDuration: "03 — ጊዜ",
  sectionSeverity: "04 — ክብደት",
  submitBtn: "ምዘና ያግኙ →",
  analyzing: "በመተንተን ላይ",
  formDisclaimer: "የጤና ትምህርት ብቻ — የሕክምና ምርመራ አይደለም። ሁልጊዜ የጤና ባለሙያ ያማክሩ።",

  symptoms: ["ትኩሳት","ራስ ምታት","ብርድ","ድካም","ማቅለሽለሽ","ማስታወክ","ተቅማጥ","የሆድ ህመም","ሳል","የትንፋሽ ችግር","የደረት ህመም","የጉሮሮ ህመም","የሰውነት ህመም","የመገጣጠሚያ ህመም","ሽፍታ","ቢጫ ቆዳ","ጥቁር ሽንት","ላብ","የምግብ ፍላጎት ማጣት","ክብደት መቀነስ","ያበጡ እጢዎች","የደበዘዘ እይታ","ጥሩ አንገት","ግራ መጋባት"],
  durations: ["ከ1 ቀን ያነሰ","1–3 ቀናት","4–7 ቀናት","1–2 ሳምንታት","ከ2 ሳምንታት በላይ"],
  severityMild: "ቀላል",
  severityModerate: "መካከለኛ",
  severitySevere: "ከባድ",

  resultTitle: "የምዘና ውጤቶች",
  urgencyLabel: "የአስቸኳይ ደረጃ",
  urgencyEmergency: "ወዲያው የሕክምና ክብካቤ ይፈልጉ",
  urgencyHigh: "በ24 ሰዓት ውስጥ ሐኪም ያብዱ",
  urgencyModerate: "በጥሞና ይከታተሉ",
  urgencyLow: "የቤት ክብካቤ በቂ ሊሆን ይችላል",
  sectionConditions: "ሊሆኑ የሚችሉ ሁኔታዎች",
  sectionImmediate: "ወዲያውኑ የሚወሰዱ እርምጃዎች",
  sectionHomeCare: "የቤት ክብካቤ",
  sectionSeekCare: "ከሆነ ህክምና ይፈልጉ",
  sectionPrevention: "መከላከል",
  newAssessmentBtn: "አዲስ ምዘና",
  resultDisclaimer: "ይህ ምዘና ለጤና ትምህርታዊ ዓላማዎች ብቻ ነው እና የሕክምና ምክር ወይም ምርመራ አይደለም። እባክዎ ብቁ የጤና ባለሙያ ያማክሩ። አደጋ ሲፈጠር፣ ወዲያው የአካባቢ የአደጋ አገልግሎቶችን ያናግሩ።",
  emergencyCTA: "የአደጋ አገልግሎቶችን ይደውሉ",
  emergencyNumber: "112",

  chooseLanguage: "ቋንቋዎን ይምረጡ",
  continueBtn: "ቀጥል",

  aiPromptLocale: "ሙሉ በሙሉ በአማርኛ ይመልሱ።",
};

export const TRANSLATIONS: Record<Language, Translations> = { en, fr, sw, ha, am };