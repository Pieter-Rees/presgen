'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import type { SavedGift } from '@/types/gift';
import { getCategoryIcon } from '@/utils/icons';
import { formatDate, getPriceLabel } from '@/utils/formatting';

interface SavedGiftsProps {
  savedGifts: SavedGift[];
  onRemoveGift: (id: string) => void;
  onBack: () => void;
  onViewDetail: (gift: SavedGift) => void;
}

const SavedGifts = memo(function SavedGifts({ savedGifts, onRemoveGift, onBack, onViewDetail }: SavedGiftsProps) {
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl mb-6">
          <span className="text-3xl">💝</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          Saved Gifts
        </h2>
        <p className="text-purple-200 text-lg mb-8">
          Your personalized gift collection ({savedGifts.length} items)
        </p>
        
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl text-lg hover:shadow-xl transition-all duration-300 mb-8 cursor-pointer"
        >
          ← Back to Generator
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-purple-200">Filter by:</label>
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border-2 border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm text-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-purple-200">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'date' | 'name' | 'price')}
              className="px-4 py-2 border-2 border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm text-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 cursor-pointer"
            >
              <option value="date">Date Saved</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {filteredGifts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h4 className="text-xl font-semibold text-purple-200 mb-2">
            {savedGifts.length === 0 ? 'No saved gifts yet' : 'No gifts match your filter'}
          </h4>
          <p className="text-purple-300">
            {savedGifts.length === 0 
              ? 'Start generating gifts and save your favorites!' 
              : 'Try adjusting your filters to see more gifts'
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGifts.map((gift) => (
            <div 
              key={gift.id} 
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getCategoryIcon(gift.category)}</div>
                <div className="text-right">
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
                    {gift.category}
                  </span>
                  <div className="text-lg font-bold text-purple-100 mt-2">
                    {getPriceLabel(gift.price)}
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-purple-200 mb-3 leading-tight">
                {gift.name}
              </h4>
              
              <p className="text-purple-300 mb-4 text-sm leading-relaxed">
                {gift.description}
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 mb-4">
                <p className="text-sm text-purple-200 leading-relaxed">
                  <span className="font-semibold">Why this gift:</span> {gift.reason}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-purple-300 mb-4">
                <span>For: {gift.recipientName}</span>
                <span>{formatDate(gift.savedAt)}</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => onViewDetail(gift)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onRemoveGift(gift.id)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-red-400 py-2 px-3 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SavedGifts; 