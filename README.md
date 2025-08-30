# TriLLM Arena 🧠

A modern web application that allows you to compare responses from three leading AI models side-by-side: **OpenAI**, **DeepSeek**, and **Gemini**.

## 🚀 Features

- **Multi-Provider Comparison**: Test the same prompt across OpenAI, DeepSeek, and Gemini simultaneously
- **Real-time Results**: See responses from all three models in parallel with timing metrics
- **Beautiful UI**: Modern, responsive design with gradient animations and glassmorphism effects
- **Token Usage Tracking**: Monitor token consumption for each provider
- **Error Handling**: Graceful error handling with timeout protection
- **Easy Configuration**: Simple API key input for each provider

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, TailwindCSS
- **Backend**: Node.js, Express.js
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/iamabhi1373/tri-provider-playground.git
cd tri-provider-playground
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8787`

## 🔑 API Keys Setup

To use the application, you'll need API keys from the respective providers:

- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **DeepSeek**: Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
- **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

Enter these keys in the web interface - they are not stored and only used for the current session.

## 🎯 Usage

1. Open the application in your browser
2. Enter your API keys for the providers you want to test
3. Optionally specify custom models (defaults provided)
4. Enter your prompt in the text area
5. Click "🚀 Battle All Models" to compare responses
6. View results side-by-side with timing and token usage metrics

## 📊 Supported Models

### OpenAI
- `gpt-4o-mini` (default)
- `gpt-4o`
- `gpt-3.5-turbo`

### DeepSeek
- `deepseek-chat` (default)
- `deepseek-coder`

### Gemini
- `gemini-1.5-flash` (default)
- `gemini-1.5-pro`
- `gemini-1.0-pro`

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

```bash
npm run build  # No build step required
```

The `vercel.json` configuration file is included for seamless deployment.

## 🔧 API Endpoints

- `POST /api/compare` - Compare responses from all three providers
- `GET /health` - Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Security Notes

- API keys are handled client-side and not stored
- All requests include timeout protection (60s)
- CORS is enabled for development purposes
- Use environment variables for production API key management

---

Built with ❤️ for AI enthusiasts who want to compare model capabilities effortlessly.
