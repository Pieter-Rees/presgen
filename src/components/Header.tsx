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
    <header className="bg-army-dark/95 backdrop-blur-sm border-b-2 border-army-gold sticky top-0 z-50 shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-army-gold to-transparent"></div>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 military-badge rounded-lg flex items-center justify-center">
                <span className="text-army-gold font-bold text-xl">🎁</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-army-gold military-text uppercase tracking-tight">
                PresGen
              </h1>
              <div className="ribbon text-xs px-2 py-0.5 mt-0.5">
                AI-Powered Gift Discovery
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onGenerateNewGift}
              className="hidden md:flex items-center space-x-2 military-badge text-army-gold px-4 py-2 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
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
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-army-gold font-bold">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-army-gold"></div>
              <span className="uppercase tracking-wide">AI Ready</span>
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