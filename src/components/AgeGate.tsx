interface AgeGateProps {
  onConfirm: () => void;
}

export function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <main 
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8"
        role="main"
        aria-labelledby="age-gate-title"
      >
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-3xl" role="img" aria-label="flower">🌸</span>
          </div>
          <h1 id="age-gate-title" className="text-2xl font-semibold text-gray-800 mb-2">
            AI Companion
          </h1>
          <p className="text-gray-600">
            Your safe space for emotional connection and
            self-discovery
          </p>
        </div>

        <section 
          className="bg-purple-50 rounded-2xl p-6 mb-6"
          aria-labelledby="age-verification-heading"
        >
          <h2 id="age-verification-heading" className="font-semibold text-gray-800 mb-3">
            Age Verification
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            AI Companion is designed for adults aged 18 and
            over. This app provides a space to explore emotional
            wellness, boundaries, and intimacy in a safe,
            private environment.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            By continuing, you confirm that you are at least 18
            years old.
          </p>
        </section>

        <button
          onClick={onConfirm}
          className="w-full py-4 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="Confirm I am 18 years or older and continue to app"
        >
          I am 18 or older
        </button>

        <section 
          className="mt-6 pt-6 border-t border-gray-200"
          aria-labelledby="privacy-promise-heading"
        >
          <h3 id="privacy-promise-heading" className="text-sm font-semibold text-gray-800 mb-2">
            Privacy Promise
          </h3>
          <ul className="text-xs text-gray-600 space-y-1" role="list">
            <li>
              • Your conversations are encrypted and private
            </li>
            <li>• You can delete your data anytime</li>
            <li>• No sharing with third parties</li>
            <li>• Full control over your boundaries</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
