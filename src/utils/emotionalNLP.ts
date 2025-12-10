/**
 * Emotional NLP Processing
 * Detects emotions, sentiment, pain points, and psychological themes from user input
 */

export interface EmotionalAnalysis {
  emotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number; // -1 to 1
  themes: string[];
  painPoints: string[];
  urgencyLevel: 'critical' | 'high' | 'moderate' | 'low';
  userStory: string[];
}

// Comprehensive emotion keywords with weights
const EMOTION_KEYWORDS = {
  // Sadness & Grief
  sadness: {
    words: ['sad', 'depressed', 'down', 'upset', 'miserable', 'heartbroken', 'devastated', 'hopeless', 'empty', 'lonely', 'lost', 'numb'],
    weight: 1,
  },
  grief: {
    words: ['grief', 'loss', 'mourn', 'miss', 'died', 'death', 'gone', 'lost someone', 'bereaved'],
    weight: 1.2,
  },
  // Anxiety & Fear
  anxiety: {
    words: ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'terrified', 'scared', 'afraid', 'fear', 'stress', 'overwhelmed', 'racing thoughts'],
    weight: 1,
  },
  panic: {
    words: ['panic', 'panic attack', 'hyperventilating', 'heart racing', 'chest pain'],
    weight: 1.3,
  },
  // Anger & Frustration
  anger: {
    words: ['angry', 'furious', 'rage', 'mad', 'irritated', 'frustrated', 'resentment', 'bitter', 'hate'],
    weight: 0.9,
  },
  // Shame & Guilt
  shame: {
    words: ['shame', 'ashamed', 'embarrassed', 'guilty', 'guilt', 'worthless', 'inadequate', 'failure'],
    weight: 1.1,
  },
  // Hopelessness & Suicidality
  hopelessness: {
    words: ['hopeless', 'no point', 'give up', 'suicide', 'suicidal', 'self-harm', 'hurt myself', 'kill myself', 'overdose', 'end it'],
    weight: 1.5,
  },
  // Trauma
  trauma: {
    words: ['trauma', 'traumatic', 'flashback', 'triggered', 'ptsd', 'nightmare', 'abuse', 'violence', 'assault', 'attack', 'rape', 'harassment'],
    weight: 1.4,
  },
  // Isolation
  isolation: {
    words: ['alone', 'isolated', 'lonely', 'no one understands', 'alone in this', 'unsupported', 'abandoned'],
    weight: 0.9,
  },
  // Hope & Strength
  hope: {
    words: ['hope', 'better', 'improve', 'stronger', 'healing', 'grateful', 'proud', 'accomplished', 'positive', 'good'],
    weight: -0.8, // negative weight = reduces negativity
  },
  // Resilience
  resilience: {
    words: ['survive', 'survived', 'overcame', 'managed', 'coped', 'recovered', 'stronger now', 'learned'],
    weight: -0.7,
  },
};

// Psychological themes and pain points
const THEME_KEYWORDS = {
  relationships: ['partner', 'spouse', 'girlfriend', 'boyfriend', 'husband', 'wife', 'family', 'friend', 'relationship', 'breakup', 'divorce'],
  work: ['work', 'job', 'boss', 'workplace', 'career', 'unemployment', 'fired', 'quit', 'stressed at work'],
  health: ['sick', 'illness', 'disease', 'health', 'pain', 'chronic', 'hospital', 'medication', 'therapy'],
  identity: ['identity', 'who am i', 'belong', 'fit in', 'different', 'lgbtq', 'cultural'],
  finances: ['money', 'financial', 'debt', 'poor', 'struggling financially', 'bills', 'rent'],
  selfworth: ['worthless', 'not good enough', 'self-esteem', 'confidence', 'insecure', 'not worthy'],
  parenting: ['parent', 'child', 'kid', 'children', 'mother', 'father', 'parenting'],
  substance: ['alcohol', 'drugs', 'addiction', 'substance', 'drinking', 'using', 'sober'],
  gbv: ['abuse', 'violence', 'assault', 'harassment', 'rape', 'domestic', 'hit', 'hurt'],
};

// Crisis keywords
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'self-harm', 'hurt myself', 'overdose', 'end it', 'no point living',
  'want to die', 'should die', 'deserve to die', 'harm others', 'violent thoughts',
];

/**
 * Analyze emotional content of user input
 */
