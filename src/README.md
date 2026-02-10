# AI Companion - Emotional Companion App

An emotionally sophisticated AI companion designed for high-agency women in singlehood who feel burned out by dating and stuck in self-discovery.

## Core Features

### 🤖 Eli - Your Gentle Listener
- **Memory System**: Eli remembers key facts about you (work, relationships, patterns, preferences) across sessions
- **Tone Detection**: Sophisticated sentiment analysis that adapts responses based on your emotional state
- **Paced Responses**: Adjustable chat pace (slow/medium/fast) for thoughtful, unhurried conversations
- **Continuity**: "He remembers me" - personalized greetings and context-aware responses

### 🌸 Safety & Wellness
- **18+ Age Gate**: Privacy-focused entry with clear messaging
- **Boundaries Control**: Set off-limits topics during onboarding
- **Safe Word**: Customizable safe word (default: "pause") to immediately slow or redirect conversations
- **Sexual Wellness Mode**: Opt-in space for discussing fantasies, desires, and boundaries with consent focus
- **Crisis Detection**: Automatic detection of distress with resources for professional help

### 🧠 Memory & Continuity
- **Automatic Memory Extraction**: Eli learns from conversations (work, location, relationship history, patterns)
- **Categorized Memories**: Personal, Work, Relationships, Preferences, Boundaries, Patterns
- **Privacy Controls**: View and delete individual memories anytime

### 🧭 Exploration Tools
- **Desire Exploration**: Understand what you want in relationships and life
- **Boundaries Workshop**: Practice setting and communicating boundaries
- **Self-Discovery Journal**: Guided prompts for deeper self-understanding
- **Values Compass**: Identify and align with core values

### 📔 Private Journal
- Write and store personal reflections
- Topic-based organization
- Full privacy - stored locally on your device

### 🎥 Video Presence (Optional)
- Calming visual avatar for increased intimacy
- Toggle on/off anytime
- No user video required

## Technical Implementation

### Data Storage
- **localStorage**: All data stored locally on device
- **No server sync**: Complete privacy
- **Clear data option**: Delete all data anytime

### Memory System
Automatically extracts and categorizes:
- Personal info (name, age, location)
- Work and career details
- Relationship history and patterns
- Boundaries and preferences
- Dating burnout signals

### Tone Detection
Detects and responds to:
- Distressed (provides grounding, offers resources)
- Curious/Excited (encourages exploration)
- Low mood (validates feelings)
- Playful (matches energy)
- Neutral (reflective listening)

### Safety Features
1. **Safe Word**: Immediate conversation pause
2. **Crisis Resources**: Links to National Suicide Prevention Lifeline (988), Crisis Text Line
3. **Boundary Respect**: Avoids off-limits topics set during onboarding
4. **Wellness Mode Toggle**: Explicit opt-in for sexual wellness discussions

## User Flow

1. **Age Verification**: 18+ confirmation with privacy promise
2. **Onboarding** (3 steps):
   - Introduction and name (optional)
   - Boundary setting and safe word
   - Sexual wellness mode opt-in
3. **Main Experience**:
   - Chat with Eli (with memory and tone awareness)
   - Explore tools and prompts
   - Write journal entries
   - Review what Eli remembers

## Privacy & Ethics

- **No PII Collection**: Not designed for sensitive personal information
- **Local Storage Only**: All data stays on your device
- **Not Therapy**: Clear messaging that this isn't professional mental health support
- **Consent-Focused**: Explicit opt-in for sexual wellness discussions
- **Age-Gated**: 18+ only with clear verification

## Mobile Optimization

- Responsive design for mobile web
- Optimized for late-night usage (target use case)
- Touch-friendly interface
- Mobile menu for navigation

## Success Metrics (PRD Alignment)

### User-Centric
- "Felt seen/understood" score ≥ 8/10 for ≥70% of users
- Median ≥2 sessions per week among retained users

### Business
- ≥30% week-4 retention for first cohort
- ≥50% of signups complete ≥2 sessions in first 7 days

### Technical
- Median response time < 2s (simulated with delays)
- Session tracking for retention analysis

## Future Enhancements

- LLM integration for more sophisticated responses
- Encrypted cloud sync (optional)
- Voice mode
- Customizable avatar
- Guided programs (e.g., "30 days of boundaries")
- Premium features (advanced memory, longer history)
