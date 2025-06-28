# Gift Generator

An AI-powered gift suggestion application that helps you find the perfect presents for your friends, family, and colleagues.

## Features

- 🤖 AI-powered gift suggestions using Claude 3.5 Sonnet
- 🎯 Personalized recommendations based on recipient details
- 💰 Budget-aware suggestions
- 🔄 Regenerate suggestions for more options
- 💝 Save favorite gifts to your personal collection
- 📱 Responsive design for all devices
- ⚡ Fast and modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **Deployment**: Standalone output for easy deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key

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

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_SITE_URL=https://gift.pieterrees.nl
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to gift.pieterrees.nl

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Configure custom domain `gift.pieterrees.nl` in Vercel
5. Deploy!

### Option 2: Self-hosted

1. Build the application:
```bash
npm run build
```

2. The standalone build will be in `.next/standalone/`

3. Deploy the standalone folder to your server

4. Set up environment variables on your server

5. Configure your web server (nginx/Apache) to serve the Next.js app

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | No |

## API Configuration

The app uses OpenRouter API to access Claude 3.5 Sonnet for generating gift suggestions. To get an API key:

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Generate an API key
4. Add it to your environment variables

## Features

### Form Inputs
- Recipient name
- Relationship type
- Age range
- Interests (multiple selection)
- Budget range
- Occasion
- Additional information

### AI Suggestions
- 6 personalized gift suggestions
- Price ranges within budget
- Category classification
- Reasoning for each suggestion
- Regenerate functionality for variety
- Save individual gifts to your collection

### Gift Collection
- Save favorite gifts with one click
- View all saved gifts in a dedicated section
- Filter saved gifts by category
- Sort by date saved, name, or price
- Remove gifts from your collection
- Persistent storage using localStorage

### UI/UX
- Modern gradient design
- Responsive layout
- Loading states
- Error handling
- Accessible form elements
- Navigation between generator and saved gifts

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── GiftForm.tsx    # Gift form component
│   ├── GiftSuggestions.tsx # Results component
│   ├── SavedGifts.tsx  # Saved gifts collection
│   └── Header.tsx      # Header component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainer.