export function analyzeEmotionalContent(userInput: string): EmotionalAnalysis {
  const lower = userInput.toLowerCase();
  const words = lower.split(/\s+/);
  
  // Detect emotions
  const detectedEmotions: Map<string, number> = new Map();
  let overallSentimentScore = 0;

  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, config]) => {
    config.words.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = userInput.match(regex) || [];
      if (matches.length > 0) {
        detectedEmotions.set(emotion, (detectedEmotions.get(emotion) || 0) + matches.length * config.weight);
        overallSentimentScore += matches.length * config.weight;
      }
    });
  });

  // Sort emotions by intensity
  const emotionsArray = Array.from(detectedEmotions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);

  // Normalize sentiment score (-1 to 1)
  const sentimentScore = Math.max(-1, Math.min(1, overallSentimentScore / 5));
  const sentiment: 'positive' | 'negative' | 'neutral' | 'mixed' =
    sentimentScore > 0.3 ? 'positive' :
    sentimentScore < -0.3 ? 'negative' :
    sentimentScore > -0.1 && sentimentScore < 0.1 ? 'neutral' :
    'mixed';

  // Detect themes
  const detectedThemes: string[] = [];
  Object.entries(THEME_KEYWORDS).forEach(([theme, keywords]) => {
    if (keywords.some((kw) => lower.includes(kw))) {
      detectedThemes.push(theme);
    }
  });

  // Identify pain points
  const painPoints: string[] = [];
  if (emotionsArray.includes('sadness') || emotionsArray.includes('grief')) painPoints.push('loss or grief');
  if (emotionsArray.includes('anxiety') || emotionsArray.includes('panic')) painPoints.push('anxiety or fear');
  if (emotionsArray.includes('anger')) painPoints.push('anger or resentment');
  if (emotionsArray.includes('trauma')) painPoints.push('trauma or abuse');
  if (detectedThemes.includes('relationships')) painPoints.push('relationship difficulties');
  if (detectedThemes.includes('work')) painPoints.push('work stress');
  if (detectedThemes.includes('health')) painPoints.push('health concerns');
  if (detectedThemes.includes('selfworth')) painPoints.push('low self-worth');

  // Determine urgency
  const urgencyLevel: 'critical' | 'high' | 'moderate' | 'low' =
    CRISIS_KEYWORDS.some((kw) => lower.includes(kw)) ? 'critical' :
    emotionsArray.includes('hopelessness') || emotionsArray.includes('panic') ? 'high' :
    emotionsArray.length > 0 ? 'moderate' :
    'low';

  return {
    emotions: emotionsArray,
    sentiment,
    sentimentScore,
    themes: detectedThemes,
    painPoints,
    urgencyLevel,
    userStory: extractStory(userInput),
  };
}

/**
 * Extract key narrative elements from user input
 */
