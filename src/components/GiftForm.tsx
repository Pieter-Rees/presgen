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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = useCallback((field: keyof GiftFormErrors) => {
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleStringChange = useCallback((field: 'name' | 'relationship' | 'age' | 'budget' | 'occasion' | 'additionalInfo', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  }, [clearError]);

  const handleInterestToggle = useCallback((interest: string) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
    clearError('interests');
  }, [clearError]);

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validateForm, onSubmit, formData]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 sm:space-y-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full mb-4">
            <span className="text-xl sm:text-2xl">✨</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Tell us about the gift recipient
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            The more details you provide, the better our AI suggestions will be!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Recipient&apos;s Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleStringChange('name', e.target.value)}
              disabled={isGenerating || isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter their name"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Your Relationship *
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleStringChange('relationship', e.target.value)}
              disabled={isGenerating || isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.relationship ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select relationship</option>
              {relationshipOptions.map(option => (
                <option key={option} value={option}>
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="text-red-600 text-sm">{errors.relationship}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Age Range *
            </label>
            <select
              value={formData.age}
              onChange={(e) => handleStringChange('age', e.target.value)}
              disabled={isGenerating || isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.age ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select age range</option>
              {ageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.age && <p className="text-red-600 text-sm">{errors.age}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Interests * (Click to set importance - first click is most important)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                      disabled={isGenerating || isSubmitting}
                      className="sr-only"
                    />
                    <div className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer relative ${
                      (isGenerating || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                    }`}>
                      {importanceNumber && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          {importanceNumber}
                        </div>
                      )}
                      <span className="text-sm font-medium capitalize text-slate-900">{capitalizeFirst(interest)}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.interests && <p className="text-red-600 text-sm">{errors.interests}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Budget Range *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {budgetOptions.map(option => (
                <label key={option.value} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={formData.budget === option.value}
                    onChange={(e) => handleStringChange('budget', e.target.value)}
                    disabled={isGenerating || isSubmitting}
                    className="sr-only"
                  />
                  <div className={`p-4 sm:p-6 rounded-lg border-2 transition-all text-center cursor-pointer ${
                    (isGenerating || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    formData.budget === option.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}>
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-600 font-medium">{option.range}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.budget && <p className="text-red-600 text-sm">{errors.budget}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Occasion *
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => handleStringChange('occasion', e.target.value)}
              disabled={isGenerating || isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.occasion ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select occasion</option>
              {occasionOptions.map(option => (
                <option key={option} value={option}>
                  {capitalizeFirst(option)}
                </option>
              ))}
            </select>
            {errors.occasion && <p className="text-red-600 text-sm">{errors.occasion}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleStringChange('additionalInfo', e.target.value)}
              rows={4}
              disabled={isGenerating || isSubmitting}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-colors border-slate-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Any special preferences, hobbies, or details that might help us find the perfect gift..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating || isSubmitting}
              className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg text-base hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isGenerating || isSubmitting) ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Suggestions...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
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