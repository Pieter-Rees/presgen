export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    'low': 'Under $50',
    'medium': '$50-150',
    'high': '$150+'
  };
  return labels[budget] || budget;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatAgeRange(age: string): string {
  return age.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

