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
  initialData?: GiftFormData | null;
}

const EMPTY_FORM_DATA: GiftFormData = {
  name: '',
  relationship: '',
  age: '',
  interests: [],
  budget: '',
  occasion: '',
  additionalInfo: ''
};

const cloneFormData = (data: GiftFormData): GiftFormData => ({
  ...data,
  interests: [...data.interests],
});

const GiftForm = memo(function GiftForm({ onSubmit, isGenerating, initialData }: GiftFormProps) {
  const [formData, setFormData] = useState<GiftFormData>(
    initialData ? cloneFormData(initialData) : cloneFormData(EMPTY_FORM_DATA)
  );

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
      <div className="military-badge rounded-lg shadow-2xl p-8 space-y-8">
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="ribbon ribbon-blue text-xs px-6 py-1">
              RECIPIENT INTELLIGENCE FORM
            </div>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 military-badge rounded-lg mb-4 mt-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-black text-army-gold military-text mb-3 uppercase tracking-tight">
            Tell us about the gift recipient
          </h2>
          <div className="ribbon-decoration inline-block">
            <p className="text-army-khaki-light text-lg font-semibold">
              The more details you provide, the better our AI suggestions will be!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
              Recipient&apos;s Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleStringChange('name', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-army-gold focus:border-army-gold text-army-khaki-light bg-army-dark/50 backdrop-blur-sm transition-all duration-300 font-semibold ${
                errors.name ? 'border-red-600' : 'border-army-gold/50 hover:border-army-gold'
              }`}
              placeholder="Enter their name"
            />
            {errors.name && <p className="text-red-400 text-sm font-bold uppercase">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
              Your Relationship *
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleStringChange('relationship', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-army-gold focus:border-army-gold text-army-khaki bg-army-dark/50 backdrop-blur-sm transition-all duration-300 font-semibold cursor-pointer ${
                errors.relationship ? 'border-red-600' : 'border-army-gold/50 hover:border-army-gold'
              }`}
            >
              <option value="">Select relationship</option>
              {relationshipOptions.map(option => (
                <option key={option} value={option} className="bg-army-dark">
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="text-red-400 text-sm font-bold uppercase">{errors.relationship}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
              Age Range *
            </label>
            <select
              value={formData.age}
              onChange={(e) => handleStringChange('age', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-army-gold focus:border-army-gold text-army-khaki bg-army-dark/50 backdrop-blur-sm transition-all duration-300 font-semibold cursor-pointer ${
                errors.age ? 'border-red-600' : 'border-army-gold/50 hover:border-army-gold'
              }`}
            >
              <option value="">Select age range</option>
              {ageOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-army-dark">
                  {option.label}
                </option>
              ))}
            </select>
            {errors.age && <p className="text-red-400 text-sm font-bold uppercase">{errors.age}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
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
                    <div className={`p-4 rounded-lg border-2 transition-all duration-300 group-hover:scale-105 cursor-pointer relative military-badge ${
                      isSelected
                        ? 'border-army-gold bg-army-gold/20 text-army-gold shadow-lg'
                        : 'border-army-gold/50 bg-army-dark/50 hover:border-army-gold hover:bg-army-gold/10'
                    }`}>
                      {importanceNumber && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 ribbon rounded-full flex items-center justify-center text-army-dark text-xs font-black shadow-lg">
                          {importanceNumber}
                        </div>
                      )}
                      <span className="text-sm font-bold capitalize text-army-khaki-light">{capitalizeFirst(interest)}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.interests && <p className="text-red-400 text-sm font-bold uppercase">{errors.interests}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
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
                  <div className={`p-6 rounded-lg border-2 transition-all duration-300 group-hover:scale-105 text-center cursor-pointer military-badge ${
                    formData.budget === option.value
                      ? 'border-army-gold bg-army-gold/20 text-army-gold shadow-lg'
                      : 'border-army-gold/50 bg-army-dark/50 hover:border-army-gold hover:bg-army-gold/10'
                  }`}>
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-bold text-army-khaki-light">{option.label}</div>
                    <div className="text-sm text-army-khaki-light/90 font-semibold">{option.range}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.budget && <p className="text-red-400 text-sm font-bold uppercase">{errors.budget}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
              Occasion *
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => handleStringChange('occasion', e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-army-gold focus:border-army-gold text-army-khaki bg-army-dark/50 backdrop-blur-sm transition-all duration-300 font-semibold cursor-pointer ${
                errors.occasion ? 'border-red-600' : 'border-army-gold/50 hover:border-army-gold'
              }`}
            >
              <option value="">Select occasion</option>
              {occasionOptions.map(option => (
                <option key={option} value={option} className="bg-army-dark">
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.occasion && <p className="text-red-400 text-sm font-bold uppercase">{errors.occasion}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-army-gold uppercase tracking-wide">
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleStringChange('additionalInfo', e.target.value)}
              rows={4}
              className="w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-army-gold focus:border-army-gold text-army-khaki bg-army-dark/50 backdrop-blur-sm transition-all duration-300 border-army-gold/50 hover:border-army-gold resize-none font-semibold"
              placeholder="Any special preferences, hobbies, or details that might help us find the perfect gift..."
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full military-badge text-army-gold font-black py-4 px-8 rounded-lg text-lg uppercase tracking-wide hover:scale-105 focus:ring-2 focus:ring-army-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-army-gold"></div>
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