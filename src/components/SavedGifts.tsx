'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import type { SavedGift } from '@/types/gift';
import GiftCard from '@/components/ui/GiftCard';

interface SavedGiftsProps {
  savedGifts: SavedGift[];
  onRemoveGift: (id: string) => void;
  onBack: () => void;
  onViewDetail: (gift: SavedGift) => void;
  onClearAllGifts: () => void;
}

const SavedGifts = memo(function SavedGifts({ savedGifts, onRemoveGift, onBack, onViewDetail, onClearAllGifts }: SavedGiftsProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(savedGifts.map(gift => gift.category)))],
    [savedGifts]
  );
  
  const filteredGifts = useMemo(() => 
    savedGifts
      .filter(gift => filterCategory === 'all' || gift.category === filterCategory)
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price.localeCompare(b.price);
          case 'date':
          default:
            return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        }
      }),
    [savedGifts, filterCategory, sortBy]
  );

  const handleFilterChange = useCallback((value: string) => {
    setFilterCategory(value);
  }, []);

  const handleSortChange = useCallback((value: 'date' | 'name' | 'price') => {
    setSortBy(value);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="ribbon ribbon-red text-xs px-8 py-1">
            GIFT ARSENAL
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-20 h-20 military-badge rounded-lg mb-6 mt-6">
          <span className="text-3xl">💝</span>
        </div>
        <h2 className="text-4xl font-black text-army-gold military-text mb-6 uppercase tracking-tight">
          Saved Gifts
        </h2>
        <p className="text-army-khaki-light text-lg mb-8 font-semibold">
          Your personalized gift collection ({savedGifts.length} items)
        </p>
        
        <div className="flex gap-4 justify-center items-center mb-8">
          <button
            onClick={onBack}
            className="military-badge text-army-gold font-black py-3 px-6 rounded-lg text-lg uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            ← Back to Generator
          </button>
          {savedGifts.length > 0 && (
            <button
              onClick={onClearAllGifts}
              className="military-badge border-2 border-red-600 text-red-400 font-black py-3 px-6 rounded-lg text-lg uppercase tracking-wide hover:bg-red-600/20 transition-all duration-300 cursor-pointer"
            >
              Clear All Gifts
            </button>
          )}
        </div>
      </div>

      <div className="military-badge rounded-lg shadow-2xl p-6 mb-8">
        <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-4 inline-block">FILTER & SORT</div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-bold text-army-gold uppercase tracking-wide">Filter by:</label>
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border-2 border-army-gold/50 rounded-lg bg-army-dark text-white focus:ring-2 focus:ring-army-gold focus:border-army-gold transition-all duration-300 cursor-pointer font-semibold"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-army-dark text-white">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-bold text-army-gold uppercase tracking-wide">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'date' | 'name' | 'price')}
              className="px-4 py-2 border-2 border-army-gold/50 rounded-lg bg-army-dark text-white focus:ring-2 focus:ring-army-gold focus:border-army-gold transition-all duration-300 cursor-pointer font-semibold"
            >
              <option value="date" className="bg-army-dark text-white">Date Saved</option>
              <option value="name" className="bg-army-dark text-white">Name</option>
              <option value="price" className="bg-army-dark text-white">Price</option>
            </select>
          </div>
        </div>
      </div>

      {filteredGifts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 military-badge rounded-lg mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h4 className="text-xl font-black text-army-gold military-text mb-2 uppercase">
            {savedGifts.length === 0 ? 'No saved gifts yet' : 'No gifts match your filter'}
          </h4>
          <p className="text-army-khaki-light font-semibold">
            {savedGifts.length === 0 
              ? 'Start generating gifts and save your favorites!' 
              : 'Try adjusting your filters to see more gifts'
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onViewDetail={() => onViewDetail(gift)}
              onRemove={() => onRemoveGift(gift.id)}
              showRecipientInfo
              size="sm"
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default SavedGifts; 