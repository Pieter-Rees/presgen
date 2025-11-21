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
        className="flex items-center space-x-2 px-4 py-2 military-badge text-army-gold text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <span className="text-lg">🌟</span>
        <span>My Menu</span>
        {totalItems > 0 && (
          <span className="ml-1 ribbon text-xs px-2 py-0.5">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 military-badge rounded-lg shadow-2xl border-2 border-army-gold p-5 space-y-5">
          <div>
            <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-3 inline-block">INTELLIGENCE BRIEFING</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="military-badge border border-army-gold rounded-lg p-3">
                <p className="text-xs text-army-khaki-light mb-1 uppercase tracking-wide font-semibold">Saved Gifts</p>
                <p className="text-2xl font-black text-army-gold">{savedGiftsCount}</p>
              </div>
              <div className="military-badge border border-army-gold rounded-lg p-3">
                <p className="text-xs text-army-khaki mb-1 uppercase tracking-wide font-semibold">Saved Recipients</p>
                <p className="text-2xl font-black text-army-gold">{savedRecipientsCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onViewSavedGifts();
              }}
              className="w-full military-badge text-army-gold py-3 px-4 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              💝 View Saved Gifts
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onViewSavedRecipients();
              }}
              className="w-full military-badge border-2 border-army-gold text-army-khaki py-3 px-4 text-sm font-bold uppercase tracking-wide hover:bg-army-gold/20 transition-all duration-300 cursor-pointer"
            >
              👥 View Saved Recipients
            </button>
          </div>

          <div className="military-badge border border-army-gold rounded-lg p-3 text-xs text-army-khaki-light">
            <p>Use recipient profiles to prefill the generator and avoid repeating details.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