function extractStory(text: string): string[] {
  const story: string[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  
  // Take up to 2 most meaningful sentences
  sentences
    .map((s) => ({
      text: s.trim(),
      weight: Array.from(Object.values(EMOTION_KEYWORDS)).reduce(
        (w, config) =>
          w + (config.words.filter((kw) => s.toLowerCase().includes(kw)).length * config.weight),
        0
      ),
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .forEach((s) => story.push(s.text));

  return story;
}

/**
 * Generate therapeutic talking points based on analysis
 */
export function generateTherapeuticGuidance(analysis: EmotionalAnalysis): string {
  const { emotions, painPoints, userStory, urgencyLevel } = analysis;

  // Critical crisis intervention
  if (urgencyLevel === 'critical') {
    return `I can hear you're in a lot of pain right now, and I want you to know that your life matters. 

Please reach out to a crisis helpline immediately:
• National Suicide Prevention Lifeline: 988 (call or text)
• Crisis Text Line: Text HOME to 741741
• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

You deserve immediate professional support. Will you reach out to one of these resources right now?`;
  }

  let guidance = '';

  // Empathetic opening
  if (userStory.length > 0) {
    guidance += `I hear you—${userStory[0].toLowerCase()}. `;
  } else {
    guidance += `I'm listening, and I'm here for you. `;
  }

  // Validate primary emotion
  if (emotions.length > 0) {
    const primaryEmotion = emotions[0];
    guidance += getEmotionalValidation(primaryEmotion);
  }

  // Address pain points with coping mechanisms
  if (painPoints.length > 0) {
    guidance += ` Let's work on your ${painPoints[0]}. `;
    guidance += getCopingMechanisms(painPoints[0]);
  }

  // Reflective questions for deeper understanding
  guidance += `\n\n${getReflectiveQuestion(emotions[0] || '', painPoints[0] || '')}`;

  // Gentle closing
  guidance += `\n\nIf it helps, we can take this one small step at a time.`;

  return guidance;
}

function getEmotionalValidation(emotion: string): string {
  const validations: Record<string, string> = {
    sadness: 'It\'s completely natural to feel sad. Your emotions are valid.',
    grief: 'Grief is love with nowhere to go. It\'s a reflection of what mattered to you.',
    anxiety: 'What you\'re feeling is real, and many people experience this. You\'re not alone.',
    panic: 'Panic feels unbearable, but it always passes. You\'re safe, even though it doesn\'t feel like it.',
    anger: 'Your anger is telling you that something matters to you. That\'s important information.',
    shame: 'What happened to you doesn\'t define who you are. Shame often lies to us.',
    hopelessness: 'These feelings are temporary, even though they feel permanent right now.',
    trauma: 'What happened was not your fault. Your body is trying to protect you.',
    isolation: 'You might feel alone, but reaching out—like you\'re doing now—matters.',
    hope: 'I\'m glad you\'re finding moments of hope. Hold onto those.',
  };
  return validations[emotion] || 'Your feelings are valid and important.';
}

function getCopingMechanisms(painPoint: string): string {
  const mechanisms: Record<string, string> = {
    'loss or grief': 'Some coping strategies: journaling about memories, talking with supportive people, creating rituals to honor what was lost, or engaging in activities they loved.',
    'anxiety or fear': 'Try grounding techniques: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. Deep breathing (4 counts in, 7 hold, 8 out) also calms your nervous system.',
    'anger or resentment': 'Channel anger productively: physical activity, creative expression (art, music, writing), or talk to someone you trust about what\'s really underneath the anger.',
    'trauma or abuse': 'Healing takes time. EMDR, trauma-focused CBT, and support groups have helped many survivors. Safety first—consider professional trauma therapy.',
    'relationship difficulties': 'Healthy communication is key. Express your needs clearly, listen to understand (not to respond), and be willing to seek couples counseling if needed.',
    'work stress': 'Set boundaries: define work hours, take breaks, discuss concerns with your boss, or explore what role/environment might fit you better.',
    'health concerns': 'Work with your healthcare team. Self-care (sleep, nutrition, movement) supports healing. Connect with others managing similar health challenges.',
    'low self-worth': 'Practice self-compassion. Notice your inner critic—would you speak this way to a friend? Challenge negative self-talk with evidence-based thoughts.',
  };
  return mechanisms[painPoint] || 'Let\'s explore what might help you feel better.';
}

function getReflectiveQuestion(emotion: string, painPoint: string): string {
  const questions: Record<string, string[]> = {
    sadness: [
      'What would bring even a small moment of comfort today?',
      'Who or what grounds you when you feel this way?',
      'What did things feel like before this heaviness arrived?',
    ],
    grief: [
      'What do you miss most about them or what was lost?',
      'How can you honor what mattered to you?',
      'Is there someone you can share your memories with?',
    ],
    anxiety: [
      'What specifically feels most uncertain right now?',
      'Can you separate what\'s in your control from what isn\'t?',
      'What would help you feel even slightly more grounded?',
    ],
    panic: [
      'Can you slow your breathing with me—in for 4, out for 8?',
      'You\'re safe. What\'s one thing you can feel right now?',
      'What helps you when panic peaks?',
    ],
    anger: [
      'What boundary has been crossed that makes you angry?',
      'What do you wish was different?',
      'How can you honor this anger while staying true to your values?',
    ],
    trauma: [
      'What would help you feel safer right now?',
      'Have you had support from someone who understands?',
      'What small thing could remind you that you survived and are still here?',
    ],
    hope: [
      'What gave you that spark of hope?',
      'How can you nurture that feeling?',
      'What\'s one small step toward what you\'re hoping for?',
    ],
  };
  
  const questionList = questions[emotion] || [
    'What would help right now?',
    'What do you need from me?',
    'What strength have you shown that we can build on?',
  ];

  return questionList[Math.floor(Math.random() * questionList.length)];
}
