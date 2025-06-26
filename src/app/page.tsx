'use client';

import { useState } from 'react';
import GiftForm from '@/components/GiftForm';
import GiftSuggestions from '@/components/GiftSuggestions';
import Header from '@/components/Header';

interface GiftFormData {
  name: string;
  relationship: string;
  age: string;
  interests: string[];
  budget: string;
  occasion: string;
  additionalInfo: string;
}

interface GiftData {
  recipient: GiftFormData;
  suggestions: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    reason: string;
  }>;
}

export default function Home() {
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIPowered, setIsAIPowered] = useState(false);

  const handleGenerateGifts = async (formData: GiftFormData) => {
    setIsGenerating(true);
    setIsAIPowered(false);
    
    // Debug: Check if API key is loaded
    console.log('API Key loaded:', !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);
    console.log('API Key starts with:', process.env.NEXT_PUBLIC_OPENROUTER_API_KEY?.substring(0, 10));
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful gift consultant that provides personalized gift suggestions in JSON format.'
            },
            {
              role: 'user',
              content: `You are an expert gift consultant. Generate 6 personalized gift suggestions for the following person:

Recipient: ${formData.name}
Relationship: ${formData.relationship}
Age Range: ${formData.age}
Interests: ${formData.interests.join(', ')}
Budget: ${formData.budget}
Occasion: ${formData.occasion}
${formData.additionalInfo ? `Additional Information: ${formData.additionalInfo}` : ''}

Please provide 6 gift suggestions in the following JSON format:
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

Respond only with valid JSON, no additional text.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      // Parse the JSON response from AI
      let suggestions;
      try {
        suggestions = JSON.parse(aiResponse);
      } catch {
        console.error('Failed to parse AI response:', aiResponse);
        throw new Error('Invalid response format from AI');
      }

      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        setGiftData({
          recipient: formData,
          suggestions: suggestions.suggestions
        });
        setIsAIPowered(true);
      } else {
        throw new Error('No suggestions received from AI');
      }

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      // Fallback to mock suggestions
      const mockSuggestions = generateMockSuggestions(formData);
      setGiftData({
        recipient: formData,
        suggestions: mockSuggestions
      });
      setIsAIPowered(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateGifts = async () => {
    if (!giftData) return;
    
    setIsGenerating(true);
    setIsAIPowered(false);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful gift consultant that provides personalized gift suggestions in JSON format.'
            },
            {
              role: 'user',
              content: `You are an expert gift consultant. Generate 6 NEW and DIFFERENT personalized gift suggestions for the following person (avoid repeating previous suggestions):

Recipient: ${giftData.recipient.name}
Relationship: ${giftData.recipient.relationship}
Age Range: ${giftData.recipient.age}
Interests: ${giftData.recipient.interests.join(', ')}
Budget: ${giftData.recipient.budget}
Occasion: ${giftData.recipient.occasion}
${giftData.recipient.additionalInfo ? `Additional Information: ${giftData.recipient.additionalInfo}` : ''}

Please provide 6 NEW gift suggestions in the following JSON format:
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
6. DIFFERENT from previous suggestions

Respond only with valid JSON, no additional text.`
            }
          ],
          temperature: 0.9, // Higher temperature for more variety
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      // Parse the JSON response from AI
      let suggestions;
      try {
        suggestions = JSON.parse(aiResponse);
      } catch {
        console.error('Failed to parse AI response:', aiResponse);
        throw new Error('Invalid response format from AI');
      }

      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        setGiftData(prev => ({
          ...prev!,
          suggestions: suggestions.suggestions
        }));
        setIsAIPowered(true);
      } else {
        throw new Error('No suggestions received from AI');
      }

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      // Fallback to mock suggestions
      const mockSuggestions = generateMockSuggestions(giftData.recipient);
      setGiftData(prev => ({
        ...prev!,
        suggestions: mockSuggestions
      }));
      setIsAIPowered(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockSuggestions = (formData: GiftFormData) => {
    const { relationship, interests, budget } = formData;
    
    const suggestions = [];
    
    // Generate suggestions based on interests
    if (interests.includes('technology')) {
      suggestions.push({
        id: 1,
        name: 'Smart Home Device',
        description: 'A practical and modern gift for tech enthusiasts',
        price: '$50-100',
        category: 'Technology',
        reason: 'Perfect for someone who loves smart home technology'
      });
    }
    
    if (interests.includes('cooking')) {
      suggestions.push({
        id: 2,
        name: 'Premium Cooking Set',
        description: 'High-quality kitchen tools for the culinary enthusiast',
        price: '$80-150',
        category: 'Kitchen & Cooking',
        reason: 'Great for someone passionate about cooking'
      });
    }
    
    if (interests.includes('reading')) {
      suggestions.push({
        id: 3,
        name: 'E-reader or Book Subscription',
        description: 'Digital reading device or monthly book delivery',
        price: '$100-200',
        category: 'Books & Reading',
        reason: 'Ideal for avid readers'
      });
    }
    
    if (interests.includes('fitness')) {
      suggestions.push({
        id: 4,
        name: 'Fitness Tracker',
        description: 'Smart watch to track health and fitness goals',
        price: '$150-300',
        category: 'Health & Fitness',
        reason: 'Perfect for fitness enthusiasts'
      });
    }
    
    if (interests.includes('art')) {
      suggestions.push({
        id: 5,
        name: 'Art Supplies Kit',
        description: 'Professional-grade art materials for creative expression',
        price: '$60-120',
        category: 'Arts & Crafts',
        reason: 'Great for artistic individuals'
      });
    }
    
    // Add some generic suggestions based on relationship and occasion
    if (relationship === 'colleague') {
      suggestions.push({
        id: 6,
        name: 'Professional Desk Organizer',
        description: 'Elegant desk accessories for the workplace',
        price: '$30-80',
        category: 'Office & Professional',
        reason: 'Practical and professional gift for colleagues'
      });
    }
    
    if (relationship === 'friend') {
      suggestions.push({
        id: 7,
        name: 'Experience Gift Card',
        description: 'Gift card for memorable experiences (dining, activities)',
        price: '$50-200',
        category: 'Experiences',
        reason: 'Create lasting memories with friends'
      });
    }
    
    if (relationship === 'family') {
      suggestions.push({
        id: 8,
        name: 'Personalized Photo Album',
        description: 'Custom photo book with shared memories',
        price: '$40-100',
        category: 'Personalized',
        reason: 'Meaningful family gift with sentimental value'
      });
    }
    
    // Filter by budget
    const budgetRange = budget === 'low' ? [0, 50] : 
                       budget === 'medium' ? [50, 150] : 
                       [150, 500];
    
    return suggestions.filter(suggestion => {
      const price = parseInt(suggestion.price.replace(/[^0-9]/g, ''));
      return price >= budgetRange[0] && price <= budgetRange[1];
    }).slice(0, 6); // Limit to 6 suggestions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Gift Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the perfect gift for your friends, colleagues, and loved ones. 
            Tell us about them and we&apos;ll suggest thoughtful presents just for them.
          </p>
        </div>

        {!giftData ? (
          <GiftForm onSubmit={handleGenerateGifts} isGenerating={isGenerating} />
        ) : (
          <GiftSuggestions 
            giftData={giftData} 
            onReset={() => {
              setGiftData(null);
              setIsAIPowered(false);
            }}
            onRegenerate={handleRegenerateGifts}
            isGenerating={isGenerating}
            isAIPowered={isAIPowered}
          />
        )}
      </main>
    </div>
  );
}
