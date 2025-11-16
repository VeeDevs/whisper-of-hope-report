/**
 * Test script for emotionalNLP functionality
 * Demonstrates how the AI therapist analyzes and responds to emotional input
 */

import { analyzeEmotionalContent, generateTherapeuticGuidance } from './src/utils/emotionalNLP.js';

const testInputs = [
  "I've been feeling so sad and lonely lately. My best friend moved away and I don't know how to cope with the loss.",
  "I'm having panic attacks at work. My boss is demanding and I feel like I can't do anything right. I'm terrified I'll get fired.",
  "I was in an abusive relationship and I still have nightmares. I don't feel safe anymore.",
  "I'm struggling with my identity and I don't feel like I belong anywhere. Everything feels meaningless.",
  "I can't stop thinking about hurting myself. Nothing matters anymore.",
  "I've been working on myself and I'm starting to feel hopeful again. Therapy is really helping.",
];

console.log('🧠 EMOTIONAL NLP ANALYSIS & THERAPEUTIC RESPONSE TEST\n');
console.log('='.repeat(80));

testInputs.forEach((userInput, index) => {
  console.log(`\n📝 USER INPUT #${index + 1}:`);
  console.log(`"${userInput}"\n`);

  // Analyze emotional content
  const analysis = analyzeEmotionalContent(userInput);

  // Display analysis results
  console.log('🔍 EMOTIONAL ANALYSIS:');
  console.log(`  • Detected Emotions: ${analysis.emotions.length > 0 ? analysis.emotions.join(', ') : 'None'}`);
  console.log(`  • Sentiment: ${analysis.sentiment} (score: ${analysis.sentimentScore.toFixed(2)})`);
  console.log(`  • Themes: ${analysis.themes.length > 0 ? analysis.themes.join(', ') : 'None'}`);
  console.log(`  • Pain Points: ${analysis.painPoints.length > 0 ? analysis.painPoints.join(', ') : 'None'}`);
  console.log(`  • Urgency Level: ${analysis.urgencyLevel}`);
  if (analysis.userStory.length > 0) {
    console.log(`  • User's Story: ${analysis.userStory.join(' | ')}`);
  }

  // Generate and display therapeutic response
  const therapeuticResponse = generateTherapeuticGuidance(analysis);
  console.log('\n💬 THERAPEUTIC RESPONSE:');
  console.log(`${therapeuticResponse}`);

  console.log('\n' + '-'.repeat(80));
});

console.log('\n✅ TEST COMPLETE');
console.log(`Tested ${testInputs.length} different emotional scenarios.`);
console.log('The AI therapist now provides emotionally intelligent, personalized responses!');
