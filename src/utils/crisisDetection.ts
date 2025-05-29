
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
  'not worth living', 'better off dead', 'want to die', 'take my life',
  'selfmoord', 'dood maak', 'seermaak', // Afrikaans
  'ukuzibulala', 'ukuzilimaza', // Zulu
  'ukuzibulala', 'ukuzenzakalisa' // Xhosa
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
