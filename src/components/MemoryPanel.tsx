import { UserProfile, MemoryItem } from '../App';

interface MemoryPanelProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function MemoryPanel({ profile, setProfile }: MemoryPanelProps) {
  const memories = profile.memories || [];
  
  const categorizedMemories = {
    personal: memories.filter(m => m.category === 'personal'),
    work: memories.filter(m => m.category === 'work'),
    relationship: memories.filter(m => m.category === 'relationship'),
    preference: memories.filter(m => m.category === 'preference'),
    boundary: memories.filter(m => m.category === 'boundary'),
    pattern: memories.filter(m => m.category === 'pattern'),
  };

  const categoryLabels: Record<string, { title: string; icon: string; color: string }> = {
    personal: { title: 'Personal', icon: '👤', color: 'from-blue-400 to-cyan-500' },
    work: { title: 'Work & Career', icon: '💼', color: 'from-purple-400 to-indigo-500' },
    relationship: { title: 'Relationships', icon: '💕', color: 'from-pink-400 to-rose-500' },
    preference: { title: 'Preferences', icon: '⭐', color: 'from-amber-400 to-orange-500' },
    boundary: { title: 'Boundaries', icon: '🛡️', color: 'from-teal-400 to-green-500' },
    pattern: { title: 'Patterns', icon: '🔄', color: 'from-violet-400 to-purple-500' },
  };

  const handleDeleteMemory = (id: string) => {
    setProfile({
      ...profile,
      memories: memories.filter(m => m.id !== id),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What Eli Remembers</h2>
          <p className="text-gray-600">
            Key details from our conversations that help me understand you better
          </p>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
              🧠
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Building your memory</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              As we chat, I'll remember important details about you—your work, preferences, patterns, and more. This helps our conversations feel more personal and continuous.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categoryLabels).map(([key, { title, icon, color }]) => {
              const items = categorizedMemories[key as keyof typeof categorizedMemories];
              if (items.length === 0) return null;

              return (
                <div key={key} className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${color}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{icon}</span>
                      <h3 className="font-semibold text-gray-800">{title}</h3>
                      <span className="text-sm text-gray-500">({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(memory => (
                        <div
                          key={memory.id}
                          className="flex items-start justify-between gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                        >
                          <p className="text-sm text-gray-700 flex-1">{memory.fact}</p>
                          <button
                            onClick={() => handleDeleteMemory(memory.id)}
                            className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-2">Privacy & Control</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            These memories are stored locally on your device. You can remove any memory by hovering over it and clicking "Remove." If you want to start fresh, you can clear all data from the settings.
          </p>
        </div>
      </div>
    </div>
  );
}