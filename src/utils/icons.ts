export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Technology': '💻',
    'Kitchen & Cooking': '🍳',
    'Books & Reading': '📚',
    'Health & Fitness': '💪',
    'Arts & Crafts': '🎨',
    'Office & Professional': '💼',
    'Experiences': '🎉',
    'Personalized': '🎁',
    'Fashion & Beauty': '👗',
    'Sports & Outdoors': '⚽',
    'Home & Garden': '🏠',
    'Music': '🎵',
    'Gaming': '🎮',
    'Travel': '✈️',
    'Food & Beverages': '🍷',
    'Pets': '🐕',
    'Education': '🎓',
    'Entertainment': '🎬'
  };
  return icons[category] || '🎁';
}

