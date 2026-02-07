# Communication Intelligence Platform

An advanced AI-powered communication assistant designed to help users craft the perfect message. This platform leverages local LLMs (via Ollama) to analyze text, predict audience reactions, transform tones, and provide intelligent writing assistance.

## 🚀 Features

- **Text Analysis**: Get detailed insights into how your text perceives different audiences (e.g., general, professional).
- **Audience Reaction Prediction**: AI simulates reactions from various personas such as Recruiters, Managers, Professors, Clients, and Teammates.
- **Tone Transformation**: Instantly rewrite your text to match a desired tone (e.g., professional, friendly, persuasive).
- **Paraphrasing & Summarization**: Refine your content by rephrasing for clarity or summarizing for brevity.
- **Document Processing**: Upload PDF, DOCX, or TXT files for analysis and processing.
- **Interactive AI Chat**: Context-aware chat interface to brainstorm and refine your writing.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **AI/LLM**: Ollama (Llama 3), OpenAI SDK
- **Database**: MongoDB (via Mongoose)
- **File Handling**: Multer, PDF Parse, Mammoth

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js** (v20 or higher)
2.  **Ollama**: This project uses a local Llama 3 model.
    - [Download Ollama](https://ollama.com/)
    - Pull the model: `ollama pull llama3`
    - Ensure Ollama is running on port `11434`.

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd Communication-Intelligence
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables (if required for MongoDB or other services):
    - Create a `.env` file based on your configuration needs.

## 🚀 Running the Application

Start the development server:

```bash
npm run dev
```

This command starts both the backend API and the frontend application.

- **Frontend**: `http://localhost:5000` (or the port shown in terminal)
- **Backend API**: `http://localhost:5000/api`

## 🏗️ Project Structure

- `client/`: React frontend application
- `server/`: Express backend and API routes
- `shared/`: Shared types and schemas (Zod)
- `script/`: Build and utility scripts

## 📜 License

MIT
