import { FeedbackItem } from './FeedbackModal';

interface FeedbackPanelProps {
  feedbackItems: FeedbackItem[];
  onDelete: (id: string) => void;
  onExport: () => void;
}

export function FeedbackPanel({ feedbackItems, onDelete, onExport }: FeedbackPanelProps) {
  const typeIcons = {
    bug: '🐛',
    feature: '✨',
    feedback: '💭',
  };

  const typeLabels = {
    bug: 'Bug Report',
    feature: 'Feature Request',
    feedback: 'General Feedback',
  };

  const typeColors = {
    bug: 'from-red-400 to-rose-500',
    feature: 'from-purple-400 to-indigo-500',
    feedback: 'from-blue-400 to-cyan-500',
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Feedback</h2>
            <p className="text-gray-600">
              Thank you for helping us improve AI Companion
            </p>
          </div>
          {feedbackItems.length > 0 && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
          )}
        </div>

        {feedbackItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
              💬
            </div>
            <h3 className="font-medium text-gray-800 mb-2">No feedback yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Found a bug or have a suggestion? Click the feedback button in the sidebar to share your thoughts.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className={`h-1 bg-gradient-to-r ${typeColors[item.type]}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeIcons[item.type]}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            {typeLabels[item.type]}
                          </span>
                          {item.status === 'exported' && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Exported
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800">{item.subject}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                    {item.description}
                  </p>
                  {item.email && (
                    <div className="text-sm text-gray-500">
                      Contact: {item.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-2">How to share your feedback</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Your feedback is stored locally for privacy. To share it with us:
          </p>
          <ol className="text-sm text-gray-700 space-y-1 ml-4">
            <li>1. Click "Export All" to download your feedback as a text file</li>
            <li>2. Email it to feedback@aicompanion.app (or your preferred method)</li>
            <li>3. We'll review and may follow up if you provided contact info</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
