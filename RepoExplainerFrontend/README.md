# Repo Explainer Frontend

[Live Deployment](https://repoexplainer-app.vercel.app/)

Repo Explainer is an AI-powered application that helps users understand GitHub repositories through an interactive chat interface. This project serves as the frontend client, built with Next.js and heavily leveraging the **Tambo AI SDK** for its conversational capabilities.

## 🚀 Tambo AI Integration

This project demonstrates a robust integration of the **Tambo UI SDK** (`@tambo-ai/react` and `@tambo-ai/typescript-sdk`), showcasing how to build rich, generative UI experiences.

### Key Features & Implementation

1.  **Centralized Configuration (`src/lib/tambo.ts`)**
    The core of the integration lies in `src/lib/tambo.ts`. This file acts as the registry for:
    - **AI Tools:** Functions that the AI can execute to fetch real-time data (e.g., `countryPopulation` tool).
    - **Generative Components:** UI components that the AI can choose to render within the chat stream based on context.

2.  **Custom AI Components**
    We have extended the default chat experience by registering custom components in `src/components/tambo/`:
    - **`Graph`**: For visualizing data trends dynamically.
    - **`DataCard`**: For displaying structured statistical information.

    When the AI detects a need to show a graph or a data card, it doesn't just output text; it renders these interactive React components directly in the chat stream.

3.  **Message Threading**
    The application utilizes `MessageThreadFull` (located in `src/components/tambo/message-thread-full.tsx`) to handle complex message history, loading states, and generative content streaming seamlessly.

### Directory Structure for AI

The `src/components/tambo/` directory is structured to house all AI-related UI elements, making the project scalable and easy to maintain:

- `mcp-*.tsx`: Components for Model Context Protocol interactions.
- `message-*.tsx`: Components handling message rendering and input.
- `elicitation-ui.tsx`: Specialized UI for gathering user intent.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI SDK:** [Tambo AI](https://tambo.co/)
- **Icons:** Lucide React
- **State/Data:** Axios, SWR/React Query patterns (custom hooks)

## 🏁 Getting Started

1.  **Clone the repository**

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy the example environment file:

    ```bash
    cp example.env.local .env.local
    ```

    Add your Tambo API Key to `.env.local`:

    ```env
    NEXT_PUBLIC_TAMBO_API_KEY=your_key_here
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

This project is part of the Tambo AI ecosystem. Contributions to improve the component library or tool definitions are welcome.
