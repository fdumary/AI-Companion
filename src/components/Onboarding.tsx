import { useState } from 'react';
import { UserProfile } from '../App';

interface OnboardingProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [safeWord, setSafeWord] = useState('pause');
  const [sexualWellnessEnabled, setSexualWellnessEnabled] = useState(false);

  const offLimitOptions = [
    'Past trauma',
    'Family issues',
    'Political topics',
    'Religious topics',
    'Specific people in my life',
    'None - I\'m open to anything',
  ];

  const handleComplete = () => {
    onComplete({
      name: name.trim() || undefined,
      preferences: {
        videoPresence: false,
        chatPace: 'medium',
        sexualWellnessEnabled,
        cloudSync: false,
        highContrast: false,
        largeText: false,
      },
      boundaries: {
        offLimitsTopics: selectedTopics.filter(t => t !== 'None - I\'m open to anything'),
        safeWord: safeWord || 'pause',
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <main 
        className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8"
        role="main"
        aria-labelledby="onboarding-title"
      >
        {/* Progress */}
        <div 
          className="flex gap-2 mb-8"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label={`Step ${step} of 3`}
        >
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Step {step} of 3: {
            step === 1 ? 'Introduction' :
            step === 2 ? 'Set your boundaries' :
            'Configure wellness mode'
          }
        </div>

        {step === 1 && (
          <div>
            <h2 id="onboarding-title" className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome to AI Companion
            </h2>
            <p className="text-gray-600 mb-6">
              I'm Eli, your gentle listener. Let's start by getting to know each other.
            </p>

            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="user-name-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  What should I call you? (Optional)
                </label>
                <input
                  id="user-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or nickname"
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-describedby="name-help-text"
                />
                <p id="name-help-text" className="text-xs text-gray-500 mt-1">
                  This helps me personalize our conversations.
                </p>
              </div>

              <div 
                className="bg-purple-50 rounded-xl p-4"
                role="note"
                aria-labelledby="what-to-expect-heading"
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong id="what-to-expect-heading">What to expect:</strong> We'll chat at your pace about whatever's on your mind—dating burnout, boundaries, desires, or just how you're feeling. I'll remember important details so you don't have to repeat yourself.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 id="onboarding-title" className="text-2xl font-semibold text-gray-800 mb-2">
              Your Boundaries Matter
            </h2>
            <p className="text-gray-600 mb-6">
              You're in complete control. Let me know what topics you'd prefer to avoid.
            </p>

            <div className="space-y-4">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Off-limits topics (select all that apply)
                </legend>
                <div className="space-y-2" role="group" aria-label="Off-limits topics selection">
                  {offLimitOptions.map(topic => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          if (topic === 'None - I\'m open to anything') {
                            setSelectedTopics([topic]);
                          } else {
                            setSelectedTopics(prev =>
                              prev.includes(topic)
                                ? prev.filter(t => t !== topic)
                                : [...prev.filter(t => t !== 'None - I\'m open to anything'), topic]
                            );
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={topic}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label 
                  htmlFor="safe-word-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your safe word
                </label>
                <input
                  id="safe-word-input"
                  type="text"
                  value={safeWord}
                  onChange={(e) => setSafeWord(e.target.value)}
                  placeholder="e.g., pause, stop, slow down"
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-describedby="safe-word-help-text"
                  required
                />
                <p id="safe-word-help-text" className="text-xs text-gray-500 mt-1">
                  Say this word anytime to immediately slow down or redirect the conversation
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 id="onboarding-title" className="text-2xl font-semibold text-gray-800 mb-2">
              Explore Safely
            </h2>
            <p className="text-gray-600 mb-6">
              Would you like to enable conversations about sexual wellness, desires, and intimacy?
            </p>

            <div className="space-y-4">
              <div 
                className="border-2 border-purple-200 rounded-xl p-4"
                role="region"
                aria-labelledby="wellness-mode-heading"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 id="wellness-mode-heading" className="font-semibold text-gray-800 mb-1">
                      Sexual Wellness Mode
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      This enables discussions about fantasies, arousal, boundaries, and what you want sexually—all in a judgment-free, consent-focused space. You can toggle this on or off anytime.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSexualWellnessEnabled(!sexualWellnessEnabled)}
                    className={`ml-4 w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${
                      sexualWellnessEnabled ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={sexualWellnessEnabled}
                    aria-label="Toggle sexual wellness mode"
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      sexualWellnessEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                    <span className="sr-only">
                      {sexualWellnessEnabled ? 'Sexual wellness mode is on' : 'Sexual wellness mode is off'}
                    </span>
                  </button>
                </div>
              </div>

              <div 
                className="bg-purple-50 rounded-xl p-4 space-y-2"
                role="note"
                aria-labelledby="reminders-heading"
              >
                <h4 id="reminders-heading" className="text-sm font-semibold text-gray-800">
                  Remember:
                </h4>
                <ul className="text-xs text-gray-700 space-y-1" role="list">
                  <li>• You control the pace and depth of every conversation</li>
                  <li>• Use your safe word "{safeWord}" anytime to pause</li>
                  <li>• You can change these settings whenever you want</li>
                  <li>• This is not therapy—it's a space for exploration and support</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex gap-3 mt-8" aria-label="Onboarding navigation">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Go back to previous step"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            className="flex-1 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label={step === 3 ? 'Complete onboarding and start chatting with Eli' : 'Continue to next step'}
          >
            {step === 3 ? 'Start Chatting with Eli' : 'Continue'}
          </button>
        </nav>
      </main>
    </div>
  );
}
