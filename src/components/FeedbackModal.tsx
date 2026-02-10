import { useState } from 'react';

export interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'feedback';
  subject: string;
  description: string;
  email?: string;
  timestamp: Date;
  status: 'submitted' | 'exported';
}

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'>) => void;
}

export function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [type, setType] = useState<'bug' | 'feature' | 'feedback'>('feedback');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    onSubmit({
      type,
      subject: subject.trim(),
      description: description.trim(),
      email: email.trim() || undefined,
    });

    onClose();
  };

  const typeOptions = [
    { value: 'bug', label: '🐛 Bug Report', desc: 'Report something that isn\'t working' },
    { value: 'feature', label: '✨ Feature Request', desc: 'Suggest a new feature or improvement' },
    { value: 'feedback', label: '💭 General Feedback', desc: 'Share your thoughts or experience' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Share Your Feedback</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to share?
            </label>
            <div className="space-y-2">
              {typeOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value as 'bug' | 'feature' | 'feedback')}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                    type === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'bug' ? 'What\'s broken?' : type === 'feature' ? 'What would you like to see?' : 'Summary'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                type === 'bug' 
                  ? 'e.g., Chat messages not sending' 
                  : type === 'feature'
                  ? 'e.g., Voice mode for chatting'
                  : 'Brief summary of your feedback'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'bug' ? 'What happened? What did you expect?' : 'Tell us more'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'bug'
                  ? 'Steps to reproduce:\n1. I clicked...\n2. Then I...\n3. Expected... but got...'
                  : type === 'feature'
                  ? 'Describe how this feature would help you...'
                  : 'Share your thoughts, suggestions, or experience...'
              }
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {/* Optional Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only if you'd like us to follow up with you
            </p>
          </div>

          {/* Privacy Note */}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Privacy note:</strong> Your feedback is stored locally on your device. To share it with us, 
              you'll be able to export it after submitting. We never automatically collect or send your data.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!subject.trim() || !description.trim()}
              className="flex-1 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
