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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">🎁</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900">
                PresGen
              </h1>
              <p className="text-xs text-slate-500">
                AI-Powered Gift Discovery
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onGenerateNewGift}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 cursor-pointer"
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
            
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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