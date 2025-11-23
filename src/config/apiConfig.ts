import type { GiftFormData } from '@/types/gift';

export const API_CONFIG = {
  model: 'x-ai/grok-4.1-fast:free',
  defaultTemperature: 0.7,
  regenerateTemperature: 0.9,
  defaultMaxTokens: 1000,
  baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
} as const;

export const SYSTEM_PROMPT = 'You are a helpful gift consultant that provides personalized gift suggestions in JSON format.';

export function buildGiftPrompt(
  formData: GiftFormData,
  savedGiftNames: string[],
  isRegenerate: boolean = false
): string {
  const savedGiftNamesText = savedGiftNames.length > 0 
    ? `\n\nIMPORTANT: Please avoid these gifts that have already been saved for this person:\n${savedGiftNames.map(name => `- ${name}`).join('\n')}\n\nMake sure your new suggestions are completely different from these saved gifts.`
    : '';

  const regenerateText = isRegenerate 
    ? 'Generate 6 NEW and DIFFERENT personalized gift suggestions for the following person (avoid repeating previous suggestions):'
    : 'Generate 6 personalized gift suggestions for the following person:';

  return `${regenerateText}

Recipient: ${formData.name}
Relationship: ${formData.relationship}
Age Range: ${formData.age}
Interests (ordered by importance, most important first): ${formData.interests.map((interest, index) => `${interest} (priority ${index + 1})`).join(', ')}
Budget: ${formData.budget}
Occasion: ${formData.occasion}
${formData.additionalInfo ? `Additional Information: ${formData.additionalInfo}` : ''}${savedGiftNamesText}

Please provide 6 ${isRegenerate ? 'NEW ' : ''}gift suggestions in the following JSON format:
{
  "suggestions": [
    {
      "id": 1,
      "name": "Gift Name",
      "description": "Brief description of the gift",
      "price": "Price range (e.g., $50-100)",
      "category": "Category (e.g., Technology, Kitchen & Cooking, Books & Reading, Health & Fitness, Arts & Crafts, Office & Professional, Experiences, Personalized)",
      "reason": "Why this gift is perfect for this person"
    }
  ]
}

Make sure the suggestions are:
1. Within the specified budget range
2. Relevant to their interests and age
3. Appropriate for the relationship and occasion
4. Practical and thoughtful
5. Include a mix of different categories
${isRegenerate ? '6. DIFFERENT from previous suggestions and saved gifts\n' : ''}7. NOT in the list of already saved gifts provided above

Respond only with valid JSON, no additional text.`;
}

