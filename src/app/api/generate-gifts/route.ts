import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: body.messages,
        temperature: body.temperature ?? API_CONFIG.defaultTemperature,
        max_tokens: body.max_tokens ?? API_CONFIG.defaultMaxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid API key. Please check your OPENROUTER_API_KEY environment variable.',
            details: errorMessage
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenRouter API error: ${errorMessage}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate gift suggestions' },
      { status: 500 }
    );
  }
}
