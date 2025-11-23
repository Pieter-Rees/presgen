'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import type { SavedRecipient } from '@/types/gift';
import { formatDate, getBudgetLabel, formatAgeRange, capitalizeFirst } from '@/utils/formatting';

interface SavedRecipientsProps {
  recipients: SavedRecipient[];
  onBack: () => void;
  onUseRecipient: (recipient: SavedRecipient) => void;
  onRemoveRecipient: (id: string) => void;
}

const SavedRecipients = memo(function SavedRecipients({
  recipients,
  onBack,
  onUseRecipient,
  onRemoveRecipient,
}: SavedRecipientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');

  const relationships = useMemo(
    () => ['all', ...Array.from(new Set(recipients.map(recipient => recipient.relationship)))],
    [recipients]
  );

  const filteredRecipients = useMemo(() => {
    return recipients
      .filter(recipient => {
        if (relationshipFilter !== 'all' && recipient.relationship !== relationshipFilter) {
          return false;
        }

        if (!searchTerm.trim()) {
          return true;
        }

        const term = searchTerm.trim().toLowerCase();
        return (
          recipient.name.toLowerCase().includes(term) ||
          recipient.occasion.toLowerCase().includes(term) ||
          recipient.interests.some(interest => interest.toLowerCase().includes(term))
        );
      })
      .sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
  }, [recipients, searchTerm, relationshipFilter]);

  const handleRelationshipChange = useCallback((value: string) => {
    setRelationshipFilter(value);
  }, []);

  const handleUseRecipient = useCallback(
    (recipient: SavedRecipient) => {
      onUseRecipient(recipient);
    },
    [onUseRecipient]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="ribbon ribbon-blue text-xs px-8 py-1">
            RECIPIENT DATABASE
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-20 h-20 military-badge rounded-lg mb-6 mt-6">
          <span className="text-3xl">👥</span>
        </div>
        <h2 className="text-4xl font-black text-army-gold military-text mb-6 uppercase tracking-tight">
          Saved Recipients
        </h2>
        <p className="text-army-khaki-light text-lg mb-8 font-semibold">
          Reuse recipient profiles to generate fresh gift ideas faster
        </p>

        <button
          onClick={onBack}
          className="military-badge text-army-gold font-black py-3 px-6 rounded-lg text-lg uppercase tracking-wide hover:scale-105 transition-all duration-300 mb-8 cursor-pointer"
        >
          ← Back to Generator
        </button>
      </div>

      <div className="military-badge rounded-lg shadow-2xl p-6 mb-8">
        <div className="ribbon ribbon-green text-xs px-3 py-1 mb-4 inline-block">SEARCH & FILTER</div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-bold text-army-gold uppercase tracking-wide block mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search by name, interest, or occasion"
              className="w-full px-4 py-3 border-2 border-army-gold/50 rounded-lg bg-army-dark/50 backdrop-blur-sm text-army-khaki-light focus:ring-2 focus:ring-army-gold focus:border-army-gold transition-all duration-300 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-army-gold uppercase tracking-wide block mb-2">
              Relationship
            </label>
            <select
              value={relationshipFilter}
              onChange={event => handleRelationshipChange(event.target.value)}
              className="w-full px-4 py-3 border-2 border-army-gold/50 rounded-lg bg-army-dark text-white focus:ring-2 focus:ring-army-gold focus:border-army-gold transition-all duration-300 cursor-pointer font-semibold"
            >
              {relationships.map(relationship => (
                <option key={relationship} value={relationship} className="bg-army-dark text-white">
                  {relationship === 'all' ? 'All relationships' : capitalizeFirst(relationship)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 military-badge rounded-lg mb-6">
            <span className="text-3xl">📇</span>
          </div>
          <h4 className="text-xl font-black text-army-gold military-text mb-2 uppercase">
            {recipients.length === 0 ? 'No saved recipients yet' : 'No recipients match your search'}
          </h4>
          <p className="text-army-khaki-light font-semibold">
            {recipients.length === 0
              ? 'Generate a gift once and we will store their profile for next time.'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipients.map((recipient) => (
            <div
              key={recipient.id}
              className="military-badge p-6 rounded-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-army-khaki-light uppercase tracking-wide font-semibold">Recipient</p>
                  <h3 className="text-xl font-black text-army-gold military-text uppercase">{recipient.name}</h3>
                  <p className="text-army-khaki-light capitalize font-semibold">{recipient.relationship}</p>
                </div>
                <span className="ribbon text-xs px-3 py-1">
                  {formatDate(recipient.savedAt)}
                </span>
              </div>

              <div className="space-y-3 text-sm text-army-khaki-light mb-4 font-semibold">
                <div className="flex justify-between">
                  <span>Age range</span>
                  <span className="text-army-gold font-bold">{formatAgeRange(recipient.age)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget</span>
                  <span className="text-army-gold font-bold">{getBudgetLabel(recipient.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occasion</span>
                  <span className="text-army-gold font-bold uppercase">{recipient.occasion}</span>
                </div>
              </div>

              <div className="military-badge border border-army-gold rounded-lg p-3 mb-4">
                <div className="ribbon ribbon-blue text-xs px-2 py-0.5 mb-2 inline-block">TOP INTERESTS</div>
                <div className="flex flex-wrap gap-2">
                  {recipient.interests.slice(0, 3).map((interest, interestIndex) => (
                    <span key={interest} className="ribbon text-xs px-3 py-1">
                      #{interestIndex + 1} {capitalizeFirst(interest)}
                    </span>
                  ))}
                  {recipient.interests.length > 3 && (
                    <span className="ribbon ribbon-green text-xs px-3 py-1">
                      +{recipient.interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {recipient.additionalInfo && (
                <div className="text-sm text-army-khaki-light mb-4">
                  <div className="ribbon ribbon-green text-xs px-2 py-0.5 mb-1 inline-block">NOTES</div>
                  <p className="leading-relaxed font-semibold">{recipient.additionalInfo}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleUseRecipient(recipient)}
                  className="flex-1 military-badge text-army-gold py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Use Profile
                </button>
                <button
                  onClick={() => onRemoveRecipient(recipient.id)}
                  className="military-badge border-2 border-red-600 text-red-400 py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-600/20 transition-all duration-300 cursor-pointer"
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

export default SavedRecipients;

