'use client';

import { memo } from 'react';
import UserMenu from '@/components/UserMenu';

interface HeaderProps {
  onViewSavedGifts: () => void;
  onViewSavedRecipients: () => void;
  onGenerateNewGift: () => void;
  savedGiftsCount: number;
  savedRecipientsCount: number;
}

const Header = memo(function Header({
  onViewSavedGifts,
  onViewSavedRecipients,
  onGenerateNewGift,
  savedGiftsCount,
  savedRecipientsCount,
}: HeaderProps) {
  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎁</span>
              </div>
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
            <button 
              onClick={onGenerateNewGift}
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span>✨</span>
              <span>Generate New Gift</span>
            </button>
            
            <div className="hidden md:flex">
              <UserMenu
                savedGiftsCount={savedGiftsCount}
                savedRecipientsCount={savedRecipientsCount}
                onViewSavedGifts={onViewSavedGifts}
                onViewSavedRecipients={onViewSavedRecipients}
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-purple-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
            
            <div className="md:hidden">
              <UserMenu
                savedGiftsCount={savedGiftsCount}
                savedRecipientsCount={savedRecipientsCount}
                onViewSavedGifts={onViewSavedGifts}
                onViewSavedRecipients={onViewSavedRecipients}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header; 