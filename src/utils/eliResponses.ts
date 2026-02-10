import { detectTone, shouldProvideResources, DetectedMood } from './toneDetection';
import { getRelevantMemories, MemoryItem } from './memoryExtraction';

// Using Message and UserProfile types from App.tsx to avoid duplication
interface Message {
  id: string;
  sender: 'user' | 'eli';
  text: string;
  timestamp: Date;
  tone?: 'supportive' | 'reflective' | 'exploratory' | 'validating' | 'grounding' | 'intimate';
  detectedMood?: DetectedMood;
}

interface UserProfile {
  name?: string;
  preferences: {
    sexualWellnessEnabled: boolean;
    videoPresence?: boolean;
    chatPace?: 'slow' | 'medium' | 'fast';
    cloudSync?: boolean;
    highContrast?: boolean;
    largeText?: boolean;
  };
  boundaries: {
    safeWord: string;
    offLimitsTopics?: string[];
  };
  memories: MemoryItem[];
  sessions?: Array<{
    date: Date;
    messageCount: number;
  }>;
}

export function generateEliResponse(
  userInput: string, 
  messageHistory: Message[], 
  profile: UserProfile
): Message {
  try {
    const input = userInput.toLowerCase();
    const detectedMood = detectTone(userInput);
    
    // Check for safe word
    if (input.includes(profile.boundaries.safeWord.toLowerCase())) {
      return {
        id: Date.now().toString(),
        sender: 'eli',
        text: `I hear you saying "${profile.boundaries.safeWord}." I'm pausing right here. You're in complete control. Would you like to change topics, slow down, or take a break? What would feel better right now?`,
        timestamp: new Date(),
        tone: 'grounding',
        detectedMood: 'neutral',
      };
    }
    
    // Crisis detection
    if (shouldProvideResources(detectedMood, userInput)) {
      return {
        id: Date.now().toString(),
        sender: 'eli',
        text: `I'm really concerned about what you just shared. You deserve real, immediate support. Please reach out to a crisis helpline:\n\n• National Suicide Prevention Lifeline: 988 (US)\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nI'm here to listen, but you need and deserve professional help right now. Can you reach out to one of these resources?`,
        timestamp: new Date(),
        tone: 'grounding',
        detectedMood,
      };
    }
    
    // Get relevant memories for context
    const relevantMemories = getRelevantMemories(userInput, profile.memories || []);
    const userName = profile.name || '';
    
    // Analyze sentiment and topic
    const isQuestionAboutSelf = /who am i|what do i want|my purpose|discover myself|lost|confused|don't know/i.test(input);
    const isAboutDating = /dating|relationship|partner|love|romance|men|burnout|tired|exhaust/i.test(input);
    const isAboutBoundaries = /boundary|boundaries|no|can't say no|people pleasing|put myself first/i.test(input);
    const isAboutDesires = /want|desire|need|crave|wish|fantasy|sexual|intimacy/i.test(input);
    const isEmotional = /feel|feeling|emotion|sad|happy|angry|frustrated|overwhelmed|anxious/i.test(input);
    const isGreeting = /^(hi|hello|hey|good morning|good evening)/i.test(input);
    const isSexualWellness = profile.preferences.sexualWellnessEnabled && 
      /sex|sexual|arousal|turned on|desire|fantasy|fantasies|intimate|intimacy|pleasure|orgasm/i.test(input);

    let responseText = '';
    let tone: Message['tone'] = 'supportive';

    // Memory-aware greeting
    if (isGreeting) {
      const greetingName = userName ? `, ${userName}` : '';
      const lastSession = profile.sessions && profile.sessions.length > 1 ? profile.sessions[profile.sessions.length - 2] : null;
      
      if (lastSession && relevantMemories.length > 0) {
        const memoryContext = relevantMemories[0].fact;
        responseText = `Hi${greetingName}! Good to see you again. Last time we talked about ${memoryContext.toLowerCase()}. How have you been since then?`;
      } else if (lastSession) {
        responseText = `Welcome back${greetingName}! I've been thinking about our last conversation. How are you feeling today?`;
      } else {
        responseText = `Hi${greetingName}! I'm so glad you're here. What's on your heart today?`;
      }
      tone = 'supportive';
    } 
    
    // Distressed mood
    else if (detectedMood === 'distressed') {
      const responses = [
        "I can feel how much pain you're in right now, and I want you to know I'm here with you. You don't have to carry this alone. Take a breath with me—can you tell me what you need in this moment?",
        "That sounds incredibly hard. Your feelings are completely valid. Before we continue, I want to make sure you're safe and have support. Are you in a safe place right now?",
        "I'm really hearing the weight of what you're going through. It takes strength to share this. What would help you feel even a little bit more grounded right now?",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'grounding';
    }
    
    // Sexual wellness (if enabled)
    else if (isSexualWellness) {
      const responses = [
        "This is a brave space to explore what you desire. There's no shame here—your sexuality is yours to understand and celebrate. What aspect of this feels most important to explore right now?",
        "I appreciate you sharing this with me. Your desires matter, and understanding them is part of knowing yourself fully. What would it feel like to honor what you're feeling?",
        "You're allowed to want what you want. Sexual wellness is about agency, pleasure, and knowing your own body and mind. What boundaries or desires are you curious about?",
        "Thank you for trusting me with this. Exploring your sexuality—fantasies, boundaries, what turns you on—is healthy and empowering. Where would you like to start?",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'intimate';
    }
    
    // Self-discovery
    else if (isQuestionAboutSelf) {
      const nameContext = userName ? `, ${userName}` : '';
      const responses = [
        `That's such a powerful question to sit with${nameContext}. It takes courage to admit when we feel lost. What if, instead of trying to find all the answers right now, we explore what feels true in this moment? What's one thing you know about yourself that hasn't changed?`,
        `You're in a season of becoming, and that can feel disorienting. But here's what I notice: you're asking the questions. That's where discovery begins. What part of yourself are you most curious about right now?`,
        `Not knowing is actually a really honest place to be. Many people pretend they have it all figured out, but you're brave enough to sit in the uncertainty. What if this confusion is making space for something new to emerge?`,
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'reflective';
    }
    
    // Dating burnout
    else if (isAboutDating) {
      const burnoutMemory = (profile.memories || []).find(m => m.fact.includes('dating burnout'));
      const prefix = burnoutMemory ? "I remember you mentioned feeling burned out before. " : "";
      
      const responses = [
        `${prefix}Dating burnout is so real, and it makes sense that you're feeling this way. The constant performance, the disappointments—it's exhausting. What would it feel like to take the pressure off for a while and just focus on what you actually enjoy?`,
        `${prefix}It sounds like dating has been draining rather than nourishing. That's important information. What would change if you shifted from 'finding someone' to 'discovering what I actually want'? You deserve relationships that energize you, not deplete you.`,
        `${prefix}I hear you. The burnout is valid. Sometimes we need to step back and remember that being single isn't a problem to solve—it's a space where you get to be fully yourself. What parts of your life feel most alive to you right now?`,
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'validating';
    }
    
    // Boundaries
    else if (isAboutBoundaries) {
      const boundaryMemories = (profile.memories || []).filter(m => m.category === 'boundary');
      const context = boundaryMemories.length > 0 ? ` I remember you've mentioned boundaries around ${boundaryMemories[0].fact.toLowerCase()}.` : "";
      
      const responses = [
        `Setting boundaries is one of the most loving things you can do—for yourself and others.${context} It's hard at first, especially if you've been conditioned to please. What's one small boundary you'd like to practice?`,
        `Boundaries aren't walls—they're clarity.${context} They help you honor your needs while still showing up in relationships. Where do you notice you need more protection or space in your life?`,
        `Saying no is a complete sentence, even though it doesn't always feel that way.${context} What makes it hard for you to say no? Let's explore what's underneath that.`,
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'exploratory';
    }
    
    // Desires
    else if (isAboutDesires) {
      const responses = [
        "Desire is such valuable information. It shows us what we're drawn to, what we value, what we need. There's no shame in wanting. What desires feel most important for you to honor right now?",
        "Exploring what you want—emotionally, relationally, in all parts of your life—is an act of self-love. You're allowed to want things, to have needs, to dream. What part of your desires feels safe to explore today?",
        "Your desires matter. Not just in relationships, but in every part of your life. What would it look like to give yourself permission to pursue what truly lights you up?",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'exploratory';
    }
    
    // Emotional
    else if (isEmotional || detectedMood === 'low') {
      const nameContext = userName ? `, ${userName}` : '';
      const responses = [
        `Thank you for sharing how you're feeling${nameContext}. Your emotions are valid, and they're giving you important information. What does this feeling need from you right now?`,
        `I'm here with you in this${nameContext}. Feelings can be intense, but they're also temporary. You're allowed to feel exactly what you're feeling. What would help you feel supported right now?`,
        `It takes strength to sit with difficult emotions${nameContext}. You're not running from them—you're here, feeling them. That's brave. What's this feeling trying to tell you?`,
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'validating';
    }
    
    // Curious/excited mood
    else if (detectedMood === 'curious' || detectedMood === 'excited') {
      const responses = [
        "I love your energy around this! Tell me more—what's sparking this curiosity?",
        "This sounds like an important exploration for you. What's drawing you to think about this right now?",
        "I can feel your excitement! What would it mean to lean into this feeling?",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'exploratory';
    }
    
    // General reflective
    else {
      const responses = [
        "I'm listening. Tell me more about that.",
        "That sounds really significant. What stands out to you most about what you just shared?",
        "I hear you. What would it mean to honor what you're experiencing right now?",
        "Thank you for trusting me with this. What feels most important for you to explore about this?",
        "There's wisdom in what you're saying. What do you notice when you sit with these thoughts?",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
      tone = 'reflective';
    }

    return {
      id: Date.now().toString(),
      sender: 'eli',
      text: responseText,
      timestamp: new Date(),
      tone,
      detectedMood,
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      id: Date.now().toString(),
      sender: 'eli',
      text: "I'm here and listening. Tell me more about what's on your mind.",
      timestamp: new Date(),
      tone: 'supportive',
      detectedMood: 'neutral',
    };
  }
}