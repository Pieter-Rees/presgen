export const interestOptions = [
  'technology', 'cooking', 'reading', 'fitness', 'art', 'music', 
  'travel', 'gaming', 'fashion', 'sports', 'photography', 'gardening',
] as const;

export const relationshipOptions = [
  'friend', 'family', 'colleague', 'partner', 'acquaintance',
] as const;

export const budgetOptions = [
  { value: 'low', label: 'Under $50', range: '$0-50', icon: '💰' },
  { value: 'medium', label: '$50-150', range: '$50-150', icon: '💎' },
  { value: 'high', label: '$150+', range: '$150+', icon: '👑' },
] as const;

export const occasionOptions = [
  'birthday', 'christmas', 'anniversary', 'graduation', 'wedding', 
  'housewarming', 'thank you', 'just because',
] as const;

export const ageOptions = [
  { value: 'child', label: 'Child (0-12)' },
  { value: 'teen', label: 'Teen (13-19)' },
  { value: 'young-adult', label: 'Young Adult (20-29)' },
  { value: 'adult', label: 'Adult (30-49)' },
  { value: 'senior', label: 'Senior (50+)' },
] as const;

