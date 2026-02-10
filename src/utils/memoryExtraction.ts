export interface MemoryItem {
  id: string;
  category: 'personal' | 'work' | 'relationship' | 'preference' | 'boundary' | 'pattern';
  fact: string;
  timestamp: Date;
}

export function extractMemories(userMessage: string, existingMemories: MemoryItem[]): MemoryItem[] {
  const newMemories: MemoryItem[] = [];
  
  if (!userMessage || typeof userMessage !== 'string') {
    return newMemories;
  }
  
  // Ensure existingMemories is always an array
  const memories = Array.isArray(existingMemories) ? existingMemories : [];
  
  const text = userMessage.toLowerCase();
  
  // Work patterns
  try {
    const workRegex = /i work (as|at|in)|my job|i'm a |i am a /;
    if (workRegex.test(text)) {
      const matchRegex = /(?:work (?:as|at|in)|job is|i'm a |i am a )([^.,!?]+)/;
      const match = text.match(matchRegex);
      if (match && match[1]) {
        const hasExisting = memories.some(m => 
          m.category === 'work' && m.fact.toLowerCase().includes(match[1].trim())
        );
        if (!hasExisting) {
          newMemories.push({
            id: Date.now().toString() + Math.random(),
            category: 'work',
            fact: `Works ${match[1].trim()}`,
            timestamp: new Date(),
          });
        }
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Name mentions
  try {
    const nameRegex = /my name is|call me|i'm /;
    if (nameRegex.test(text) && !text.includes('feeling')) {
      const matchRegex = /(?:my name is|call me|i'm )\s*([a-zA-Z]+)/;
      const match = text.match(matchRegex);
      if (match && match[1] && match[1].length > 2) {
        const hasExisting = memories.some(m => 
          m.category === 'personal' && m.fact.toLowerCase().includes('name')
        );
        if (!hasExisting) {
          newMemories.push({
            id: Date.now().toString() + Math.random(),
            category: 'personal',
            fact: `Name: ${match[1]}`,
            timestamp: new Date(),
          });
        }
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Age
  try {
    const ageRegex = /i'm \d+|i am \d+|years old/;
    if (ageRegex.test(text)) {
      const matchRegex = /(?:i'm|i am)\s*(\d+)|(\d+)\s*years old/;
      const match = text.match(matchRegex);
      if (match) {
        const age = match[1] || match[2];
        if (age) {
          const hasExisting = memories.some(m => 
            m.category === 'personal' && m.fact.includes('years old')
          );
          if (!hasExisting) {
            newMemories.push({
              id: Date.now().toString() + Math.random(),
              category: 'personal',
              fact: `${age} years old`,
              timestamp: new Date(),
            });
          }
        }
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Location
  try {
    const locationRegex = /i live in|living in|moved to|based in/;
    if (locationRegex.test(text)) {
      const matchRegex = /(?:live in|living in|moved to|based in)\s*([a-zA-Z\s]+?)(?:\.|,|!|\?|$)/;
      const match = text.match(matchRegex);
      if (match && match[1]) {
        const hasExisting = memories.some(m => 
          m.category === 'personal' && m.fact.toLowerCase().includes('lives in')
        );
        if (!hasExisting) {
          newMemories.push({
            id: Date.now().toString() + Math.random(),
            category: 'personal',
            fact: `Lives in ${match[1].trim()}`,
            timestamp: new Date(),
          });
        }
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Ex/relationship history
  try {
    const relationshipRegex = /my ex|broke up|relationship ended|past relationship/;
    if (relationshipRegex.test(text)) {
      const hasExisting = memories.some(m => 
        m.category === 'relationship' && m.fact.includes('previous relationship')
      );
      if (!hasExisting) {
        newMemories.push({
          id: Date.now().toString() + Math.random(),
          category: 'relationship',
          fact: 'Has mentioned a previous relationship',
          timestamp: new Date(),
        });
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Dating burnout mentions
  try {
    const burnoutRegex = /tired of dating|dating is exhausting|burned out|dating burnout|over dating apps/;
    if (burnoutRegex.test(text)) {
      const hasExisting = memories.some(m => 
        m.category === 'pattern' && m.fact.includes('dating burnout')
      );
      if (!hasExisting) {
        newMemories.push({
          id: Date.now().toString() + Math.random(),
          category: 'pattern',
          fact: 'Experiencing dating burnout',
          timestamp: new Date(),
        });
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Preferences - night owl
  try {
    const nightRegex = /late at night|can't sleep|nighttime|before bed/;
    if (nightRegex.test(text)) {
      const hasExisting = memories.some(m => 
        m.category === 'preference' && m.fact.includes('late night')
      );
      if (!hasExisting) {
        newMemories.push({
          id: Date.now().toString() + Math.random(),
          category: 'preference',
          fact: 'Often chats late at night',
          timestamp: new Date(),
        });
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Boundary mentions
  try {
    const boundaryRegex = /i don't like|makes me uncomfortable|not okay with|boundary|off limits/;
    if (boundaryRegex.test(text)) {
      const matchRegex = /(?:don't like|uncomfortable|not okay with|boundary about)\s+([^.,!?]+)/;
      const match = text.match(matchRegex);
      if (match && match[1]) {
        newMemories.push({
          id: Date.now().toString() + Math.random(),
          category: 'boundary',
          fact: `Boundary: ${match[1].trim()}`,
          timestamp: new Date(),
        });
      }
    }
  } catch (e) {
    // Skip if error
  }

  // Patterns - people pleasing
  try {
    const pleasingRegex = /people pleaser|can't say no|always saying yes|put others first/;
    if (pleasingRegex.test(text)) {
      const hasExisting = memories.some(m => 
        m.category === 'pattern' && m.fact.includes('people-pleasing')
      );
      if (!hasExisting) {
        newMemories.push({
          id: Date.now().toString() + Math.random(),
          category: 'pattern',
          fact: 'Notices people-pleasing tendencies',
          timestamp: new Date(),
        });
      }
    }
  } catch (e) {
    // Skip if error
  }

  return newMemories;
}

export function getRelevantMemories(userMessage: string, allMemories: MemoryItem[]): MemoryItem[] {
  if (!userMessage || typeof userMessage !== 'string' || !Array.isArray(allMemories)) {
    return [];
  }
  
  const text = userMessage.toLowerCase();
  const relevant: MemoryItem[] = [];
  
  try {
    for (const memory of allMemories) {
      // Work-related query
      if (/work|job|career|boss/.test(text) && memory.category === 'work') {
        relevant.push(memory);
        continue;
      }
      
      // Relationship query
      if (/date|dating|relationship|ex|partner/.test(text) && 
          (memory.category === 'relationship' || memory.category === 'pattern')) {
        relevant.push(memory);
        continue;
      }
      
      // Boundary query
      if (/boundary|boundaries|limit|comfortable/.test(text) && memory.category === 'boundary') {
        relevant.push(memory);
      }
    }
  } catch (e) {
    // Return empty array if error
  }
  
  return relevant;
}