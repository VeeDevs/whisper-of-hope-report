
import React, { createContext, useContext, ReactNode, useState } from "react";

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
    suicideCrisisLine: "Suicide Crisis Line",
    crisis247: "24/7 crisis counseling",
    childlineSA: "Childline South Africa",
    supportForChildren: "Support for children and teens",
    gbvCommandCentre: "GBV Command Centre",
    gbvSupport: "Gender-based violence support",
    sadagMentalHealth: "SADAG Mental Health Line",
    mentalHealthSupport: "Mental health support",
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
    
    // Reports
    communityReports: "Gemeenskapsverslae",
    viewAnonymousReports: "Bekyk anonieme verslae van die gemeenskap",
    createReport: "Skep Verslag",
    hideForm: "Versteek Vorm",
    loginToReport: "Aanmeld om te Rapporteer",
    noReportsYet: "Geen Verslae Nog Nie",
    beFirstToShare: "Wees die eerste om ʼn verslag met die gemeenskap te deel.",
    createFirstReport: "Skep Eerste Verslag",
    
    // Crisis modal
    youAreNotAlone: "Jy is Nie Alleen Nie",
    crisisDetected: "Ons het opgespoor dat jy dalk deur ʼn moeilike tyd gaan. Hier is hulpbronne wat kan help:",
    iUnderstand: "Ek Verstaan",
    
    // General
    anonymousId: "Anonieme ID",
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
    
    // Crisis modal
    youAreNotAlone: "Kawuwedwa",
    iUnderstand: "Ngiyezwa",
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('whisper_language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  React.useEffect(() => {
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
