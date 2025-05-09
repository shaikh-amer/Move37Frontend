# Move37 Frontend

A Next.js-based video generation platform that uses AI to create engaging video content.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Installation Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Move37Frontend.git
   cd Move37Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   REPLICATE_API_TOKEN=your_replicate_api_token
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

   Note: You'll need to:
   - Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Get a Replicate API token from [Replicate](https://replicate.com)
   - Generate a random string for NEXTAUTH_SECRET (you can use `openssl rand -base64 32`)

4. **Install additional type definitions**
   ```bash
   npm install --save-dev @types/uuid
   ```

## Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Features

- AI-powered script generation using Google's Gemini API
- Video generation using Replicate's AI models
- Scene editor for video customization
- Text-to-speech integration
- Background music generation
- Video preview and download capabilities

## Project Structure

```
Move37Frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── redux/              # Redux store and slices
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## API Integration

The application integrates with several APIs:

1. **Google Gemini API**
   - Used for script generation
   - Requires API key in environment variables

2. **Replicate API**
   - Used for video generation
   - Requires API token in environment variables
   - Note: Requires credits in your Replicate account

## Troubleshooting

1. **API Errors**
   - Ensure all API keys are correctly set in `.env.local`
   - Check API rate limits and credits
   - Verify API endpoints are accessible

2. **Build Errors**
   - Clear the `.next` folder and node_modules
   - Run `npm install` again
   - Check for TypeScript errors

3. **Runtime Errors**
   - Check browser console for errors
   - Verify all environment variables are set
   - Ensure all dependencies are installed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
