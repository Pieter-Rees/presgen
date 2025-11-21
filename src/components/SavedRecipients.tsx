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
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl mb-6">
          <span className="text-3xl">👥</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          Saved Recipients
        </h2>
        <p className="text-purple-200 text-lg mb-8">
          Reuse recipient profiles to generate fresh gift ideas faster
        </p>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl text-lg hover:shadow-xl transition-all duration-300 mb-8 cursor-pointer"
        >
          ← Back to Generator
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-semibold text-purple-200 block mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search by name, interest, or occasion"
              className="w-full px-4 py-3 border-2 border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm text-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-purple-200 block mb-2">
              Relationship
            </label>
            <select
              value={relationshipFilter}
              onChange={event => handleRelationshipChange(event.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm text-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 cursor-pointer"
            >
              {relationships.map(relationship => (
                <option key={relationship} value={relationship}>
                  {relationship === 'all' ? 'All relationships' : capitalizeFirst(relationship)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mb-6">
            <span className="text-3xl">📇</span>
          </div>
          <h4 className="text-xl font-semibold text-purple-200 mb-2">
            {recipients.length === 0 ? 'No saved recipients yet' : 'No recipients match your search'}
          </h4>
          <p className="text-purple-300">
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
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-purple-300">Recipient</p>
                  <h3 className="text-xl font-bold text-purple-100">{recipient.name}</h3>
                  <p className="text-purple-300 capitalize">{recipient.relationship}</p>
                </div>
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
                  {formatDate(recipient.savedAt)}
                </span>
              </div>

              <div className="space-y-3 text-sm text-purple-200 mb-4">
                <div className="flex justify-between">
                  <span className="text-purple-300">Age range</span>
                  <span>{formatAgeRange(recipient.age)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Budget</span>
                  <span>{getBudgetLabel(recipient.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Occasion</span>
                  <span className="capitalize">{recipient.occasion}</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 mb-4">
                <p className="text-xs uppercase tracking-wide text-purple-300 mb-2">Top Interests</p>
                <div className="flex flex-wrap gap-2">
                  {recipient.interests.slice(0, 3).map((interest, interestIndex) => (
                    <span key={interest} className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-100">
                      #{interestIndex + 1} {capitalizeFirst(interest)}
                    </span>
                  ))}
                  {recipient.interests.length > 3 && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-purple-300">
                      +{recipient.interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {recipient.additionalInfo && (
                <div className="text-sm text-purple-300 mb-4">
                  <p className="font-semibold text-purple-200 mb-1">Notes</p>
                  <p className="leading-relaxed">{recipient.additionalInfo}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleUseRecipient(recipient)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Use Profile
                </button>
                <button
                  onClick={() => onRemoveRecipient(recipient.id)}
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

export default SavedRecipients;

