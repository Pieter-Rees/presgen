import { memo } from 'react';

const Header = memo(function Header({ onViewSavedGifts, onGenerateNewGift }: { onViewSavedGifts?: () => void; onGenerateNewGift?: () => void }) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-purple-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 gradient-magic rounded-xl flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-lg">🎁</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                PresGen
              </h1>
              <p className="text-xs text-purple-200 font-medium tracking-wide">
                AI-Powered Gift Discovery
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {onGenerateNewGift && (
              <button 
                onClick={onGenerateNewGift}
                className="hidden md:flex items-center space-x-2 btn-modern gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span>✨</span>
                <span>Generate New Gift</span>
              </button>
            )}
            
            {onViewSavedGifts && (
              <button 
                onClick={onViewSavedGifts}
                className="hidden md:flex items-center space-x-2 glass-text px-4 py-2 rounded-xl text-sm font-semibold text-purple-200 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer"
              >
                <span>💝</span>
                <span>Saved Gifts </span>
                
              </button>
            )}
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-purple-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
            
            <button className="md:hidden p-2 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 focus-ring cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header; 