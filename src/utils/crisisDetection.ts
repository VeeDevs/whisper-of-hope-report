
const CRISIS_KEYWORDS = [
  // English
  'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
  'not worth living', 'better off dead', 'want to die', 'take my life',
  
  // Afrikaans
  'selfmoord', 'dood maak', 'seermaak', 'my lewe beëindig', 'wil sterf',
  'nie werd om te leef nie', 'beter dood', 'my lewe neem',
  
  // isiZulu
  'ukuzibulala', 'ukuzilimaza', 'ngifuna ukufa', 'angifuni ukuphila',
  'ngingcono ngifile', 'ngizozibulala', 'ukuphila akusho lutho',
  
  // isiXhosa
  'ukuzibulala', 'ukuzenzakalisa', 'ndifuna ukufa', 'andifuni ukuphila',
  'ndingcono ndifile', 'ndizozibulala', 'ubomi abunanto',
  
  // Sesotho
  'ho ipolaea', 'ho itima', 'ke batla ho shwa', 'ha ke batle ho phela',
  'ke molemo ha ke shwele', 'bophelo ha bo na bokgoni',
  
  // Tshivenda
  'u lwela vhutshilo', 'ndi do fara', 'a thi funi u phila',
  'ndo naka ndi shone', 'vhutshilo a vhu na ndeme',
  
  // Xitsonga
  'ku tifela', 'ndzi lava ku fa', 'a ndzi lavi ku hanya',
  'ndzi ta va ndzi file', 'vutomi a byi na nkoka',
  
  // isiNdebele
  'ukuzibulala', 'ngifuna ukufa', 'angifuni ukuphila',
  'ngingcono ngifile', 'ukuphila akusho lutho'
];

export const detectCrisisContent = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export const getSouthAfricanEmergencyContacts = () => ({
  suicideCrisis: {
    name: "Suicide Crisis Line",
    number: "0800 567 567", 
    description: "24/7 crisis counseling"
  },
  childline: {
    name: "Childline South Africa",
    number: "0800 055 555",
    description: "Support for children and teens"
  },
  gbvCommand: {
    name: "GBV Command Centre", 
    number: "0800 428 428",
    description: "Gender-based violence support"
  },
  sadag: {
    name: "SADAG Mental Health Line",
    number: "011 234 4837",
    description: "Mental health support"
  }
});
