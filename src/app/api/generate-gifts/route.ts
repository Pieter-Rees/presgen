import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';

export const maxDuration = 30;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

function validateRequestBody(body: unknown): body is RequestBody {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const reqBody = body as Record<string, unknown>;

  if (!Array.isArray(reqBody.messages)) {
    return false;
  }

  const validMessages = reqBody.messages.every((msg) => {
    if (!msg || typeof msg !== 'object') {
      return false;
    }
    const message = msg as Record<string, unknown>;
    return (
      typeof message.role === 'string' &&
      ['system', 'user', 'assistant'].includes(message.role) &&
      typeof message.content === 'string'
    );
  });

  if (!validMessages) {
    return false;
  }

  if (reqBody.temperature !== undefined && typeof reqBody.temperature !== 'number') {
    return false;
  }

  if (reqBody.max_tokens !== undefined && typeof reqBody.max_tokens !== 'number') {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!validateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

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
        const errorJson = JSON.parse(errorText) as { error?: { message?: string } | string };
        if (typeof errorJson.error === 'object' && errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        } else if (typeof errorJson.error === 'string') {
          errorMessage = errorJson.error;
        }
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
