# ChatDPT - AI Chat Application

A modern, responsive chat application built with Node.js, Express, and modern web technologies. This application provides a clean and intuitive interface for interacting with an AI assistant.

![ChatDPT Screenshot](screenshot.png)

## Features

- 🚀 Real-time chat interface
- 💬 Markdown support for messages
- ⚡ Fast and responsive design
- 🌙 Dark/Light mode ready
- 📱 Mobile-friendly layout
- ✨ Animated typing indicators
- 🔄 Message history persistence

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Backend**: Node.js, Express
- **AI Integration**: Groq API
- **Search**: Tavily API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Groq API Key
- Tavily API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatgpt-clone-js.git
   cd chatgpt-clone-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   TAVILY_API_KEY=your_tavily_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   node server.js
   ```

5. Open your browser and navigate to `http://localhost:3001`

## Project Structure

```
chatgpt-clone-js/
├── frontend/           # Frontend files
│   ├── index.html     # Main HTML file
│   └── script.js      # Frontend JavaScript
├── server.js          # Express server
├── chatbot.js         # AI integration logic
├── package.json       # Project dependencies
└── README.md          # This file
```

## Configuration

You can customize the following environment variables in the `.env` file:

- `PORT`: Server port (default: 3001)
- `TAVILY_API_KEY`: Your Tavily API key
- `GROQ_API_KEY`: Your Groq API key

## Usage

1. Type your message in the input box
2. Press Enter or click the send button
3. The AI will process your message and respond
4. Use Shift+Enter for new lines in your messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

👤 **Manish**

- GitHub: [Manishopt](https://github.com/Manishopt)
- Email: manishop1air@gmail.com

## Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by popular chat applications
- Special thanks to all contributors

---

<div align="center">
  Made with JavaScript & ❤️
</div>
