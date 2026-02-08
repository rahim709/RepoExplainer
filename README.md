# RepoExplainer 🚀

**RepoExplainer** is an intelligent assistant designed to help developers quickly understand and navigate unfamiliar GitHub repositories. Powered by **Google Gemini** and **Tambo AI**, it analyzes codebases, generates summaries, and allows users to ask questions about the code using a smart Retrieval-Augmented Generation (RAG) system with an interactive chat interface.

[Live Deployment](https://repoexplainer-app.vercel.app/)

## 🌟 Features

- **Repository Analysis**: Simply paste a GitHub URL to get an instant overview.
- **AI-Powered Summaries**: Automatically extracts tech stack, architecture style, key features, and complexity using Gemini AI.
- **Smart RAG Q&A**:
  - **Intelligent File Selection**: Instead of embedding everything, Gemini analyzes the project's file tree to determine _exactly_ which files are relevant to your query.
  - **On-Demand Fetching**: Fetches the latest content of selected files directly from GitHub.
  - **Contextual Answers**: Generates strict, code-aware answers based on the actual source code.
- **Interactive Chat Interface**: Rich conversational UI powered by Tambo AI SDK with generative components.
- **Secure Authentication**: Built-in user handling with JWT and secure cookies.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **AI Model**: Google Gemini 1.5/3.0 (via `@google/genai`)
- **GitHub Integration**: Octokit SDK
- **Authentication**: JWT, BCrypt
- **Validation**: Zod

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI SDK**: [Tambo AI](https://tambo.co/) (`@tambo-ai/react` and `@tambo-ai/typescript-sdk`)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🧠 How It Works (The RAG Pipeline)

1. **Ingestion**: User submits a GitHub URL. The backend fetches the file tree and "Hero Files" (README, package.json).
2. **Summarization**: Gemini analyzes the hero files to create a project snapshot.
3. **Q&A Loop**:
   - **User Query**: "How is authentication handled?"
   - **Context Retrieval**: Gemini scans the _file tree_ and identifies relevant paths (e.g., `src/middlewares/auth.ts`, `src/controllers/auth.controller.ts`).
   - **Content Fetching**: The backend downloads the raw code for _only_ those files.
   - **Answer Generation**: Gemini constructs an answer using the specific file contents as context.

## 🎨 Tambo AI Integration

The frontend demonstrates a robust integration of the **Tambo UI SDK**, showcasing how to build rich, generative UI experiences.

### Key Features & Implementation

1. **Centralized Configuration (`src/lib/tambo.ts`)**
   - Registry for AI Tools: Functions that the AI can execute to fetch real-time data
   - Generative Components: UI components that the AI can choose to render within the chat stream

2. **Custom AI Components** (`src/components/tambo/`)
   - **`Graph`**: For visualizing data trends dynamically
   - **`DataCard`**: For displaying structured statistical information
   - **`MessageThreadFull`**: Handles complex message history, loading states, and generative content streaming

3. **Directory Structure**
   - `mcp-*.tsx`: Components for Model Context Protocol interactions
   - `message-*.tsx`: Components handling message rendering and input
   - `elicitation-ui.tsx`: Specialized UI for gathering user intent

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Google Gemini API Key
- GitHub Personal Access Token (for higher rate limits)
- Tambo API Key

### Backend Installation

1. **Clone the repository**
```bash
   git clone https://github.com/rahim709/RepoExplainer.git
   cd RepoExplainer/RepoExplainerBackend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure Environment**
   Create a `.env` file in the root directory:
```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_key
   GITHUB_PAT=your_github_personal_access_token
   JWT_SECRET=your_jwt_secret
   origin=http://localhost:3000
```

4. **Run the backend**
```bash
   # Development
   npm run dev

   # Build & Start
   npm run build
   npm start
```

### Frontend Installation

1. **Navigate to frontend directory**
```bash
   cd ../RepoExplainerFrontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Environment Setup**
   Copy the example environment file:
```bash
   cp example.env.local .env.local
```

   Add your Tambo API Key to `.env.local`:
```env
   NEXT_PUBLIC_TAMBO_API_KEY=your_key_here
```

4. **Run the development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔌 API Endpoints

- `POST /api/repo/analyze` - Submit a repo URL for analysis
- `POST /api/chat` - Ask a question about the analyzed repo
- `POST /api/user/signup` - User registration
- `POST /api/user/signin` - User login

## 🤝 Contributing

Contributions are welcome! This project is part of the Tambo AI ecosystem. Please open an issue or submit a pull request for any improvements to the component library, tool definitions, or core functionality.

## 📄 License

This project is licensed under the ISC License.
