import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { VideoPresence } from './components/VideoPresence';
import { AgeGate } from './components/AgeGate';
import { Onboarding } from './components/Onboarding';
import { FeedbackModal, FeedbackItem } from './components/FeedbackModal';
import { AuthModal } from './components/AuthModal';
import * as api from './utils/supabaseClient';

export interface Message {
  id: string;
  sender: 'user' | 'eli';
  text: string;
  timestamp: Date;
  tone?: 'supportive' | 'reflective' | 'exploratory' | 'validating' | 'grounding' | 'intimate';
  detectedMood?: 'distressed' | 'curious' | 'playful' | 'low' | 'neutral' | 'excited';
}

export interface MemoryItem {
  id: string;
  category: 'personal' | 'work' | 'relationship' | 'preference' | 'boundary' | 'pattern';
  fact: string;
  timestamp: Date;
}

export interface UserProfile {
  name?: string;
  isOver18?: boolean;
  hasCompletedOnboarding?: boolean;
  preferences: {
    videoPresence: boolean;
    chatPace: 'slow' | 'medium' | 'fast';
    sexualWellnessEnabled: boolean;
    cloudSync: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
  boundaries: {
    offLimitsTopics: string[];
    safeWord: string;
  };
  memories: MemoryItem[];
  journalEntries: Array<{
    id: string;
    topic: string;
    content: string;
    date: Date;
  }>;
  sessions: Array<{
    date: Date;
    messageCount: number;
  }>;
  feedbackItems: FeedbackItem[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    preferences: {
      videoPresence: false,
      chatPace: 'medium',
      sexualWellnessEnabled: false,
      cloudSync: false,
      highContrast: false,
      largeText: false,
    },
    boundaries: {
      offLimitsTopics: [],
      safeWord: 'pause',
    },
    memories: [],
    journalEntries: [],
    sessions: [],
    feedbackItems: [],
  });
  const [activeView, setActiveView] = useState<'chat' | 'tools' | 'journal' | 'memory' | 'feedback'>('chat');
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Load persisted data
  useEffect(() => {
    const savedMessages = localStorage.getItem('eli_messages');
    const savedProfile = localStorage.getItem('eli_profile');
    
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        memories: parsed.memories?.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })) || [],
        journalEntries: parsed.journalEntries?.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })) || [],
        sessions: parsed.sessions?.map((s: any) => ({
          ...s,
          date: new Date(s.date)
        })) || [],
        feedbackItems: parsed.feedbackItems?.map((f: any) => ({
          ...f,
          timestamp: new Date(f.timestamp)
        })) || [],
      });
      setShowAgeGate(!parsed.isOver18);
      setShowOnboarding(parsed.isOver18 && !parsed.hasCompletedOnboarding);
    }
    
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Persist data
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('eli_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('eli_profile', JSON.stringify(profile));
  }, [profile]);

  // Track sessions
  useEffect(() => {
    if (profile.hasCompletedOnboarding && messages.length > 0) {
      const today = new Date().toDateString();
      const lastSession = profile.sessions[profile.sessions.length - 1];
      
      if (!lastSession || new Date(lastSession.date).toDateString() !== today) {
        setProfile(prev => ({
          ...prev,
          sessions: [...prev.sessions, { date: new Date(), messageCount: 0 }]
        }));
      }
    }
  }, [messages.length, profile.hasCompletedOnboarding]);

  // Listen for switch to chat event from tools
  useEffect(() => {
    const handleSwitchToChat = () => {
      setActiveView('chat');
    };
    window.addEventListener('switch-to-chat', handleSwitchToChat);
    return () => window.removeEventListener('switch-to-chat', handleSwitchToChat);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const session = await api.getCurrentSession();
      setIsAuthenticated(!!session);
      
      if (session && profile.preferences.cloudSync) {
        // Sync data from cloud
        try {
          setSyncStatus('syncing');
          const data = await api.fetchAllData();
          if (data.profile) {
            setProfile(prev => ({ ...prev, ...data.profile }));
          }
          if (data.messages) {
            setMessages(data.messages);
          }
          setSyncStatus('synced');
        } catch (error) {
          console.error('Sync error:', error);
          setSyncStatus('error');
        }
      }
    };
    
    if (profile.hasCompletedOnboarding) {
      checkAuth();
    }
  }, [profile.hasCompletedOnboarding]);

  // Auto-sync when cloud sync is enabled
  useEffect(() => {
    if (isAuthenticated && profile.preferences.cloudSync && profile.hasCompletedOnboarding) {
      const syncData = async () => {
        try {
          setSyncStatus('syncing');
          await api.syncAllData(profile, messages);
          setSyncStatus('synced');
          setTimeout(() => setSyncStatus('idle'), 2000);
        } catch (error) {
          console.error('Auto-sync error:', error);
          setSyncStatus('error');
        }
      };
      
      // Debounce sync
      const timeout = setTimeout(syncData, 3000);
      return () => clearTimeout(timeout);
    }
  }, [profile, messages, isAuthenticated]);

  // Apply accessibility preferences
  useEffect(() => {
    if (profile.preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (profile.preferences.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [profile.preferences.highContrast, profile.preferences.largeText]);

  const handleAgeConfirm = () => {
    setProfile(prev => ({ ...prev, isOver18: true }));
    setShowAgeGate(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
    }));
    setShowOnboarding(false);
    
    // Welcome message
    setMessages([{
      id: '1',
      sender: 'eli',
      text: `Hi ${data.name || 'there'}, I'm Eli. I'm really glad you're here. This is your space—judgment-free, at your own pace. I'm here to listen, remember, and help you explore whatever's on your mind. How are you feeling right now?`,
      timestamp: new Date(),
      tone: 'supportive'
    }]);
  };

  const handleFeedbackSubmit = (feedback: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'>) => {
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'submitted',
    };
    
    setProfile(prev => ({
      ...prev,
      feedbackItems: [newFeedback, ...(prev.feedbackItems || [])],
    }));
  };

  if (showAgeGate) {
    return <AgeGate onConfirm={handleAgeConfirm} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>

      {/* Desktop: Show sidebar - fixed to viewport */}
      <div className="hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:z-10">
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          profile={profile}
          setProfile={setProfile}
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
      </div>
      
      {/* Main content area with left margin for sidebar on desktop */}
      <div className="flex-1 flex flex-col md:ml-64">
        {profile.preferences.videoPresence && (
          <VideoPresence />
        )}
        
        {/* Mobile header with menu */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-purple-100">
          <h1 className="font-semibold text-gray-800">AI Companion</h1>
          <button 
            onClick={() => {
              const modal = document.getElementById('mobile-menu');
              if (modal) modal.classList.toggle('hidden');
            }}
            className="p-2 hover:bg-purple-50 rounded-lg"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <ChatInterface
          messages={messages}
          setMessages={setMessages}
          profile={profile}
          setProfile={setProfile}
          activeView={activeView}
        />
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Mobile menu modal */}
      <div id="mobile-menu" className="hidden md:hidden fixed inset-0 bg-black/50 z-50" onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.classList.add('hidden');
        }
      }}>
        <div className="bg-white h-full w-80 max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
          <Sidebar 
            activeView={activeView}
            setActiveView={(view) => {
              setActiveView(view);
              document.getElementById('mobile-menu')?.classList.add('hidden');
            }}
            profile={profile}
            setProfile={setProfile}
            onOpenFeedback={() => {
              setShowFeedbackModal(true);
              document.getElementById('mobile-menu')?.classList.add('hidden');
            }}
          />
        </div>
      </div>
    </div>
  );
}