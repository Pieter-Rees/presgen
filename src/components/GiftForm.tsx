'use client';

import { useState, useCallback, memo } from 'react';

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

  const interestOptions = [
    'technology', 'cooking', 'reading', 'fitness', 'art', 'music', 
    'travel', 'gaming', 'fashion', 'sports', 'photography', 'gardening'
  ];

  const relationshipOptions = [
    'friend', 'family', 'colleague', 'partner', 'acquaintance'
  ];

  const budgetOptions = [
    { value: 'low', label: 'Under $50', range: '$0-50', icon: '💰' },
    { value: 'medium', label: '$50-150', range: '$50-150', icon: '💎' },
    { value: 'high', label: '$150+', range: '$150+', icon: '👑' }
  ];

  const occasionOptions = [
    'birthday', 'christmas', 'anniversary', 'graduation', 'wedding', 
    'housewarming', 'thank you', 'just because'
  ];

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
          {/* Name */}
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

          {/* Relationship */}
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
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="text-red-400 text-sm font-medium">{errors.relationship}</p>}
          </div>

          {/* Age */}
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
              <option value="child">Child (0-12)</option>
              <option value="teen">Teen (13-19)</option>
              <option value="young-adult">Young Adult (20-29)</option>
              <option value="adult">Adult (30-49)</option>
              <option value="senior">Senior (50+)</option>
            </select>
            {errors.age && <p className="text-red-400 text-sm font-medium">{errors.age}</p>}
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-purple-200">
              Interests * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interestOptions.map(interest => (
                <label key={interest} className="relative group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 group-hover:scale-105 cursor-pointer ${
                    formData.interests.includes(interest)
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200 shadow-lg'
                      : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
                  }`}>
                    <span className="text-sm font-medium capitalize">{interest}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.interests && <p className="text-red-400 text-sm font-medium">{errors.interests}</p>}
          </div>

          {/* Budget */}
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

          {/* Occasion */}
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
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors.occasion && <p className="text-red-400 text-sm font-medium">{errors.occasion}</p>}
          </div>

          {/* Additional Info */}
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

          {/* Submit Button */}
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