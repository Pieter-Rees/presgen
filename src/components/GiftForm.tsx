'use client';

import { useState } from 'react';

interface GiftFormData {
  name: string;
  relationship: string;
  age: string;
  interests: string[];
  budget: string;
  occasion: string;
  additionalInfo: string;
}

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

export default function GiftForm({ onSubmit, isGenerating }: GiftFormProps) {
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

  const interestOptions = [
    'technology', 'cooking', 'reading', 'fitness', 'art', 'music', 
    'travel', 'gaming', 'fashion', 'sports', 'photography', 'gardening'
  ];

  const relationshipOptions = [
    'friend', 'family', 'colleague', 'partner', 'acquaintance'
  ];

  const budgetOptions = [
    { value: 'low', label: 'Under $50', range: '$0-50' },
    { value: 'medium', label: '$50-150', range: '$50-150' },
    { value: 'high', label: '$150+', range: '$150+' }
  ];

  const occasionOptions = [
    'birthday', 'christmas', 'anniversary', 'graduation', 'wedding', 
    'housewarming', 'thank you', 'just because'
  ];

  const handleStringChange = (field: 'name' | 'relationship' | 'age' | 'budget' | 'occasion' | 'additionalInfo', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData(prev => ({ ...prev, interests: newInterests }));
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: GiftFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    if (!formData.age) newErrors.age = 'Age range is required';
    if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.occasion) newErrors.occasion = 'Occasion is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about the gift recipient</h2>
          <p className="text-gray-600">The more details you provide, the better our suggestions will be!</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient&apos;s Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleStringChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter their name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Relationship *
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => handleStringChange('relationship', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
              errors.relationship ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select relationship</option>
            {relationshipOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.relationship && <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range *
          </label>
          <select
            value={formData.age}
            onChange={(e) => handleStringChange('age', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select age range</option>
            <option value="child">Child (0-12)</option>
            <option value="teen">Teen (13-19)</option>
            <option value="young-adult">Young Adult (20-29)</option>
            <option value="adult">Adult (30-49)</option>
            <option value="senior">Senior (50+)</option>
          </select>
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map(interest => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 bg-white"
                />
                <span className="text-sm text-gray-700 capitalize">{interest}</span>
              </label>
            ))}
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {budgetOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 bg-white">
                <input
                  type="radio"
                  name="budget"
                  value={option.value}
                  checked={formData.budget === option.value}
                  onChange={(e) => handleStringChange('budget', e.target.value)}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 bg-white"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.range}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
        </div>

        {/* Occasion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occasion *
          </label>
          <select
            value={formData.occasion}
            onChange={(e) => handleStringChange('occasion', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
              errors.occasion ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select occasion</option>
            {occasionOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.occasion && <p className="text-red-500 text-sm mt-1">{errors.occasion}</p>}
        </div>

        {/* Additional Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleStringChange('additionalInfo', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Any other details that might help us suggest the perfect gift..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating gift suggestions...</span>
            </div>
          ) : (
            'Generate Gift Suggestions'
          )}
        </button>
      </form>
    </div>
  );
} 