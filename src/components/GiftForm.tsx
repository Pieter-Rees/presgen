'use client';

import { useState, useCallback, memo } from 'react';
import type { GiftFormData } from '@/types/gift';
import { interestOptions, relationshipOptions, budgetOptions, occasionOptions, ageOptions } from '@/config/formOptions';
import { capitalizeFirst } from '@/utils/formatting';

interface GiftFormErrors {
  name?: string;
  relationship?: string;
  age?: string;
  interests?: string;
  budget?: string;
  occasion?: string;
  additionalInfo?: string;
}

interface GiftFormProps {
  onSubmit: (data: GiftFormData) => void;
  isGenerating: boolean;
}

const GiftForm = memo(function GiftForm({ onSubmit, isGenerating }: GiftFormProps) {
  const [formData, setFormData] = useState<GiftFormData>({
    name: '',
    relationship: '',
    age: '',
    interests: [],
    budget: '',
    occasion: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<GiftFormErrors>({});

  const handleStringChange = useCallback((field: 'name' | 'relationship' | 'age' | 'budget' | 'occasion' | 'additionalInfo', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleInterestToggle = useCallback((interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData(prev => ({ ...prev, interests: newInterests }));
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: undefined }));
    }
  }, [formData.interests, errors.interests]);

  const validateForm = useCallback((): boolean => {
    const newErrors: GiftFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    if (!formData.age) newErrors.age = 'Age range is required';
    if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.occasion) newErrors.occasion = 'Occasion is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [validateForm, onSubmit, formData]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass rounded-3xl shadow-2xl p-8 space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 animate-pulse-glow">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Tell us about the gift recipient
          </h2>
          <p className="text-purple-200 text-lg">
            The more details you provide, the better our AI suggestions will be!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-200">
              Recipient&apos;s Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleStringChange('name', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-foreground bg-white/5 backdrop-blur-sm transition-all duration-300 ${
                errors.name ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              placeholder="Enter their name"
            />
            {errors.name && <p className="text-red-400 text-sm font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-200">
              Your Relationship *
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleStringChange('relationship', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-foreground bg-white/5 backdrop-blur-sm transition-all duration-300 ${
                errors.relationship ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
            >
              <option value="">Select relationship</option>
              {relationshipOptions.map(option => (
                <option key={option} value={option}>
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="text-red-400 text-sm font-medium">{errors.relationship}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-200">
              Age Range *
            </label>
            <select
              value={formData.age}
              onChange={(e) => handleStringChange('age', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-foreground bg-white/5 backdrop-blur-sm transition-all duration-300 ${
                errors.age ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
            >
              <option value="">Select age range</option>
              {ageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.age && <p className="text-red-400 text-sm font-medium">{errors.age}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-purple-200">
              Interests * (Click to set importance - first click is most important)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interestOptions.map(interest => {
                const index = formData.interests.indexOf(interest);
                const isSelected = index !== -1;
                const importanceNumber = isSelected ? index + 1 : null;
                return (
                  <label key={interest} className="relative group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleInterestToggle(interest)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 group-hover:scale-105 cursor-pointer relative ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-200 shadow-lg'
                        : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
                    }`}>
                      {importanceNumber && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {importanceNumber}
                        </div>
                      )}
                      <span className="text-sm font-medium capitalize">{capitalizeFirst(interest)}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.interests && <p className="text-red-400 text-sm font-medium">{errors.interests}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-purple-200">
              Budget Range *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map(option => (
                <label key={option.value} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={formData.budget === option.value}
                    onChange={(e) => handleStringChange('budget', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-xl border-2 transition-all duration-300 group-hover:scale-105 text-center cursor-pointer ${
                    formData.budget === option.value
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-200 shadow-lg'
                      : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
                  }`}>
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-purple-300">{option.range}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.budget && <p className="text-red-400 text-sm font-medium">{errors.budget}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-200">
              Occasion *
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => handleStringChange('occasion', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-foreground bg-white/5 backdrop-blur-sm transition-all duration-300 ${
                errors.occasion ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
            >
              <option value="">Select occasion</option>
              {occasionOptions.map(option => (
                <option key={option} value={option}>
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.occasion && <p className="text-red-400 text-sm font-medium">{errors.occasion}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-purple-200">
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleStringChange('additionalInfo', e.target.value)}
              rows={4}
              className="w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-foreground bg-white/5 backdrop-blur-sm transition-all duration-300 border-purple-500/30 hover:border-purple-400/50 resize-none"
              placeholder="Any special preferences, hobbies, or details that might help us find the perfect gift..."
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-modern bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating Suggestions...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🎁</span>
                  <span>Generate Gift Suggestions</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default GiftForm; 