export type DetectedMood = 'distressed' | 'curious' | 'playful' | 'low' | 'neutral' | 'excited';

export function detectTone(message: string): DetectedMood {
  if (!message || typeof message !== 'string') {
    return 'neutral';
  }
  
  const text = message.toLowerCase();
  
  // Distressed - takes priority
  if (/hurt|crying|can't take|overwhelmed|anxious|panic|scared|afraid|alone|empty|hopeless|suicidal|self harm/.test(text)) {
    return 'distressed';
  }
  
  // Playful/excited
  if (/haha|lol|excited|fun|love it|amazing|can't wait|yay|!\s*!/.test(text)) {
    return 'excited';
  }
  
  if (/!!|so good|so excited|omg|love/.test(text)) {
    return 'excited';
  }
  
  // Curious/exploratory
  if (/curious|wonder|thinking about|what if|exploring|trying to understand|figuring out/.test(text)) {
    return 'curious';
  }
  
  // Low mood
  if (/tired|exhausted|drained|sad|depressed|down|low|burned out|burnout|lonely|lost|stuck/.test(text)) {
    return 'low';
  }
  
  return 'neutral';
}

export function shouldProvideResources(mood: DetectedMood, text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  const crisisWords = /suicidal|kill myself|end it all|self harm|hurt myself|not worth living/i;
  return mood === 'distressed' && crisisWords.test(text);
}
