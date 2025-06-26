# PresGen - AI-Powered Gift Generator

A modern web application that generates personalized gift suggestions using AI. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎁 **Personalized Gift Suggestions**: Get tailored gift recommendations based on recipient details
- 🤖 **AI-Powered**: Uses OpenRouter to access multiple AI models (Claude 3.5 Sonnet)
- 📱 **Modern UI**: Beautiful, responsive design with smooth animations
- 🔄 **Fallback System**: Graceful degradation to mock suggestions if AI is unavailable
- ⚡ **Fast**: Built with Next.js 15 and Turbopack for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd presgen
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
# OpenRouter API Key (Client-side)
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Getting an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your dashboard
4. Create an API key
5. Add the API key to your `.env.local` file

**⚠️ Security Note**: This application uses the API key directly in the frontend. For production use, consider using a backend API route to protect your API key.

### Running the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## How It Works

1. **Form Input**: Users fill out a comprehensive form with recipient details including:
   - Name and relationship
   - Age range
   - Interests and hobbies
   - Budget range
   - Occasion
   - Additional notes

2. **AI Processing**: The form data is sent directly to OpenRouter's API using Claude 3.5 Sonnet to generate personalized gift suggestions

3. **Smart Suggestions**: The AI considers:
   - Budget constraints
   - Personal interests
   - Relationship context
   - Age appropriateness
   - Occasion relevance

4. **Fallback System**: If the AI service is unavailable, the app gracefully falls back to pre-defined gift suggestions

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: OpenRouter API with Claude 3.5 Sonnet (client-side)
- **Deployment**: Vercel-ready

## API Integration

The application calls OpenRouter's API directly from the frontend:

```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [...],
    temperature: 0.7,
    max_tokens: 1000,
  }),
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.
