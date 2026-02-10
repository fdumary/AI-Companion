import { useState } from 'react';
import { BookOpen, Plus } from './Icons';
import { UserProfile } from '../App';

interface JournalPanelProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function JournalPanel({ profile, setProfile }: JournalPanelProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  
  const entries = profile.journalEntries || [];

  const handleSaveEntry = () => {
    if (!newTopic.trim() || !newContent.trim()) return;
    
    const newEntry = {
      id: Date.now().toString(),
      topic: newTopic.trim(),
      content: newContent.trim(),
      date: new Date(),
    };
    
    setProfile({
      ...profile,
      journalEntries: [newEntry, ...entries],
    });
    
    setNewTopic('');
    setNewContent('');
    setIsWriting(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Delete this journal entry?')) {
      setProfile({
        ...profile,
        journalEntries: entries.filter(e => e.id !== id),
      });
    }
  };

  if (isWriting) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">New Journal Entry</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Title
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g., Reflections on boundaries"
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your thoughts
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write freely... this is your private space."
                  rows={12}
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsWriting(false);
                  setNewTopic('');
                  setNewContent('');
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEntry}
                disabled={!newTopic.trim() || !newContent.trim()}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Journal</h2>
            <p className="text-gray-600">
              Reflections and insights from your journey
            </p>
          </div>
          <button 
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Your journal is waiting</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create a space for your thoughts, reflections, and insights. Write freely about your journey, patterns you're noticing, or anything on your mind.
            </p>
            <button 
              onClick={() => setIsWriting(true)}
              className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
            >
              Start Writing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex-1">{entry.topic}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
