# RepoExplainer 🚀

**RepoExplainer** is an intelligent assistant designed to help developers quickly understand and navigate unfamiliar GitHub repositories. Powered by **Google Gemini**, it analyzes codebases, generates summaries, and allows users to ask questions about the code using a smart Retrieval-Augmented Generation (RAG) system.

## 🌟 Features

- **Repository Analysis**: Simply paste a GitHub URL to get an instant overview.
- **AI-Powered Summaries**: automatically extracts tech stack, architecture style, key features, and complexity using Gemini AI.
- **Smart RAG Q&A**:
  - **Intelligent File Selection**: Instead of embedding everything, Gemini analyzes the project's file tree to determine _exactly_ which files are relevant to your query.
  - **On-Demand Fetching**: Fetches the latest content of selected files directly from GitHub.
  - **Contextual Answers**: Generates strict, code-aware answers based on the actual source code.
- **Secure Authentication**: Built-in user handling with JWT and secure cookies.

## 🛠️ Tech Stack

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **AI Model**: Google Gemini 1.5/3.0 (via `@google/genai`)
- **GitHub Integration**: Octokit SDK
- **Authentication**: JWT, BCrypt
- **Validation**: Zod

## 🧠 How It Works (The RAG Pipeline)

1.  **Ingestion**: User submits a GitHub URL. The backend fetches the file tree and "Hero Files" (README, package.json).
2.  **Summarization**: Gemini analyzes the hero files to create a project snapshot.
3.  **Q&A Loop**:
    - **User Query**: "How is authentication handled?"
    - **Context Retrieval**: Gemini scans the _file tree_ and identifies relevant paths (e.g., `src/middlewares/auth.ts`, `src/controllers/auth.controller.ts`).
    - **Content Fetching**: The backend downloads the raw code for _only_ those files.
    - **Answer Generation**: Gemini constructs an answer using the specific file contents as context.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Google Gemini API Key
- GitHub Personal Access Token (for higher rate limits)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ArpitKrSingh7/tamboBackend.git
    cd tamboBackend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_key
    GITHUB_PAT=your_github_personal_access_token
    JWT_SECRET=your_jwt_secret
    origin=http://localhost:3000
    ```

4.  **Run the application**

    ```bash
    # Development
    npm run dev

    # Build & Start
    npm run build
    npm start
    ```

## 🔌 API Endpoints

- `POST /api/repo/analyze` - Submit a repo URL for analysis.
- `POST /api/chat` - Ask a question about the analyzed repo.
- `POST /api/user/signup` - User registration.
- `POST /api/user/signin` - User login.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License

This project is licensed under the ISC License.
