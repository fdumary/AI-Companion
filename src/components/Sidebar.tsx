import { MessageCircle, Compass, BookOpen, Settings, Video, VideoOff } from './Icons';
import { UserProfile } from '../App';

interface SidebarProps {
  activeView: 'chat' | 'tools' | 'journal' | 'memory' | 'feedback';
  setActiveView: (view: 'chat' | 'tools' | 'journal' | 'memory' | 'feedback') => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onOpenFeedback?: () => void;
}

export function Sidebar({ activeView, setActiveView, profile, setProfile, onOpenFeedback }: SidebarProps) {
  const menuItems = [
    { id: 'chat' as const, icon: MessageCircle, label: 'Chat with Eli', badge: null },
    { id: 'memory' as const, icon: () => <span className="text-xl">🧠</span>, label: 'Memory', badge: profile.memories?.length || 0 },
    { id: 'tools' as const, icon: Compass, label: 'Exploration Tools', badge: null },
    { id: 'journal' as const, icon: BookOpen, label: 'My Journal', badge: profile.journalEntries?.length || 0 },
    { id: 'feedback' as const, icon: () => <span className="text-xl">💬</span>, label: 'Feedback', badge: profile.feedbackItems?.length || 0 },
  ];

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-sm border-r border-purple-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-purple-100 flex-shrink-0">
        <h1 className="font-semibold text-gray-800 mb-1">AI Companion</h1>
        <p className="text-sm text-gray-500">Your space for self-discovery</p>
        {profile.name && (
          <p className="text-xs text-purple-600 mt-2">Welcome back, {profile.name}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
              activeView === item.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            {typeof item.icon === 'function' ? <item.icon /> : <item.icon className="w-5 h-5" />}
            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
            {item.badge !== null && item.badge > 0 && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        
        {/* Feedback button (alternative if not in main menu) */}
        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-purple-50 border-2 border-dashed border-gray-300 hover:border-indigo-300 mt-4"
          >
            <span className="text-xl">✍️</span>
            <span className="text-sm font-medium flex-1 text-left">Give Feedback</span>
          </button>
        )}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-purple-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profile.preferences.videoPresence ? (
              <Video className="w-4 h-4 text-purple-600" />
            ) : (
              <VideoOff className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">Video Presence</span>
          </div>
          <button
            onClick={() => setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                videoPresence: !profile.preferences.videoPresence
              }
            })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.preferences.videoPresence ? 'bg-indigo-500' : 'bg-gray-200'
            }`}
            aria-label={`Toggle video presence ${profile.preferences.videoPresence ? 'off' : 'on'}`}
            aria-pressed={profile.preferences.videoPresence}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              profile.preferences.videoPresence ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌸</span>
            <span className="text-sm text-gray-700">Wellness Mode</span>
          </div>
          <button
            onClick={() => setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                sexualWellnessEnabled: !profile.preferences.sexualWellnessEnabled
              }
            })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.preferences.sexualWellnessEnabled ? 'bg-pink-500' : 'bg-gray-200'
            }`}
            aria-label={`Toggle sexual wellness mode ${profile.preferences.sexualWellnessEnabled ? 'off' : 'on'}`}
            aria-pressed={profile.preferences.sexualWellnessEnabled}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              profile.preferences.sexualWellnessEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">☁️</span>
            <span className="text-sm text-gray-700">Cloud Sync</span>
          </div>
          <button
            onClick={() => setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                cloudSync: !profile.preferences.cloudSync
              }
            })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.preferences.cloudSync ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            aria-label={`Toggle cloud sync ${profile.preferences.cloudSync ? 'off' : 'on'}`}
            aria-pressed={profile.preferences.cloudSync}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              profile.preferences.cloudSync ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="pt-3 border-t border-purple-100">
          <p className="text-xs font-medium text-gray-700 mb-2">Accessibility</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-700">High Contrast</span>
            <button
              onClick={() => setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  highContrast: !profile.preferences.highContrast
                }
              })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                profile.preferences.highContrast ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
              aria-label={`Toggle high contrast ${profile.preferences.highContrast ? 'off' : 'on'}`}
              aria-pressed={profile.preferences.highContrast}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                profile.preferences.highContrast ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700">Large Text</span>
            <button
              onClick={() => setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  largeText: !profile.preferences.largeText
                }
              })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                profile.preferences.largeText ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
              aria-label={`Toggle large text ${profile.preferences.largeText ? 'off' : 'on'}`}
              aria-pressed={profile.preferences.largeText}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                profile.preferences.largeText ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="chat-pace" className="text-sm text-gray-700 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Chat Pace
          </label>
          <select
            id="chat-pace"
            value={profile.preferences.chatPace}
            onChange={(e) => setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                chatPace: e.target.value as 'slow' | 'medium' | 'fast'
              }
            })}
            className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Select chat response pace"
          >
            <option value="slow">Slow & Thoughtful</option>
            <option value="medium">Medium</option>
            <option value="fast">Quick Responses</option>
          </select>
        </div>

        <button
          onClick={handleClearData}
          className="w-full text-xs text-red-600 hover:text-red-700 py-2 text-center"
          aria-label="Delete all data and reset app"
        >
          Delete All Data
        </button>
      </div>
    </div>
  );
}