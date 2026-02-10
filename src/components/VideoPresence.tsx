export function VideoPresence() {
  return (
    <div className="bg-gradient-to-br from-purple-400 to-indigo-500 h-48 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Avatar */}
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center text-2xl">
            🌸
          </div>
        </div>
        <p className="text-white font-medium">Eli is here</p>
        <p className="text-white/80 text-sm">Listening with care</p>
      </div>
    </div>
  );
}
