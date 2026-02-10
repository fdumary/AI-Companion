import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from './Icons';
import { Message, UserProfile } from '../App';
import { generateEliResponse } from '../utils/eliResponses';
import { extractMemories } from '../utils/memoryExtraction';
import { ToolsPanel } from './ToolsPanel';
import { JournalPanel } from './JournalPanel';
import { MemoryPanel } from './MemoryPanel';
import { FeedbackPanel } from './FeedbackPanel';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  activeView: 'chat' | 'tools' | 'journal' | 'memory' | 'feedback';
}

export function ChatInterface({ messages, setMessages, profile, setProfile, activeView }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only auto-scroll when new messages are added, not on initial load
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [messages.length, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    // Extract memories from user message
    const newMemories = extractMemories(input.trim(), profile.memories || []);
    if (newMemories.length > 0) {
      setProfile({
        ...profile,
        memories: [...(profile.memories || []), ...newMemories],
      });
    }

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thoughtful response delay based on chat pace
    const delays = { slow: 2500, medium: 1500, fast: 800 };
    const delay = delays[profile.preferences.chatPace];

    setTimeout(() => {
      const eliResponse = generateEliResponse(input, messages, profile);
      setMessages(prev => [...prev, eliResponse]);
      setIsTyping(false);
      
      // Update session message count
      if (profile.sessions && profile.sessions.length > 0) {
        const sessions = [...profile.sessions];
        sessions[sessions.length - 1].messageCount += 2; // User + Eli
        setProfile({ ...profile, sessions });
      }
    }, delay);
  };

  if (activeView === 'tools') {
    return <ToolsPanel profile={profile} setMessages={setMessages} messages={messages} />;
  }

  if (activeView === 'journal') {
    return <JournalPanel profile={profile} setProfile={setProfile} />;
  }

  if (activeView === 'memory') {
    return <MemoryPanel profile={profile} setProfile={setProfile} />;
  }

  if (activeView === 'feedback') {
    return (
      <FeedbackPanel
        feedbackItems={profile.feedbackItems || []}
        onDelete={(id) => {
          setProfile({
            ...profile,
            feedbackItems: (profile.feedbackItems || []).filter(f => f.id !== id),
          });
        }}
        onExport={() => {
          const feedbackText = (profile.feedbackItems || [])
            .map(item => {
              return `
Type: ${item.type.toUpperCase()}
Subject: ${item.subject}
Date: ${new Date(item.timestamp).toLocaleString()}
${item.email ? `Contact: ${item.email}` : ''}

Description:
${item.description}

${'='.repeat(50)}
`;
            })
            .join('\n');

          const blob = new Blob([feedbackText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ai-companion-feedback-${new Date().toISOString().split('T')[0]}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Mark all as exported
          setProfile({
            ...profile,
            feedbackItems: (profile.feedbackItems || []).map(f => ({ ...f, status: 'exported' as const })),
          });
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" id="main-content">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" role="log" aria-live="polite" aria-label="Chat conversation">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            role="article"
            aria-label={`Message from ${message.sender === 'user' ? 'you' : 'Eli'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-purple-100'
              }`}
            >
              {message.sender === 'eli' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">Eli</span>
                  {message.tone && (
                    <span className="text-xs text-purple-400">• {message.tone}</span>
                  )}
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-purple-600 font-medium">Eli is thinking...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Safe word reminder */}
      <div className="px-4 py-2 bg-purple-50 border-t border-purple-100">
        <p className="text-xs text-center text-gray-600">
          Remember: Say "<span className="font-semibold text-purple-600">{profile.boundaries.safeWord}</span>" anytime to pause or redirect
        </p>
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-100 bg-white/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <label htmlFor="message-input" className="sr-only">Type your message</label>
          <input
            id="message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-3 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm md:text-base"
            aria-label="Message input field"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}