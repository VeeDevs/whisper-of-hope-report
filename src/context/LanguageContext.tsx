
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
    chat: "Chat",
    
    // Home page
    whisperOfHope: "Whisper of Hope",
    safeAnonymousReporting: "Safe Anonymous Reporting",
    homeDescription: "An anonymous platform to report bullying incidents and support others in a safe environment.",
    viewReports: "View Reports",
    getStarted: "Get Started",
    learnMore: "Learn More",
    anonymousReporting: "Anonymous Reporting",
    anonymousReportingDesc: "Report incidents anonymously without fear of retaliation, using your unique anonymous ID.",
    communitySupport: "Community Support",
    communitySupportDesc: "Comment on reports to offer support and advice to others in need.",
    safeEnvironment: "Safe Environment",
    safeEnvironmentDesc: "A moderated platform created to foster a supportive and safe community.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    
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
    
    // Reports page
    communityReports: "Community Reports",
    communityHub: "Community Hub",
    shareReportsDesc: "Share reports, participate in polls, and find support",
    viewAnonymousReports: "View anonymous reports from the community",
    createReport: "Create Report",
    hideForm: "Hide Form",
    hide: "Hide",
    create: "Create",
    createPoll: "Create Poll",
    loginToReport: "Login to Report",
    loginToParticipate: "Login to Participate",
    noReportsYet: "No Reports Yet",
    beFirstToShare: "Be the first to share a report with the community.",
    createFirstReport: "Create First Report",
    noPolls: "No Polls Yet",
    createFirstPoll: "Create the first poll to gather community insights.",
    polls: "Polls",
    
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
    status: "I am a",
    student: "Student",
    working: "Working Professional",
    other: "Other",
    age: "Age",
    yourAge: "Your age",
    schoolUniversity: "School/University Name",
    workplace: "Workplace Name",
    schoolPlaceholder: "e.g., University of Cape Town",
    workplacePlaceholder: "e.g., ABC Company",
    institutionNote: "This will be displayed publicly next to your anonymous ID",
    registering: "Registering...",
    alreadyHaveAccount: "Already have an account?",
    
    // Login
    welcomeBack: "Welcome Back",
    loginToContinue: "Log in to continue your anonymous journey",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    loggingIn: "Logging in...",
    logIn: "Log in",
    dontHaveAccount: "Don't have an account?",
    
    // Crisis modal
    youAreNotAlone: "You Are Not Alone",
    crisisDetected: "We detected that you might be going through a difficult time. Here are resources that can help:",
    remember: "Remember:",
    youMatter: "You matter, your life has value, and there are people who want to help you.",
    iUnderstand: "I Understand",
    
    // Chat
    connectSupport: "Connect & Support",
    buildSupportNetwork: "Build your support network and join group discussions in a safe, anonymous environment",
    supportNetwork: "Support Network",
    discussionGroups: "Discussion Groups",
    selectConnection: "Select a connection or group to start chatting",
    
    // General
    anonymousId: "Anonymous ID",
    timeAgo: "ago",
    comment: "comment",
    comments: "comments",
    viewDetails: "View details",
    backToReports: "Back to Reports",
    reportNotFound: "Report Not Found",
    reportNotFoundDesc: "The report you're looking for doesn't exist or has been removed.",
    pageNotFound: "Page Not Found",
    pageNotFoundDesc: "The page you're looking for doesn't exist or has been moved.",
    returnHome: "Return Home",
    copyright: "Whisper of Hope ©",
    selectStatus: "Select status",
    
     // Auth
     signIn: "Sign In",
     signUp: "Sign Up", 
     email: "Email",
     counselor: "Counselor",
     administrator: "Administrator",
     signingIn: "Signing In...",
     signingUp: "Signing Up...",
     institution: "Institution (Optional)",
     institutionPlaceholder: "School, University, or Organization",
     userType: "User Type",
     checkEmail: "Please check your email for a confirmation link",
     loginFirst: "Please log in to access this feature",
     
     auth: {
       welcome: "Welcome to Whisper of Hope",
       subtitle: "Your safe space for anonymous support",
       signIn: "Sign In",
       signUp: "Sign Up", 
       email: "Email",
       password: "Password",
       username: "Username",
       institution: "Institution",
       institutionPlaceholder: "School, University, or Organization",
       userType: "User Type",
       student: "Student",
       working: "Working Professional",
       other: "Other",
       age: "Age",
       signingIn: "Signing In...",
       signingUp: "Signing Up...",
       checkEmail: "Please check your email for a confirmation link",
       loginFirst: "Please log in to access this feature"
     },
  },
  
  af: {
    // Navigation
    home: "Tuis",
    reports: "Verslae",
    about: "Omtrent",
    login: "Aanmeld",
    register: "Registreer",
    logout: "Afmeld",
    chat: "Gesels",
    
    // Home page
    whisperOfHope: "Fluistering van Hoop",
    safeAnonymousReporting: "Veilige Anonieme Rapportering",
    homeDescription: "ʼn Anonieme platform vir die rapportering van boelie en ondersteuning van ander in ʼn veilige omgewing.",
    viewReports: "Bekyk Verslae",
    getStarted: "Begin",
    learnMore: "Leer Meer",
    anonymousReporting: "Anonieme Rapportering",
    anonymousReportingDesc: "Rapporteer voorvalle anoniem sonder vrees vir wraak, met jou unieke anonieme ID.",
    communitySupport: "Gemeenskapsondersteuning",
    communitySupportDesc: "Kommentaar op verslae om ondersteuning en raad aan ander in nood te bied.",
    safeEnvironment: "Veilige Omgewing",
    safeEnvironmentDesc: "ʼn Gemodereerde platform geskep om ʼn ondersteunende en veilige gemeenskap te bevorder.",
    terms: "Voorwaardes",
    privacy: "Privaatheid",
    contact: "Kontak",
    
    // About page
    aboutWhisperOfHope: "Oor Fluistering van Hoop",
    aboutDescription: "ʼn Veilige, anonieme platform geskep om mense te help om boelievoorvalle aan te meld en mekaar te ondersteun.",
    ourMission: "Ons Missie",
    ourMissionText: "Fluistering van Hoop is geskep met ʼn eenvoudige maar kragtige missie: om ʼn veilige ruimte te bied waar enigeen wat boelie ervaar of dit waarneem hul stories anoniem kan deel.",
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
    
    // Reports page
    communityHub: "Gemeenskapshub",
    shareReportsDesc: "Deel verslae, neem deel aan peiling, en vind ondersteuning",
    createReport: "Skep Verslag",
    hide: "Versteek",
    create: "Skep",
    createPoll: "Skep Peiling",
    loginToParticipate: "Meld aan om Deel te neem",
    noReportsYet: "Nog Geen Verslae Nie",
    beFirstToShare: "Wees die eerste om ʼn verslag met die gemeenskap te deel.",
    createFirstReport: "Skep Eerste Verslag",
    noPolls: "Nog Geen Peilings Nie",
    createFirstPoll: "Skep die eerste peiling om gemeenskapsinsigte te versamel.",
    polls: "Peilings",
    
    // Forms
    createAnonymousReport: "Skep Anonieme Verslag",
    reportWillBeAnonymous: "Jou verslag sal anoniem wees. Slegs jou anonieme ID sal sigbaar wees.",
    title: "Titel",
    briefTitle: "Kort titel van jou verslag",
    reportDetails: "Verslag Besonderhede",
    describeInDetail: "Beskryf die situasie in detail...",
    submitReport: "Dien Verslag In",
    
    // Registration
    createAccount: "Skep ʼn Rekening",
    registerForAnonymousId: "Registreer om jou unieke anonieme identiteit te kry",
    username: "Gebruikersnaam",
    chooseUsername: "Kies ʼn gebruikersnaam",
    password: "Wagwoord",
    choosePassword: "Kies ʼn wagwoord",
    passwordStoredLocally: "*Wagwoord word plaaslik gestoor en word slegs gebruik om jou identiteit te verifieer",
    status: "Ek is ʼn",
    student: "Student",
    working: "Werkende Professioneel",
    other: "Ander",
    age: "Ouderdom",
    yourAge: "Jou ouderdom",
    schoolUniversity: "Skool/Universiteit Naam",
    workplace: "Werkplek Naam",
    schoolPlaceholder: "bv., Universiteit van Kaapstad",
    workplacePlaceholder: "bv., ABC Maatskappy",
    institutionNote: "Dit sal openlik langs jou anonieme ID vertoon word",
    registering: "Registreer...",
    alreadyHaveAccount: "Het reeds ʼn rekening?",
    
    // Login
    welcomeBack: "Welkom Terug",
    loginToContinue: "Meld aan om jou anonieme reis voort te sit",
    enterUsername: "Voer jou gebruikersnaam in",
    enterPassword: "Voer jou wagwoord in",
    loggingIn: "Meld aan...",
    logIn: "Meld aan",
    dontHaveAccount: "Het nie ʼn rekening nie?",
    
    // Crisis modal
    youAreNotAlone: "Jy is Nie Alleen Nie",
    crisisDetected: "Ons het opgespoor dat jy dalk deur ʼn moeilike tyd gaan. Hier is hulpbronne wat kan help:",
    iUnderstand: "Ek Verstaan",
    remember: "Onthou:",
    youMatter: "Jy maak saak, jou lewe het waarde, en daar is mense wat jou wil help.",
    
    // Chat
    connectSupport: "Verbind & Ondersteun",
    buildSupportNetwork: "Bou jou ondersteuningsnetwerk en sluit aan by groepbesprekings in ʼn veilige, anonieme omgewing",
    supportNetwork: "Ondersteuningsnetwerk",
    discussionGroups: "Besprekingsgroepe",
    selectConnection: "Kies ʼn verbinding of groep om te begin gesels",
    
    // General
    anonymousId: "Anonieme ID",
    copyright: "Fluistering van Hoop ©",
    selectStatus: "Kies status",
    pageNotFound: "Bladsy Nie Gevind Nie",
    pageNotFoundDesc: "Die bladsy waarna jy soek bestaan nie of is geskuif.",
    returnHome: "Keer Terug Huis",
  },
  
  zu: {
    // Navigation
    home: "Ikhaya",
    reports: "Imibiko",
    about: "Mayelana",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    chat: "Xoxa",
    
    // Home page
    whisperOfHope: "Ukunyenyeza Kwethemba",
    safeAnonymousReporting: "Ukubika Okuphephile Okungaboniswi",
    homeDescription: "Inkundla engaboniswi yokubika ukucindezela nokusekela abanye endaweni ephephile.",
    viewReports: "Buka Imibiko",
    getStarted: "Qala",
    learnMore: "Funda Kabanzi",
    anonymousReporting: "Ukubika Okungaboniswi",
    anonymousReportingDesc: "Bika izigameko ngaphandle kokuboniswa ngaphandle kokwesaba ukuphindisela, usebenzisa i-ID yakho engaboniswi.",
    communitySupport: "Ukusekela Komphakathi",
    communitySupportDesc: "Phawula emibikweni ukuze unikeze ukusekela neseluleko kwabanye abasesidingeni.",
    safeEnvironment: "Indawo Ephephile",
    safeEnvironmentDesc: "Inkundla elawulwayo edalwe ukuze ikhuthaze umphakathi osekelanayo nophephile.",
    
    // About page
    aboutWhisperOfHope: "Mayelana Nokunyenyeza Kwethemba",
    aboutDescription: "Inkundla ephephile, engaboniswi eyenzelwe ukusiza abantu ukuthi babike izigameko zokucindezela futhi basekelane.",
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
    
    // Reports page
    communityHub: "Isikhungo Somphakathi",
    shareReportsDesc: "Yabelana ngemibiko, bamba iqhaza ezinhlolisweni, futhi uthole ukusekela",
    createReport: "Dala Umbiko",
    hide: "Fihla",
    create: "Dala",
    createPoll: "Dala Inhloliswa",
    loginToParticipate: "Ngena Ukuze Ubambe Iqhaza",
    noReportsYet: "Ayikho Imibiko Okwamanje",
    beFirstToShare: "Yiba owokuqala ukwabelana ngombiko nomphakathi.",
    createFirstReport: "Dala Umbiko Wokuqala",
    noPolls: "Azikho Izinhloliswa Okwamanje",
    createFirstPoll: "Dala inhloliswa yokuqala ukuze uqoqe imibono yomphakathi.",
    polls: "Izinhloliswa",
    
    // Registration
    createAccount: "Dala I-akhawunti",
    registerForAnonymousId: "Bhalisa ukuze uthole ubunyangasho bakho obungaboniswi obuhlukile",
    username: "Igama lomsebenzisi",
    chooseUsername: "Khetha igama lomsebenzisi",
    password: "Iphasiwedi",
    choosePassword: "Khetha iphasiwedi",
    status: "Ngingu",
    student: "Umfundi",
    working: "Uchwepheshe Osebenzayo",
    other: "Okunye",
    age: "Iminyaka",
    yourAge: "Iminyaka yakho",
    schoolUniversity: "Igama Lesikole/Inyuvesi",
    workplace: "Igama Lendawo Yokusebenza",
    registering: "Iyabhalisa...",
    alreadyHaveAccount: "Usena i-akhawunti?",
    
    // Login
    welcomeBack: "Siyakwamukela Futhi",
    loginToContinue: "Ngena ukuze uqhubeke nohambo lwakho olungaboniswi",
    enterUsername: "Faka igama lakho lomsebenzisi",
    enterPassword: "Faka iphasiwedi yakho",
    loggingIn: "Iyangena...",
    logIn: "Ngena",
    dontHaveAccount: "Awuna i-akhawunti?",
    
    // Crisis modal
    youAreNotAlone: "Awuwedwa",
    crisisDetected: "Sibone ukuthi mhlawumbe udlula esikhathini esinzima. Nazi izinsiza ezingakusiza:",
    iUnderstand: "Ngiyaqonda",
    
    // General
    anonymousId: "I-ID Engaboniswi",
    copyright: "Ukunyenyeza Kwethemba ©",
    selectStatus: "Khetha isimo",
    pageNotFound: "Ikhasi Alitholakali",
    pageNotFoundDesc: "Ikhasi olifunayo alikhona noma lishintshiwe.",
    returnHome: "Buyela Ekhaya",
  },
  
  xh: {
    // Navigation
    home: "Ikhaya",
    reports: "Iingxelo",
    about: "Malunga",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    chat: "Ncokola",
    
    // Home page
    whisperOfHope: "Ukusebeza Kwethemba",
    safeAnonymousReporting: "Ukuxela Okukhuselekileyo Okungaboniswi",
    homeDescription: "Iqonga elingaboniswi lokuxela ukuxhaphaza nokuxhasa abanye kwindawo ekhuselekileyo.",
    viewReports: "Jonga Iingxelo",
    getStarted: "Qala",
    learnMore: "Funda Ngakumbi",
    
    // About page
    aboutWhisperOfHope: "Malunga Nokusebeza Kwethemba",
    aboutDescription: "Iqonga elikhuselekileyo, elingaboniswi elenzelwe ukunceda abantu ukuba baxele iziganeko zokuxhaphaza kwaye baxhasane.",
    needImmediateHelp: "Ufuna Uncedo Ngoko Nangoko?",
    immediateHelpText: "Ukuba wena okanye umntu omwaziyo usengozini ngokukhawuleza, nceda uqhagamshelane neenkonzo zongxamiseko zasekhaya okanye usebenzise ezi zixhobo zikhethekileyo:",
    emergencyNumbers: "Amanani kaNgxamiseko",
    nationalEmergency: "Ungxamiseko lweSizwe",
    policeEmergency: "Ungxamiseko lwamaPolisa",
    medicalEmergency: "Ungxamiseko lwezonyango",
    
    // Registration
    createAccount: "Yenza iAkhawunti",
    username: "Igama lomsebenzisi",
    password: "Iphaswedi",
    status: "Ndingu",
    student: "Umfundi",
    working: "Ingcali eSebenzayo",
    other: "Okunye",
    age: "Ubudala",
    registering: "Iyabhalisa...",
    
    // General
    anonymousId: "I-ID Engaboniswi",
    copyright: "Ukusebeza Kwethemba ©",
    pageNotFound: "Iphepha Alifumanekanga",
    returnHome: "Buyela Ekhaya",
  },
  
  st: {
    // Navigation  
    home: "Lapeng",
    reports: "Tlaleho",
    about: "Ka",
    login: "Kena",
    register: "Ingodisa",
    logout: "Tswa",
    chat: "Buisana",
    
    // Home page
    whisperOfHope: "Lebitso la Tshepo",
    safeAnonymousReporting: "Tlaleho e Bolokehileng e sa Tsebahaleng",
    homeDescription: "Sethala se sa tsebahaleng sa ho tlaleha diketsahalo tsa thibelo le ho tshehetsa ba bang sebakeng se sireletsehileng.",
    
    // About page
    aboutWhisperOfHope: "Ka Lebitso la Tshepo",
    aboutDescription: "Sethala se sireletsehileng, se sa tsebahaleng se entsoeng ho thusa batho ho tlaleha ditiragalo tsa thibelo le ho thusana.",
    needImmediateHelp: "O hloka Thuso ka Potlako?",
    
    // Registration
    createAccount: "Etsa Akhaonto",
    username: "Lebitso la mosebedisi",
    password: "Phaswete",
    status: "Ke",
    student: "Moithuti",
    age: "Dilemo",
    registering: "E ngodisa...",
    
    // General
    copyright: "Lebitso la Tshepo ©",
    pageNotFound: "Leqephe ha le Fumanehe",
    returnHome: "Kgutlela Lapeng",
  },
  
  ve: {
    // Navigation
    home: "Hayani",
    reports: "Mitaladzo",
    about: "Nga ha",
    login: "Pinda",
    register: "Nwalisa",
    logout: "Buda",
    chat: "Amba",
    
    // Home page
    whisperOfHope: "Tshikhudo tsha Themba",
    
    // About page
    aboutWhisperOfHope: "Nga ha Tshikhudo tsha Themba",
    aboutDescription: "Thulamela ya vhutshilo, yo songo divhadzwaho yo itaho u thusa vhathu u khou rangela zwitshinyatshinya na u thusana.",
    needImmediateHelp: "Ni toda Thuso na Lunyilo?",
    
    // Registration
    createAccount: "Itani Akhantu",
    username: "Dzina la mushumisi",
    password: "Phasiwe",
    age: "Minwaha",
    
    // General
    copyright: "Tshikhudo tsha Themba ©",
    pageNotFound: "Tsihalo a tshi Ngo Wanala",
    returnHome: "Vhuyelani Hayani",
  },
  
  ts: {
    // Navigation
    home: "Kaya",
    reports: "Swiviko",
    about: "Mayelana na",
    login: "Ngena", 
    register: "Tsalela",
    logout: "Huma",
    chat: "Vulavula",
    
    // Home page
    whisperOfHope: "Ku Hlanganisa ka Themba",
    
    // About page
    aboutWhisperOfHope: "Mayelana na ku Hlanganisa ka Themba",
    aboutDescription: "Pulatifomo yo sirheleka, yo nga vonakali yo endleriwa ku pfuna vanhu ku vika swiendlakalo swa ku rharhela na ku tirhisana.",
    needImmediateHelp: "U lava Mpfuno hi ku Hatlisa?",
    
    // Registration
    createAccount: "Endla Akhawunti",
    username: "Vito ra mutirhisi",
    password: "Phasiwe",
    age: "Malembe",
    
    // General
    copyright: "Ku Hlanganisa ka Themba ©",
    pageNotFound: "Tluka ri nga Kumeki",
    returnHome: "Vuya Kaya",
  },
  
  nr: {
    // Navigation
    home: "Ekhaya",
    reports: "Imibhalo", 
    about: "Ngenxa",
    login: "Ngena",
    register: "Bhalisa",
    logout: "Phuma",
    chat: "Khuluma",
    
    // Home page
    whisperOfHope: "Ukusebeza Kwethemba",
    
    // About page
    aboutWhisperOfHope: "Ngenxa Yokusebeza Kwethemba",
    aboutDescription: "Inkundla ephephile, engaboniswi eyenzelwe ukusiza abantu ukuthi babike izigameko zokucindezela futhi basekelane.",
    needImmediateHelp: "Ufuna Usizo Ngokushesha?",
    
    // Registration
    createAccount: "Dala I-akhawunti",
    username: "Igama lomsebenzisi",
    password: "Iphasiwedi",
    age: "Iminyaka",
    
    // General
    copyright: "Ukusebeza Kwethemba ©",
    pageNotFound: "Ikhasi Alitholakali",
    returnHome: "Buyela Ekhaya",
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
