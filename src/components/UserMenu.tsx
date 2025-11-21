'use client';

import { useState, useRef, useEffect } from 'react';

interface UserMenuProps {
  savedGiftsCount: number;
  savedRecipientsCount: number;
  onViewSavedGifts: () => void;
  onViewSavedRecipients: () => void;
}

const UserMenu = ({ savedGiftsCount, savedRecipientsCount, onViewSavedGifts, onViewSavedRecipients }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const totalItems = savedGiftsCount + savedRecipientsCount;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-purple-50 bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
      >
        <span className="text-lg">🌟</span>
        <span>My Menu</span>
        {totalItems > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20 p-5 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-300 mb-2">Saved Overview</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                <p className="text-sm text-purple-300 mb-1">Saved Gifts</p>
                <p className="text-2xl font-bold text-purple-100">{savedGiftsCount}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                <p className="text-sm text-purple-300 mb-1">Saved Recipients</p>
                <p className="text-2xl font-bold text-purple-100">{savedRecipientsCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onViewSavedGifts();
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              💝 View Saved Gifts
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onViewSavedRecipients();
              }}
              className="w-full bg-white/10 backdrop-blur-sm border border-purple-500/30 text-purple-100 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              👥 View Saved Recipients
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-xs text-purple-300">
            <p>Use recipient profiles to prefill the generator and avoid repeating details.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

