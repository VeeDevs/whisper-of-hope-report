import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

export type SupportedLanguage = 'en' | 'af' | 'zu' | 'xh' | 'st' | 've' | 'ts' | 'nr';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: "Home",
    reports: "Reports",
    about: "About",
    login: "Login",
    register: "Register",
    logout: "Logout",
    
    // Home page
    whisperOfHope: "Whisper of Hope",
    safeAnonymousReporting: "Safe Anonymous Reporting",
    homeDescription: "A secure platform for reporting bullying and harassment anonymously in South Africa.",
    viewReports: "View Reports",
    getStarted: "Get Started",
    
    // About page
    aboutWhisperOfHope: "About Whisper of Hope",
    aboutDescription: "A safe, anonymous platform created to help people report bullying incidents and support each other.",
    ourMission: "Our Mission",
    ourMissionText: "Whisper of Hope was created with a simple yet powerful mission: to provide a safe space where anyone experiencing bullying or witnessing it can share their stories anonymously. We believe that by breaking the silence around bullying, we can help create safer communities and support those who need it most.",
    howAnonymityWorks: "How Anonymity Works",
    howAnonymityWorksText: "When you register on Whisper of Hope, you're assigned a unique anonymous ID that will be used instead of your real name when you post reports or comments. Your personal information is never shared with other users, ensuring your privacy and safety. This anonymity allows people to speak freely about sensitive situations without fear of retaliation.",
    communityGuidelines: "Community Guidelines",
    communityGuidelinesText: "While anonymity provides freedom, it also comes with responsibility. We expect all members of our community to adhere to these basic guidelines:",
    guidelineRespectful: "Be respectful and supportive in your comments",
    guidelineNoIdentifying: "Do not share identifying information about yourself or others",
    guidelineReportAbuse: "Report abuse or harmful content",
    guidelineIntendedPurpose: "Use the platform for its intended purpose of support and awareness",
    guidelineRealPeople: "Remember that real people are behind every report",
    needImmediateHelp: "Need Immediate Help?",
    immediateHelpText: "If you or someone you know is in immediate danger, please contact local emergency services or use these specialized resources:",
    emergencyNumbers: "Emergency Numbers",
    nationalEmergency: "National Emergency",
    policeEmergency: "Police Emergency",
    medicalEmergency: "Medical Emergency",
    crisisSupport: "Crisis Support Services",
    suicideCrisisLine: "Suicide Crisis Line",
    crisis247: "24/7 crisis counseling",
    childlineSA: "Childline South Africa",
    supportForChildren: "Support for children and teens",
    gbvCommandCentre: "GBV Command Centre",
    gbvSupport: "Gender-based violence support",
    sadagMentalHealth: "SADAG Mental Health Line",
    mentalHealthSupport: "Mental health support",
    safeline: "Safeline",
    traumaCounseling: "Trauma counseling and support",
    lifelineNorthern: "Lifeline Northern Cape",
    emotionalSupport: "Emotional support and counseling",
    relevantFoundations: "Relevant Foundations & Organizations",
    famsa: "FAMSA (Family and Marriage Society of SA)",
    famsaDescription: "Family counseling and social services",
    tears: "TEARS Foundation",
    tearsDescription: "Support for victims of crime and violence",
    mosaic: "Mosaic Training Service & Healing Centre",
    mosaicDescription: "Training and healing for trauma survivors",
    rape: "Rape Crisis Cape Town Trust",
    rapeDescription: "Support for survivors of sexual violence",
    
    // Reports
    communityReports: "Community Reports",
    viewAnonymousReports: "View anonymous reports from the community",
    createReport: "Create Report",
    hideForm: "Hide Form",
    loginToReport: "Login to Report",
    noReportsYet: "No Reports Yet",
    beFirstToShare: "Be the first to share a report with the community.",
    createFirstReport: "Create First Report",
    
    // Forms
    createAnonymousReport: "Create Anonymous Report",
    reportWillBeAnonymous: "Your report will be anonymous. Only your anonymous ID will be visible.",
    title: "Title",
    briefTitle: "Brief title of your report",
    reportDetails: "Report Details",
    describeInDetail: "Describe the situation in detail...",
    submitReport: "Submit Report",
    
    // Comments
    addComment: "Add a Comment",
    shareThoughts: "Share your thoughts or support...",
    postComment: "Post Comment",
    pleaseLoginToComment: "Please login to comment",
    noCommentsYet: "No comments yet. Be the first to comment!",
    
    // Registration
    createAccount: "Create an Account",
    registerForAnonymousId: "Register to get your unique anonymous identity",
    username: "Username",
    chooseUsername: "Choose a username",
    password: "Password",
    choosePassword: "Choose a password",
    passwordStoredLocally: "*Password is stored locally and only used to verify your identity",
    status: "Status",
    student: "Student",
    working: "Working",
    other: "Other",
    schoolUniversity: "School/University",
    workplace: "Workplace",
    registering: "Registering...",
    alreadyHaveAccount: "Already have an account?",
    
    // Crisis modal
    youAreNotAlone: "You Are Not Alone",
    crisisDetected: "We detected that you might be going through a difficult time. Here are resources that can help:",
    remember: "Remember:",
    youMatter: "You matter, your life has value, and there are people who want to help you.",
    iUnderstand: "I Understand",
    
    // General
    anonymousId: "Anonymous ID",
    timeAgo: "ago",
    comment: "comment",
    comments: "comments",
    viewDetails: "View details",
    backToReports: "Back to Reports",
    reportNotFound: "Report Not Found",
    reportNotFoundDesc: "The report you're looking for doesn't exist or has been removed.",
    copyright: "Whisper of Hope ©",
  },
  
  af: {
    // Navigation
    home: "Tuis",
    reports: "Verslae",
    about: "Omtrent",
    login: "Aanmeld",
    register: "Registreer",
    logout: "Afmeld",
    
    // Home page
    whisperOfHope: "Fluistering van Hoop",
    safeAnonymousReporting: "Veilige Anonieme Rapportering",
    homeDescription: "ʼn Veilige platform vir die anonieme rapportering van boelie en intimidasie in Suid-Afrika.",
    viewReports: "Bekyk Verslae",
    getStarted: "Begin",
    
    // About page
    aboutWhisperOfHope: "Oor Fluistering van Hoop",
    aboutDescription: "ʼn Veilige, anonieme platform geskep om mense te help om boelievoorvalle aan te meld en mekaar te ondersteun.",
    ourMission: "Ons Missie",
    ourMissionText: "Fluistering van Hoop is geskep met ʼn eenvoudige maar kragtige missie: om ʼn veilige ruimte te bied waar enigeen wat boelie ervaar of dit waarneem hul stories anoniem kan deel.",
    howAnonymityWorks: "Hoe Anonimiteit Werk",
    howAnonymityWorksText: "Wanneer jy by Fluistering van Hoop registreer, kry jy ʼn unieke anonieme ID wat gebruik sal word in plaas van jou regte naam wanneer jy verslae of kommentaar plaas.",
    communityGuidelines: "Gemeenskapsriglyne",
    communityGuidelinesText: "Alhoewel anonimiteit vryheid bied, kom dit ook met verantwoordelikheid. Ons verwag dat alle lede van ons gemeenskap hierdie basiese riglyne volg:",
    guidelineRespectful: "Wees respekvol en ondersteunend in jou kommentaar",
    guidelineNoIdentifying: "Deel nie identifiserende inligting oor jouself of ander nie",
    guidelineReportAbuse: "Rapporteer misbruik of skadelike inhoud",
    guidelineIntendedPurpose: "Gebruik die platform vir sy bedoelde doel van ondersteuning en bewustheid",
    guidelineRealPeople: "Onthou dat regte mense agter elke verslag is",
    needImmediateHelp: "Het Onmiddellike Hulp Nodig?",
    immediateHelpText: "As jy of iemand wat jy ken in onmiddellike gevaar is, kontak asseblief plaaslike nooddienste of gebruik hierdie gespesialiseerde hulpbronne:",
    emergencyNumbers: "Noodnommers",
    nationalEmergency: "Nasionale Noodgeval",
    policeEmergency: "Polisie Noodgeval",
    medicalEmergency: "Mediese Noodgeval",
    crisisSupport: "Krisishulpdienste",
    suicideCrisisLine: "Selfmoord Krisisllyn",
    crisis247: "24/7 krisisberading",
    childlineSA: "Childline Suid-Afrika",
    supportForChildren: "Ondersteuning vir kinders en tieners",
    gbvCommandCentre: "GBV Bevelsentrum",
    gbvSupport: "Geslagsgebaseerde geweld ondersteuning",
    sadagMentalHealth: "SADAG Geestesgesondheid Lyn",
    mentalHealthSupport: "Geestesgesondheid ondersteuning",
    safeline: "Safeline",
    traumaCounseling: "Trauma berading en ondersteuning",
    lifelineNorthern: "Lifeline Noord-Kaap",
    emotionalSupport: "Emosionele ondersteuning en berading",
    relevantFoundations: "Relevante Stigtings & Organisasies",
    famsa: "FAMSA (Familie en Huwelik Vereniging van SA)",
    famsaDescription: "Familie berading en sosiale dienste",
    tears: "TEARS Stigting",
    tearsDescription: "Ondersteuning vir slagoffers van misdaad en geweld",
    mosaic: "Mosaic Opleidingsdiens & Genesing Sentrum",
    mosaicDescription: "Opleiding en genesing vir trauma oorlewendes",
    rape: "Verkragting Krisis Kaapstad Trust",
    rapeDescription: "Ondersteuning vir oorlewendes van seksuele geweld",
    copyright: "Fluistering van Hoop ©",
    
    // Crisis modal
    youAreNotAlone: "Jy is Nie Alleen Nie",
    crisisDetected: "Ons het opgespoor dat jy dalk deur ʼn moeilike tyd gaan. Hier is hulpbronne wat kan help:",
    iUnderstand: "Ek Verstaan",
    remember: "Onthou:",
    youMatter: "Jy maak saak, jou lewe het waarde, en daar is mense wat jou wil help.",
    
    // General
    anonymousId: "Anonieme ID",
    copyright: "Fluistering van Hoop ©",
  },
  
  zu: {
    // Navigation
    home: "Ikhaya",
    reports: "Imibiko",
    about: "Mayelana",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    
    // Home page
    whisperOfHope: "Ukunyenyeza Kwethemba",
    safeAnonymousReporting: "Ukubika Okuphephile Okungaboniswi",
    homeDescription: "Inkundla ephephile yokubika ukucindezela nokuhlukunyezwa ngaphandle kokuboniswa eNingizimu Afrika.",
    viewReports: "Buka Imibiko",
    getStarted: "Qala",
    
    // About page
    aboutWhisperOfHope: "Mayelana Nokunyenyeza Kwethemba",
    aboutDescription: "Inkundla ephephile, engaboniswi eyenzelwe ukusiza abantu ukuthi babike izigameko zokucindezela futhi basekelane.",
    ourMission: "Umgomo Wethu",
    ourMissionText: "Ukunyenyeza Kwethemba kwadalwa ngomgomo olula kodwa onamandla: ukuhlinzeka ngendawo ephephile lapho noma ubani ohlukunyezwa noma okubonayo angabelana ngezindaba zakhe ngaphandle kokuboniswa.",
    needImmediateHelp: "Udinga Usizo Olusheshayo?",
    immediateHelpText: "Uma wena noma othile omwaziyo usengozini esheshayo, sicela uthintane nezinsiza zasendaweni noma usebenzise lezi zinsiza ezikhethekileyo:",
    emergencyNumbers: "Izinombolo Zesimo Esiphuthumayo",
    nationalEmergency: "Isimo Esiphuthumayo Sesizwe",
    policeEmergency: "Isimo Esiphuthumayo Samaphoyisa",
    medicalEmergency: "Isimo Esiphuthumayo Lwezonyango",
    crisisSupport: "Izinsiza Zokusekela Esikhathi Esinzima",
    suicideCrisisLine: "Ulayini Wesimo Esiphuthumayo Sokuzibulala",
    crisis247: "Ukululekwa kwesikhathi esinzima okungu-24/7",
    childlineSA: "I-Childline eNingizimu Afrika",
    supportForChildren: "Ukusekela izingane nabafikisayo",
    copyright: "Ukunyenyeza Kwethemba ©",
    
    // Crisis modal
    youAreNotAlone: "Awuwedwa",
    crisisDetected: "Sibone ukuthi mhlawumbe udlula esikhathini esinzima. Nazi izinsiza ezingakusiza:",
    iUnderstand: "Ngiyaqonda",
    
    // General
    anonymousId: "I-ID Engaboniswi",
  },
  
  xh: {
    // Navigation
    home: "Ikhaya",
    reports: "Iingxelo",
    about: "Malunga",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    
    // Home page
    whisperOfHope: "Ukusebeza Kwethemba",
    safeAnonymousReporting: "Ukuxela Okukhuselekileyo Okungaboniswi",
    homeDescription: "Iqonga elikhuselekileyo lokuxela ukuxhaphaza nokuhlukunyezwa ngaphandle kokuboniswa eMzantsi Afrika.",
    
    // About page
    aboutWhisperOfHope: "Malunga Nokusebeza Kwethemba",
    aboutDescription: "Iqonga elikhuselekileyo, elingaboniswi elenzelwe ukunceda abantu ukuba baxele iziganeko zokuxhaphaza kwaye baxhasane.",
    needImmediateHelp: "Ufuna Uncedo Ngoko Nangoko?",
    immediateHelpText: "Ukuba wena okanye umntu omwaziyo usengozini ngokukhawuleza, nceda uqhagamshelane neenkonzo zongxamiseko zasekhaya okanye usebenzise ezi zixhobo zikhethekileyo:",
    emergencyNumbers: "Amanani kaNgxamiseko",
    nationalEmergency: "Ungxamiseko lweSizwe",
    policeEmergency: "Ungxamiseko lwamaPolisa",
    medicalEmergency: "Ungxamiseko lwezonyango",
    copyright: "Ukusebeza Kwethemba ©",
    
    // Crisis modal
    youAreNotAlone: "Awukho Wedwa",
    crisisDetected: "Sibone ukuba mhlawumbe udlula kwixesha elinzima. Nazi izixhobo ezinokukunceda:",
    iUnderstand: "Ndiyaqonda",
    
    // General
    anonymousId: "I-ID Engaboniswi",
  },
  
  st: {
    // Navigation  
    home: "Lapeng",
    reports: "Tlaleho",
    about: "Ka",
    login: "Kena",
    register: "Ingodisa",
    logout: "Tswa",
    
    // About page
    aboutWhisperOfHope: "Ka Lebitso la Tshepo",
    aboutDescription: "Sethala se sireletsehileng, se sa tsebahaleng se entsoeng ho thusa batho ho tlaleha ditiragalo tsa thibelo le ho thusana.",
    needImmediateHelp: "O hloka Thuso ka Potlako?",
    copyright: "Lebitso la Tshepo ©",
    
    // Crisis modal
    youAreNotAlone: "Ha o le Mong",
    iUnderstand: "Kea Utloisisa",
  },
  
  ve: {
    // Navigation
    home: "Hayani",
    reports: "Mitaladzo",
    about: "Nga ha",
    login: "Pinda",
    register: "Nwalisa",
    logout: "Buda",
    
    // About page
    aboutWhisperOfHope: "Nga ha Tshikhudo tsha Themba",
    aboutDescription: "Thulamela ya vhutshilo, yo songo divhadzwaho yo itaho u thusa vhathu u khou rangela zwitshinyatshinya na u thusana.",
    needImmediateHelp: "Ni toda Thuso na Lunyilo?",
    copyright: "Tshikhudo tsha Themba ©",
    
    // Crisis modal
    youAreNotAlone: "A ni Nwani",
    iUnderstand: "Ndi a Pfesesa",
  },
  
  ts: {
    // Navigation
    home: "Kaya",
    reports: "Swiviko",
    about: "Mayelana na",
    login: "Ngena", 
    register: "Tsalela",
    logout: "Huma",
    
    // About page
    aboutWhisperOfHope: "Mayelana na ku Hlanganisa ka Themba",
    aboutDescription: "Pulatifomo yo sirheleka, yo nga vonakali yo endleriwa ku pfuna vanhu ku vika swiendlakalo swa ku rharhela na ku tirhisana.",
    needImmediateHelp: "U lava Mpfuno hi ku Hatlisa?",
    copyright: "Ku Hlanganisa ka Themba ©",
    
    // Crisis modal
    youAreNotAlone: "A wu nga Nweni",
    iUnderstand: "Ndzi a Twisisa",
  },
  
  nr: {
    // Navigation
    home: "Ekhaya",
    reports: "Imibhalo", 
    about: "Ngenxa",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    
    // About page
    aboutWhisperOfHope: "Ngenxa Yokusebeza Kwethemba",
    aboutDescription: "Inkundla ephephile, engaboniswi eyenzelwe ukusiza abantu ukuthi babike izigameko zokucindezela futhi basekelane.",
    needImmediateHelp: "Ufuna Usizo Ngokushesha?",
    copyright: "Ukusebeza Kwethemba ©",
    
    // Crisis modal
    youAreNotAlone: "Kawuwedwa",
    iUnderstand: "Ngiyezwa",
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('whisper_language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('whisper_language') as SupportedLanguage;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
