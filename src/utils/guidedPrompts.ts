export const guidedPrompts = {
  checkIns: [
    "How are you feeling about dating right now?",
    "What's been on your mind lately?",
    "Is there anything you've been wanting to explore or talk through?",
    "How's your energy today—are you feeling drained or energized?",
    "What's one thing that would make today feel better?",
  ],
  
  boundaries: [
    "What's one boundary you've been wanting to set but haven't yet?",
    "Where in your life do you feel most comfortable saying 'no'? Where is it hardest?",
    "How do you feel when someone crosses a boundary of yours?",
    "What would it look like to protect your energy more intentionally?",
  ],
  
  desires: [
    "What does intimacy look like for you in an ideal relationship?",
    "What are you craving—emotionally, physically, or spiritually?",
    "If you could design your perfect relationship, what would it include?",
    "What brings you genuine pleasure and joy?",
  ],
  
  patterns: [
    "What patterns are you noticing in your relationships or dating life?",
    "Is there a version of yourself you keep showing up as that doesn't feel authentic?",
    "What old belief about yourself are you ready to let go of?",
    "What keeps coming up for you lately?",
  ],
  
  selfDiscovery: [
    "What version of yourself are you becoming?",
    "What makes you feel most like yourself?",
    "If you weren't afraid, what would you do differently?",
    "What do you know to be true about yourself, even on hard days?",
  ],
};

export function getRandomPrompt(category: keyof typeof guidedPrompts): string {
  const prompts = guidedPrompts[category];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function shouldOfferCheckIn(messageCount: number): boolean {
  // Offer a check-in every 10-15 messages
  return messageCount > 0 && messageCount % 12 === 0;
}
